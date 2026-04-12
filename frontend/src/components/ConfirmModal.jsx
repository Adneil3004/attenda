import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  requireMatch = null // If provided, user must type this text to enable the button
}) => {
  const [inputValue, setInputValue] = useState('');
  const isMatch = requireMatch ? inputValue.trim() === requireMatch.trim() : true;

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#1f2937] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-gray-700"
        >
          <div className="mb-8">
            <h3 className="mb-3 text-3xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tight uppercase">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {requireMatch && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
              <label className="block text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
                Security Identification Required:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Type "${requireMatch}"`}
                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                autoFocus
              />
              {!isMatch && inputValue.length > 0 && (
                <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">
                  Invalid digital signature
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all order-2 sm:order-1"
            >
              {cancelText}
            </button>
            <button
              disabled={!isMatch}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all order-1 sm:order-2
                ${!isMatch ? 'bg-slate-200 dark:bg-gray-700 cursor-not-allowed grayscale' : 
                  variant === 'danger' ? 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 shadow-xl shadow-red-200 dark:shadow-red-900/20' : 
                  variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95 shadow-xl shadow-amber-100 dark:shadow-amber-900/20' : 
                  'bg-[var(--color-primary)] hover:scale-105 active:scale-95 shadow-xl shadow-[var(--color-primary)]/20'}
              `}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
