import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const GuestDrawer = ({ isOpen, onClose, guest, activeEvent, groups }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Pending');
  const [groupId, setGroupId] = useState('');
  const [diet, setDiet] = useState('');
  const [plusOne, setPlusOne] = useState(false);
  const [notes, setNotes] = useState('');

  // Hydrate form when guest changes
  useEffect(() => {
    if (guest) {
      setFirstName(guest.first_name || '');
      setLastName(guest.last_name || '');
      setEmail(guest.email || '');
      setStatus(guest.rsvp_status || 'Pending');
      setGroupId(guest.guest_group_id || '');
      setDiet(guest.dietary_restrictions || '');
      setPlusOne(guest.plus_one || false);
      setNotes(guest.notes || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setStatus('Pending');
      setGroupId('');
      setDiet('');
      setPlusOne(false);
      setNotes('');
    }
    setErrorMsg('');
  }, [guest, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeEvent) {
      setErrorMsg("Error: No active event found.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const guestData = {
      event_id: activeEvent.id,
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      rsvp_status: status,
      guest_group_id: groupId || null,
      dietary_restrictions: diet || null,
      plus_one: plusOne,
      notes: notes || null
    };

    try {
      if (guest) {
        // Update existing guest
        const { error } = await supabase
          .from('guests')
          .update(guestData)
          .eq('id', guest.id);
        if (error) throw error;
      } else {
        // Create new guest
        const { error } = await supabase
          .from('guests')
          .insert([guestData]);
        if (error) throw error;
      }
      onClose(); // Will trigger fetch on parent
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save guest data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[var(--color-primary)]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-[var(--color-surface)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">
            {guest ? 'Edit Guest' : 'Add New Guest'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-[var(--color-outline-variant)] opacity-20"></div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-xs font-bold border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">First Name *</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="Jane"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
              placeholder="jane@example.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">RSVP Status</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Group</label>
              <select 
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
              >
                <option value="">Unassigned</option>
                {groups?.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Dietary Restrictions</label>
            <input 
              type="text" 
              value={diet}
              onChange={e => setDiet(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
              placeholder="e.g. Vegan, Gluten-free"
            />
          </div>

          <div className="p-4 bg-[var(--color-secondary-fixed)]/30 rounded-lg border border-[var(--color-secondary-fixed)]/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={plusOne}
                onChange={e => setPlusOne(e.target.checked)}
                className="w-4 h-4 text-[var(--color-secondary)] rounded focus:ring-[var(--color-secondary)]" 
              />
              <span className="text-sm font-semibold text-[var(--color-on-secondary-fixed-variant)]">Allow Plus One</span>
            </label>
          </div>
          
          <div className="flex flex-col relative">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Private Notes</label>
            <textarea 
              rows="4"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm resize-none"
              placeholder="Internal notes about this guest..."
            ></textarea>
          </div>

          <div className="pt-8 pb-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity ambient-shadow disabled:opacity-50"
            >
              {loading ? 'Saving...' : (guest ? 'Save Changes' : 'Add Guest')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GuestDrawer;
