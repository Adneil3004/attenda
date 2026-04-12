import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import TableCard from '../../components/dashboard/TableCard';
import UnassignedPanel from '../../components/dashboard/UnassignedPanel';
import CreateTableModal from '../../components/dashboard/CreateTableModal';
import GuestChip from '../../components/dashboard/GuestChip';

const INITIAL_TABLES = [
  { id: 't1', name: 'VIP Center Stage', capacity: 10, guestIds: ['g1', 'g2', 'g5'] },
  { id: 't2', name: 'Main Floor A', capacity: 8, guestIds: ['g3'] },
  { id: 't3', name: 'Main Floor B', capacity: 8, guestIds: [] },
  { id: 't4', name: 'Founders Circle', capacity: 6, guestIds: ['g4'] },
];

const INITIAL_GUESTS = [
  { id: 'g1', firstName: 'John', lastName: 'Doe', rsvpStatus: 'Confirmed', guestType: 'VIP', groupName: 'Speakers' },
  { id: 'g2', firstName: 'Sarah', lastName: 'Miller', rsvpStatus: 'Confirmed', guestType: 'VIP', groupName: 'Speakers' },
  { id: 'g3', firstName: 'Mike', lastName: 'Rodriguez', rsvpStatus: 'Pending', guestType: 'Individual', groupName: 'Attendees' },
  { id: 'g4', firstName: 'Emily', lastName: 'Chen', rsvpStatus: 'Confirmed', guestType: 'VIP', groupName: 'VIP' },
  { id: 'g5', firstName: 'David', lastName: 'Kim', rsvpStatus: 'Confirmed', guestType: 'Individual', groupName: 'Attendees' },
  { id: 'g6', firstName: 'Lisa', lastName: 'Johnson', rsvpStatus: 'Declined', guestType: 'Individual', groupName: 'Attendees' },
  { id: 'g7', firstName: 'James', lastName: 'Wilson', rsvpStatus: 'Confirmed', guestType: 'VIP', groupName: 'Speakers' },
  { id: 'g8', firstName: 'Anna', lastName: 'Martinez', rsvpStatus: 'Pending', guestType: 'Individual', groupName: 'Attendees' },
  { id: 'g9', firstName: 'Robert', lastName: 'Brown', rsvpStatus: 'Confirmed', guestType: 'PlusOne', groupName: 'VIP' },
  { id: 'g10', firstName: 'Jennifer', lastName: 'Taylor', rsvpStatus: 'Confirmed', guestType: 'VIP', groupName: 'Sponsors' },
];

