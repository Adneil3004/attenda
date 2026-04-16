import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { rsvpApi } from '../../lib/rsvpApi';

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

const RsvpDesigner = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    headline: "You're Invited!",
    message: "We'd love to have you join us.",
    headerImageUrl: "",
    requireAttendanceTracking: true,
    allowDietaryRequirements: false,
    typographyTheme: "Serif",
    colorTheme: "Midnight"
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchRsvpConfig = async () => {
      try {
        setLoading(true);
        const storedId = localStorage.getItem('activeEventId');
        const effectiveId = eventId || storedId;
        
        if (!effectiveId) {
          setLoading(false);
          return;
        }

        // Use authenticated endpoint - returns RsvpConfigDto with nested rsvpConfig
        const data = await apiClient.get(`/events/${effectiveId}/rsvp-config`);
        
        if (data && data.rsvpConfig) {
          setConfig(prev => ({ 
            ...prev, 
            headline: data.rsvpConfig.headline ?? prev.headline,
            message: data.rsvpConfig.message ?? prev.message,
            headerImageUrl: data.rsvpConfig.headerImageUrl ?? prev.headerImageUrl,
            requireAttendanceTracking: data.rsvpConfig.requireAttendanceTracking ?? prev.requireAttendanceTracking,
            allowDietaryRequirements: data.rsvpConfig.allowDietaryRequirements ?? prev.allowDietaryRequirements,
            typographyTheme: data.rsvpConfig.typographyTheme ?? prev.typographyTheme,
            colorTheme: data.rsvpConfig.colorTheme ?? prev.colorTheme
          }));
          if (data.rsvpConfig.headerImageUrl) {
            setPreviewImage(data.rsvpConfig.headerImageUrl);
          }
        }
      } catch (err) {
        // Error is handled by caller, no need to log details
      } finally {
        setLoading(false);
      }
    };
    fetchRsvpConfig();
  }, [eventId]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          alert('La imagen debe ser menor a 5MB.');
          return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setConfigValue = (name, value) => {
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const storedId = localStorage.getItem('activeEventId');
      const effectiveId = eventId || storedId;

      let finalConfig = { ...config };

      if (selectedFile) {
          const uploadRes = await rsvpApi.uploadRsvpImage(effectiveId, selectedFile);
          if (uploadRes.imageUrl) {
              finalConfig.headerImageUrl = uploadRes.imageUrl;
              setConfig(prev => ({ ...prev, headerImageUrl: uploadRes.imageUrl }));
          }
      }

      await rsvpApi.saveRsvpConfig(effectiveId, finalConfig);
      setSelectedFile(null); // Clear selected file after successful save
      setNotification({ type: 'success', message: 'Configuración guardada exitosamente' });
    } catch (err) {
      console.error(err);
      setNotification({ 
        type: 'error', 
        message: 'Error al guardar: ' + (err.response?.data?.message || err.message) 
      });
    } finally {
      setSaving(false);
    }
  };


  const activeTheme = THEMES[config.colorTheme] || THEMES.Midnight;
  const activeTypography = TYPOGRAPHY[config.typographyTheme] || TYPOGRAPHY.Serif;

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 animate-fade-in pb-16 lg:pb-0">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playball&family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');
        `}
      </style>
      
      {/* LEFT PANEL: CONFIGURE */}
      <div className="w-full lg:w-2/5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-[var(--color-surface-container)] rounded-2xl p-6 border border-[var(--color-card-border)] ambient-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">RSVP Designer</h2>
            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest">Premium Tools</div>
          </div>
          
          <div className="space-y-6">
            {/* Header Image Upload */}
            <div className="space-y-3">
              <label className="text-sm border-l-2 border-[var(--color-secondary)] pl-2 font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Event Cover Image
              </label>
              
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div className="w-full h-32 border-2 border-dashed border-[var(--color-outline)] rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-[var(--color-secondary)] group-hover:bg-[var(--color-surface-container-high)] transition-all overflow-hidden bg-[var(--color-surface)]">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-secondary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Upload Image</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-tight italic">Recommended: High resolution 16:9 or 4:3 images. This will be the first thing guests see.</p>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <label className="text-sm border-l-2 border-[var(--color-secondary)] pl-2 font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Invitation Message
              </label>
              
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Headline</span>
                <input
                  type="text"
                  name="headline"
                  value={config.headline}
                  onChange={handleChange}
                  placeholder="e.g. Save the Date!"
                  className="w-full h-11 bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl px-4 text-sm text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-secondary)] transition-colors font-bold"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Custom Message</span>
                <textarea
                  name="message"
                  value={config.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell your guests about the special day..."
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-4 text-sm text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-secondary)] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Form Logic */}
            <div className="space-y-4 pt-4 border-t border-[var(--color-card-border)]">
              <label className="text-sm border-l-2 border-[var(--color-secondary)] pl-2 font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Guest Options
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-[var(--color-surface-container-high)] rounded-lg transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Attendance Tracking</span>
                  <span className="text-xs text-[var(--color-text-muted)]">Guests must confirm Yes/No</span>
                </div>
                <input type="checkbox" name="requireAttendanceTracking" checked={config.requireAttendanceTracking} onChange={handleChange} className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" />
              </label>

              <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-[var(--color-surface-container-high)] rounded-lg transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Dietary Requirements</span>
                  <span className="text-xs text-[var(--color-text-muted)]">Ask guests about allergies/preferences</span>
                </div>
                <input type="checkbox" name="allowDietaryRequirements" checked={config.allowDietaryRequirements} onChange={handleChange} className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" />
              </label>
            </div>

            {/* Aesthetics */}
            <div className="space-y-4 pt-4 border-t border-[var(--color-card-border)]">
              <label className="text-sm border-l-2 border-[var(--color-secondary)] pl-2 font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Visual Style
              </label>
              
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Typography Set</span>
                <div className="flex gap-2">
                  {Object.keys(TYPOGRAPHY).map((type) => (
                    <button
                      key={type}
                      onClick={() => setConfigValue('typographyTheme', type)}
                      className={`px-4 py-2 rounded-lg text-sm border font-medium transition-all cursor-pointer ${
                        config.typographyTheme === type 
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' 
                        : 'bg-transparent border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Color Theme</span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(THEMES).map(([themeName, themeData]) => (
                    <button
                      key={themeName}
                      onClick={() => setConfigValue('colorTheme', themeName)}
                      className={`cursor-pointer w-10 h-10 rounded-full border-2 transition-transform ${
                        config.colorTheme === themeName ? 'border-[var(--color-primary)] scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: themeData['--rsvp-bg'] }}
                      title={themeName}
                    >
                      <span className="block w-4 h-4 mx-auto rounded-full" style={{ backgroundColor: themeData['--rsvp-accent'] }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="flex mt-8">
            {/* Publish Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-[var(--color-primary)] text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-card-border)] overflow-hidden relative min-h-[700px] p-4 lg:p-12">
        <div className="absolute top-6 left-6 z-10 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase text-white/95 border border-white/20 shadow-2xl flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Interactive Live Preview
        </div>

        {/* Mobile Device Frame Mockup */}
        <div className="w-full max-w-[390px] h-[800px] overflow-y-auto rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative border-[14px] border-[#121212] flex flex-col"
             style={{ ...activeTheme }}>
          
          <div className="w-full h-full flex-1 overflow-y-auto custom-scrollbar flex flex-col relative transition-colors duration-700" style={{ backgroundColor: 'var(--rsvp-bg)' }}>
            
            {/* Header Image - UPDATED TO 400PX HEIGHT */}
            <div className={`w-full h-[400px] relative shrink-0 transition-all duration-700 ${!previewImage ? 'bg-gradient-to-br from-neutral-800 to-neutral-950' : ''}`}>
               {previewImage ? (
                 <img src={previewImage} alt="Header" className="w-full h-full object-cover" />
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                    <svg className="w-16 h-16 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">No Image Uploaded</span>
                 </div>
               )}
               {/* Deep gradient overlay for text legibility and blending */}
               <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-[var(--rsvp-bg)] via-[var(--rsvp-bg)]/80 to-transparent pointer-events-none"></div>
            </div>

            {/* Content Body */}
            <div className="px-8 pb-12 pt-0 flex-1 flex flex-col relative z-10 transition-all duration-700" style={{ ...activeTypography, marginTop: '-20px' }}>
                <h1 
                  className={`text-4xl mb-6 text-center leading-[1.1] transition-all duration-500 tracking-tight ${config.typographyTheme === 'Script' ? 'font-normal' : 'font-black'}`} 
                  style={{ color: 'var(--rsvp-primary)', fontFamily: activeTypography.fontFamily }}
                >
                  {config.headline || "Headline"}
                </h1>
                
                <p className="text-center opacity-70 mb-10 whitespace-pre-wrap leading-relaxed text-base font-medium" style={{ color: 'var(--rsvp-primary)' }}>
                  {config.message || "Invitation details and message..."}
                </p>

                {/* Event Details Mock - Styled for Premium Feel */}
                <div className="backdrop-blur-sm border rounded-3xl p-6 mb-10 shadow-inner" style={{ backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="uppercase text-[10px] font-black tracking-[0.3em] opacity-50 mb-1" style={{ color: 'var(--rsvp-primary)' }}>When & Where</span>
                    <span className="font-bold text-xl" style={{ color: 'var(--rsvp-primary)' }}>Dec 31, 2026</span>
                    <span className="text-base font-medium opacity-80" style={{ color: 'var(--rsvp-primary)' }}>8:00 PM — Midnight</span>
                    <div className="w-8 h-[2px] rounded-full my-3" style={{ backgroundColor: 'var(--rsvp-accent)' }}></div>
                    <span className="text-sm font-semibold text-center opacity-80 max-w-[200px]" style={{ color: 'var(--rsvp-primary)' }}>
                      Grand Ballroom Plaza<br/>123 Celebration Ave, NY
                    </span>
                  </div>
                </div>

                {config.requireAttendanceTracking && (
                  <div className="space-y-4 mt-auto">
                     <button className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all active:scale-95 hover:brightness-110 active:brightness-90"
                             style={{ backgroundColor: 'var(--rsvp-accent)', color: '#ffffff' }}>
                       I will attend
                     </button>
                     <button className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm border-2 transition-all active:scale-95 bg-transparent opacity-60 hover:opacity-100"
                             style={{ borderColor: 'var(--rsvp-primary)', color: 'var(--rsvp-primary)' }}>
                       Politely decline
                     </button>
                  </div>
                )}

                {config.allowDietaryRequirements && config.requireAttendanceTracking && (
                  <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--rsvp-border)' }}>
                     <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-3 block text-center" style={{ color: 'var(--rsvp-primary)' }}>Dietary Requirements</label>
                     <div className="w-full border rounded-2xl h-14 px-5 text-sm flex items-center italic opacity-60"
                          style={{ color: 'var(--rsvp-primary)', backgroundColor: 'var(--rsvp-surface)', borderColor: 'var(--rsvp-border)' }}>
                        e.g. Vegan, No gluten, Nut allergy...
                     </div>
                  </div>
                )}
            </div>
            
          </div>
        </div>
      </div>

      {/* PREMIUM NOTIFICATION COMPONENT */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all pointer-events-none">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-toast-slide-up pointer-events-auto ${
            notification.type === 'success' 
              ? 'bg-emerald-600 border-emerald-500 text-white' 
              : 'bg-rose-600 border-rose-500 text-white'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              notification.type === 'success' ? 'bg-white/20' : 'bg-white/20'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <div className="flex flex-col pr-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </span>
              <span className="text-sm font-bold">
                {notification.message}
              </span>
            </div>

            <button 
              onClick={() => setNotification(null)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Style for Animations */}
      <style>
        {`
          @keyframes toast-slide-up {
            0% { transform: translateY(100%); opacity: 0; }
            40% { transform: translateY(-10px); opacity: 1; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-toast-slide-up {
            animation: toast-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
    </div>
  );
};


export default RsvpDesigner;
