import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const GuestChip = ({ guest, onRemove, compact = false, isVIP = false, isOverlay = false }) => {
  const isDraggable = guest.rsvpStatus === 'Confirmed' || guest.rsvpStatus === 'Pending';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: guest.id,
    disabled: !isDraggable || isOverlay
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-[9px] font-bold";
    if (status === 'Confirmed') return <span className={`${baseClasses} bg-[#ecfdf5] text-[#10b981]`}>Confirmed</span>;
    if (status === 'Pending') return <span className={`${baseClasses} bg-amber-50 text-amber-600`}>Pending</span>;
    return <span className={`${baseClasses} bg-gray-100 text-gray-500`}>{status}</span>;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group flex items-center gap-2 rounded-2xl
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${compact ? 'p-2' : 'p-3'}
        bg-white dark:bg-[#25272b] 
        border border-gray-100 dark:border-white/5
        ${isDragging ? 'opacity-50 shadow-2xl scale-105' : 'shadow-sm hover:shadow-md'}
        ${!isDraggable ? 'opacity-40 cursor-not-allowed' : ''}
        ${isOverlay ? 'shadow-2xl border-emerald-500/50 rotate-3' : ''}
      `}
    >
      {/* Avatar */}
      <div className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-sm ${
        compact ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'
      } bg-[#ff9f0a] text-white`}>
        {getInitials(guest.firstName, guest.lastName)}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-bold text-[#1a202c] dark:text-gray-100 ${compact ? 'text-xs' : 'text-sm'}`}>
          {`${guest.firstName} ${guest.lastName}`}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          {getStatusBadge(guest.rsvpStatus)}
        </div>
      </div>

      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(guest.id); }}
          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GuestChip;
