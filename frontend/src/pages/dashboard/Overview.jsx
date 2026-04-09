const Overview = () => {
  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ─── Header ─── */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">Welcome, Concierge</h2>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Manage your flagship events and guest lists.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-high)] overflow-hidden border border-[var(--color-outline-variant)]/20">
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)] text-white text-sm font-bold">
            JD
          </div>
        </div>
      </div>

      {/* ─── Hero Cards Section ─── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Upcoming Event Card */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10 overflow-hidden flex flex-col md:flex-row min-h-[280px]">
          <div className="flex-1 p-8 flex flex-col border-t-4 border-[var(--color-secondary)]">
            <span className="inline-block bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-6">
              Upcoming Event
            </span>
            <h3 className="text-4xl font-bold text-[var(--color-primary)] mb-4 leading-tight">Boda de Ana & Carlos</h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">September 14, 2026</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Antigua, Guatemala</span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Preparation Progress</span>
                <span className="text-sm font-bold text-[var(--color-secondary)]">80%</span>
              </div>
              <div className="w-full h-2 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-secondary)] w-[80%] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-[var(--color-primary)] relative overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Event Preview</p>
                <p className="text-xs font-medium text-white">Safe For Work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Concierge Support Card */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--color-primary)] rounded-xl ambient-shadow p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-white mb-4">Concierge Support</h4>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Need assistance with your planning? Our specialist team is on standby 24/7 for premium members.
            </p>
          </div>
          <button className="w-full bg-white text-[var(--color-primary)] py-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[var(--color-surface-container-low)] transition-colors relative z-10">
            Contact VIP Specialist
          </button>
        </div>
      </div>

      {/* ─── Actions Row ─── */}
      <div className="flex space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-secondary)]/5 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Assign Template</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Administrar grupo de invitados</span>
        </button>
      </div>

      {/* ─── Metrics Section ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Total Invitados</span>
            <svg className="w-5 h-5 text-[var(--color-secondary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-[var(--color-primary)] mb-1">248</div>
          <p className="text-[var(--color-on-surface-variant)] text-[11px] font-medium">Todos los invitados registrados</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Confirmados</span>
            <div className="w-8 h-8 rounded-md bg-[#10b981]"></div>
          </div>
          <div className="text-4xl font-bold text-[#059669] mb-1">174</div>
          <p className="text-[var(--color-on-surface-variant)] text-[11px] font-medium">Asistencias confirmadas</p>
        </div>

        <div className="bg-white p-6 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Pendientes</span>
            <div className="w-8 h-8 rounded-md bg-[#f59e0b]"></div>
          </div>
          <div className="text-4xl font-bold text-[#d97706] mb-1">52</div>
          <p className="text-[var(--color-on-surface-variant)] text-[11px] font-medium">Invitaciones pendientes</p>
        </div>

        <div className="bg-white p-6 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Declinados</span>
            <div className="w-8 h-8 rounded-md bg-[#f43f5e]"></div>
          </div>
          <div className="text-4xl font-bold text-[#e11d48] mb-1">22</div>
          <p className="text-[var(--color-on-surface-variant)] text-[11px] font-medium">Invitaciones rechazadas</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-2">
        {/* ─── Left/Center Content Area ─── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Attendance Breakdown Card */}
          <div className="bg-white p-8 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-[var(--color-primary)]">Attendance Breakdown</h4>
              <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Estado del grupo de invitados</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase tracking-tighter">
                  <span className="text-[var(--color-on-surface-variant)]">Confirmado</span>
                  <span className="text-[var(--color-primary)]">70%</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] w-[70%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase tracking-tighter">
                  <span className="text-[var(--color-on-surface-variant)]">Pendiente</span>
                  <span className="text-[var(--color-primary)]">21%</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f59e0b] w-[21%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase tracking-tighter">
                  <span className="text-[var(--color-on-surface-variant)]">Rechazado</span>
                  <span className="text-[var(--color-primary)]">5%</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f43f5e] w-[5%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase tracking-tighter">
                  <span className="text-[var(--color-on-surface-variant)]">Parcial</span>
                  <span className="text-[var(--color-primary)]">4%</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#b45309] w-[4%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-outline-variant)]/10 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Confirmado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Pendiente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Rechazado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></div>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Parcial</span>
              </div>
            </div>
          </div>

          {/* Guest Groups Summary Table */}
          <div className="bg-white p-8 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-[var(--color-primary)]">Guest Groups Summary</h4>
              <a className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-widest hover:underline" href="#">Ver todo</a>
            </div>
            <div className="overflow-hidden border border-[var(--color-outline-variant)]/20 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-container-low)]">
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Nombre del grupo</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Invitado</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/10">
                  <tr>
                    <td className="px-6 py-5 text-sm font-bold text-[var(--color-primary)]">Familia Rodríguez</td>
                    <td className="px-6 py-5 text-sm text-[var(--color-on-surface-variant)]">6</td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-[#059669] bg-[#ecfdf5] px-2 py-1 rounded">Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-5 text-sm font-bold text-[var(--color-primary)]">Primos Maternos</td>
                    <td className="px-6 py-5 text-sm text-[var(--color-on-surface-variant)]">4</td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-[#d97706] bg-[#fffbeb] px-2 py-1 rounded">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── Sidebar (Right) ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Plantilla de invitación Card */}
          <div className="bg-white p-8 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-[var(--color-primary)]">Plantilla de invitación</h4>
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
            <div className="space-y-6">
              <div className="pt-2">
                <h5 className="font-bold text-[var(--color-primary)] text-sm mb-4">Floral Romance</h5>
                <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-widest">Floral</span>
                </div>
                
                <div className="aspect-square bg-[var(--color-surface-container)] flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-outline-variant)]/40 mb-6 p-4 text-center">
                  <div className="w-12 h-12 rounded bg-white shadow-sm flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-[var(--color-outline-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Ninguna plantilla asignada</p>
                </div>
                
                <button className="w-full py-3 border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-secondary)]/5 transition-colors">
                  Ver plantillas
                </button>
              </div>
            </div>
          </div>

          {/* Detalles de evento Card */}
          <div className="bg-white p-8 rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/10">
            <h4 className="text-lg font-bold text-[var(--color-primary)] mb-6">Detalles de evento</h4>
            <div className="space-y-6">
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Nombre de evento</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">Boda García & López</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Tipo</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">Boda</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#fffbeb] flex items-center justify-center text-[#f59e0b]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Fecha</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">June 14, 2026</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center text-[#4f46e5]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Tipo de plan</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">Premium</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#ffe4e6] flex items-center justify-center text-[#e11d48]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Cliente</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">María García</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Overview;
