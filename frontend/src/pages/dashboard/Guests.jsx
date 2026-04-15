import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import GuestDrawer from '../../components/dashboard/GuestDrawer';
import ConfirmationModal from '../../components/dashboard/ConfirmationModal';
import { apiClient } from '../../lib/api';
import { useParams } from 'react-router-dom';

const Guests = () => {
  const { eventId } = useParams();
  const { user, session } = useAuth();
  
  // States
  const [activeEvent, setActiveEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  // Selection state
  const [selectedGuestIds, setSelectedGuestIds] = useState(new Set());
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger',
    requiresKeyword: false,
    loading: false
  });

  // Calculate total guests including plusOnes
  const totalGuests = useMemo(() => {
    return guests.reduce((sum, guest) => sum + (guest.plusOnes || 0), 0) + guests.length;
  }, [guests]);


  const fetchEventDetails = useCallback(async () => {
    if (!eventId) return;
    try {
      const eventData = await apiClient.get(`/events/${eventId}`);
      setActiveEvent(eventData);
    } catch (err) {
      console.error('Error fetching event details:', err);
    }
  }, [eventId]);

  const fetchData = useCallback(async () => {
    if (!user || !eventId) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Ensure we have event details
      await fetchEventDetails();
      
      // 2. Fetch Groups for this event from Backend
      const groupsData = await apiClient.get(`/Groups/event/${eventId}`);
      setGroups(groupsData || []);

      // 3. Fetch Guests for this event from Backend
      const guestsData = await apiClient.get(`/Guests/event/${eventId}`);
      setGuests(guestsData || []);
      
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load guest data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, session, eventId, fetchEventDetails]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  // derived filtered state
  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchSearch = (g.firstName + ' ' + (g.lastName||'')).toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || g.rsvpStatus === statusFilter;
      const matchGroup = groupFilter === 'All' || (g.groupName === groupFilter);
      return matchSearch && matchStatus && matchGroup;
    });
  }, [guests, searchTerm, statusFilter, groupFilter]);

  // Selection handlers
  const toggleSelectGuest = (id) => {
    const next = new Set(selectedGuestIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedGuestIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedGuestIds.size === filteredGuests.length && filteredGuests.length > 0) {
      setSelectedGuestIds(new Set());
    } else {
      setSelectedGuestIds(new Set(filteredGuests.map(g => g.id)));
    }
  };

  const isAllSelected = filteredGuests.length > 0 && selectedGuestIds.size === filteredGuests.length;

  // Deletion Handlers
  const handleDeleteSingle = (guest) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Guest',
      message: `Are you sure you want to remove ${guest.firstName} ${guest.lastName}? This action cannot be undone.`,
      type: 'danger',
      requiresKeyword: false,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          await apiClient.delete('/Guests/batch', {
            eventId: activeEvent.id,
            guestIds: [guest.id]
          });

          fetchData();
        } catch (err) {
          alert(err.message);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${selectedGuestIds.size} Guests`,
      message: `Are you sure you want to remove the ${selectedGuestIds.size} selected guests? This action cannot be undone.`,
      type: 'danger',
      requiresKeyword: false,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          await apiClient.delete('/Guests/batch', {
            eventId: activeEvent.id,
            guestIds: Array.from(selectedGuestIds)
          });

          setSelectedGuestIds(new Set());
          fetchData();
        } catch (err) {
          alert(err.message);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  const handleDeleteAll = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Guest List',
      message: 'CRITICAL: This will remove ALL guests from this event. You cannot undo this operation.',
      type: 'danger',
      requiresKeyword: true,
      keyword: 'BORRAR',
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/Guests/event/${activeEvent.id}/all`);

          setSelectedGuestIds(new Set());
          fetchData();
        } catch (err) {
          alert(err.message);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  // Download CSV Template - Resilient Method
  const handleDownloadTemplate = () => {
    const headers = ['FirstName', 'LastName', 'PhoneNumber', 'GroupName', 'DietaryRestrictions', 'Notes'];
    const row = ['John', 'Doe', '+12345678900', 'Family', 'Vegetarian;Gluten-Free', 'Allergic to peanuts'];
    const csvString = headers.join(',') + "\n" + row.join(',');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Explicit anchor tag creation and click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "guests_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  };

  // Handle CSV Upload with improved column mapping
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!activeEvent) {
      alert("No active event found.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/); // Handle both \n and \r\n
      if (lines.length < 2) return;

      const newGuests = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV split (note: doesn't handle quoted commas, but better than nothing for now)
        const cols = line.split(',').map(c => c.trim());
        
        if (cols.length >= 2) {
          newGuests.push({
            firstName: cols[0] || '',
            lastName: cols[1] || '',
            phoneNumber: cols[2] || '',
            groupName: cols[3] || null,
            dietaryRestrictions: cols[4] ? cols[4].split(';').map(s => s.trim()).filter(s => s) : [],
            notes: cols[5] || null
          });
        }
      }

      if (newGuests.length === 0) return;

      // Ensure limit is respected (count each plus their plusOnes)
      const totalNewGuests = newGuests.reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
      if (totalGuests + totalNewGuests > activeEvent.guest_limit) {
        alert(`Cannot import ${newGuests.length} guests (${totalNewGuests} total espacios). Tu plan ${activeEvent.capacity_tier} te permite hasta ${activeEvent.guest_limit} lugares.`);
        return;
      }

      setLoading(true);
      try {
        await apiClient.post('/Guests/import', {
          eventId: activeEvent.id,
          guests: newGuests
        });

        fetchData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)]">Guest List</h1>
            <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Manage RSVPs, groups, and dietary needs.</p>
            {activeEvent && (
              <p className={`text-xs font-semibold mt-2 ${totalGuests > activeEvent.guest_limit ? 'text-red-600' : 'text-[var(--color-secondary)]'}`}>
                Event: {activeEvent.name} ({totalGuests} / {activeEvent.guest_limit} lugares usados)
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto flex-1">
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search name..."
                className="pl-10 pr-4 py-2.5 bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 text-sm w-full sm:w-48 shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-2.5 pl-3 pr-8 bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 text-sm w-full sm:w-auto shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>

            {/* Group Filter */}
            <select 
              value={groupFilter}
              onChange={e => setGroupFilter(e.target.value)}
              className="py-2.5 pl-3 pr-8 bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 text-sm w-full sm:w-auto shadow-sm"
            >
              <option value="All">All Groups</option>
              {groups.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
              {/* Plantilla Button */}
              <button 
                onClick={handleDownloadTemplate}
                title="Download CSV Template"
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-[var(--color-outline-variant)]/30 rounded-md text-xs font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all ambient-shadow"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span className="hidden lg:inline">Template (.csv)</span>
              </button>

              {/* Importar Button */}
              <label 
                title="Import CSV File"
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-[var(--color-outline-variant)]/30 rounded-md text-xs font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] transition-all ambient-shadow cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="hidden lg:inline">Import</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
              </label>

              {/* Add Guest Button */}
              <button 
                onClick={() => openDrawer()}
                disabled={activeEvent && totalGuests >= activeEvent.guest_limit}
                className="bg-[var(--color-primary)] text-white px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold hover:bg-opacity-90 transition-colors ambient-shadow flex items-center gap-2 ml-1 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span className="hidden sm:inline">Add Guest</span>
              </button>

              {/* Clear List Button - Always visible if guests exist */}
              {guests.length > 0 && (
                <button 
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-red-100 text-red-500 rounded-md text-xs font-bold hover:bg-red-50 hover:border-red-200 transition-all ambient-shadow"
                  title="Remove all guests from this event"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden lg:inline">Clear List</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 text-sm bg-red-50 text-red-600 border border-red-200 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedGuestIds.size > 0 && (
          <div className="mb-4 p-4 bg-[var(--color-primary-container)]/50 border border-[var(--color-primary)]/10 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 sheen-container">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {selectedGuestIds.size} guests selected
              </span>
              <div className="h-4 w-px bg-[var(--color-primary)]/20 mx-2"></div>
              <button 
                onClick={toggleSelectAll}
                className="text-xs font-bold text-[var(--color-secondary)] hover:underline"
              >
                Deselect All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* The No-Divider Table */}
        {/* The No-Divider Table Container */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-xl ambient-shadow flex-1 flex flex-col border border-gray-100 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="min-w-[850px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)]/20 text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] items-center sticky top-0 z-10">
                <div className="col-span-1 flex justify-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                </div>
                <div className="col-span-6 md:col-span-4 lg:col-span-3">Guest Name</div>
                <div className="col-span-2">Status</div>
                <div className="hidden md:block col-span-2">Group</div>
                <div className="hidden lg:block col-span-2">Dietary</div>
                <div className="col-span-3 md:col-span-3 lg:col-span-2 text-center">Acciones</div>
              </div>
              
              {/* Table Body Content */}
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading guests...</div>
                ) : filteredGuests.length === 0 ? (
                  <div className="p-12 text-center text-sm text-gray-400 font-semibold bg-gray-50/50 h-full flex flex-col justify-center items-center min-h-[300px]">
                    <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    No guests found. Get started by adding someone manually or importing a CSV.
                  </div>
                ) : (
                  filteredGuests.map((guest, index) => (
                    <div 
                      key={guest.id} 
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors group cursor-pointer ${
                        selectedGuestIds.has(guest.id) 
                          ? 'bg-[var(--color-primary)]/[0.03] border-l-4 border-[var(--color-primary)]' 
                          : index % 2 === 0 ? 'bg-[var(--color-surface-container-lowest)] border-l-4 border-transparent' : 'bg-[var(--color-surface-container-low)]/30 hover:bg-[var(--color-surface-container-low)] border-l-4 border-transparent'
                      }`}
                      onClick={() => openDrawer(guest)}
                    >
                      <div className="col-span-1 flex justify-center" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedGuestIds.has(guest.id)}
                          onChange={() => toggleSelectGuest(guest.id)}
                          className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-4 lg:col-span-3">
                        <p className="font-semibold text-[var(--color-primary)] text-sm">{guest.firstName} {guest.lastName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{guest.phoneNumber}</p>
                      </div>
                      <div className="col-span-2">{getStatusBadge(guest.rsvpStatus)}</div>
                      <div className="hidden md:block col-span-2 text-sm text-[var(--color-on-surface-variant)]">{guest.groupName || '—'}</div>
                      <div className="hidden lg:block col-span-2 text-sm text-[var(--color-on-surface-variant)] truncate">{guest.dietaryRestrictions?.join(', ') || '—'}</div>
                      <div className="col-span-3 md:col-span-3 lg:col-span-2 flex items-center justify-center gap-2">
                        <button 
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          onClick={(e) => { e.stopPropagation(); openDrawer(guest); }}
                          title="Editar Invitado"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          onClick={(e) => { e.stopPropagation(); handleDeleteSingle(guest); }}
                          title="Eliminar Invitado"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GuestDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); fetchData(); }} 
        guest={selectedGuest} 
        activeEvent={activeEvent}
        groups={groups}
      />

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        requiresKeyword={confirmModal.requiresKeyword}
        keyword={confirmModal.keyword}
        loading={confirmModal.loading}
      />
    </>
  );
};

export default Guests;
