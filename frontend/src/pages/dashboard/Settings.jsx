import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const navItems = [
    { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'Account', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
  ];

  return (
    <div className="w-full h-full flex bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] -mt-8 font-body">
      
      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col xl:flex-row gap-10 py-10 px-8 xl:px-12 overflow-y-auto w-full max-w-7xl mx-auto">
        
        {/* Left Column: Forms */}
        <div className="flex-1 space-y-6">
          <header className="mb-6">
            <h1 className="text-xl text-[var(--color-primary)] font-display">Account Settings</h1>
            <p className="text-sm text-gray-600 mt-2 max-w-xl leading-relaxed">
              Refine your profile and invitation preferences. Your changes are saved automatically to the cloud.
            </p>
          </header>

          {/* Profile Card */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative pb-6">
            {/* Top Purple Line */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-400"></div>
            
            <div className="px-8 pt-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                    <img src="https://ui-avatars.com/api/?name=Alexander+Ivory&background=0D1117&color=fff&size=128" alt="Alexander Ivory" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 text-purple-600 hover:scale-105 transition-transform">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Personal Details</p>
                  <p className="text-xs font-bold text-gray-800 tracking-widest uppercase">MAIN ACCOUNT HOLDER</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800">Full Name</label>
                  <input type="text" defaultValue="Alexander Ivory" className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800">Email Address</label>
                  <input type="email" defaultValue="alexander@ivoryink.com" className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800">Phone Number</label>
                  <input type="tel" defaultValue="+1 (555) 012-3456" className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-800">Birthdate</label>
                  <div className="relative">
                    <input type="text" defaultValue="05/12/1988" className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-200" />
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-800">Gender Preference</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="gender" defaultChecked className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300" />
                      Male
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="gender" className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300" />
                      Female
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="gender" className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300" />
                      Non-binary
                    </label>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-gray-100" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">Security</p>
                  <p className="text-xs text-gray-500 mt-0.5">Last password change: 3 months ago</p>
                </div>
                <button className="px-4 py-2 bg-[#f3f0ff] text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Team & Access Card */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pt-5 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[var(--color-primary)] font-display text-base">Team & Access</h3>
                <p className="text-xs text-gray-500 mt-1">Add co-admins to help manage your event lists.</p>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Add Co-Admin
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-lg">
                <div className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Miller&background=0D1117&color=fff" className="w-8 h-8 rounded-md shadow-sm" alt="Sarah" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Sarah Miller</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Admin</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-lg">
                <div className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=James+Chen&background=0D1117&color=fff" className="w-8 h-8 rounded-md shadow-sm" alt="James" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">James Chen</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Editor</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              <button className="flex items-center justify-center p-3.5 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors h-full min-h-[64px]">
                + Add New Role
              </button>
            </div>
          </section>

          {/* Payment Methods Card */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
            <h3 className="text-[var(--color-primary)] font-display text-base">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#000a1f] rounded-xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex justify-between items-center z-10 w-full mb-6">
                  <span className="text-sm font-black italic tracking-wider">VISA</span>
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14zm-1-10h2v6h-2z" />
                  </svg>
                </div>
                <div className="space-y-4 z-10 mt-auto">
                  <p className="text-sm font-mono tracking-[0.2em] text-white">••••  ••••  ••••  4242</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-[#a3a3a3]">Card Holder</p>
                      <p className="text-[10px] font-bold uppercase mt-0.5">Alexander Ivory</p>
                    </div>
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-[#a3a3a3]">Expires</p>
                      <p className="text-[10px] font-bold mt-0.5">12/28</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl flex items-center justify-center min-h-[160px] hover:bg-gray-50 cursor-pointer transition-colors p-4">
                <div className="text-center text-gray-500">
                  <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Link New Account</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm text-[var(--color-primary)] font-display">Recent Transactions</h4>
                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All History</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-[#f9f9f9] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Annual Membership</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">May 12, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">$420.00</p>
                    <p className="text-[8px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">Completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-[#f9f9f9] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Custom Calligraphy Set</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">April 28, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">$85.00</p>
                    <p className="text-[8px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center pt-8 text-[10px] text-gray-400">
            Ivory & Ink Digital Concierge • Version 2.4.1 • © 2024
          </footer>
        </div>

        {/* Right Column: Plan Info */}
        <aside className="xl:w-[300px] flex-shrink-0 space-y-6 pt-16">
          {/* Current Plan Card */}
          <div className="bg-[#0f1b3d] rounded-xl p-7 text-white shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6c85b5] font-semibold mb-2">Current Plan</p>
              <h3 className="text-3xl font-display font-light">Elite <span className="text-sm text-[#6c85b5] font-normal leading-loose">/ Yearly</span></h3>
            </div>
            <p className="text-xs text-[#a0b3d8] leading-relaxed">
              Full access to concierge services, priority guest seating, and digital calligraphy.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#f3f0ff] text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[#b8c9eb]">Unlimited Invitations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#f3f0ff] text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[#b8c9eb]">Priority Support</span>
              </li>
            </ul>
            <div className="pt-2">
              <button className="w-full py-2.5 bg-white text-[#0f1b3d] font-bold text-xs rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                Manage Subscription
              </button>
            </div>
            <div className="text-center">
              <button className="text-[9px] text-[#6c85b5] hover:text-white transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Privacy Box */}
          <div className="bg-[#f8f9fa] rounded-xl p-5 flex items-start gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Data Privacy</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Your data is encrypted and secure.</p>
            </div>
            <div className="text-gray-400 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default Settings;
