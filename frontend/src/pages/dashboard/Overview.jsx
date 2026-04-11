import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    declined: 0
  });
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch user's primary event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('event_date', { ascending: true })
        .limit(1)
        .single();

      if (eventError && eventError.code !== 'PGRST116') throw eventError;
      
      if (eventData) {
        setActiveEvent(eventData);

        // 2. Fetch Guests counts
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('rsvp_status')
          .eq('event_id', eventData.id);

        if (guestsError) throw guestsError;

        const counts = { total: guestsData.length, confirmed: 0, pending: 0, declined: 0 };
        guestsData.forEach(g => {
          if (g.rsvp_status === 'Confirmed') counts.confirmed++;
          else if (g.rsvp_status === 'Pending') counts.pending++;
          else if (g.rsvp_status === 'Declined') counts.declined++;
        });
        setMetrics(counts);

        // 3. Simple Countdown Logic (Native)
        const eventDate = new Date(eventData.event_date);
        const now = new Date();
        const diffMs = eventDate - now;
        
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
          setCountdown({ days, hours });
        } else {
          setCountdown({ days: 0, hours: 0 });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[var(--color-surface-container-high)] rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-[var(--color-surface-container-high)] rounded"></div>
        </div>
      </div>
    );
  }

  // Simulación de eventos. Cambia el array por datos reales de Supabase luego.
  const events = activeEvent ? [activeEvent] : [];

  // Empty State View
  if (!events || events.length === 0) {
    return (
      <div className="flex-1 w-full h-[calc(100vh-8rem)] flex items-center justify-center -mt-8 py-20 px-6">
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto ambient-shadow border border-[var(--color-outline-variant)]/10 flex flex-col items-center">
          
          <div className="w-24 h-24 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mb-8 relative border-8 border-white shadow-sm">
            <div className="absolute inset-0 bg-[var(--color-secondary)]/10 rounded-full animate-ping opacity-50"></div>
            <svg className="w-10 h-10 text-[var(--color-secondary)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-display font-bold text-[var(--color-primary)] mb-3">
            Aún no tienes eventos
          </h2>
          
          <p className="text-[var(--color-on-surface-variant)] text-sm mb-8 leading-relaxed max-w-sm">
            Empieza creando tu primer evento para gestionar listas de invitados, asignar mesas y enviar invitaciones digitales.
          </p>
          
          <button 
            onClick={() => navigate('/dashboard/create-event')}
            className="flex items-center gap-2 bg-[var(--color-secondary)] hover:brightness-110 transition-all text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-[var(--color-secondary)]/30 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Crear tu primer evento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full p-2 animate-in fade-in duration-700">

      {/* ─── Header ─── */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-3xl font-headline font-bold text-[var(--color-primary)] tracking-tight">Welcome, Concierge</h2>
          <p className="text-[var(--color-on-surface-variant)] text-xs font-semibold mt-1">Manage your flagship events and guest lists.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold border-4 border-white shadow-sm">
          JD
        </div>
      </div>

      {/* ─── Hero Cards Section ─── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Upcoming Event Card */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl ambient-shadow border border-[var(--color-outline-variant)]/5 overflow-hidden flex flex-col md:flex-row min-h-[250px] sheen-container">
          <div className="flex-1 p-8 flex flex-col border-t-4 border-[#7c3aed]">
            <span className="inline-block bg-[#7c3aed]/10 text-[#7c3aed] text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-6">
              Upcoming Event
            </span>
            <h3 className="text-4xl font-headline font-bold text-[var(--color-primary)] mb-4 leading-tight">{activeEvent?.name}</h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold uppercase">
                  {activeEvent?.event_date && new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(activeEvent.event_date))}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--color-on-surface-variant)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-bold uppercase">{activeEvent?.location_name || 'Venue not set'}</span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Attendance Rate</span>
                <span className="text-xs font-extrabold text-[#7c3aed]">{metrics.total > 0 ? Math.round((metrics.confirmed / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                <div className="h-full bg-[#7c3aed] rounded-full transition-all duration-1000" style={{ width: `${metrics.total > 0 ? Math.round((metrics.confirmed / metrics.total) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-[#030712] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex gap-4 items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-3xl font-headline font-black text-white">{countdown.days}</p>
                  <p className="text-[8px] font-extrabold text-white/40 uppercase tracking-widest">Days</p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-headline font-black text-white">{countdown.hours}</p>
                  <p className="text-[8px] font-extrabold text-white/40 uppercase tracking-widest">Hours</p>
                </div>
              </div>
              <p className="text-[9px] font-extrabold text-white/40 uppercase tracking-[0.2em] mb-1">Time Remaining</p>
              <p className="text-[10px] font-bold text-white uppercase italic">Concierge Exclusive</p>
            </div>
          </div>
        </div>

        {/* Concierge Support Card */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--color-primary)] rounded-xl shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <svg className="w-48 h-48 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-headline font-bold text-white mb-3">Concierge Support</h4>
            <p className="text-white/60 text-xs leading-relaxed mb-8">
              Need assistance with your planning? Our specialist team is on standby 24/7 for premium members.
            </p>
          </div>
          <button className="w-full bg-white text-[var(--color-primary)] py-3.5 rounded-lg font-extrabold text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#f8fafc] transition-all active:scale-[0.98]">
            Contact VIP Specialist
          </button>
        </div>
      </div>

      {/* ─── Metrics Section ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-7 rounded-2xl ambient-shadow border border-[var(--color-outline-variant)]/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[var(--color-on-surface-variant)] text-[9px] font-extrabold uppercase tracking-widest opacity-60">Total Invitados</span>
            <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[var(--color-secondary)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-4xl font-headline font-extrabold text-[var(--color-primary)] mb-1 tracking-tighter">{metrics.total}</div>
            <p className="text-[var(--color-on-surface-variant)] text-[10px] font-bold opacity-40">Todos los invitados registrados</p>
          </div>
        </div>
        
        <div className="bg-white p-7 rounded-2xl ambient-shadow border border-[var(--color-outline-variant)]/5">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[var(--color-on-surface-variant)] text-[9px] font-extrabold uppercase tracking-widest opacity-60">Confirmados</span>
            <div className="w-8 h-8 rounded-lg bg-[#10b981]"></div>
          </div>
          <div className="text-4xl font-headline font-extrabold text-[#10b981] mb-1 tracking-tighter">{metrics.confirmed}</div>
          <p className="text-[var(--color-on-surface-variant)] text-[10px] font-bold opacity-40">Asistencias confirmadas</p>
        </div>

        <div className="bg-white p-7 rounded-2xl ambient-shadow border border-[var(--color-outline-variant)]/5">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[var(--color-on-surface-variant)] text-[9px] font-extrabold uppercase tracking-widest opacity-60">Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]"></div>
          </div>
          <div className="text-4xl font-headline font-extrabold text-[#f59e0b] mb-1 tracking-tighter">{metrics.pending}</div>
          <p className="text-[var(--color-on-surface-variant)] text-[10px] font-bold opacity-40">Invitaciones pendientes</p>
        </div>

        <div className="bg-white p-7 rounded-2xl ambient-shadow border border-[var(--color-outline-variant)]/5">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[var(--color-on-surface-variant)] text-[9px] font-extrabold uppercase tracking-widest opacity-60">Declinados</span>
            <div className="w-8 h-8 rounded-lg bg-[#f43f5e]"></div>
          </div>
          <div className="text-4xl font-headline font-extrabold text-[#f43f5e] mb-1 tracking-tighter">{metrics.declined}</div>
          <p className="text-[var(--color-on-surface-variant)] text-[10px] font-bold opacity-40">Invitaciones rechazadas</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-2">
        {/* Attendance Breakdown Card */}
        <div className="col-span-12 bg-white p-8 rounded-2xl ambient-shadow border border-[var(--color-outline-variant)]/5">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-headline font-bold text-[var(--color-primary)]">Attendance Breakdown</h4>
            <span className="text-[9px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] opacity-40">Estado del grupo</span>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[10px] font-extrabold mb-2 uppercase tracking-tight">
                <span className="text-[var(--color-on-surface-variant)]">Confirmado</span>
                <span className="text-[var(--color-primary)]">{metrics.total > 0 ? Math.round((metrics.confirmed / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-[#f8fafc] rounded-full overflow-hidden">
                <div className="h-full bg-[#10b981] rounded-full shadow-sm shadow-[#10b981]/20 transition-all duration-1000" style={{ width: `${metrics.total > 0 ? Math.round((metrics.confirmed / metrics.total) * 100) : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-extrabold mb-2 uppercase tracking-tight">
                <span className="text-[var(--color-on-surface-variant)]">Pendiente</span>
                <span className="text-[var(--color-primary)]">{metrics.total > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-[#f8fafc] rounded-full overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full shadow-sm shadow-[#f59e0b]/20 transition-all duration-1000" style={{ width: `${metrics.total > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-extrabold mb-2 uppercase tracking-tight">
                <span className="text-[var(--color-on-surface-variant)]">Declinado</span>
                <span className="text-[var(--color-primary)]">{metrics.total > 0 ? Math.round((metrics.declined / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-[#f8fafc] rounded-full overflow-hidden">
                <div className="h-full bg-[#f43f5e] rounded-full shadow-sm shadow-[#f43f5e]/20 transition-all duration-1000" style={{ width: `${metrics.total > 0 ? Math.round((metrics.declined / metrics.total) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#f1f5f9] flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
              <span className="text-[9px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-60">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
              <span className="text-[9px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-60">Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
              <span className="text-[9px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-60">Declinado</span>
            </div>
          </div>
        </div>

        {/* ─── Sidebar (Now Empty/Removed) ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
        </div>
      </div>
    </div>
  );
};

export default Overview;
