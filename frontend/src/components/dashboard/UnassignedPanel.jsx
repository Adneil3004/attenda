import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import GuestChip from './GuestChip';

const UnassignedPanel = ({ guests }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: { type: 'unassigned' }
  });

  return (
    <div className={`
      h-full flex flex-col bg-white dark:bg-[#1a1b1e] rounded-[1.5rem] shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden
      ${isOver ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
    `}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
              Guest List
            </h2>
          </div>
          <span className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-tight">
            {guests.length} Items
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

    </div>
  );
};

export default UnassignedPanel;
