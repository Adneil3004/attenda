import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import { apiClient } from '../../lib/api';
import TableCard from '../../components/dashboard/TableCard';
import UnassignedPanel from '../../components/dashboard/UnassignedPanel';
import CreateTableModal from '../../components/dashboard/CreateTableModal';
import GuestChip from '../../components/dashboard/GuestChip';

const TableLayout = () => {
  const { eventId: paramEventId } = useParams();
  
  const SYSTEM_KEYWORDS = ['create-event', 'my-events', 'table-layout', 'guests', 'tasks', 'settings', 'rsvp-designer', 'edit-event'];
  const isValidId = (id) => id && !SYSTEM_KEYWORDS.includes(id);

  // Fallback to localStorage if eventId not in URL, ensuring we only use valid IDs
  const eventId = isValidId(paramEventId) 
    ? paramEventId 
    : (isValidId(localStorage.getItem('activeEventId')) ? localStorage.getItem('activeEventId') : null);
  const [tables, setTables] = useState([]);
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGuest, setActiveGuest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Show toast notification - must be declared before fetchData
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async (isRefresh = false) => {
    if (!eventId) {
      showToast('No active event. Please select an event first.', 'error');
      setIsLoading(false);
      return;
    }
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const [fetchedTables, fetchedGuests] = await Promise.all([
        apiClient.get(`/Tables/event/${eventId}`),
        apiClient.get(`/Guests/event/${eventId}`)
      ]);
      setTables(fetchedTables);
      setGuests(fetchedGuests);
    } catch (err) {
      console.error('Error fetching seating data:', err);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [eventId]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 }
    })
  );

  // Computed: assigned guest IDs (from table.guests which is array of objects)
  const assignedGuestIds = useMemo(() => {
    return tables.flatMap(t => (t.guests || []).map(g => g.id));
  }, [tables]);

  // Computed: unassigned guests (confirmed or pending ones not at a table)
  const unassignedGuests = useMemo(() => {
    return guests.filter(g => 
      !assignedGuestIds.includes(g.id) && 
      (g.rsvpStatus === 'Confirmed' || g.rsvpStatus === 'Pending')
    );
  }, [guests, assignedGuestIds]);

  // Computed: get guest by ID
  const getGuestById = useCallback((guestId) => {
    return guests.find(g => g.id === guestId);
  }, [guests]);

  // Check if table can accept more guests
  const canAddToTable = useCallback((tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table && ((table.guests?.length || 0) < table.capacity);
  }, [tables]);

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const guest = getGuestById(active.id);
    setActiveGuest(guest);
  }, [getGuestById]);

  // Handle drag end (OPTIMISTIC)
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    setActiveGuest(null);

    if (!over) return;

    const guestId = active.id;
    const overId = over.id;
    const previousTables = [...tables];

    // Dropped on unassigned panel
    if (overId === 'unassigned') {
      // Check if it was already unassigned
      if (!assignedGuestIds.includes(guestId)) return;

      // Optimistic update - use guests array
      setTables(prev => prev.map(t => ({
        ...t,
        guests: (t.guests || []).filter(g => g.id !== guestId)
      })));

      try {
        await apiClient.post(`/Tables/unassign-guest/${guestId}/event/${eventId}`);
        // Refresh data to stay in sync
        await fetchData(true);
        showToast('Guest unassigned', 'success');
      } catch (error) {
        setTables(previousTables);
        showToast(error.message || 'Failed to unassign guest', 'error');
      }
      return;
    }

    // Dropped on a table
    if (overId.startsWith('table-')) {
      const tableId = overId.replace('table-', '');

      // Check if already in this table
      const currentTable = tables.find(t => t.id === tableId);
      if (currentTable?.guests?.some(g => g.id === guestId)) return;

      // Check capacity
      if (!canAddToTable(tableId)) {
        showToast('Table is full!', 'error');
        return;
      }

      // Optimistic update - use guests array
      const guestToAdd = guests.find(g => g.id === guestId);
      setTables(prev => prev.map(table => {
        // Remove from current table
        const filteredGuests = (table.guests || []).filter(g => g.id !== guestId);
        // Add to new table
        if (table.id === tableId && guestToAdd) {
          return { ...table, guests: [...filteredGuests, guestToAdd] };
        }
        return { ...table, guests: filteredGuests };
      }));

      try {
        await apiClient.post(`/Tables/${tableId}/assign-guest/${guestId}/event/${eventId}`);
        // Refresh data to stay in sync
        await fetchData(true);
        showToast('Guest assigned successfully!', 'success');
      } catch (error) {
        // Revert on error
        setTables(previousTables);
        showToast(error.message || 'Failed to assign guest', 'error');
      }
    }
  }, [tables, eventId, assignedGuestIds, canAddToTable, showToast, fetchData, guests]);

  // Remove guest from tables (manual click from card)
  const handleRemoveGuest = useCallback(async (guestId) => {
    const previousTables = [...tables];
    setTables(prev => prev.map(t => ({
      ...t,
      guests: (t.guests || []).filter(g => g.id !== guestId)
    })));

    try {
      await apiClient.post(`/Tables/unassign-guest/${guestId}/event/${eventId}`);
      await fetchData(true);
    } catch (error) {
      setTables(previousTables);
      showToast('Error removing guest', 'error');
    }
  }, [tables, eventId, showToast, fetchData]);

  // Create new table
  const handleCreateTable = async (tableData) => {
    try {
      const payload = { ...tableData, eventId };
      const newTable = await apiClient.post('/Tables', payload);
      setTables(prev => [...prev, { ...newTable, guests: [] }]);
      setIsCreateModalOpen(false);
      showToast('Table created!', 'success');
    } catch (error) {
      showToast('Error creating table', 'error');
    }
  };

  // Update existing table
  const handleUpdateTable = async (tableData) => {
    try {
      await apiClient.put(`/Tables/${tableData.id}`, tableData);
      setTables(prev => prev.map(t => t.id === tableData.id ? { ...t, ...tableData } : t));
      setEditingTable(null);
      showToast('Table updated!', 'success');
    } catch (error) {
      showToast('Error updating table', 'error');
    }
  };

  // Delete table
  const handleDeleteTable = async (tableId) => {
    try {
      await apiClient.delete(`/Tables/${tableId}/event/${eventId}`);
      setTables(prev => prev.filter(t => t.id !== tableId));
      showToast('Table deleted.', 'success');
    } catch (error) {
      showToast('Error deleting table', 'error');
    }
  };

  // Early return only on initial load, otherwise show with inline loading
  if (isLoading && tables.length === 0 && guests.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] dark:bg-[#0a0a0b] -m-6 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Floor Plan & Seating
          </h1>
          {(isLoading || isRefreshing) && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[var(--color-primary)]"></div>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Organize guest seating with drag and drop
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-black flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add Table
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Tables Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-10">
            {tables.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-[var(--color-card-bg)] rounded-2xl ambient-shadow border border-[var(--color-card-border)]">
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">No tables yet</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 max-w-xs">
                  Create your first table to start organizing guest seating
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-[#030712] text-white rounded-xl font-semibold flex items-center gap-2 hover:brightness-110 transition-all ambient-shadow"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Table
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tables.map(table => (
                  <TableCard
                    key={table.id}
                    table={table}
                    guests={guests}
                    onRemoveGuest={handleRemoveGuest}
                    onDeleteTable={handleDeleteTable}
                    onEditTable={(t) => setEditingTable(t)}
                  />
                ))}

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="min-h-[200px] rounded-2xl border-2 border-dashed border-[var(--color-card-border)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all focus:outline-none"
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">Add Table</span>
                </button>
              </div>
            )}
          </div>

          {/* Unassigned Panel */}
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <UnassignedPanel
              guests={unassignedGuests}
            />
          </div>
        </div>

        <DragOverlay>
          {activeGuest ? (
            <div className="scale-105 rotate-2">
              <GuestChip guest={activeGuest} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTableModal
        isOpen={isCreateModalOpen || !!editingTable}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTable(null);
        }}
        onCreate={editingTable ? handleUpdateTable : handleCreateTable}
        editTable={editingTable}
      />

      {toast && (
        <div className={`
          fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50
          animate-in slide-in-from-right-4 duration-300
          ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-white'}
        `}>
          {toast.type === 'success' && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-bold tracking-tight">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default TableLayout;
