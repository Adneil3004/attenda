import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
  const navigate = useNavigate();

  // Simulated event data
  const [events] = useState([
    {
      id: 1,
      name: 'Boda de Ana & Carlos',
      type: 'Wedding',
      date: 'September 14, 2026',
      location: 'Antigua, Guatemala',
      guests: 248,
      status: 'Active',
      tier: 'Premium',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      name: 'XV Años de Isabella',
      type: 'XV years',
      date: 'December 05, 2026',
      location: 'Monterrey, México',
      guests: 120,
      status: 'Ready',
      tier: 'Elite',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      name: 'Company Kickoff 2027',
      type: 'Company',
      date: 'January 20, 2027',
      location: 'CDMX, México',
      guests: 50,
      status: 'Draft',
      tier: 'Free',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
    }
  ]);

  return (
    <div className="flex flex-col gap-8 w-full p-2 animate-in fade-in duration-700">
      
      {/* ─── Header ─── */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-headline font-bold text-[var(--color-primary)] tracking-tight">Mis Eventos</h2>
          <p className="text-[var(--color-on-surface-variant)] text-xs font-semibold mt-2">Gestiona y personaliza todas tus celebraciones activas.</p>
        </div>
      </div>

      {/* ─── Events Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div 
            key={event.id}
            className="group bg-white rounded-2xl overflow-hidden ambient-shadow border border-[var(--color-outline-variant)]/5 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Image/Status Overlay */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                {event.tier}
              </div>

              {event.status === 'Active' && (
                <div className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  En Vivo
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-headline font-bold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors">
                    {event.name}
                  </h4>
                  <p className="text-[10px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-widest opacity-60 mt-1">
                    {event.type}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)]">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary)]">{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)]">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary)]">{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)]">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary)]">{event.guests} Invitados</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-xl font-extrabold text-[9px] uppercase tracking-[0.1em] hover:brightness-110 transition-all shadow-md active:scale-[0.98]"
                >
                  Administrar
                </button>
                <button className="w-12 h-11 bg-[#f1f5f9] text-[var(--color-primary)] rounded-xl flex items-center justify-center hover:bg-[#e2e8f0] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyEvents;
