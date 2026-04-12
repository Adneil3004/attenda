import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const Overview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    attendance: 0,
    confirmed: 0,
    pending: 0,
    declined: 0,
    attendanceRate: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Priority order for event ID: URL param > localStorage > next upcoming (backend default)
        const urlId = searchParams.get('eventId');
        const storedId = localStorage.getItem('activeEventId');
        const effectiveId = urlId || storedId;

        const dashData = await apiClient.get(`/events/dashboard${effectiveId ? `/${effectiveId}` : ''}`);
        
        if (dashData) {
          setActiveEvent({
            id: dashData.id,
            name: dashData.name,
            eventDate: dashData.eventDate,
            locationName: dashData.locationName,
            capacityTier: dashData.capacityTier,
            imageUrl: dashData.imageUrl
          });

          // Sync localStorage
          if (dashData.id) {
            localStorage.setItem('activeEventId', dashData.id);
          }

          setMetrics({
            total: dashData.totalGuests,
            attendance: dashData.totalCheckedIn,
            confirmed: dashData.confirmedCount,
            declined: dashData.declinedCount,
            pending: dashData.pendingCount,
            attendanceRate: dashData.totalGuests > 0 ? (dashData.totalCheckedIn / dashData.totalGuests) * 100 : 0,
          });

          // Countdown Logic
          const eventDate = new Date(dashData.eventDate);
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
    };

    fetchData();
  }, [user, searchParams]);

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

  // If no active event was returned (dashboard data null)
  if (!activeEvent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[var(--color-surface-container-lowest)] rounded-3xl min-h-[500px] border border-[var(--color-outline-variant)]/20 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center mb-8 border border-[var(--color-primary)]/10">
          <svg className="w-10 h-10 text-[var(--color-primary)] opacity-40 cursor-bolt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-headline font-black text-[var(--color-primary)] mb-4">No tenés eventos activos</h2>
        <p className="text-[var(--color-on-surface-variant)] text-center max-w-sm mb-10 font-medium leading-relaxed opacity-70">
          Parece que todavía no creaste ningún evento o no tenés uno próximo para administrar. ¡Empecemos ahora mismo!
        </p>
        <button 
          onClick={() => navigate('/dashboard/create-event')}
          className="px-10 py-5 bg-[var(--color-primary)] text-white rounded-[24px] font-bold text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_-15px_rgba(var(--color-primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Crear mi primer evento
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {/* ─── Event Hero Header ─── */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl ambient-shadow overflow-hidden flex flex-col md:flex-row border border-[var(--color-outline-variant)]/10 min-h-[340px]">
          <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-[#f1f5f9]">
            <img 
              src={activeEvent?.imageUrl || 'https://images.unsplash.com/photo-1519224406070-51d3e2ef0dec?q=80&w=1000&auto=format&fit=crop'} 
              alt="Event Header" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden"></div>
          </div>
          
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col">
            <div className="mb-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#f0fdf4] text-[#16a34a] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-[#16a34a]/10">Publicado</span>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider opacity-60">ID: #{activeEvent?.id?.slice(0, 8) || '---'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black text-[var(--color-primary)] tracking-tight mb-4 leading-tight">
                {activeEvent?.name || 'Cargando evento...'}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[var(--color-on-surface-variant)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {activeEvent?.eventDate ? new Date(activeEvent.eventDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-primary)] truncate max-w-[200px]">{activeEvent?.locationName || 'Sin ubicación'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[var(--color-outline-variant)]/10 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  +{metrics.total > 4 ? metrics.total - 4 : 0}
                </div>
              </div>
              <button 
                onClick={() => navigate('/dashboard/guests')}
                className="text-[var(--color-on-surface-variant)] text-[10px] font-extrabold uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors"
              >
                Ver todos los invitados →
              </button>
            </div>
          </div>
        </div>

        {/* Countdown / Tier Card */}
        <div className="col-span-12 lg:col-span-4 bg-[#030712] rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#3b82f633_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_#8b5cf633_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
          
          <div className="relative p-10 h-full flex flex-col justify-between z-10">
            <div>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Tiempo Restante</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-6xl font-headline font-black text-white leading-none mb-2">{countdown.days}</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Días</p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <p className="text-6xl font-headline font-black text-white leading-none mb-2">{countdown.hours}</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Horas</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Tu Plan</p>
                  <p className="text-lg font-headline font-black text-white uppercase italic tracking-tighter">{(activeEvent?.capacityTier || 'FREE').toUpperCase()}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white transition-all duration-300"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Invitados" 
          value={metrics.total.toString()} 
          icon="guests" 
          color="#3b82f6"
          trend="+12%" 
        />
        <StatCard 
          label="Confirmados" 
          value={metrics.confirmed.toString()} 
          icon="check" 
          color="#10b981"
          trend={metrics.total > 0 ? `${Math.round((metrics.confirmed/metrics.total)*100)}%` : '0%'} 
        />
        <StatCard 
          label="Pendientes" 
          value={metrics.pending.toString()} 
          icon="clock" 
          color="#f59e0b" 
        />
        <StatCard 
          label="Tasa Asistencia" 
          value={`${Math.round(metrics.attendanceRate)}%`} 
          icon="pulse" 
          color="#7c3aed"
          trend="Real-time" 
        />
      </div>

      {/* ─── Secondary Grid ─── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Concierge Support */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--color-primary)] rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
            <svg className="w-80 h-80 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-headline font-black text-white mb-4 leading-tight">Soporte Concierge</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-[240px]">
              Tu evento merece la perfección. Nuestro equipo está listo para ayudarte con la lista de invitados 24/7.
            </p>
          </div>
          
          <div className="relative z-10 pt-10">
            <button className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#f8fafc] transition-all">
              Hablar con un experto
            </button>
          </div>
        </div>

        {/* Placeholder for future sections */}
        <div className="col-span-12 lg:col-span-8 bg-white/50 border border-[var(--color-outline-variant)]/10 rounded-3xl p-10 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-headline font-black text-[var(--color-primary)] uppercase tracking-tight">Actividad Reciente</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-60">Live Updates</span>
            </div>
          </div>
          
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-[var(--color-outline-variant)]/10">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[var(--color-primary)]">
                   {i}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-[var(--color-primary)]">Invitado {i} ha confirmado asistencia</p>
                   <p className="text-[10px] text-[var(--color-on-surface-variant)] opacity-50 font-medium">Hace {i*15} minutos</p>
                 </div>
                 <div className="text-[#10b981]">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
