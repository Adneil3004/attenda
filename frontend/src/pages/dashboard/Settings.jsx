import React, { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const toggleNotification = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-12 pb-20">
      
      {/* ─── Header ─── */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight font-headline">Settings</h2>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Manage your account preferences and concierge defaults.</p>
      </header>

      {/* ─── Profile Section (Surface Container Low) ─── */}
      <section className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white ambient-shadow flex items-center justify-center border-2 border-white">
              <span className="text-2xl font-bold text-[var(--color-primary)]">JD</span>
            </div>
            <button className="absolute -bottom-2 -right-2 bg-[var(--color-primary)] text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-[var(--color-primary)]">José Daniel Hernández</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm">jdanielhn@example.com</p>
            <span className="inline-block bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-2">
              Premium Member
            </span>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-outline-variant)]/10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Full Name</label>
            <input 
              type="text" 
              defaultValue="José Daniel Hernández"
              className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Email Address</label>
            <input 
              type="email" 
              defaultValue="jdanielhn@example.com"
              className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none"
            />
          </div>
        </div>
      </section>

      {/* ─── Event Defaults (Surface Container Lowest / White Card) ─── */}
      <section className="space-y-6 px-2">
        <h4 className="text-lg font-bold text-[var(--color-primary)] font-headline">Event Defaults</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)] mb-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Default Event Type</span>
            </div>
            <select className="w-full bg-[var(--color-surface-container-low)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none appearance-none cursor-pointer">
              <option>Wedding / Boda</option>
              <option>Corporate Gala</option>
              <option>Birthday Party</option>
              <option>Digital RSVP Only</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)] mb-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Timezone</span>
            </div>
            <select className="w-full bg-[var(--color-surface-container-low)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none appearance-none cursor-pointer">
              <option>(GMT-06:00) Central America</option>
              <option>(GMT-05:00) Eastern Time</option>
              <option>(GMT+01:00) Central Europe</option>
            </select>
          </div>

        </div>
      </section>

      {/* ─── Notifications (Tonal separation via bg shift) ─── */}
      <section className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-6">
        <h4 className="text-lg font-bold text-[var(--color-primary)] font-headline">Notifications</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl ambient-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-primary)]">Email Notifications</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Receive daily summaries and event updates.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleNotification('email')}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-outline-variant)]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.email ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl ambient-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center text-[#4f46e5]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-primary)]">SMS Alerts</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Get instant alerts for urgent RSVPs.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleNotification('sms')}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications.sms ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-outline-variant)]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.sms ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer Actions ─── */}
      <div className="flex justify-end pt-4 space-x-4">
        <button className="px-6 py-3 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">
          Discard Changes
        </button>
        <button className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all">
          Save Settings
        </button>
      </div>

    </div>
  );
};

export default Settings;
