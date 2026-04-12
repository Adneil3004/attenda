import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../lib/api';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    eventType: '',
    celebrants: [''],
    organizerName: '',
    religiousAddress: '',
    venueAddress: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await apiClient.get(`/events/${id}`);
        if (data) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            startDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 16) : '',
            endDate: '', // Assuming single day for now
            eventType: data.eventType || '',
            celebrants: data.celebrants?.length > 0 ? data.celebrants : [''],
            organizerName: data.organizerName || '',
            religiousAddress: data.religiousAddress || '',
            venueAddress: data.locationName || '',
            imageUrl: data.imageUrl || ''
          });
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('No se pudo cargar la información del evento.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCelebrantChange = (index, value) => {
    const newCelebrants = [...formData.celebrants];
    newCelebrants[index] = value;
    setFormData({ ...formData, celebrants: newCelebrants });
  };

  const addCelebrant = () => {
    setFormData({ ...formData, celebrants: [...formData.celebrants, ''] });
  };

  const removeCelebrant = (index) => {
    const newCelebrants = formData.celebrants.filter((_, i) => i !== index);
    setFormData({ ...formData, celebrants: newCelebrants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put(`/events/${id}`, {
        id: id,
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        eventType: formData.eventType,
        celebrants: formData.celebrants.filter(c => c.trim() !== ''),
        organizerName: formData.organizerName,
        religiousAddress: formData.religiousAddress,
        venueAddress: formData.venueAddress,
        imageUrl: formData.imageUrl
      });
      navigate('/dashboard/my-events');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando evento...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-3xl font-headline font-bold text-[var(--color-primary)]">Editar Evento</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 ambient-shadow space-y-8 border border-[var(--color-outline-variant)]/10">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 col-span-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Nombre del Evento</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Tipo de Evento</label>
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="Ej. Boda, XV Años"
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all"
              required
            />
          </div>
        </div>

        {/* Image URL Section */}
        <div className="space-y-4 p-6 bg-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-headline font-bold text-[var(--color-primary)]">Imagen del Evento</h4>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-1.5">
              <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase mb-2">URL de la imagen (Unsplash, etc.)</p>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all text-xs"
              />
            </div>
            {formData.imageUrl && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <img src={formData.imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Dirección del Evento / Salón</label>
            <input
              type="text"
              name="venueAddress"
              value={formData.venueAddress}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Dirección Religiosa / Ceremonia</label>
            <input
              type="text"
              name="religiousAddress"
              value={formData.religiousAddress}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none font-medium transition-all"
            />
          </div>
        </div>

        {/* Celebrants */}
        <div className="space-y-4">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">Festejados</label>
          {formData.celebrants.map((celebrant, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={celebrant}
                onChange={(e) => handleCelebrantChange(idx, e.target.value)}
                className="flex-1 px-5 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl outline-none"
              />
              {idx > 0 && (
                <button type="button" onClick={() => removeCelebrant(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCelebrant} className="text-[var(--color-secondary)] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            + Añadir festejado
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
