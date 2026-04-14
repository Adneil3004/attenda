import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, ensureHttps } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import ConfirmModal from '../../components/ConfirmModal';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const [eventTypes, setEventTypes] = useState([]);
  const [isOtherType, setIsOtherType] = useState(false);
  const [customType, setCustomType] = useState('');

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
    imageUrl: '',
    isBusiness: false,
    status: 'Active'
  });


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [eventData, types] = await Promise.all([
          apiClient.get(`/events/${id}`),
          apiClient.get('/events/types')
        ]);

        if (types) {
          setEventTypes(types);
        }

        if (eventData) {
          localStorage.setItem('activeEventId', eventData.id);
          const eventType = eventData.eventType || '';
          
          // Define which types are considered "Social" vs "Empresa"
          const socialTypes = ['Boda', 'XV Años', 'Bautizo', 'Cumpleaños', 'Baby Shower'];
          const businessTypes = ['Graduación', 'Fin de año', 'Aniversario', 'Congreso', 'Lanzamiento de Producto', 'Inauguración', 'Workshop / Capacitación'];
          
          const isOther = eventType !== '' && !socialTypes.includes(eventType) && !businessTypes.includes(eventType);
          
          setFormData({
            name: eventData.name || '',
            description: eventData.description || '',
            startDate: eventData.eventDate ? new Date(eventData.eventDate).toISOString().slice(0, 16) : '',
            endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().slice(0, 16) : '', 
            eventType: isOther ? 'Otro' : eventType,
            celebrants: eventData.celebrants?.length > 0 ? eventData.celebrants : [''],
            organizerName: eventData.organizerName || '',
            religiousAddress: eventData.religiousAddress || '',
            venueAddress: eventData.locationName || '',
            imageUrl: eventData.imageUrl || '',
            isBusiness: eventData.isBusiness,
            status: eventData.status || 'Active'
          });

          if (isOther) {
            setIsOtherType(true);
            setCustomType(eventData.eventType);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`An error occurred while loading the event data: ${err.message || 'Unknown error'}. Please try reloading the page.`);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventType') {
      setIsOtherType(value === 'Otro');
      if (value !== 'Other') setCustomType('');
    }
    setFormData({ ...formData, [name]: value });
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
      const payloadType = isOtherType ? customType : formData.eventType;
      
      // Ensure dates are sent with Z for UTC consistency
      const formattedStartDate = formData.startDate ? (formData.startDate.includes('Z') ? formData.startDate : `${formData.startDate}:00Z`) : null;
      const formattedEndDate = formData.endDate ? (formData.endDate.includes('Z') ? formData.endDate : `${formData.endDate}:00Z`) : null;

      await apiClient.put(`/events/${id}`, {
        id: id,
        name: formData.name,
        description: formData.description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        eventType: payloadType,
        celebrants: formData.celebrants.filter(c => c.trim() !== ''),
        organizerName: formData.organizerName,
        religiousAddress: formData.religiousAddress,
        venueAddress: formData.venueAddress,
        imageUrl: formData.imageUrl,
        isBusiness: formData.isBusiness
      });
      navigate(`/dashboard?eventId=${id}`);
    } catch (err) {
      console.error('Error updating event:', err);
      setError(`Failed to update the event: ${err.message || 'Operation failed'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      data: { name: formData.name }
    });
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await apiClient.delete(`/events/${id}`);
      navigate('/dashboard/my-events');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(`Could not delete the event: ${err.message || 'Access denied'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = (disabledState) => {
    setModalConfig({
      isOpen: true,
      type: 'toggle',
      data: { disable: disabledState }
    });
  };

  const confirmToggleStatus = async () => {
    const { disable } = modalConfig.data;
    setSaving(true);
    try {
      await apiClient.post(`/events/${id}/status`, { disable: disable });
      setFormData(prev => ({ ...prev, status: disable ? 'Cancelled' : 'Active' }));
      setModalConfig({ ...modalConfig, isOpen: false });
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(`Failed to update event status: ${err.message || 'Request failed'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Image validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format not allowed. Please use JPG, PNG or WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const data = await apiClient.uploadImage(`/events/${id}/image`, file);
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(`Image upload failed: ${err.message || 'Connection error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] animate-pulse text-center">Loading event data...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-800 text-center">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h3 className="text-red-900 dark:text-red-200 font-bold mb-2">Error Loading Event</h3>
      <p className="text-red-600 dark:text-red-400 text-sm mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Reload Page</button>
    </div>
  );

  const isCancelled = formData.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="group p-3 bg-white dark:bg-gray-700 hover:bg-[var(--color-primary)] dark:hover:bg-gray-600 rounded-2xl border border-slate-100 dark:border-gray-600 shadow-sm transition-all duration-300"
          >
            <svg className="w-5 h-5 text-slate-400 dark:text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-4xl font-headline font-black text-[var(--color-primary)] dark:text-white tracking-tight">Edit Event</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isCancelled ? 'bg-amber-400' : 'bg-green-400'}`}></span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">{formData.status}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => handleToggleStatus(!isCancelled)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isCancelled 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50 hover:scale-105' 
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:scale-105'
            }`}
          >
            {isCancelled ? 'Activate Event' : 'Suspend Event'}
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/50 hover:scale-105 transition-all shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1f2937] rounded-[2.5rem] p-10 ambient-shadow space-y-10 border border-[var(--color-outline-variant)]/10 dark:border-gray-700">
        
        {/* Basic Info Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] dark:text-white opacity-40">General Information</h4>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Event Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-medium text-slate-600 dark:text-gray-300 transition-all duration-300"
                placeholder="Enter protocol details..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Organizer</label>
              <input
                type="text"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                placeholder="Organizer name"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Categoría del Evento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const socialTypes = ['Boda', 'XV Años', 'Bautizo', 'Cumpleaños', 'Baby Shower'];
                    const isCurrentSocial = socialTypes.includes(formData.eventType);
                    setFormData({ 
                      ...formData, 
                      isBusiness: false, 
                      eventType: isCurrentSocial ? formData.eventType : 'Boda' 
                    });
                    if (!isCurrentSocial) setIsOtherType(false);
                  }}
                  className={`py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    !formData.isBusiness
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] dark:text-white'
                      : 'border-slate-100 dark:border-gray-700 text-slate-400 dark:text-gray-500 hover:border-[var(--color-primary)]/30'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Social
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const businessTypes = ['Graduación', 'Fin de año', 'Aniversario', 'Congreso', 'Lanzamiento de Producto', 'Inauguración', 'Workshop / Capacitación'];
                    const isCurrentBusiness = businessTypes.includes(formData.eventType);
                    setFormData({ 
                      ...formData, 
                      isBusiness: true, 
                      eventType: isCurrentBusiness ? formData.eventType : 'Graduación' 
                    });
                    if (!isCurrentBusiness) setIsOtherType(false);
                  }}
                  className={`py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    formData.isBusiness
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] dark:text-white'
                      : 'border-slate-100 dark:border-gray-700 text-slate-400 dark:text-gray-500 hover:border-[var(--color-primary)]/30'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Empresa
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Event Type</label>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Type...</option>
                    {!formData.isBusiness ? (
                      <>
                        <option value="Boda">Boda</option>
                        <option value="XV Años">XV Años</option>
                        <option value="Bautizo">Bautizo</option>
                        <option value="Cumpleaños">Cumpleaños</option>
                        <option value="Baby Shower">Baby Shower</option>
                      </>
                    ) : (
                      <>
                        <option value="Graduación">Graduación</option>
                        <option value="Fin de año">Fin de año</option>
                        <option value="Aniversario">Aniversario</option>
                        <option value="Congreso">Congreso</option>
                        <option value="Lanzamiento de Producto">Lanzamiento de Producto</option>
                        <option value="Inauguración">Inauguración</option>
                        <option value="Workshop / Capacitación">Workshop / Capacitación</option>
                      </>
                    )}
                    <option value="Other">Other (Specify)</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                
                {isOtherType && (
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Specify event type..."
                    className="w-full px-6 py-4 bg-[var(--color-primary)]/[0.02] border border-[var(--color-primary)]/20 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none font-bold text-[var(--color-primary)] dark:text-white animate-in slide-in-from-top-2 duration-300"
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300"
                required
              />
            </div>
          </div>
        </div>

        {/* Visual Identity Section */}
        <div className="space-y-6 p-8 bg-slate-50/50 dark:bg-gray-800/50 rounded-[2rem] border border-slate-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] dark:text-white opacity-40">Visual Identity</h4>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] text-slate-400 dark:text-gray-400 font-black uppercase tracking-widest ml-1">Update Media</p>
                <div className="relative group/upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 dark:border-gray-600 rounded-[1.5rem] bg-white dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-500 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-slate-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[var(--color-primary)]/10 transition-all duration-500">
                      <svg className="w-6 h-6 text-slate-300 dark:text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 group-hover:text-[var(--color-primary)] transition-colors">Upload New Asset</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-[9px] text-slate-400 dark:text-gray-400 font-black uppercase tracking-widest ml-1">External Link</p>
                <div className="relative">
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-5 py-3.5 bg-white dark:bg-gray-700 border border-slate-100 dark:border-gray-600 rounded-xl outline-none text-[10px] text-[var(--color-primary)] dark:text-white font-bold shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-200 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-2">
              {formData.imageUrl ? (
                <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden border-[10px] border-white dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">
                  <img src={ensureHttps(formData.imageUrl)} alt="Event Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-6 right-6">
                    <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Preview</p>
                    <p className="text-white font-bold truncate">{formData.name}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/10] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-gray-700 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-slate-200 dark:text-gray-700">
                  <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Image Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logistics Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] dark:text-white opacity-40">Location and Logistics</h4>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Convention Center / Venue</label>
              <div className="relative">
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
                  <svg className="w-5 h-5 text-slate-400 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 ml-1">Religious Venue (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  name="religiousAddress"
                  value={formData.religiousAddress}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all duration-300"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
                  <svg className="w-5 h-5 text-slate-400 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebrants Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] dark:text-white opacity-40">Celebrants</h4>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.celebrants.map((celebrant, idx) => (
              <div key={idx} className="flex gap-3 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <input
                  type="text"
                  value={celebrant}
                  onChange={(e) => handleCelebrantChange(idx, e.target.value)}
                  placeholder="Full name"
                  className="flex-1 px-6 py-4 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:border-[var(--color-primary)]/30 outline-none font-bold text-slate-700 dark:text-white transition-all"
                />
                {idx > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeCelebrant(idx)} 
                    className="p-4 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            onClick={addCelebrant} 
            className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl hover:border-[var(--color-primary)]/30 dark:hover:border-white/30 hover:shadow-lg hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
          >
            <div className="w-6 h-6 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
              <svg className="w-4 h-4 text-[var(--color-primary)] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 group-hover:text-[var(--color-primary)] dark:group-hover:text-white transition-colors">Add Celebrant</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-6 bg-gradient-to-br from-[var(--color-primary)] to-[#2d3250] dark:from-violet-600 dark:to-indigo-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(45,50,80,0.3)] hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(45,50,80,0.4)] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>Save Changes</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </form>

      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'delete'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmDelete}
        requireMatch={formData.name}
        title="DELETE EVENT?"
        message={`This action will permanently delete "${formData.name.toUpperCase()}" and all associated guest data. This cannot be undone. Please type the event name to confirm.`}
        confirmText="PERMANENT DELETE"
        variant="danger"
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'toggle'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmToggleStatus}
        title={modalConfig.data?.disable ? 'SUSPEND EVENT' : 'ACTIVATE EVENT'}
        message={modalConfig.data?.disable 
          ? 'Guest access will be revoked for this event.' 
          : 'Full visibility will be restored and the event will be active.'}
        confirmText={modalConfig.data?.disable ? 'SUSPEND' : 'ACTIVATE'}
        variant={modalConfig.data?.disable ? 'warning' : 'primary'}
      />
    </div>
  );
};

export default EditEvent;
