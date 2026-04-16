import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { rsvpApi } from '../lib/rsvpApi';

const THEMES = {
  Midnight: { '--rsvp-bg': '#0d0d0d', '--rsvp-primary': '#ffffff', '--rsvp-accent': '#7c3aed', '--rsvp-surface': 'rgba(255,255,255,0.05)', '--rsvp-border': 'rgba(255,255,255,0.1)' },
  Blush:    { '--rsvp-bg': '#fff1f2', '--rsvp-primary': '#9f1239', '--rsvp-accent': '#f43f5e', '--rsvp-surface': 'rgba(159,18,57,0.03)', '--rsvp-border': 'rgba(159,18,57,0.1)' },
  Sage:     { '--rsvp-bg': '#f0fdf4', '--rsvp-primary': '#166534', '--rsvp-accent': '#22c55e', '--rsvp-surface': 'rgba(22,101,52,0.03)', '--rsvp-border': 'rgba(22,101,52,0.1)' },
  Gold:     { '--rsvp-bg': '#fffbeb', '--rsvp-primary': '#78350f', '--rsvp-accent': '#f59e0b', '--rsvp-surface': 'rgba(120,53,15,0.03)', '--rsvp-border': 'rgba(120,53,15,0.1)' },
  Lavender: { '--rsvp-bg': '#faf5ff', '--rsvp-primary': '#581c87', '--rsvp-accent': '#a855f7', '--rsvp-surface': 'rgba(88,28,135,0.03)', '--rsvp-border': 'rgba(88,28,135,0.1)' },
};

const TYPOGRAPHY = {
  Serif:  { fontFamily: "'Playfair Display', serif" },
  Sans:   { fontFamily: "'Inter', system-ui, sans-serif" },
  Script: { fontFamily: "'Playball', cursive" },
};

const RsvpPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [guest, setGuest] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Plus-ones state
  const [plusOnes, setPlusOnes] = useState([]);
  const [dietary, setDietary] = useState('');

  const token = searchParams.get('token');
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (token) {
          // Public guest flow: fetch guest + config in one go
          const data = await rsvpApi.fetchGuestByToken(token);
          console.log('RSVP data:', data);
          
          // Use whatever format the API returns (camelCase or lowercase)
          const eventName = data?.eventName ?? data?.eventname ?? 'Your Event';
          const eventDate = data?.eventDate ?? data?.eventdate;
          const venueName = data?.venueName ?? data?.venuename;
          const headerImageUrl = data?.headerImageUrl ?? data?.headerimageurl;
          const headline = data?.rsvpHeadline ?? data?.headline ?? 'You\'re Invited!';
          const message = data?.rsvpMessage ?? data?.message;
          const colorTheme = data?.colorTheme ?? data?.colortheme ?? 'Midnight';
          const typographyTheme = data?.typographyTheme ?? data?.typographytheme ?? 'Serif';
          
          setGuest(data);
          setConfig({
            eventName,
            eventDate,
            venueName,
            headerImageUrl,
            rsvpConfig: {
              headline,
              message,
              colorTheme,
              typographyTheme,
              requireAttendanceTracking: true,
              allowDietaryRequirements: true
            }
          });
        } else {
          setError('Invalid invitation link');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Invitation not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddPlusOne = () => {
    if (plusOnes.length < guest.plusOnes) {
      setPlusOnes([...plusOnes, { firstName: '', lastName: '', phoneNumber: '' }]);
    }
  };

  const handlePlusOneChange = (index, field, value) => {
    const updated = [...plusOnes];
    updated[index][field] = value;
    setPlusOnes(updated);
  };

  const handleRemovePlusOne = (index) => {
    setPlusOnes(plusOnes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status) => {
    if (!token) return;

    try {
      setSubmitting(true);
      await rsvpApi.confirmRsvp({
        token,
        status,
        plusOnes: status === 'Confirmed' ? plusOnes : []
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('RSVP failed:', err);
      alert('Failed to send RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm font-medium tracking-wider uppercase tracking-[0.2em]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ backgroundColor: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-bg'] || '#0d0d0d' }}>
        <div className="max-w-md">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-primary'] || 'white', fontFamily: TYPOGRAPHY[config?.rsvpConfig?.typographyTheme]?.fontFamily }}>
            ¡Gracias, {guest?.firstName}!
          </h1>
          <p className="opacity-60 text-lg" style={{ color: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-primary'] || 'white' }}>
            Tu respuesta ha sido registrada. ¡Nos vemos pronto!
          </p>
        </div>
      </div>
    );
  }

  const alreadyResponded = !isPreview && (guest?.alreadyResponded ?? guest?.alreadyresponded ?? false);
  if (alreadyResponded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-bg'] || '#0d0d0d' }}>
        <div className="max-w-md w-full">
          {/* Event Details - Show even when already responded */}
          {config?.eventDate && (
            <div className="backdrop-blur-sm border rounded-3xl p-6 mb-8" style={{ backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}>
              <div className="flex flex-col items-center gap-1.5">
                <span className="uppercase text-[10px] font-black tracking-[0.3em] opacity-50 mb-1" style={{ color: 'var(--rsvp-primary)' }}>When & Where</span>
                <span className="font-bold text-xl" style={{ color: 'var(--rsvp-primary)' }}>{formatDate(config.eventDate)}</span>
                <span className="text-base font-medium opacity-80" style={{ color: 'var(--rsvp-primary)' }}>{formatTime(config.eventDate)}</span>
                <div className="w-8 h-[2px] rounded-full my-3" style={{ backgroundColor: 'var(--rsvp-accent)' }}></div>
                <span className="text-sm font-semibold text-center opacity-80" style={{ color: 'var(--rsvp-primary)' }}>
                  {config.venueName || 'Venue details coming soon'}
                </span>
              </div>
            </div>
          )}
          
          {/* Already Responded Message */}
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-primary'] || 'white', fontFamily: TYPOGRAPHY[config?.rsvpConfig?.typographyTheme]?.fontFamily }}>
              Ya respondiste, {guest?.firstName}!
            </h1>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ 
                backgroundColor: guest?.rsvpStatus === 'Confirmed' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: guest?.rsvpStatus === 'Confirmed' ? '#22c55e' : '#ef4444'
              }}>
              {guest?.rsvpStatus === 'Confirmed' ? '✅ Asistiré' : '❌ No podré asistir'}
            </div>
            <p className="opacity-60 text-lg" style={{ color: THEMES[config?.rsvpConfig?.colorTheme]?.['--rsvp-primary'] || 'white' }}>
              Tu respuesta ya fue registrada. ¡Gracias por confirmar!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="text-center px-6">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Event Not Available
          </h1>
          <p className="text-white/50 text-sm max-w-xs mx-auto">
            {error || 'The event you are looking for does not exist or has been removed.'}
          </p>
        </div>
      </div>
    );
  }

  const activeTheme = THEMES[config.rsvpConfig?.colorTheme] || THEMES.Midnight;
  const activeTypography = TYPOGRAPHY[config.rsvpConfig?.typographyTheme] || TYPOGRAPHY.Serif;
  const requireTracking = config.rsvpConfig?.requireAttendanceTracking ?? true;
  const allowDietary = config.rsvpConfig?.allowDietaryRequirements ?? false;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date coming soon';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Date coming soon';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const canAddMore = plusOnes.length < (guest?.plusOnes || 0);

  return (
    <div style={activeTheme}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playball&family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');
          :root {
            --rsvp-bg: ${activeTheme['--rsvp-bg']};
            --rsvp-primary: ${activeTheme['--rsvp-primary']};
            --rsvp-accent: ${activeTheme['--rsvp-accent']};
            --rsvp-surface: ${activeTheme['--rsvp-surface']};
            --rsvp-border: ${activeTheme['--rsvp-border']};
          }
        `}
      </style>
      
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 text-center font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          PREVIEW MODE
        </div>
      )}

      <div className="min-h-screen transition-colors duration-700" style={{ backgroundColor: 'var(--rsvp-bg)' }}>
        {/* Header Image */}
        <div className={`w-full h-[400px] relative transition-all duration-700 ${!config.headerImageUrl ? 'bg-gradient-to-br from-neutral-800 to-neutral-950' : ''}`}>
          {config.headerImageUrl ? (
            <img src={config.headerImageUrl} alt="Event Header" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
              <svg className="w-16 h-16 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Event Image</span>
            </div>
          )}
          <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-[var(--rsvp-bg)] via-[var(--rsvp-bg)]/80 to-transparent pointer-events-none"></div>
        </div>

        <div 
          className="px-8 pb-12 pt-0 flex flex-col relative z-10 transition-all duration-700 max-w-xl mx-auto"
          style={{ ...activeTypography, marginTop: '-20px' }}
        >
          {/* Guest Greeting */}
          {guest && (
            <div className="text-center mb-2 animate-fade-in">
              <span className="text-sm font-black uppercase tracking-[0.4em] opacity-40 italic" style={{ color: 'var(--rsvp-primary)' }}>
                Hola, {guest.firstName}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 
            className={`text-4xl mb-6 text-center leading-[1.1] transition-all duration-500 tracking-tight ${config.rsvpConfig?.typographyTheme === 'Script' ? 'font-normal' : 'font-black'}`}
            style={{ color: 'var(--rsvp-primary)', fontFamily: activeTypography.fontFamily }}
          >
            {config.rsvpConfig?.headline || "You're Invited!"}
          </h1>

          {/* Message */}
          <p className="text-center opacity-70 mb-10 whitespace-pre-wrap leading-relaxed text-base font-medium" style={{ color: 'var(--rsvp-primary)' }}>
            {config.rsvpConfig?.message || "We'd love to have you join us."}
          </p>

          {/* Event Details */}
          <div className="backdrop-blur-sm border rounded-3xl p-6 mb-10 shadow-inner" style={{ backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}>
            <div className="flex flex-col items-center gap-1.5">
              <span className="uppercase text-[10px] font-black tracking-[0.3em] opacity-50 mb-1" style={{ color: 'var(--rsvp-primary)' }}>When & Where</span>
              <span className="font-bold text-xl" style={{ color: 'var(--rsvp-primary)' }}>{formatDate(config.eventDate)}</span>
              <span className="text-base font-medium opacity-80" style={{ color: 'var(--rsvp-primary)' }}>{formatTime(config.eventDate)}</span>
              <div className="w-8 h-[2px] rounded-full my-3" style={{ backgroundColor: 'var(--rsvp-accent)' }}></div>
              <span className="text-sm font-semibold text-center opacity-80 max-w-[200px]" style={{ color: 'var(--rsvp-primary)' }}>
                {config.venueName || 'Venue details coming soon'}
              </span>
            </div>
          </div>

          {/* Plus-One Management */}
          {guest?.plusOnes > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="uppercase text-[10px] font-black tracking-[0.3em] opacity-50" style={{ color: 'var(--rsvp-primary)' }}>
                  Acompañantes ({plusOnes.length}/{guest.plusOnes})
                </h3>
                {canAddMore && (
                  <button 
                    onClick={handleAddPlusOne}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-current opacity-60 hover:opacity-100 transition-all"
                    style={{ color: 'var(--rsvp-primary)' }}
                  >
                    + Agregar
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {plusOnes.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border flex flex-col gap-3 animate-slide-up" style={{ backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase opacity-40">Invitado #{idx + 1}</span>
                       <button onClick={() => handleRemovePlusOne(idx)} className="text-red-500/60 hover:text-red-500">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Nombre"
                        value={p.firstName}
                        onChange={(e) => handlePlusOneChange(idx, 'firstName', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        style={{ color: 'var(--rsvp-primary)' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Apellido"
                        value={p.lastName}
                        onChange={(e) => handlePlusOneChange(idx, 'lastName', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        style={{ color: 'var(--rsvp-primary)' }}
                      />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Teléfono (opcional)"
                      value={p.phoneNumber}
                      onChange={(e) => handlePlusOneChange(idx, 'phoneNumber', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ color: 'var(--rsvp-primary)' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP Buttons */}
          {!isPreview && requireTracking && (
            <div className="space-y-4">
              <button 
                disabled={submitting}
                onClick={() => handleSubmit('Confirmed')}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--rsvp-accent)', color: '#ffffff' }}
              >
                {submitting ? 'Confirmando...' : 'I will attend'}
              </button>
              <button 
                disabled={submitting}
                onClick={() => handleSubmit('Declined')}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm border-2 transition-all active:scale-95 bg-transparent opacity-60 hover:opacity-100 disabled:opacity-30"
                style={{ borderColor: 'var(--rsvp-primary)', color: 'var(--rsvp-primary)' }}>
                Politely decline
              </button>
            </div>
          )}

          {!isPreview && allowDietary && (
            <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--rsvp-border)' }}>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-3 block text-center" style={{ color: 'var(--rsvp-primary)' }}>Dietary Requirements</label>
              <input 
                type="text"
                placeholder="e.g. Vegan, No gluten, Nut allergy..."
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full border rounded-2xl h-14 px-5 text-sm italic focus:outline-none transition-all"
                style={{ color: 'var(--rsvp-primary)', backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}
              />
            </div>
          )}

          {!isPreview && (
            <div className="mt-16 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-30" style={{ color: 'var(--rsvp-primary)' }}>
                Powered by <span className="font-bold">Attenda</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RsvpPage;