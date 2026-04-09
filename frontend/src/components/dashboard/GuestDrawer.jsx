const GuestDrawer = ({ isOpen, onClose, guest }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[var(--color-primary)]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-[var(--color-surface)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col pt-safe">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-xl font-bold text-[var(--color-primary)]">
              {guest ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full h-px bg-[var(--color-outline-variant)] opacity-20"></div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue={guest?.name || ''}
                className="bg-[var(--color-surface-container-lowest)] border border-transparent rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col relative">
                <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">RSVP Status</label>
                <select 
                  defaultValue={guest?.status || 'Pending'}
                  className="bg-[var(--color-surface-container-lowest)] border border-transparent rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
              <div className="flex flex-col relative">
                <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Group</label>
                <select 
                  defaultValue={guest?.group || 'Unassigned'}
                  className="bg-[var(--color-surface-container-lowest)] border border-transparent rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
                >
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                  <option value="Work">Work</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Dietary Restrictions</label>
              <input 
                type="text" 
                defaultValue={guest?.diet || ''}
                className="bg-[var(--color-surface-container-lowest)] border border-transparent rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="e.g. Vegan, Gluten-free"
              />
            </div>

            <div className="p-4 bg-[var(--color-secondary-fixed)]/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={guest?.plusOne} className="w-4 h-4 text-[var(--color-secondary)] rounded focus:ring-[var(--color-secondary)]" />
                <span className="text-sm font-semibold text-[var(--color-on-secondary-fixed-variant)]">Allow Plus One</span>
              </label>
            </div>
            
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Private Notes</label>
              <textarea 
                rows="4"
                className="bg-[var(--color-surface-container-lowest)] border border-transparent rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm resize-none"
                placeholder="Internal notes about this guest..."
              ></textarea>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 bg-[var(--color-surface-container-low)] ghost-border border-t">
             <button type="button" className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity ambient-shadow">
              {guest ? 'Save Changes' : 'Add Guest'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestDrawer;
