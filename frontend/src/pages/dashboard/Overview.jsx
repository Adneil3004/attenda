import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import { apiClient, ensureHttps } from '../../lib/api';
import { scheduleApi } from '../../lib/schedule';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Overview = () => {
  const navigate = useNavigate();
  const { eventId: urlEventId } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isDarkMode = isDark;
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    attendance: 0,
    confirmed: 0,
    pending: 0,
    declined: 0,
    attendanceRate: 0,
    totalTables: 0,
    seatingCapacity: 0,
    seatedGuests: 0,
    fullTables: 0,
    availableTables: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const SYSTEM_KEYWORDS = ['create-event', 'my-events', 'table-layout', 'guests', 'tasks', 'settings', 'rsvp-designer', 'edit-event', 'providers'];
      const isValidId = (id) => id && !SYSTEM_KEYWORDS.includes(id);

      try {
        const storedId = localStorage.getItem('activeEventId');
        
        // Ensure we don't use system keywords as IDs
        const cleanUrlId = isValidId(urlEventId) ? urlEventId : null;
        const cleanStoredId = isValidId(storedId) ? storedId : null;
        
        const effectiveId = cleanUrlId || cleanStoredId;

        const endpoint = effectiveId ? `/events/${effectiveId}` : '/events/dashboard';
        const dashData = await apiClient.get(endpoint);
        
        if (dashData) {
          setActiveEvent({
            id: dashData.id,
            name: dashData.name,
            eventDate: dashData.eventDate,
            locationName: dashData.locationName,
            capacityTier: dashData.capacityTier,
            imageUrl: dashData.imageUrl,
            status: dashData.status
          });

          if (dashData.id) {
            localStorage.setItem('activeEventId', dashData.id);
          }

          setMetrics({
            total: dashData.totalGuests ?? 0,
            attendance: dashData.totalCheckedIn ?? 0,
            confirmed: dashData.confirmedCount ?? 0,
            declined: dashData.declinedCount ?? 0,
            pending: dashData.pendingCount ?? 0,
            attendanceRate: dashData.totalGuests > 0 ? ((dashData.totalCheckedIn ?? 0) / dashData.totalGuests) * 100 : 0,
            totalTables: dashData.totalTables ?? 0,
            seatingCapacity: dashData.totalSeatingCapacity ?? 0,
            seatedGuests: dashData.seatedGuestsCount ?? 0,
            fullTables: dashData.fullTablesCount ?? 0,
            availableTables: dashData.availableTablesCount ?? 0
          });

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

          // Fetch actual event activities (Schedule)
          if (dashData.id) {
            try {
              const scheduleData = await scheduleApi.getAll(dashData.id);
              if (scheduleData && scheduleData.length > 0) {
                // Sort by order/time
                const sortedActivities = [...scheduleData].sort((a, b) => a.order - b.order);
                setActivities(sortedActivities);
              } else {
                // Fallback: If no activities yet, fetch recent guests to keep the feed alive
                const guestsData = await apiClient.get(`/Guests/event/${dashData.id}`);
                const guestActivities = (guestsData || []).slice(0, 10).map((guest, index) => ({
                  activityId: guest?.id || `guest-${index}`,
                  type: 'guest',
                  title: `${String(guest?.firstName || 'Guest')} ${String(guest?.lastName || '')}`,
                  status: guest?.rsvpStatus || 'Synced',
                  category: 'Other'
                }));
                setActivities(guestActivities);
              }
            } catch (scheduleErr) {
              console.error('Error fetching schedule:', scheduleErr);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Handle stale event ID or no events (404)
        if (err.message && err.message.includes('404')) {
          const wasUsingSpecificId = !!(urlEventId || localStorage.getItem('activeEventId'));
          localStorage.removeItem('activeEventId');

          if (wasUsingSpecificId) {
            // If we were trying a specific ID that failed, try the general dashboard (auto-picker)
            window.location.reload(); // Hard reload is safer to clear all states
          } else {
            // If even the general dashboard 404s, it means there are NO events
            navigate('/dashboard/create-event');
          }
        } else {
          setError(err.message || 'Failed to load dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, urlEventId]);

  // Handle loading state
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

  // Handle error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 rounded-lg font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[var(--color-surface-container-lowest)] rounded-3xl min-h-[500px] border border-[var(--color-outline-variant)]/20 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center mb-8 border border-[var(--color-primary)]/10">
          <svg className="w-10 h-10 text-[var(--color-primary)] opacity-40 cursor-bolt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-headline font-black text-[var(--color-primary)] mb-4 uppercase tracking-tight">No active events</h2>
        <p className="text-[var(--color-on-surface-variant)] text-center max-w-sm mb-10 font-medium leading-relaxed opacity-70">
          It seems you haven't initialized any events yet. The systems are ready for creation.
        </p>
        <button 
          onClick={() => navigate('/dashboard/create-event')}
          className="px-10 py-5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-[24px] font-bold text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(var(--color-primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Create my first event
        </button>
      </div>
    );
  }

  const isCancelled = activeEvent.status === 'Cancelled';

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {/* ─── Event Hero Header ─── */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Event Hero Card */}
        <div className="col-span-12 lg:col-span-8 bg-[var(--color-surface-container-lowest)] rounded-[2.5rem] ambient-shadow overflow-hidden flex flex-col md:flex-row border border-[var(--color-outline-variant)]/10 min-h-[360px] relative">
          
          {/* Sheen for dark mode */}
          {isDarkMode && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem] sheen-effect" style={{ zIndex: 1 }}></div>
          )}
          
          <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-[var(--color-surface-container-low)]">
            <img 
              src={ensureHttps(activeEvent?.imageUrl) || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop'} 
              alt="Event Header" 
              className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-container-lowest)] via-transparent to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-container-lowest)] via-transparent to-transparent md:hidden"></div>
          </div>
          
          <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col relative z-10">
            <div className="mb-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all ${
                  isCancelled 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-green-50 text-green-600 border-green-200 shadow-sm shadow-green-100'
                }`}>
                  {isCancelled ? 'Suspended' : 'Operational'}
                </span>
                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Mark #{activeEvent?.id?.slice(0, 4)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black text-[var(--color-primary)] tracking-tight mb-6 leading-[1.1]">
                {activeEvent?.name || 'Loading...'}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-[var(--color-text-muted)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--color-surface-container-high)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-primary)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-xs font-black text-[var(--color-primary)] uppercase tracking-wider">
                    {activeEvent?.eventDate 
                      ? `${new Date(activeEvent.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}, ${new Date(activeEvent.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} hrs`
                      : '---'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--color-surface-container-high)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-primary)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <span className="text-xs font-black text-[var(--color-primary)] uppercase tracking-wider truncate max-w-[180px]">{activeEvent?.locationName || 'Offline'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-[var(--color-outline-variant)]/30 flex items-center justify-between">
              <button 
                onClick={() => navigate(`/dashboard/edit-event/${activeEvent.id}`)}
                className="group flex items-center gap-3 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Manage Event</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-11 h-11 rounded-2xl border-[3px] border-[var(--color-card-bg)] bg-[var(--color-surface-container-high)] overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+40}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-11 h-11 rounded-2xl border-[3px] border-[var(--color-surface-container-lowest)] bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                  +{metrics.total > 3 ? metrics.total - 3 : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown / Tier Card */}
        <div className={`col-span-12 lg:col-span-4 bg-[var(--color-primary)] rounded-[2.5rem] overflow-hidden relative group border border-[var(--color-outline-variant)]/10 transition-all duration-700 ${isCancelled ? 'grayscale opacity-80' : ''}`}>
          <div className="absolute inset-0 bg-white/5 opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
          
          {/* Sheen effect for dark mode */}
          {isDarkMode && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem] sheen-effect" style={{ zIndex: 1 }}></div>
          )}
          
          <div className="relative p-12 h-full flex flex-col justify-between z-10 text-white">
            <div>
              <div className="flex items-center gap-3 mb-10 opacity-60">
                <div className="w-1 h-4 bg-white rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Deployment Countdown</p>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-7xl font-headline font-black leading-none mb-3 tracking-tighter">{countdown.days}</p>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Days</p>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div>
                  <p className="text-7xl font-headline font-black leading-none mb-3 tracking-tighter">{countdown.hours}</p>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Hours</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Plan Status</p>
                  <p className="text-2xl font-headline font-black uppercase italic tracking-widest text-white">{(activeEvent?.capacityTier || 'STANDARD')}</p>
                </div>
                <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Synced" 
          value={metrics.total.toString()} 
          icon="guests" 
          color="#3b82f6"
          trend="+5%" 
        />
        <StatCard 
          label="Confirmed" 
          value={metrics.confirmed.toString()} 
          icon="check" 
          color="#10b981"
          trend={metrics.total > 0 ? `${Math.round((metrics.confirmed/metrics.total)*100)}%` : '0%'} 
        />
        <StatCard 
          label="Pending" 
          value={metrics.pending.toString()} 
          icon="clock" 
          color="#f59e0b" 
        />
        <StatCard 
          label="Declined" 
          value={metrics.declined.toString()} 
          icon="cancel" 
          color="#ef4444"
          trend={metrics.total > 0 ? `${Math.round((metrics.declined/metrics.total)*100)}%` : '0%'} 
        />
      </div>

      {/* ─── Tables Management Row ─── */}
      <h3 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <span className="w-10 h-[1px] bg-[var(--color-outline-variant)]/50"></span>
        Table Logistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Tables Created" 
          value={metrics.totalTables} 
          icon="table" 
          color="#3b82f6"
          trend="Inventory" 
        />
        <StatCard 
          label="Available Tables" 
          value={metrics.availableTables} 
          icon="check" 
          color="#10b981"
          trend="With space" 
        />
        <StatCard 
          label="Full Tables" 
          value={metrics.fullTables} 
          icon="clock" 
          color="#f59e0b"
          trend="At 100%" 
        />
        <StatCard 
          label="Occupancy" 
          value={`${metrics.seatedGuests}/${metrics.seatingCapacity}`} 
          icon="guests" 
          color="#7c3aed"
          trend={metrics.seatingCapacity > 0 ? `${Math.round((metrics.seatedGuests/metrics.seatingCapacity)*100)}%` : '0%'} 
        />
      </div>

      {/* ─── Activity Feed ─── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Concierge Support */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--color-primary)] rounded-[2.5rem] p-12 flex flex-col justify-between relative overflow-hidden group min-h-[420px] border border-[var(--color-outline-variant)]/10">
          <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none text-white">
            <svg className="w-80 h-80 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-headline font-black text-white mb-6 leading-[1.1]">Senior Support</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-[260px] font-medium">
              Access protocol specialists ready to intervene if system anomalies are detected.
            </p>
          </div>
          
          <div className="relative z-10 pt-10">
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-[#21263c] rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#f8fafc] hover:scale-105 active:scale-95 transition-all duration-300">
              Request Intervention
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-12 lg:col-span-8 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-[2rem] p-6 ambient-shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-headline font-black text-[var(--color-primary)] uppercase tracking-tight">Activity Log</h3>
              <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">Live monitoring</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none">Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
          <div className="space-y-4">
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity, index) => {
                const isGuest = activity.type === 'guest';
                const startTime = activity.startTime ? new Date(activity.startTime) : null;
                
                return (
                  <div 
                    key={activity.activityId || `activity-${index}`} 
                    onClick={() => !isGuest && navigate(`/dashboard/schedule/${activeEvent.id}`)}
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--color-surface-container-low)] transition-all cursor-pointer border border-transparent hover:border-[var(--color-outline-variant)]/20"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-low)] flex flex-col items-center justify-center font-black text-[10px] text-[var(--color-primary)] dark:text-white group-hover:bg-[var(--color-surface-container-lowest)] group-hover:shadow-lg transition-all border border-transparent group-hover:border-[var(--color-outline-variant)]/30">
                      {startTime ? (
                        <>
                          <span className="text-xs">{startTime.getHours().toString().padStart(2, '0')}</span>
                          <span className="opacity-30">--</span>
                          <span className="text-[8px]">{startTime.getMinutes().toString().padStart(2, '0')}</span>
                        </>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-[var(--color-text-primary)]">
                          {activity.title}
                        </p>
                        {!isGuest && (
                          <span className="text-[8px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            Event
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider mt-0.5">
                        {isGuest ? `RSVP: ${activity.status}` : (activity.description || 'No description')}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-[var(--color-primary)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 rounded-3xl border-2 border-dashed border-[var(--color-outline-variant)]/30">
                <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">No time protocols initiated</p>
                <button 
                  onClick={() => navigate(`/dashboard/schedule/${activeEvent.id}`)}
                  className="mt-4 text-xs font-black text-indigo-500 uppercase tracking-widest hover:underline"
                >
                  Configure Schedule
                </button>
              </div>
            )}
            
            {activities.length > 0 && (
              <button 
                onClick={() => navigate(`/dashboard/schedule/${activeEvent.id}`)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors border-t border-[var(--color-outline-variant)]/10 mt-2"
              >
                View Full Schedule
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
