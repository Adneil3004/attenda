import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../lib/api';

// ---------------------------------------------------------------------------
// Simulated tokenization — mimics what Stripe.js does client-side.
// The raw card number NEVER leaves this function; only a simulated token,
// the last 4 digits, and the detected brand are extracted.
// ---------------------------------------------------------------------------
function simulateTokenize(cardNumber) {
  const raw = cardNumber.replace(/\s/g, '');
  const last4 = raw.slice(-4);
  let brand = 'Unknown';
  if (/^4/.test(raw)) brand = 'Visa';
  else if (/^5[1-5]/.test(raw)) brand = 'Mastercard';
  else if (/^3[47]/.test(raw)) brand = 'Amex';
  else if (/^6/.test(raw)) brand = 'Discover';
  // In production this would be: const result = await stripe.createPaymentMethod({...})
  const token = `pm_sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return { token, last4, brand };
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  // ── Step Stepper ──
  const [step, setStep] = useState(1);

  // ── Step 1 form state ──
  const [eventName, setEventName] = useState('');
  const [festejados, setFestejados] = useState(['']);
  const [eventType, setEventType] = useState('Boda');
  const [organizerName, setOrganizerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [religiousAddress, setReligiousAddress] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [tier, setTier] = useState('Premium');
  const [isBusiness, setIsBusiness] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Step 2: Card input (raw — never sent to backend) ──
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // ── Submission state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // Token extracted by simulateTokenize — safe to store in state
  const [cardToken, setCardToken] = useState(null);

  // ── Festejados helpers ──
  const addFestejado = () => setFestejados([...festejados, '']);
  const handleFestejadoChange = (index, value) => {
    const next = [...festejados];
    next[index] = value;
    setFestejados(next);
  };
  const removeFestejado = (index) =>
    setFestejados(festejados.filter((_, i) => i !== index));

  // ── Validation ──
  const validateStep1 = () => {
    const e = {};
    if (!eventName.trim()) e.eventName = 'El nombre del evento es obligatorio';
    if (!eventType.trim()) e.eventType = 'El tipo de evento es obligatorio';
    if (!eventDate.trim()) e.eventDate = 'La fecha es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const raw = cardNumber.replace(/\s/g, '');
    const e = {};
    if (raw.length < 15) e.cardNumber = 'Número de tarjeta inválido';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = 'Formato MM/YY requerido';
    if (cvv.length < 3) e.cvv = 'CVV inválido';
    if (!cardHolder.trim()) e.cardHolder = 'Nombre requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ──
  const handleNext = () => {
    if (!validateStep1()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (tier === 'Free') { handleSubmitEvent(null); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 → tokenize (never send raw card), move to confirm
  const handleTokenizeAndContinue = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const tokenized = simulateTokenize(cardNumber);
    setCardToken(tokenized);
    // Clear raw card data from state immediately after tokenization
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Final Submit ──
  const handleSubmitEvent = async (tokenData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Fix date-shift: ensuring YYYY-MM-DD stays the same day in UTC
      const startDate = eventDate + 'T00:00:00Z';
      
      const payload = {
        name: eventName,
        description: [eventType, ...festejados.filter(Boolean)].join(' — '),
        startDate,
        endDate: null,
        organizerId: user?.id,
        // New fields
        eventType,
        celebrants: festejados.filter(Boolean),
        organizerName,
        religiousAddress,
        venueAddress,
        capacityTier: tier.toUpperCase(),
        guestLimit: tier === 'Free' ? 50 : tier === 'Premium' ? 150 : 250,
        isBusiness,
        // Only the token and safe metadata reach the server — never the PAN
        cardToken: tokenData?.token ?? null,
        cardLast4: tokenData?.last4 ?? null,
        cardBrand: tokenData?.brand ?? null,
      };
      await apiClient.post('/events', payload);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message ?? 'Ocurrió un error. Intentá nuevamente.');
      setIsSubmitting(false);
    }
  };

  const handleConfirmAndActivate = () => {
    handleSubmitEvent(cardToken);
  };

  // ── Card input formatters ──
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: null }));
  };
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    setExpiry(val);
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: null }));
  };
  const handleCvvChange = (e) => {
    setCvv(e.target.value.replace(/\D/g, '').substring(0, 4));
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: null }));
  };

  // ── Shared component: field label ──
  const FieldLabel = ({ children }) => (
    <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
      {children}
    </span>
  );

  const InputClass = (hasError) =>
    `w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm transition-all placeholder:text-[var(--color-outline)]/50 outline-none
     focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 ${
       hasError
         ? 'ring-2 ring-[var(--color-error)]/50'
         : 'focus:ring-[var(--color-secondary)]/20'
     }`;

  const InlineError = ({ msg }) =>
    msg ? <p className="text-[var(--color-error)] text-[10px] font-bold mt-1 uppercase tracking-tight">{msg}</p> : null;

  // ────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-500">
      <style>{`
        @keyframes custom-sheen {
          0% { transform: translateX(-100%) skewX(-25deg); opacity: 0; }
          10% { opacity: 1; }
          25% { transform: translateX(250%) skewX(-25deg); opacity: 0; }
          100% { transform: translateX(250%) skewX(-25deg); opacity: 0; }
        }
        .sheen-element {
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: custom-sheen 5s infinite;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>

      {/* ─── Breadcrumbs / Header ─── */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-[var(--color-on-surface-variant)] text-xs mb-3 font-semibold uppercase tracking-widest">
          <span>Events</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={step === 1 ? 'text-[var(--color-primary)]' : ''}>New Configuration</span>
          {step >= 2 && (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className={step === 2 ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}>
                Checkout
              </span>
            </>
          )}
          {step === 3 && (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[var(--color-primary)]">Confirm</span>
            </>
          )}
        </nav>
        <h2 className="text-4xl font-headline font-bold text-[var(--color-primary)] tracking-tight">
          {step === 1 ? 'Create New Event' : step === 2 ? 'Secure Checkout' : 'Confirm & Activate'}
        </h2>
        <p className="text-[var(--color-on-surface-variant)] mt-2 max-w-xl">
          {step === 1
            ? 'Configure the core details for your digital invitation experience.'
            : step === 2
            ? `Complete your secure payment to activate the ${tier} Tier features.`
            : 'Review your order and confirm activation.'}
        </p>
      </div>

      {/* ─── Main Card ─── */}
      <div className="bg-[var(--color-surface-container-lowest)] relative overflow-hidden border-t border-[var(--color-outline-variant)]/10">

        {/* Progress ribbon */}
        <div
          className="absolute top-0 left-0 h-[4px] bg-gradient-to-r from-[var(--color-secondary)] to-[#7459f7] transition-all duration-500"
          style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
        />

        {/* ═══════════════════ STEP 1: Event Details ═══════════════════ */}
        {step === 1 && (
          <div className="p-10 space-y-12 animate-in slide-in-from-left duration-300">

            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Column A — Event Essentials */}
              <div className="space-y-8">
                <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2">
                  Event Essentials
                </h3>

                <div className="space-y-1.5">
                  <FieldLabel>Event Name</FieldLabel>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => { setEventName(e.target.value); if (errors.eventName) setErrors({ ...errors, eventName: null }); }}
                    className={InputClass(errors.eventName)}
                    placeholder="e.g. Boda García & López"
                  />
                  <InlineError msg={errors.eventName} />
                </div>

                <div className="space-y-3">
                  <FieldLabel>Nombre del Festejado(s)</FieldLabel>
                  <div className="space-y-2">
                    {festejados.map((name, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleFestejadoChange(idx, e.target.value)}
                          className={InputClass(false)}
                          placeholder={idx === 0 ? 'Nombre Principal' : 'Otro Festejado'}
                        />
                        {idx > 0 && (
                          <button
                            onClick={() => removeFestejado(idx)}
                            className="p-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-md transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addFestejado}
                      className="flex items-center gap-2 text-[var(--color-secondary)] font-semibold text-xs py-2 px-2 hover:bg-[var(--color-secondary)]/5 rounded-md transition-colors mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add another
                    </button>
                  </div>
                </div>
              </div>

              {/* Column B — Logistics */}
              <div className="space-y-8">
                <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2">
                  Configuración
                </h3>

                <div className="space-y-3">
                  <FieldLabel>Categoría del Evento</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBusiness(false);
                        setEventType('Boda');
                      }}
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        !isBusiness
                          ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]'
                          : 'border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary)]/50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Social
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBusiness(true);
                        setEventType('Graduación');
                      }}
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        isBusiness
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          : 'border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Empresa
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <FieldLabel>Event Type / Celebración</FieldLabel>
                  <select
                    value={eventType}
                    onChange={(e) => { setEventType(e.target.value); if (errors.eventType) setErrors({ ...errors, eventType: null }); }}
                    className={InputClass(errors.eventType)}
                  >
                    {!isBusiness ? (
                      <>
                        <option value="Boda">Boda</option>
                        <option value="XV Años">XV Años</option>
                        <option value="Bautizo">Bautizo</option>
                        <option value="Cumpleaños">Cumpleaños</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Otro">Otro</option>
                      </>
                    ) : (
                      <>
                        <option value="Graduación">Graduación</option>
                        <option value="Fin de año">Fin de año</option>
                        <option value="Aniversario">Aniversario</option>
                        <option value="Congreso">Congreso</option>
                        <option value="Lanzamiento de Producto">Lanzamiento de Producto</option>
                        <option value="Otro">Otro</option>
                      </>
                    )}
                  </select>
                  <InlineError msg={errors.eventType} />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Organizer Name</FieldLabel>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className={InputClass(false)}
                    placeholder="Tu nombre o empresa"
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Event Date</FieldLabel>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => { setEventDate(e.target.value); if (errors.eventDate) setErrors({ ...errors, eventDate: null }); }}
                    className={InputClass(errors.eventDate)}
                  />
                  <InlineError msg={errors.eventDate} />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Venue Address</FieldLabel>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className={InputClass(false)}
                    placeholder="Salón Palacio, CDMX"
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Religious / Ceremony Address</FieldLabel>
                  <input
                    type="text"
                    value={religiousAddress}
                    onChange={(e) => setReligiousAddress(e.target.value)}
                    className={InputClass(false)}
                    placeholder="Catedral Metropolitana (opcional)"
                  />
                </div>
              </div>
            </section>

            {/* ── Tier Selection ── */}
            <section>
              <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2 mb-6">
                Select Your Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'Free', guests: '50 Guests', price: 'Gratis', desc: 'Perfect for intimate gatherings and quick demos.' },
                  { id: 'Premium', guests: '150 Guests', price: '$800 MXN', desc: 'Ideal for standard weddings and corporate mixers.' },
                  { id: 'Elite', guests: '200+ Guests', price: '$1,500 MXN', desc: 'Scalable for major galas and grand celebrations.' },
                ].map(({ id, guests, price, desc }) => (
                  <label key={id} className="relative group cursor-pointer h-full">
                    <input
                      className="peer sr-only"
                      name="tier"
                      type="radio"
                      checked={tier === id}
                      onChange={() => setTier(id)}
                    />
                    <div className={`h-full p-6 border-2 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden
                      ${tier === id
                        ? `border-[var(--color-secondary)] ${theme === 'dark' ? 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700' : 'bg-[linear-gradient(135deg,#001b44_0%,#001b44_35%,#4c3cb7_50%,#001b44_65%,#001b44_100%)]'} shadow-xl ring-2 ring-[var(--color-secondary)]/30`
                        : 'border-[var(--color-card-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]/30'}`}
                    >
                      {tier === id && <div className="sheen-element opacity-50" />}
                      <div className="relative z-10">
                        <span className={`text-xs font-bold uppercase tracking-tighter ${tier === id ? (theme === 'dark' ? 'text-gray-300' : 'text-white/80') : 'text-[var(--color-text-secondary)]'}`}>{id}</span>
                        <p className={`text-xl font-headline font-bold mt-2 ${tier === id ? (theme === 'dark' ? 'text-white' : 'text-white') : 'text-[var(--color-text-primary)]'}`}>{guests}</p>
                        <p className={`text-xs mt-1 mb-4 ${tier === id ? (theme === 'dark' ? 'text-gray-400' : 'text-white/70') : 'text-[var(--color-text-secondary)]'}`}>{desc}</p>
                      </div>
                      <div className={`mt-auto border-t pt-4 relative z-10 ${tier === id ? (theme === 'dark' ? 'border-gray-500' : 'border-white/20') : 'border-[var(--color-card-border)]'}`}>
                        <p className={`text-2xl font-bold font-headline ${tier === id ? (theme === 'dark' ? 'text-white' : 'text-white') : 'text-[var(--color-text-primary)]'}`}>{price}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Footer */}
            <div className="bg-[var(--color-surface-container-low)] -mx-10 -mb-10 mt-4 p-8 border-t border-[var(--color-outline-variant)]/10 flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[var(--color-on-surface-variant)] font-semibold text-sm hover:text-[var(--color-error)] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Discard Draft
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-br from-[#00020a] to-[#001b44] text-white py-3 px-10 rounded-md font-semibold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {tier === 'Free' ? 'Finalizar' : 'Siguiente →'}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════ STEP 2: Payment ═══════════════════ */}
        {step === 2 && (
          <div className="p-10 animate-in slide-in-from-right duration-300">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left: card form */}
              <div className="space-y-8">
                <div className="border-b border-[var(--color-outline-variant)]/10 pb-4">
                  <h3 className="text-2xl font-headline font-bold text-[var(--color-primary)]">Payment Method</h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your card data is tokenized client-side — we never store your card number or CVV.
                  </p>
                </div>

                {/* Security notice banner */}
                <div className="bg-green-50 border border-green-200/60 rounded-lg px-4 py-3 flex items-start gap-3">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs text-green-700 leading-relaxed">
                    <strong>Simulation Mode — </strong>
                    This form simulates Stripe.js tokenization. Your card number is instantly converted to a secure token and discarded — only the last 4 digits and brand reach our server.
                  </p>
                </div>

                <form onSubmit={handleTokenizeAndContinue} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-1.5">
                    <label className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      <span>Card Number</span>
                      <span className="text-green-600 flex items-center gap-1 text-[9px]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Tokenized
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-mono tracking-widest outline-none shadow-sm ${errors.cardNumber ? 'ring-2 ring-red-400' : ''}`}
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </div>
                    <InlineError msg={errors.cardNumber} />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <FieldLabel>Expiry Date</FieldLabel>
                      <input
                        id="card-expiry"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        required
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all text-center font-mono tracking-widest outline-none shadow-sm ${errors.expiry ? 'ring-2 ring-red-400' : ''}`}
                      />
                      <InlineError msg={errors.expiry} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>CVV</FieldLabel>
                      <input
                        id="card-cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        required
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength="4"
                        placeholder="•••"
                        className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all text-center font-mono tracking-widest outline-none shadow-sm ${errors.cvv ? 'ring-2 ring-red-400' : ''}`}
                      />
                      <InlineError msg={errors.cvv} />
                    </div>
                  </div>

                  {/* Cardholder */}
                  <div className="space-y-1.5">
                    <FieldLabel>Name on Card</FieldLabel>
                    <input
                      id="card-holder"
                      type="text"
                      autoComplete="cc-name"
                      required
                      value={cardHolder}
                      onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); if (errors.cardHolder) setErrors((p) => ({ ...p, cardHolder: null })); }}
                      className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-mono uppercase outline-none shadow-sm ${errors.cardHolder ? 'ring-2 ring-red-400' : ''}`}
                      placeholder="JOHN DOE"
                    />
                    <InlineError msg={errors.cardHolder} />
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-secondary)] text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex justify-center items-center gap-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Tokenize & Review Order
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full mt-4 text-xs font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors py-2 flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Event Details
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Order Summary */}
              <div className="bg-[var(--color-surface-container-high)] rounded-2xl p-8 h-fit border border-[var(--color-outline-variant)]/20 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-secondary)] opacity-10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
                <h4 className="text-xl font-headline font-bold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/20 pb-4 mb-6">
                  Order Summary
                </h4>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-on-surface-variant)] font-semibold">Plan Selected</span>
                    <span className="font-bold text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider">{tier} Tier</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-on-surface-variant)] font-semibold">Event</span>
                    <span className="font-semibold text-right max-w-[180px] truncate text-[var(--color-primary)]">{eventName || 'Digital Invitation'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-on-surface-variant)] font-semibold">Billed to</span>
                    <span className="font-semibold text-[var(--color-primary)]">{organizerName || 'Host'}</span>
                  </div>
                </div>
                <div className="border-t border-[var(--color-outline-variant)]/20 pt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Total (MXN)</span>
                    <span className="text-4xl font-headline font-extrabold text-[var(--color-primary)]">
                      ${tier === 'Premium' ? '800' : '1,500'}
                    </span>
                  </div>
                  <p className="text-[10px] text-right text-[var(--color-outline)] mt-3 italic flex items-center justify-end gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Simulated gateway. No real charge.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════════ STEP 3: Confirm ═══════════════════ */}
        {step === 3 && (
          <div className="p-16 flex flex-col items-center text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-[var(--color-secondary)]/20 rounded-full animate-ping" />
              <svg className="w-12 h-12 text-[var(--color-secondary)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h3 className="text-3xl font-headline font-bold text-[var(--color-primary)] mb-4">
              Confirmar Activación de Plan
            </h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm max-w-sm mb-10 leading-relaxed">
              Estás a punto de activar el plan{' '}
              <span className="font-bold text-[var(--color-secondary)]">{tier}</span>{' '}
              para <strong>{eventName || 'tu evento'}</strong>.
            </p>

            <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30 rounded-2xl p-6 w-full max-w-sm mb-4 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Total a pagar</span>
                <span className="text-[var(--color-primary)] font-bold">${tier === 'Premium' ? '800' : '1,500'} MXN</span>
              </div>
              {cardToken && (
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Tarjeta</span>
                  <span className="text-[var(--color-primary)] font-bold font-mono">
                    {cardToken.brand} •••• {cardToken.last4}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Plan</span>
                <span className="text-[var(--color-secondary)] font-bold uppercase">{tier}</span>
              </div>
            </div>

            {/* Security token confirmation */}
            {cardToken && (
              <div className="bg-green-50 border border-green-200/60 rounded-lg px-4 py-3 w-full max-w-sm mb-8 text-left">
                <p className="text-[10px] text-green-700 font-mono break-all">
                  <span className="font-bold not-italic text-green-800 block mb-0.5">Token generado (no es la tarjeta):</span>
                  {cardToken.token}
                </p>
              </div>
            )}

            {submitError && (
              <div className="w-full max-w-sm mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-xs text-red-700 font-semibold">{submitError}</p>
              </div>
            )}

            <button
              onClick={handleConfirmAndActivate}
              disabled={isSubmitting}
              className="w-full max-w-xs bg-gradient-to-br from-[#00020a] to-[#001b44] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                'Confirmar y Activar Evento'
              )}
            </button>

            <button
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="mt-4 text-[var(--color-on-surface-variant)] font-semibold text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a detalles de pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
