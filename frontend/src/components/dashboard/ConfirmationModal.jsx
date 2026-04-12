// Test Auto Accept Extension - 2026-04-11
import React, { useState, useEffect } from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  requiresKeyword = false,
  keyword = "BORRAR",
  loading = false
}) => {
  const [inputKeyword, setInputKeyword] = useState('');
  const [canConfirm, setCanConfirm] = useState(!requiresKeyword);

  useEffect(() => {
    if (isOpen) {
      setInputKeyword('');
      setCanConfirm(!requiresKeyword);
    }
  }, [isOpen, requiresKeyword]);

  useEffect(() => {
    if (requiresKeyword) {
      setCanConfirm(inputKeyword.trim().toUpperCase() === keyword.toUpperCase());
    }
  }, [inputKeyword, keyword, requiresKeyword]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-50',
          iconColor: 'text-red-500',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-100'
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-500',
          buttonBg: 'bg-amber-600 hover:bg-amber-700',
          borderColor: 'border-amber-100'
        };
      default:
        return {
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-500',
          buttonBg: 'bg-[var(--color-primary)] hover:opacity-90',
          borderColor: 'border-blue-100'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border ${styles.borderColor} overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center shrink-0`}>
              {type === 'danger' && (
                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-[var(--color-primary)] leading-tight">{title}</h3>
          </div>

          <p className="text-[var(--color-on-surface-variant)] text-sm mb-8 leading-relaxed">
            {message}
          </p>

          {requiresKeyword && (
            <div className="mb-8 space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                Type <span className="text-red-600 font-bold">"{keyword}"</span> to confirm
              </label>
              <input 
                type="text" 
                value={inputKeyword}
                onChange={e => setInputKeyword(e.target.value)}
                placeholder={keyword}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-center font-bold text-red-600 placeholder:text-gray-300 focus:outline-none focus:border-red-200 transition-all uppercase"
                autoFocus
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || loading}
              className={`flex-1 px-6 py-3.5 ${styles.buttonBg} text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2`}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
