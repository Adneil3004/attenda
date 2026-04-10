import React from 'react';

const TaskDrawer = ({ isOpen, onClose, task }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white/30 backdrop-blur-md z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[440px] bg-white z-50 shadow-2xl border-l border-[var(--color-outline-variant)]/20 animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-outline-variant)]/10">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-[var(--color-surface-container-low)] text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
              {task?.tag || 'Task'}
            </span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
              task?.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {task?.priority || 'Normal'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Title Area */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-[var(--color-primary)] leading-tight">
              {task?.title || 'Task Details'}
            </h2>
            <div className="flex items-center gap-4 mt-6 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Assignee</span>
                <div className="flex items-center gap-2">
                  <img src={task?.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Assignee" className="w-6 h-6 rounded bg-gray-200" />
                  <span className="font-semibold">{task?.assignee || 'Unassigned'}</span>
                </div>
              </div>
              <div className="w-px h-8 bg-[var(--color-surface-container-low)]"></div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Due Date</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-[var(--color-primary)]">{task?.dueDate || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[var(--color-outline-variant)]/10" />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-primary)]">Description</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              {task?.description || 'No description provided for this task yet. Click to edit and add more details to guide your team.'}
            </p>
          </div>

          <hr className="border-[var(--color-outline-variant)]/10" />

          {/* Subtasks */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-primary)] flex justify-between">
              Checklist
              <span className="text-xs text-[var(--color-on-surface-variant)] font-normal">1/3 Completed</span>
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Confirm quantities with supplier', done: true },
                { label: 'Review floral sample', done: false },
                { label: 'Pay 50% deposit', done: false }
              ].map((item, idx) => (
                <label key={idx} className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer border ${item.done ? 'bg-[var(--color-surface-container-low)] border-transparent' : 'bg-white border-[var(--color-outline-variant)]/20 hover:bg-gray-50'}`}>
                  <input type="checkbox" defaultChecked={item.done} className="mt-1 accent-[var(--color-secondary)] w-4 h-4 rounded-sm" />
                  <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'font-medium text-[var(--color-primary)]'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <button className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest hover:underline">+ Add Checklist Item</button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-lowest)]">
          <button className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex justify-center items-center gap-2">
            Mark as Done
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
};

export default TaskDrawer;
