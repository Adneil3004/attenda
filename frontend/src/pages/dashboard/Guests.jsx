import { useState } from 'react';
import GuestDrawer from '../../components/dashboard/GuestDrawer';

// Mock Data
const MOCK_GUESTS = [
  { id: 1, name: 'Eleanor Vance', status: 'Confirmed', group: 'Family', plusOne: true, diet: 'None' },
  { id: 2, name: 'Theodora Crain', status: 'Pending', group: 'Friends', plusOne: false, diet: 'Vegetarian' },
  { id: 3, name: 'Luke Crain', status: 'Confirmed', group: 'Family', plusOne: true, diet: 'Gluten-free' },
  { id: 4, name: 'Steven Crain', status: 'Declined', group: 'Family', plusOne: false, diet: 'None' },
  { id: 5, name: 'Shirley Crain', status: 'Confirmed', group: 'Family', plusOne: true, diet: 'None' },
  { id: 6, name: 'Arthur Dudley', status: 'Pending', group: 'Work', plusOne: true, diet: 'None' },
];

const Guests = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const openDrawer = (guest = null) => {
    setSelectedGuest(guest);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 bg-[#19b359]/10 text-[#19b359] rounded-full text-xs font-semibold">Confirmed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 bg-[#f5a623]/10 text-[#f5a623] rounded-full text-xs font-semibold">Pending</span>;
      case 'Declined':
        return <span className="px-2.5 py-1 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full text-xs font-semibold">Declined</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)]">Guest List</h1>
            <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Manage RSVPs, groups, and dietary needs.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search guests..."
                className="pl-10 pr-4 py-2.5 bg-[var(--color-surface-container-lowest)] rounded-md outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 text-sm w-full md:w-64 ambient-shadow"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-[var(--color-outline-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => openDrawer()}
              className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[var(--color-primary-container)] transition-colors ambient-shadow flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Guest
            </button>
          </div>
        </div>

        {/* The No-Divider Table */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-xl ambient-shadow overflow-hidden flex-1 flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--color-surface-container-low)] text-xs font-bold uppercase tracking-wider text-[var(--color-outline-variant)]">
            <div className="col-span-4 md:col-span-3">Guest Name</div>
            <div className="col-span-4 md:col-span-2">Status</div>
            <div className="hidden md:block col-span-2">Group</div>
            <div className="hidden lg:block col-span-2">Dietary</div>
            <div className="hidden lg:block col-span-2">Plus One</div>
            <div className="col-span-4 md:col-span-1 text-right">Actions</div>
          </div>
          
          {/* Table Body */}
          <div className="flex-1 overflow-auto">
            {MOCK_GUESTS.map((guest, index) => (
              <div 
                key={guest.id} 
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors group cursor-pointer ${index % 2 === 0 ? 'bg-[var(--color-surface-container-lowest)]' : 'bg-[var(--color-surface-container-low)]/30 hover:bg-[var(--color-surface-container-low)]'}`}
                onClick={() => openDrawer(guest)}
              >
                <div className="col-span-4 md:col-span-3 font-semibold text-[var(--color-primary)] text-sm">{guest.name}</div>
                <div className="col-span-4 md:col-span-2">{getStatusBadge(guest.status)}</div>
                <div className="hidden md:block col-span-2 text-sm text-[var(--color-on-surface-variant)]">{guest.group}</div>
                <div className="hidden lg:block col-span-2 text-sm text-[var(--color-on-surface-variant)] truncate">{guest.diet}</div>
                <div className="hidden lg:block col-span-2">
                  {guest.plusOne ? (
                    <span className="text-[var(--color-secondary)]">Yes</span>
                  ) : (
                    <span className="text-[var(--color-outline-variant)]">No</span>
                  )}
                </div>
                <div className="col-span-4 md:col-span-1 text-right">
                  <button 
                    className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); openDrawer(guest); }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GuestDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        guest={selectedGuest} 
      />
    </>
  );
};

export default Guests;
