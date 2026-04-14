import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, ensureHttps } from '../../lib/api';
import ConfirmModal from '../../components/ConfirmModal';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.get('/events');
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleManage = (eventId) => {
    localStorage.setItem('activeEventId', eventId);
    navigate(`/dashboard/${eventId}`);
  };

  const handleEdit = (eventId) => {
    navigate(`/dashboard/edit-event/${eventId}`);
  };

  const handleDelete = (eventId, eventName) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      data: { id: eventId, name: eventName }
    });
  };

  const confirmDelete = async () => {
    const { id } = modalConfig.data;
    try {
      await apiClient.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      setModalConfig({ ...modalConfig, isOpen: false });
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleToggleStatus = (eventId, currentStatus) => {
    const disable = currentStatus !== 'Cancelled';
    setModalConfig({
      isOpen: true,
      type: 'toggle',
      data: { id: eventId, disable, currentStatus }
    });
  };

  const confirmToggleStatus = async () => {
    const { id, disable } = modalConfig.data;
    try {
      await apiClient.post(`/events/${id}/status`, { disable });
      setEvents(events.map(e => 
        e.id === id 
          ? { ...e, status: disable ? 'Cancelled' : 'Active' } 
          : e
      ));
      setModalConfig({ ...modalConfig, isOpen: false });
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 dark:border-gray-800 border-t-[var(--color-primary)] dark:border-t-violet-400 rounded-full animate-spin"></div>
        <p className="text-[14px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] dark:text-violet-400 animate-pulse text-center">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full p-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tight">My Events</h2>
          <p className="text-slate-500 dark:text-gray-400 text-[14px] font-black uppercase tracking-widest mt-2 opacity-60">Manage all your upcoming events from one dashboard.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/create-event')}
          className="bg-[var(--color-primary)] dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] shadow-xl shadow-[var(--color-primary)]/20 dark:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          New Event
        </button>
      </div>

      {/* ─── Events Grid ─── */}
      {events.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-20 text-center border border-slate-100 dark:border-gray-700 ambient-shadow">
          <div className="w-20 h-20 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-200 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-slate-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">No events found. Start by creating a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const isCancelled = event.status === 'Cancelled';
            return (
              <div 
                key={event.id}
                className={`group relative bg-white dark:bg-gray-800/40 rounded-[2.5rem] overflow-hidden ambient-shadow border border-slate-100 dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] ${isCancelled ? 'grayscale opacity-80' : ''}`}
              >
                {/* Sheen effect for dark mode */}
                <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-10 pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white to-transparent" style={{ transform: 'rotate(25deg) translateY(-50%)', height: '200%', width: '100% '}}></div>
                
                {/* Image/Status Overlay */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-gray-900">
                  <img 
                    src={ensureHttps(event.imageUrl) || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop'} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[14px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    {event.capacityTier || 'STANDARD'}
                  </div>

                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className={`px-4 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl backdrop-blur-md ${
                      !isCancelled 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-amber-500/90 text-white'
                    }`}>
                      <span className={`w-1.5 h-1.5 bg-white rounded-full ${!isCancelled ? 'animate-pulse' : ''}`}></span>
                      {isCancelled ? 'Suspended' : 'Active'}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-8 right-8">
                    <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Event #{event.id?.slice(0, 4)}</p>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tight leading-tight line-clamp-1">
                      {event.name}
                    </h4>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-1">
                      <p className="text-[14px] font-black text-slate-300 dark:text-gray-500 uppercase tracking-widest leading-none">Type</p>
                      <p className="text-[14px] font-bold text-slate-500 dark:text-gray-400 truncate">{event.eventType || 'General Event'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-black text-slate-300 dark:text-gray-500 uppercase tracking-widest leading-none">Guests</p>
                      <p className="text-[14px] font-bold text-slate-500 dark:text-gray-400">{event.guestCount || 0} Records</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 pt-6 border-t border-slate-50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-white">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date not defined'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-white line-clamp-1">{event.locationName || 'Location Disconnected'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleManage(event.id)}
                      className="flex-1 bg-[var(--color-primary)] dark:bg-white text-white dark:text-slate-900 py-4 rounded-[1.25rem] font-black text-[14px] uppercase tracking-[0.2em] shadow-xl shadow-[var(--color-primary)]/10 dark:shadow-white/5 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Manage
                    </button>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleEdit(event.id)}
                        className="w-12 h-12 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-slate-300 dark:text-gray-500 rounded-[1.25rem] flex items-center justify-center hover:text-[var(--color-primary)] dark:hover:text-white hover:border-[var(--color-primary)]/30 dark:hover:border-white/30 hover:shadow-lg transition-all duration-300"
                        title="Settings"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      
                      <button 
                        onClick={() => handleToggleStatus(event.id, event.status)}
                        className={`w-12 h-12 border rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ${
                          isCancelled 
                            ? 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40' 
                            : 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-500 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                        }`}
                        title={isCancelled ? "Activate" : "Suspend"}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {isCancelled ? (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          ) : (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </button>

                      <button 
                        onClick={() => handleDelete(event.id, event.name)}
                        className="w-12 h-12 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-500 dark:text-red-400 rounded-[1.25rem] flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modals ─── */}
      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'delete'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmDelete}
        requireMatch={modalConfig.data?.name}
        title="DELETE EVENT?"
        message={`This action will permanently delete "${modalConfig.data?.name?.toUpperCase()}" and all associated guest data. This cannot be undone.`}
        confirmText="PERMANENT DELETE"
        variant="danger"
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'toggle'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmToggleStatus}
        title={modalConfig.data?.disable ? 'SUSPEND EVENT' : 'ACTIVATE EVENT'}
        message={modalConfig.data?.disable 
          ? 'Guest access will be temporarily disabled for this event.' 
          : 'The event will be reactivated and full functionality restored.'}
        confirmText={modalConfig.data?.disable ? 'SUSPEND' : 'ACTIVATE'}
        variant={modalConfig.data?.disable ? 'warning' : 'primary'}
      />
    </div>
  );
};

export default MyEvents;
