import React, { useState } from 'react';

// ─── Sub-components for Tabs ───

const ProfileTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
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
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-outline-variant)]/10">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">First Name</label>
          <input type="text" defaultValue="José Daniel" className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Last Name</label>
          <input type="text" defaultValue="Hernández" className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Phone Number</label>
          <input type="tel" defaultValue="+502 5555 4444" className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Birthday</label>
          <input type="date" className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all border-none" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest px-1">Gender</label>
          <div className="flex gap-4">
            {['Male', 'Female', 'Other'].map(opt => (
              <label key={opt} className="flex-1 flex items-center justify-center py-3 bg-white rounded-xl text-xs font-bold text-[var(--color-primary)] cursor-pointer hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <input type="radio" name="gender" className="mr-2 accent-[var(--color-secondary)]" defaultChecked={opt === 'Male'} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AccountTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-8">
      <h3 className="text-lg font-bold text-[var(--color-primary)] font-headline">Security & Authentication</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl">
          <div>
            <p className="text-sm font-bold text-[var(--color-primary)]">Password</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Last changed 3 months ago</p>
          </div>
          <button className="px-4 py-2 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-95 transition-all">
            Update
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl">
          <div>
            <p className="text-sm font-bold text-[var(--color-primary)]">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Add an extra layer of security to your account.</p>
          </div>
          <button className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
            Enable
          </button>
        </div>
      </div>
    </div>
  </div>
);

const BillingTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    {/* Card Visual */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-[#1a1c2a] to-[#001b44] rounded-2xl p-8 text-white relative overflow-hidden h-[220px] shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-10 blur-3xl"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center backdrop-blur-md">
              <div className="w-8 h-5 bg-amber-400/80 rounded-sm"></div>
            </div>
            <span className="text-xl font-black italic tracking-tighter">VISA</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg font-mono tracking-[0.2em]">••••  ••••  ••••  4251</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-white/50">Card Holder</p>
                <p className="text-xs font-bold uppercase">José Daniel H.</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-white/50">Expires</p>
                <p className="text-xs font-bold">12 / 28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 flex flex-col justify-center space-y-4">
        <h4 className="text-sm font-bold text-[var(--color-primary)] font-headline">Default Payment Method</h4>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
          Your primary card ends in 4251. Billing cycle resets every 14th of the month.
        </p>
        <button className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-widest hover:underline text-left">
          Manage payment options
        </button>
      </div>
    </div>

    {/* Transactions */}
    <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[var(--color-primary)] font-headline">Transaction History</h3>
        <button className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest hover:underline">Download All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">
            <tr>
              <th className="pb-4">Description</th>
              <th className="pb-4">Date</th>
              <th className="pb-4 text-right">Amount</th>
              <th className="pb-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {[
              { desc: 'Elite Yearly Subscription', date: 'Apr 14, 2024', amount: '$499.00', status: 'Completed' },
              { desc: 'SMS Add-on Pack (5000)', date: 'Mar 12, 2024', amount: '$49.00', status: 'Completed' },
              { desc: 'Elite Monthly Subscription', date: 'Feb 14, 2024', amount: '$49.00', status: 'Completed' }
            ].map((row, idx) => (
              <tr key={idx} className="group cursor-default border-t border-[var(--color-outline-variant)]/10">
                <td className="py-4 font-bold text-[var(--color-primary)]">{row.desc}</td>
                <td className="py-4 text-[var(--color-on-surface-variant)] text-xs">{row.date}</td>
                <td className="py-4 text-right font-bold">{row.amount}</td>
                <td className="py-4 text-center">
                  <span className="text-[10px] font-bold text-[var(--color-primary)] bg-white px-2.5 py-1 rounded-full shadow-sm">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const TeamTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[var(--color-primary)] font-headline">Co-Administrators</h3>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all">Add Member</button>
      </div>
      <div className="space-y-4">
        {[
          { name: 'Ana Sofía Lopez', role: 'Event Coordinator', email: 'ana.lopez@attenda.me' },
          { name: 'Carlos Morales', role: 'Security Manager', email: 'c.morales@attenda.me' }
        ].map((member, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl ambient-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center font-bold text-xs text-[var(--color-primary)]">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-primary)]">{member.name}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">{member.role} • {member.email}</p>
              </div>
            </div>
            <button className="text-[var(--color-on-surface-variant)] hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ───

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'Account', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'Team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile': return <ProfileTab />;
      case 'Account': return <AccountTab />;
      case 'Billing': return <BillingTab />;
      case 'Team': return <TeamTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 pb-20 mt-4">
      
      {/* ─── Secondary Settings Sidebar ─── */}
      <aside className="lg:w-72 flex flex-col space-y-8 flex-shrink-0">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight font-headline">Settings</h2>
          <p className="text-[var(--color-on-surface-variant)] text-xs">Personalize your concierge experience.</p>
        </div>

        <nav className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-[var(--color-primary)] ambient-shadow' 
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)]'
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-[var(--color-secondary)]' : 'opacity-40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.id}
            </button>
          ))}
        </nav>

        {/* Elite Plan Card */}
        <div className="bg-gradient-to-br from-[#0a1128] to-[#001b44] rounded-2xl p-6 text-white space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 self-start">
              Elite Member
            </span>
            <div className="text-center space-y-1 mb-4">
              <p className="text-xl font-headline font-bold">Yearly Elite</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">Renews Apr 14, 2025</p>
            </div>
            <button className="w-full py-2.5 bg-white text-[var(--color-primary)] rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg transition-all">
              Upgrade Account
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Content Area ─── */}
      <main className="flex-1 min-w-0">
        {renderContent()}
      </main>

    </div>
  );
};

export default Settings;
