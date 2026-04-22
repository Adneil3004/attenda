import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Providers = () => {
  const { isDark } = useTheme();
  
  // Dummy data representing the Stitch UI state
  const metrics = [
    { label: "Total Committed", value: "$428,500.00", sub: "MXN", icon: "cash" },
    { label: "Onboarded Agencies", value: "14", sub: "Activas", icon: "briefcase" },
    { label: "Presupuesto Ejecutado", value: "85%", sub: "Límite: $500k", icon: "chart" }
  ];

  const providers = [
    { id: 10293, name: "Elite Catering Co.", category: "Gastronomía", status: "Active", spent: 185000 },
    { id: 10442, name: "Starlight Venue", category: "Locación", status: "Active", spent: 120000 },
    { id: 10881, name: "Artisan Decor", category: "Decoración", status: "Pending", spent: 45000 },
    { id: 10992, name: "Vibe Music Ent.", category: "Entretenimiento", status: "Active", spent: 78500 }
  ];

  const [activeProvider, setActiveProvider] = useState(providers[0]);

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      {/* ─── Header & KPIs ─── */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tight mb-2 uppercase">
          Providers and Costs
        </h1>
        <p className="text-sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-80 mb-8">
          Administrator
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-[var(--color-surface-container-lowest)] dark:bg-gray-800 p-6 rounded-3xl ambient-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em]">{m.label}</span>
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/5 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-primary)] dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-4xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tighter">{m.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Pie Chart Panel */}
          <div className="bg-[var(--color-surface-container-lowest)] dark:bg-gray-800 p-8 rounded-3xl ambient-shadow">
            <h3 className="text-xs font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] mb-8">Presupuesto Ejecutado</h3>
            <div className="flex items-center justify-around gap-8">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    className="stroke-gray-100 dark:stroke-gray-700"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-[var(--color-primary)]"
                    strokeWidth="3.8"
                    strokeDasharray="85, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[var(--color-primary)] dark:text-white">85%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Spent</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gastado</p>
                    <p className="text-sm font-black dark:text-white">$428,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Restante</p>
                    <p className="text-sm font-black dark:text-white">$71,500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost by Provider Panel */}
          <div className="bg-[var(--color-surface-container-lowest)] dark:bg-gray-800 p-8 rounded-3xl ambient-shadow">
            <h3 className="text-xs font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] mb-8">Costo por Proveedor</h3>
            <div className="space-y-5">
              {providers.sort((a, b) => b.spent - a.spent).map(p => (
                <div key={p.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface)] dark:text-gray-300">
                    <span>{p.name}</span>
                    <span className="text-[var(--color-primary)] dark:text-white">${p.spent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                      style={{ width: `${(p.spent / 428500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* ─── Provider Directory ─── */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <div className="mb-4">
            <h2 className="text-2xl font-headline font-black text-[var(--color-primary)] dark:text-white mb-2">Provider Directory</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] dark:text-gray-400">Management of global service level agreements</p>
          </div>

          <div className="flex flex-col gap-4">
            {providers.map((p) => (
              <div 
                key={p.id}
                onClick={() => setActiveProvider(p)}
                className={`p-6 rounded-[2rem] transition-all cursor-pointer flex items-center justify-between group
                  ${activeProvider.id === p.id 
                    ? 'bg-[var(--color-surface-container-lowest)] dark:bg-gray-800 ambient-shadow scale-[1.02]' 
                    : 'bg-[var(--color-surface-container-low)] dark:bg-gray-800/40 hover:bg-[var(--color-surface-container-lowest)] dark:hover:bg-gray-700'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${activeProvider.id === p.id ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-primary)] shadow-sm'}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold font-headline ${activeProvider.id === p.id ? 'text-[var(--color-primary)] dark:text-white' : 'text-slate-700 dark:text-gray-300'}`}>
                      {p.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor ID: #{p.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {p.status}
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${activeProvider.id === p.id ? 'text-[var(--color-primary)] translate-x-1' : 'text-gray-300 group-hover:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Provider Details / Edit Panel ─── */}
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8 bg-[var(--color-surface-container-lowest)] dark:bg-gray-800 rounded-[2.5rem] p-8 ambient-shadow flex flex-col min-h-[600px] border border-[var(--color-outline-variant)]/10 text-[var(--color-on-surface)] dark:text-white">
            
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Editing</p>
              <h2 className="text-3xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tight">{activeProvider.name}</h2>
            </div>
            
            {/* Sections without hard divider lines (using spacing and background shifts) */}
            <div className="space-y-6 mb-auto flex-1">
              
              <div className="p-5 bg-[var(--color-surface-container-low)] dark:bg-gray-700/30 rounded-3xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Representante</span>
                    <span className="dark:text-gray-200">María del Valle</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Email</span>
                    <span className="dark:text-gray-200">contacto@agencia.com</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[var(--color-surface-container-low)] dark:bg-gray-700/30 rounded-3xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Service & Payment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Acuerdo</span>
                    <span className="dark:text-gray-200">Retainer Mensual</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Siguiente Pago</span>
                    <span className="text-green-600 font-bold">$12,500.00 MXN</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[var(--color-surface-container-low)] dark:bg-gray-700/30 rounded-3xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Availability Tracking
                </h4>
                <div className="w-full h-8 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex items-center px-1">
                  <div className="flex-1 h-6 bg-blue-100 dark:bg-blue-900/30 rounded m-0.5" title="Reservado"></div>
                  <div className="flex-1 h-6 bg-transparent rounded m-0.5 border border-dashed border-slate-300 dark:border-gray-600" title="Disponible"></div>
                  <div className="flex-1 h-6 bg-blue-500 hover:bg-blue-600 transition-colors rounded m-0.5 cursor-pointer" title="Catering Activo"></div>
                  <div className="flex-1 h-6 bg-transparent rounded m-0.5 border border-dashed border-slate-300 dark:border-gray-600" title="Disponible"></div>
                </div>
              </div>

            </div>

            {/* Glassmorphic Concierge Tip */}
            <div className={`mt-8 p-6 rounded-3xl backdrop-blur-xl border border-[var(--color-secondary)]/20 shadow-lg ${isDark ? 'bg-[#1a0063]/30' : 'bg-gradient-to-br from-[var(--color-surface)]/80 to-[var(--color-secondary-fixed)]/40'}`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-white shadow-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] dark:text-blue-300 mb-1">Concierge Tip</h4>
                  <p className="text-sm font-medium text-[var(--color-on-surface-variant)] dark:text-gray-300 leading-relaxed">
                    Early deposits for catering (30 days out) secure premium seasonal menu selection at 2023 rates.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Providers;
