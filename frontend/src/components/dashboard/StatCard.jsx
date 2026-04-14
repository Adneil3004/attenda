import React from 'react';

const StatCard = ({ label, value, icon, color, trend }) => {
  const getIcon = () => {
    switch (icon) {
      case 'guests':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pulse':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'table':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'cancel':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[var(--color-card-bg)] rounded-3xl p-6 ambient-shadow border border-[var(--color-outline-variant)]/10 hover:border-[var(--color-primary)]/20 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {getIcon()}
        </div>
        {trend && typeof trend === 'string' && (
          <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981] bg-[#10b98110] px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-60 mb-1">{label}</h4>
        <p className="text-3xl font-headline font-black text-[var(--color-primary)]">{value}</p>
      </div>

      {trend && typeof trend === 'object' && trend.details && (
        <div className="mt-6 pt-6 border-t border-[var(--color-outline-variant)]/5 space-y-3">
          {trend.details.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40">{item.label}</span>
              <span className="text-xs font-black text-[var(--color-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatCard;
