import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const GuestChip = ({ guest, onRemove, isOverlay = false, isVIP = false, compact = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: guest.id,
    data: { type: 'guest', guest },
    disabled: guest.rsvpStatus === 'Declined'
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2 py-0.5 bg-[#19b359]/10 text-[#19b359] rounded-full text-[10px] font-semibold">Confirmed</span>;
      case 'Pending':
        return <span className="px-2 py-0.5 bg-[#f5a623]/10 text-[#f5a623] rounded-full text-[10px] font-semibold">Pending</span>;
      case 'Declined':
        return <span className="px-2 py-0.5 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full text-[10px] font-semibold opacity-50">Declined</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    if (type === 'VIP') {
      return <span className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">VIP</span>;
    }
    if (type === 'PlusOne') {
      return <span className="text-[10px] font-medium text-[var(--color-secondary)]">+1</span>;
    }
    return null;
  };

  const isDraggable = guest.rsvpStatus !== 'Declined';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group flex items-center gap-3 rounded-xl
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${compact ? 'p-2.5 px-3' : 'p-3'}
        ${isVIP 
          ? 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600' 
          : 'bg-[var(--color-card-bg)] border border-[var(--color-card-border)] hover:border-[var(--color-primary)]/40'
        }
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
        ${!isDraggable ? 'opacity-40 cursor-not-allowed' : ''}
        ${isOverlay ? 'shadow-xl border-[var(--color-primary)]/30 rotate-2' : ''}
      `}
    >
      {/* Avatar */}
      <div className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-sm ${
        compact ? 'w-9 h-9 text-xs' : 'w-10 h-10 text-sm'
      } ${
        isVIP 
          ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' 
          : 'bg-[var(--color-primary)] text-white'
      }`}>
        {getInitials(guest.firstName, guest.lastName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${compact ? 'text-sm' : 'text-sm'} ${isVIP ? 'text-gray-800 dark:text-white' : 'text-[var(--color-text-primary)]'}`}>
          {`${guest.firstName} ${guest.lastName}`}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {getStatusBadge(guest.rsvpStatus)}
        </div>
      </div>

      {/* Remove Button */}
      {onRemove && isDraggable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(guest.id);
          }}
          className={`rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            compact ? 'w-5 h-5' : 'w-6 h-6'
          } ${
            isVIP 
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-500'
          } opacity-0 group-hover:opacity-100 ${compact ? 'group-hover:opacity-100' : ''}`}
          title="Remove from table"
        >
          <svg className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GuestChip;
