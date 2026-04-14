import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTheme } from '../../contexts/ThemeContext';
import GuestChip from './GuestChip';

const TableCard = ({ table, guests, onRemoveGuest, onDeleteTable, onEditTable }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { theme } = useTheme();

  const { setNodeRef, isOver } = useDroppable({
    id: `table-${table.id}`,
    data: { type: 'table', tableId: table.id }
  });

  // Backend returns 'guests' as array of objects, but we need guest IDs for some logic
  // The guests array from backend: [{ id, firstName, lastName, rsvpStatus }, ...]
  const currentGuests = table.guests || [];
  const guestIds = currentGuests.map(g => g.id);
  const fillPercentage = (currentGuests.length / table.capacity) * 100;
  const isFull = currentGuests.length >= table.capacity;
  
  // VIP detection: either by name or by priority field
  const isVIP = table.name.toLowerCase().includes('founders') || 
                table.name.toLowerCase().includes('vip') || 
                table.priority === 'VIP';
  const isDark = isVIP;

  const getProgressColor = () => {
    if (isFull) return 'bg-red-500';
    if (fillPercentage >= 75) return 'bg-amber-500';
    return 'bg-[#19b359]';
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300 ambient-shadow
        ${isVIP 
          ? 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600' 
          : 'bg-[var(--color-card-bg)] border border-[var(--color-card-border)]'
        }
        ${isOver ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}
      `}
    >
      {/* Sheen Effect for VIP Tables only */}
      {isVIP && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -inset-full animate-sheenslow ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
              : 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
          }`} />
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-inherit">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${isVIP ? 'text-amber-500' : 'text-[var(--color-primary)]'}`}>
            {isVIP ? '👑' : '🪑'}
          </span>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isVIP ? 'text-gray-800 dark:text-white' : 'text-[var(--color-primary)]'}`}>
              {table.name}
            </h3>
            {isVIP && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] font-bold rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-700/50">
                VIP
              </span>
            )}
          </div>
          {isFull && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Full
            </span>
          )}
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isVIP 
                ? 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className={`absolute right-0 top-full mt-1 z-20 py-1 rounded-lg shadow-xl border min-w-[140px] bg-[var(--color-card-bg)] border-[var(--color-card-border)]`}>
                <button
                  onClick={() => {
                    onEditTable?.(table);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Table
                </button>
                <button
                  onClick={() => {
                    onDeleteTable?.(table.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Table
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${isVIP ? 'text-gray-600 dark:text-gray-400' : 'text-[var(--color-text-secondary)]'}`}>
            {currentGuests.length} / {table.capacity} seats
          </span>
          <span className={`text-xs font-semibold ${isFull ? 'text-red-500' : isVIP ? 'text-gray-700 dark:text-gray-300' : 'text-[var(--color-text-primary)]'}`}>
            {Math.round(fillPercentage)}% full
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isVIP ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Guest List - Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          relative px-4 pb-4 min-h-[60px] transition-colors
          ${isOver 
            ? 'bg-[var(--color-primary)]/5 border-2 border-dashed border-[var(--color-primary)] rounded-xl m-2 p-2' 
            : ''
          }
        `}
      >
        {currentGuests.length === 0 ? (
          <div className={`
            flex flex-col items-center justify-center py-4 rounded-xl border-2 border-dashed
            ${isOver 
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
              : isVIP 
                ? 'border-gray-300 dark:border-gray-600 text-gray-500' 
                : 'border-gray-200 dark:border-gray-600 text-gray-400'
            }
          `}>
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xs font-medium">Drop guests</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentGuests.map(guest => (
              <GuestChip
                key={guest.id}
                guest={guest}
                onRemove={onRemoveGuest}
                isVIP={isVIP}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
