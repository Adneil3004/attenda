import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import GuestChip from './GuestChip';

const UnassignedPanel = ({ guests, onAutoFill }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: { type: 'unassigned' }
  });

  return (
    <div className={`
      h-full flex flex-col bg-[var(--color-card-bg)] rounded-2xl ambient-shadow border border-[var(--color-card-border)]
      ${isOver ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-card-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="text-base font-bold text-[var(--color-primary)]">
              Unassigned Guests
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-semibold">
            {guests.length} remaining
          </span>
        </div>
      </div>

      {/* Guest List - Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 overflow-y-auto p-4 space-y-2 transition-colors
          ${isOver ? 'bg-[var(--color-primary)]/5' : ''}
        `}
      >
        {guests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#19b359]/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#19b359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
              All assigned!
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Every guest has been assigned to a table
            </p>
          </div>
        ) : (
          guests.map(guest => (
            <GuestChip
              key={guest.id}
              guest={guest}
            />
          ))
        )}
      </div>

      {/* Auto-Fill Button */}
      {guests.length > 0 && (
        <div className="p-4 border-t border-[var(--color-card-border)]">
          <button
            onClick={onAutoFill}
            className="w-full py-3 px-4 bg-[#030712] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-black/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-Fill Remaining
          </button>
        </div>
      )}
    </div>
  );
};

export default UnassignedPanel;