const TableLayout = () => {
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [activeGuest, setActiveGuest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [toast, setToast] = useState(null);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 }
    })
  );

  // Computed: assigned guest IDs
  const assignedGuestIds = useMemo(() => {
    return tables.flatMap(t => t.guestIds);
  }, [tables]);

  // Computed: unassigned guests
  const unassignedGuests = useMemo(() => {
    return INITIAL_GUESTS.filter(g => !assignedGuestIds.includes(g.id));
  }, [assignedGuestIds]);

  // Computed: get guest by ID
  const getGuestById = useCallback((guestId) => {
    return INITIAL_GUESTS.find(g => g.id === guestId);
  }, []);

  // Check if table can accept more guests
  const canAddToTable = useCallback((tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table && table.guestIds.length < table.capacity;
  }, [tables]);

  // Show toast notification
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const guest = getGuestById(active.id);
    setActiveGuest(guest);
  }, [getGuestById]);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveGuest(null);

    if (!over) return;

    const guestId = active.id;
    const overId = over.id;

    // Dropped on unassigned panel
    if (overId === 'unassigned') {
      removeGuestFromTables(guestId);
      showToast('Guest moved to unassigned');
      return;
    }

    // Dropped on a table
    if (overId.startsWith('table-')) {
      const tableId = overId.replace('table-', '');

      // Check if already in this table
      const currentTable = tables.find(t => t.id === tableId);
      if (currentTable?.guestIds.includes(guestId)) return;

      // Check capacity
      if (!canAddToTable(tableId)) {
        showToast('Table is full! Choose another table.', 'error');
        return;
      }

      // Remove from any current table and add to new one
      setTables(prev => {
        const updated = prev.map(table => {
          if (table.guestIds.includes(guestId)) {
            return { ...table, guestIds: table.guestIds.filter(id => id !== guestId) };
          }
          if (table.id === tableId) {
            return { ...table, guestIds: [...table.guestIds, guestId] };
          }
          return table;
        });
        return updated;
      });
      showToast('Guest assigned successfully!', 'success');
    }
  }, [tables, canAddToTable, showToast]);

  // Remove guest from tables (move to unassigned)
  const removeGuestFromTables = useCallback((guestId) => {
    setTables(prev => prev.map(table => ({
      ...table,
      guestIds: table.guestIds.filter(id => id !== guestId)
    })));
  }, []);

  // Create new table
  const handleCreateTable = useCallback((tableData) => {
    setTables(prev => [...prev, tableData]);
    showToast('Table created!', 'success');
  }, [showToast]);

  // Update existing table
  const handleUpdateTable = useCallback((tableData) => {
    setTables(prev => prev.map(t => t.id === tableData.id ? tableData : t));
    setEditingTable(null);
    showToast('Table updated!', 'success');
  }, [showToast]);

  // Delete table
  const handleDeleteTable = useCallback((tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table?.guestIds.length > 0) {
      // Move guests to unassigned
      setTables(prev => prev.filter(t => t.id !== tableId));
      showToast('Table deleted. Guests moved to unassigned.', 'success');
    } else {
      setTables(prev => prev.filter(t => t.id !== tableId));
      showToast('Table deleted.', 'success');
    }
  }, [tables, showToast]);

  // Auto-fill unassigned guests to tables
  const handleAutoFill = useCallback(() => {
    const unassigned = unassignedGuests;
    if (unassigned.length === 0) {
      showToast('No unassigned guests!', 'info');
      return;
    }

    // Sort tables by remaining capacity (least full first)
    const sortedTables = [...tables]
      .map(t => ({ ...t, remaining: t.capacity - t.guestIds.length }))
      .filter(t => t.remaining > 0)
      .sort((a, b) => b.remaining - a.remaining);

    if (sortedTables.length === 0) {
      showToast('All tables are full!', 'error');
      return;
    }

    let tableIndex = 0;
    const newAssignments = {};

    unassigned.forEach(guest => {
      // Find next table with space
      while (tableIndex < sortedTables.length) {
        const table = sortedTables[tableIndex];
        if ((newAssignments[table.id] || table.guestIds.length) < table.capacity) {
          if (!newAssignments[table.id]) {
            newAssignments[table.id] = [...table.guestIds];
          }
          newAssignments[table.id].push(guest.id);
          break;
        }
        tableIndex++;
      }
    });

    // Apply assignments
    setTables(prev => prev.map(table => ({
      ...table,
      guestIds: newAssignments[table.id] || table.guestIds
    })));

    showToast(`Auto-filled ${unassigned.length} guests!`, 'success');
  }, [tables, unassignedGuests, showToast]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Floor Plan & Seating</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">
            Drag and drop guests to assign them to tables
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAutoFill}
            disabled={unassignedGuests.length === 0}
            className="px-4 py-2.5 bg-[#030712] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 ambient-shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-Assign
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-[#030712] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all ambient-shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Table
          </button>
        </div>
      </div>

      {/* Main Content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Tables Grid */}
          <div className="flex-1 min-h-0">
            {tables.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-[var(--color-card-bg)] rounded-2xl ambient-shadow border border-[var(--color-card-border)]">
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                  No tables yet
                </h3>
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
                    guests={INITIAL_GUESTS}
                    onRemoveGuest={removeGuestFromTables}
                    onDeleteTable={handleDeleteTable}
                    onEditTable={(t) => setEditingTable(t)}
                  />
                ))}

                {/* Add Table Card */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="min-h-[200px] rounded-2xl border-2 border-dashed border-[var(--color-card-border)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"
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
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <UnassignedPanel
              guests={unassignedGuests}
              onAutoFill={handleAutoFill}
            />
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeGuest ? (
            <GuestChip
              guest={activeGuest}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create/Edit Table Modal */}
      <CreateTableModal
        isOpen={isCreateModalOpen || !!editingTable}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTable(null);
        }}
        onCreate={editingTable ? handleUpdateTable : handleCreateTable}
        editTable={editingTable}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`
          fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50
          animate-in slide-in-from-bottom-4 duration-300
          ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'success' ? 'bg-[#19b359] text-white' : 'bg-gray-800 text-white'}
        `}>
          {toast.type === 'success' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default TableLayout;
