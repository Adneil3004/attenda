import React, { useState, useEffect } from 'react';

const CreateTableModal = ({ isOpen, onClose, onCreate, editTable = null }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(8);
  const [priority, setPriority] = useState('Normal');
  const [errors, setErrors] = useState({});

  const isEditing = !!editTable;

  useEffect(() => {
    if (editTable) {
      setName(editTable.name);
      setCapacity(editTable.capacity);
      setPriority(editTable.priority || 'Normal');
    } else {
      setName('');
      setCapacity(8);
      setPriority('Normal');
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
    } else if (capacity > 50) {
      newErrors.capacity = 'Maximum capacity is 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    onCreate({
      id: editTable?.id,
      name: name.trim(),
      capacity,
      priority,
      guestIds: editTable?.guestIds || []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-primary)] dark:text-white">
              {isEditing ? 'Edit Table' : 'Create New Table'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Define your seating arrangements</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          {/* Priority Toggle */}
          <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full">
            <button
              type="button"
              onClick={() => setPriority('Normal')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                priority === 'Normal' 
                  ? 'bg-white dark:bg-gray-700 text-[var(--color-primary)] dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setPriority('VIP')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                priority === 'VIP' 
                  ? 'bg-[#030712] text-white shadow-xl' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {priority === 'VIP' && (
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              VIP Priority
            </button>
          </div>

          {/* Table Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              Table Designation
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Center Stage"
              className={`
                w-full px-5 py-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 
                text-[var(--color-primary)] dark:text-white font-semibold placeholder-gray-400 dark:placeholder-gray-500
                outline-none transition-all
                ${errors.name 
                  ? 'border-red-400 ring-4 ring-red-50 dark:ring-red-900/30' 
                  : 'border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10'
                }
              `}
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              Total Seats
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setCapacity(Math.max(1, capacity - 1))}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 text-[var(--color-primary)] dark:text-white font-black text-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all shadow-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                  min="1"
                  max="50"
                  className="flex-1 bg-transparent text-center text-[var(--color-primary)] dark:text-white font-black text-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCapacity(Math.min(50, capacity + 1))}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 text-[var(--color-primary)] dark:text-white font-black text-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {[6, 8, 10, 12].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setCapacity(num)}
                className={`
                  h-10 px-4 rounded-xl text-xs font-bold transition-all
                  ${capacity === num
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {num} Seats
              </button>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#030712] text-white rounded-2xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-gray-900 flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Update Table
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Table
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;
