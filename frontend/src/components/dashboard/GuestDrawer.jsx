import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';

const GuestDrawer = ({ isOpen, onClose, guest, activeEvent, groups }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);
  const [status, setStatus] = useState('Pending');
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [diet, setDiet] = useState('');
  const [notes, setNotes] = useState('');

  const socialGroups = ['Familia', 'Padrinos', 'Amigos', 'Compañeros de trabajo', 'Otros'];
  const corporateGroups = ['Directivos', 'Gerentes', 'Empleados', 'Proveedores', 'Clientes', 'Otros'];
  const suggestedGroups = activeEvent?.isBusiness ? corporateGroups : socialGroups;

  useEffect(() => {
    if (guest) {
      setFirstName(guest.firstName || '');
      setLastName(guest.lastName || '');
      setPhoneNumber(guest.phoneNumber || '');
      setPlusOnes(guest.plusOnes || 0);
      setStatus(guest.rsvpStatus || 'Pending');
      setGroupId(guest.guestGroupId || '');
      setGroupName(guest.groupName || '');
      setDiet(guest.dietaryRestrictions ? guest.dietaryRestrictions.join(', ') : '');
      setNotes(guest.notes || '');
    } else {
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setPlusOnes(0);
      setStatus('Pending');
      setGroupId('');
      setGroupName('');
      setDiet('');
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
      eventId: activeEvent.id,
      firstName,
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      plusOnes,
      rsvpStatus: status,
      guestGroupId: groupId || null,
      groupName: groupId ? null : (groupName || null),
      dietaryRestrictions: diet ? diet.split(',').map(s => s.trim()).filter(s => s) : [],
      notes: notes || ''
    };

    try {
      if (guest) {
        await apiClient.put(`/Guests/${guest.id}`, guestData);
      } else {
        await apiClient.post('/Guests', guestData);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save guest data.');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = (val) => {
    const existingGroup = groups?.find(g => g.id === val);
    if (existingGroup) {
      setGroupId(val);
      setGroupName(existingGroup.name);
    } else {
      setGroupId('');
      setGroupName(val);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[var(--color-primary)]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-[var(--color-surface)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">
            {guest ? 'Editar Invitado' : 'Nuevo Invitado'}
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
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Nombre *</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="Nombre"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Apellido</label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Número de Teléfono</label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
              placeholder="+54 9 11 ..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Estado RSVP</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
              >
                <option value="Confirmed">Confirmado</option>
                <option value="Pending">Pendiente</option>
                <option value="Declined">Declinado</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Acompañantes</label>
              <input 
                type="number" 
                min="0"
                max="10"
                value={plusOnes}
                onChange={e => setPlusOnes(parseInt(e.target.value) || 0)}
                className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Grupo</label>
            <select 
              value={groupId || groupName}
              onChange={e => handleGroupSelect(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm appearance-none"
            >
              <option value="">Sin asignar</option>
              <optgroup label="Grupos Existentes">
                {groups?.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </optgroup>
              {suggestedGroups.length > 0 && (
                <optgroup label="Categorías Sugeridas">
                  {suggestedGroups.map(sg => (
                    <option key={sg} value={sg}>{sg}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Restricciones Alimenticias</label>
            <input 
              type="text" 
              value={diet}
              onChange={e => setDiet(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm"
              placeholder="Ej. Vegano, Sin Gluten"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Notas Privadas</label>
            <textarea 
              rows="4"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="bg-[var(--color-surface-container-lowest)] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-sm shadow-sm resize-none"
              placeholder="Notas internas sobre este invitado..."
            ></textarea>
          </div>

          <div className="pt-8 pb-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity ambient-shadow disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (guest ? 'Guardar Cambios' : 'Agregar Invitado')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GuestDrawer;