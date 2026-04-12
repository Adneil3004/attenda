import React, { useState, useEffect } from 'react';

const CreateTableModal = ({ isOpen, onClose, onCreate, editTable = null }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(8);
  const [errors, setErrors] = useState({});

  const isEditing = !!editTable;

  useEffect(() => {
    if (editTable) {
      setName(editTable.name);
      setCapacity(editTable.capacity);
    } else {
      setName('');
      setCapacity(8);
    }
    setErrors({});
  }, [editTable, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Table name is required';
    } else if (name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }

    if (capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (capacity > 20) {
      newErrors.capacity = 'Maximum capacity is 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    onCreate({
      id: editTable?.id || `t-${Date.now()}`,
      name: name.trim(),
      capacity,
      guestIds: editTable?.guestIds || []
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-primary)]">
          {isEditing ? 'Edit Table' : 'Create New Table'}
        </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Table Name */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-primary)] mb-2">
              Table Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., VIP Center Stage"
              className={`
                w-full px-4 py-3 rounded-xl border bg-[var(--color-surface-container-lowest)] 
                text-[var(--color-primary)] placeholder-gray-400
                outline-none transition-all
                ${errors.name 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
                }
              `}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-primary)] mb-2">
              Seating Capacity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCapacity(Math.max(1, capacity - 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                className={`
                  w-20 h-12 text-center rounded-xl border bg-[var(--color-surface-container-lowest)] 
                  text-[var(--color-primary)] font-bold text-lg
                  outline-none transition-all
                  ${errors.capacity 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setCapacity(Math.min(20, capacity + 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                seats (1-20)
              </span>
            </div>
            {errors.capacity && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.capacity}</p>
            )}
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-on-surface-variant)] mb-2">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Round 6', value: 6 },
                { label: 'Round 8', value: 8 },
                { label: 'Round 10', value: 10 },
                { label: 'VIP 12', value: 12 },
              ].map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setCapacity(preset.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${capacity === preset.value
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#030712] text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all ambient-shadow"
          >
            {isEditing ? 'Save Changes' : 'Create Table'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;
