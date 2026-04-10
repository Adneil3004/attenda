import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState(1);
  const [eventName, setEventName] = useState('');
  const [festejados, setFestejados] = useState(['']);
  const [eventType, setEventType] = useState('Wedding');
  const [organizerName, setOrganizerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [religiousAddress, setReligiousAddress] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [tier, setTier] = useState('Premium');
  const [errors, setErrors] = useState({});

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const addFestejado = () => setFestejados([...festejados, '']);

  const handleFestejadoChange = (index, value) => {
    const newFestejados = [...festejados];
    newFestejados[index] = value;
    setFestejados(newFestejados);
  };

  const removeFestejado = (index) => {
    const newFestejados = festejados.filter((_, i) => i !== index);
    setFestejados(newFestejados);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!eventName.trim()) newErrors.eventName = 'El nombre del evento es obligatorio';
    if (!eventType.trim()) newErrors.eventType = 'El tipo de evento es obligatorio';
    if (!eventDate.trim()) newErrors.eventDate = 'La fecha es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tier === 'Free') {
      navigate('/dashboard');
    } else {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishPayment = (e) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAndActivate = () => {
    // Aquí iría la lógica de guardado real en Supabase más adelante
    navigate('/dashboard');
  };

  const handeCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(val);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-500">
      {/* ─── Breadcrumbs / Header ─── */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-[var(--color-on-surface-variant)] text-xs mb-3 font-semibold uppercase tracking-widest">
          <span>Events</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={step === 1 ? "text-[var(--color-primary)]" : ""}>New Configuration</span>
          {step === 2 && (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[var(--color-primary)]">Checkout</span>
            </>
          )}
        </nav>
        <h2 className="text-4xl font-headline font-bold text-[var(--color-primary)] tracking-tight">
          {step === 1 ? 'Create New Event' : 'Secure Checkout'}
        </h2>
        <p className="text-[var(--color-on-surface-variant)] mt-2 max-w-xl">
          {step === 1 
            ? 'Configure the core details for your digital invitation experience. This will serve as the foundation for your event dashboard.'
            : `Complete your secure payment to activate the ${tier} Tier features.`}
        </p>
      </div>

      {/* ─── Main Form Card ─── */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_12px_40px_rgba(25,28,29,0.04)] relative overflow-hidden border border-[var(--color-outline-variant)]/10">
        
        {/* Progress Ribbon */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[var(--color-secondary)] to-[#7459f7]"></div>
        
        {step === 1 ? (
          <div className="p-10 space-y-12 animate-in slide-in-from-left duration-300">
            
            {/* Section: Core Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2">
                  Event Essentials
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Event Name
                  </label>
                  <input 
                    type="text" 
                    value={eventName}
                    onChange={(e) => {
                      setEventName(e.target.value);
                      if (errors.eventName) setErrors({...errors, eventName: null});
                    }}
                    className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 transition-all placeholder:text-[var(--color-outline)]/50 
                      ${errors.eventName ? 'ring-2 ring-[var(--color-error)]/50' : 'focus:ring-[var(--color-secondary)]/20'}`} 
                    placeholder="e.g. Boda García & López" 
                  />
                  {errors.eventName && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.eventName}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Nombre del Festejado(s)
                  </label>
                  <div className="space-y-2">
                    {festejados.map((name, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => handleFestejadoChange(idx, e.target.value)}
                          className="flex-1 bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all placeholder:text-[var(--color-outline)]/50" 
                          placeholder={idx === 0 ? "Nombre Principal" : "Otro Festejado"} 
                        />
                        {idx > 0 && (
                          <button 
                            onClick={() => removeFestejado(idx)}
                            className="p-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-md transition-colors"
                            title="Remove"
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

              <div className="space-y-8">
                <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2">
                  Logistics
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Tipo de Evento
                  </label>
                  <div className="relative">
                    <select 
                      value={eventType}
                      onChange={(e) => {
                        setEventType(e.target.value);
                        if (errors.eventType) setErrors({...errors, eventType: null});
                      }}
                      className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 pl-4 pr-10 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 transition-all appearance-none text-[var(--color-on-surface)]
                        ${errors.eventType ? 'ring-2 ring-[var(--color-error)]/50' : 'focus:ring-[var(--color-secondary)]/20'}`}
                    >
                      <option value="Cumpleaños">Cumpleaños</option>
                      <option value="Company">Company</option>
                      <option value="Wedding">Wedding</option>
                      <option value="XV years">XV years</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.eventType && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.eventType}</p>}
                    <svg className="absolute right-3 top-[18px] w-4 h-4 text-[var(--color-outline)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Organizer Name
                    </label>
                    <input 
                      type="text" 
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all" 
                      placeholder="Your Name" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Fecha
                    </label>
                    <input 
                      type="date" 
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (errors.eventDate) setErrors({...errors, eventDate: null});
                      }}
                      className={`w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 transition-all text-[var(--color-on-surface)]
                        ${errors.eventDate ? 'ring-2 ring-[var(--color-error)]/50' : 'focus:ring-[var(--color-secondary)]/20'}`} 
                    />
                    {errors.eventDate && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.eventDate}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Event Locations */}
            <section className="space-y-8">
              <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/10 pb-2">
                Event Locations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Religious Address
                  </label>
                  <input 
                    type="text" 
                    value={religiousAddress}
                    onChange={(e) => setReligiousAddress(e.target.value)}
                    className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all placeholder:text-[var(--color-outline)]/50" 
                    placeholder="e.g. Parroquia de San Agustin" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Venue Address (Lugar del Evento)
                  </label>
                  <input 
                    type="text" 
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-3 px-4 text-sm focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all placeholder:text-[var(--color-outline)]/50" 
                    placeholder="e.g. Quinta Margarita, Monterrey" 
                  />
                </div>
              </div>
            </section>

            {/* Section: Guest Tiers (Cards) */}
            <section className="space-y-6 pt-4">
              <div className="flex items-end justify-between border-b border-[var(--color-outline-variant)]/10 pb-2">
                <h3 className="text-lg font-headline font-semibold text-[var(--color-primary)]">Guest Capacity Tier</h3>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Select One</span>
              </div>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes slide-sheen {
                  0% { transform: translateX(-200%) skewX(-25deg); }
                  100% { transform: translateX(300%) skewX(-25deg); }
                }
                .sheen-element {
                  position: absolute;
                  inset: 0;
                  width: 40%;
                  height: 100%;
                  background: linear-gradient(
                    to right, 
                    rgba(255, 255, 255, 0) 0%, 
                    rgba(255, 255, 255, 0.4) 30%, 
                    rgba(255, 255, 255, 0.9) 50%, 
                    rgba(255, 255, 255, 0.4) 70%, 
                    rgba(255, 255, 255, 0) 100%
                  );
                  animation: slide-sheen 3s infinite ease-in-out;
                  pointer-events: none;
                  z-index: 10;
                }
              `}} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Tier 1: Free */}
                <label className="relative group cursor-pointer h-full">
                  <input 
                    className="peer sr-only" 
                    name="tier" 
                    type="radio" 
                    checked={tier === 'Free'} 
                    onChange={() => setTier('Free')}
                  />
                  <div className={`h-full p-6 border-2 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden
                    ${tier === 'Free' ? 'border-[var(--color-secondary)] bg-gradient-to-br from-[#00020a] to-[#001b44] shadow-xl' : 'border-transparent bg-white'}
                  `}>
                    {tier === 'Free' && <div className="sheen-element opacity-30"></div>}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 
                          ${tier === 'Free' ? 'bg-white/10 text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-outline)]'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-tighter ${tier === 'Free' ? 'text-white/60' : 'text-[var(--color-on-surface-variant)]'}`}>Free</span>
                      </div>
                      <p className={`text-xl font-headline font-bold ${tier === 'Free' ? 'text-white' : 'text-[var(--color-primary)]'}`}>20 Guests</p>
                      <p className={`text-xs mt-1 mb-4 ${tier === 'Free' ? 'text-white/70' : 'text-[var(--color-on-surface-variant)]'}`}>Perfect for intimate gatherings and small family dinners.</p>
                    </div>
                    <div className={`mt-auto border-t pt-4 relative z-10 ${tier === 'Free' ? 'border-white/10' : 'border-[var(--color-outline-variant)]/20'}`}>
                      <p className={`text-2xl font-bold font-headline ${tier === 'Free' ? 'text-white' : 'text-[var(--color-primary)]'}`}>$0 <span className={`text-sm font-medium ${tier === 'Free' ? 'text-white/50' : 'text-[var(--color-on-surface-variant)]'}`}>MXN</span></p>
                    </div>
                  </div>
                </label>

                {/* Tier 2: Premium */}
                <label className="relative group cursor-pointer h-full mt-3 md:mt-0 items-center">
                  <input 
                    className="peer sr-only" 
                    name="tier" 
                    type="radio" 
                    checked={tier === 'Premium'} 
                    onChange={() => setTier('Premium')}
                  />
                  {tier === 'Premium' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-secondary)] text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap z-20">
                      Popular Choice
                    </div>
                  )}
                  <div className={`h-full p-6 border-2 rounded-xl transition-all shadow-sm flex flex-col justify-between relative overflow-hidden group-hover:shadow-md
                    ${tier === 'Premium' ? 'border-[var(--color-secondary)] bg-gradient-to-br from-[#00020a] to-[#001b44] shadow-xl' : 'border-transparent bg-white'}
                  `}>
                    {tier === 'Premium' && <div className="sheen-element opacity-30"></div>}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                          ${tier === 'Premium' ? 'bg-white/10 text-white' : 'bg-[#f3f4f6] text-[#75777f]'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-tighter ${tier === 'Premium' ? 'text-white/60' : 'text-[var(--color-on-surface-variant)]'}`}>Premium</span>
                      </div>
                      <p className={`text-xl font-headline font-bold ${tier === 'Premium' ? 'text-white' : 'text-[var(--color-primary)]'}`}>150 Guests</p>
                      <p className={`text-xs mt-1 mb-4 ${tier === 'Premium' ? 'text-white/70' : 'text-[var(--color-on-surface-variant)]'}`}>Ideal for standard weddings, corporate mixers, and larger parties.</p>
                    </div>
                    <div className={`mt-auto border-t pt-4 relative z-10 ${tier === 'Premium' ? 'border-white/10' : 'border-[var(--color-outline-variant)]/20'}`}>
                      <p className={`text-2xl font-bold font-headline ${tier === 'Premium' ? 'text-white' : 'text-[var(--color-primary)]'}`}>$800 <span className={`text-sm font-medium ${tier === 'Premium' ? 'text-white/50' : 'text-[var(--color-on-surface-variant)]'}`}>MXN</span></p>
                    </div>
                  </div>
                </label>

                {/* Tier 3: Elite */}
                <label className="relative group cursor-pointer h-full">
                  <input 
                    className="peer sr-only" 
                    name="tier" 
                    type="radio" 
                    checked={tier === 'Elite'} 
                    onChange={() => setTier('Elite')}
                  />
                  <div className={`h-full p-6 border-2 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden
                    ${tier === 'Elite' ? 'border-[var(--color-secondary)] bg-gradient-to-br from-[#00020a] to-[#001b44] shadow-xl' : 'border-transparent bg-white'}
                  `}>
                    {tier === 'Elite' && <div className="sheen-element opacity-30"></div>}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                          ${tier === 'Elite' ? 'bg-white/10 text-white' : 'bg-[var(--color-primary-container)] text-[#b1c6f9]'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-tighter ${tier === 'Elite' ? 'text-white/60' : 'text-[var(--color-on-surface-variant)]'}`}>Elite</span>
                      </div>
                      <p className={`text-xl font-headline font-bold ${tier === 'Elite' ? 'text-white' : 'text-[var(--color-primary)]'}`}>200+ Guests</p>
                      <p className={`text-xs mt-1 mb-4 ${tier === 'Elite' ? 'text-white/70' : 'text-[var(--color-on-surface-variant)]'}`}>Scalable for major galas, festivals, and grand celebrations.</p>
                    </div>
                    <div className={`mt-auto border-t pt-4 relative z-10 ${tier === 'Elite' ? 'border-white/10' : 'border-[var(--color-outline-variant)]/20'}`}>
                      <p className={`text-2xl font-bold font-headline ${tier === 'Elite' ? 'text-white' : 'text-[var(--color-primary)]'}`}>$1,500 <span className={`text-sm font-medium ${tier === 'Elite' ? 'text-white/50' : 'text-[var(--color-on-surface-variant)]'}`}>MXN</span></p>
                    </div>
                  </div>
                </label>

              </div>
            </section>

            {/* Footer Action Area */}
            <div className="bg-[var(--color-surface-container-low)] -mx-10 -mb-10 mt-12 p-8 border-t border-[var(--color-outline-variant)]/10 flex items-center justify-between">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-[var(--color-on-surface-variant)] font-semibold text-sm hover:text-[var(--color-error)] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Discard Draft
              </button>
              
              <div className="flex items-center gap-4">
                <button className="bg-white text-[var(--color-primary)] border border-[var(--color-outline-variant)]/30 py-3 px-8 rounded-md font-semibold text-sm hover:bg-[var(--color-surface-container-high)] transition-colors">
                  Save Progress
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-gradient-to-br from-[#00020a] to-[#001b44] text-white py-3 px-10 rounded-md font-semibold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {tier === 'Free' ? 'Finalizar' : 'Siguiente'}
                </button>
              </div>
            </div>

          </div>
        ) : step === 3 ? (
          <div className="p-16 flex flex-col items-center text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-[var(--color-secondary)]/20 rounded-full animate-ping"></div>
              <svg className="w-12 h-12 text-[var(--color-secondary)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-headline font-bold text-[var(--color-primary)] mb-4">Confirmar Activación de Plan</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm max-w-sm mb-10 leading-relaxed">
              Estás a punto de activar el plan <span className="font-bold text-[var(--color-secondary)]">{tier}</span> para <strong>{eventName || 'tu evento'}</strong>. Los datos han sido validados y están listos para ser procesados.
            </p>

            <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30 rounded-2xl p-6 w-full max-w-sm mb-10 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Total a pagar</span>
                <span className="text-[var(--color-primary)] font-bold">${tier === 'Premium' ? '800' : '1,500'} MXN</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Tarjeta</span>
                <span className="text-[var(--color-primary)] font-bold">•••• {cardNumber.slice(-4)}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmAndActivate}
              className="w-full max-w-xs bg-gradient-to-br from-[#00020a] to-[#001b44] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Confirmar y Activar Evento
            </button>
            <button 
              onClick={() => setStep(2)}
              className="mt-4 text-[var(--color-on-surface-variant)] font-semibold text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a detalles de pago
            </button>
          </div>
        ) : (
          <div className="p-10 animate-in slide-in-from-right duration-300">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="border-b border-[var(--color-outline-variant)]/10 pb-4">
                  <h3 className="text-2xl font-headline font-bold text-[var(--color-primary)]">
                    Payment Method
                  </h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">All transactions are secure and encrypted.</p>
                </div>
                
                <form onSubmit={handleFinishPayment} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-1.5">
                    <label className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      <span>Card Number</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Secure
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={cardNumber}
                        onChange={handeCardChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-mono tracking-widest outline-none shadow-sm" 
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                        Expiry Date
                      </label>
                      <input 
                        type="text" 
                        required
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all text-center font-mono tracking-widest text-[var(--color-on-surface)] outline-none shadow-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                        Security Code (CVV)
                      </label>
                      <input 
                        type="password" 
                        required
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength="4"
                        placeholder="•••"
                        className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all text-center font-mono tracking-widest outline-none shadow-sm" 
                      />
                    </div>
                  </div>

                  {/* Cardholder */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Name on Card
                    </label>
                    <input 
                      type="text" 
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-mono uppercase outline-none shadow-sm" 
                      placeholder="JOHN DOE" 
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-[var(--color-secondary)] text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex justify-center items-center gap-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Pagar ${tier === 'Premium' ? '800' : '1,500'} MXN
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

              {/* Order Summary */}
              <div className="bg-[var(--color-surface-container-high)] rounded-2xl p-8 h-fit border border-[var(--color-outline-variant)]/20 shadow-inner relative overflow-hidden">
                {/* Subtle decoration */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-secondary)] opacity-10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

                <h4 className="text-xl font-headline font-bold text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/20 pb-4 mb-6">
                  Order Summary
                </h4>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-on-surface-variant)] font-semibold">Plan Selected</span>
                    <span className="font-bold text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider">{tier} Tier</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-on-surface-variant)] font-semibold">Event Name</span>
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
                    Simulated transaction gateway. No real charge will be made.
                  </p>
                </div>
              </div>

            </section>
          </div>
        )}
      </div>

    </div>
  );
};

export default CreateEvent;
