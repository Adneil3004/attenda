import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { scheduleApi } from '../../lib/schedule';
import { DateService } from '../../lib/dateUtils';
import { exportToExcel } from '../../lib/exportUtils';

// --- Constants & Mapping ---

const CATEGORY_MAP = {
  0: 'Ceremony',
  1: 'Reception',
  2: 'Food',
  3: 'Music',
  4: 'Speech',
  5: 'Entertainment',
  6: 'Photography',
  7: 'Other',
  8: 'Custom',
};

const CATEGORIES = {
  'Ceremony': { label: 'Ceremony', icon: '✨', color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border-yellow-500/30', id: 0 },
  'Reception': { label: 'Reception', icon: '🥂', color: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30', id: 1 },
  'Food': { label: 'Food', icon: '🍽️', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30', id: 2 },
  'Music': { label: 'Music', icon: '🎵', color: 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30', id: 3 },
  'Speech': { label: 'Speech', icon: '🎤', color: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30', id: 4 },
  'Entertainment': { label: 'Show', icon: '🎭', color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30', id: 5 },
  'Photography': { label: 'Photos', icon: '📸', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30', id: 6 },
  'Other': { label: 'Other', icon: '📎', color: 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30', id: 7 },
  'Custom': { label: 'Custom', icon: '✍️', color: 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30', id: 8 },
};

// --- Icons ---
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const DragHandleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

// --- Components ---

const SortableActivity = ({ activity, onEdit, onDelete, now }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getCategoryInfo = (category) => {
    // If it's a number, get the name from map first
    const categoryName = typeof category === 'number' ? CATEGORY_MAP[category] : category;
    return CATEGORIES[categoryName] || CATEGORIES['Other'];
  };

  const categoryInfo = getCategoryInfo(activity.category);
  const startTime = DateService.toLocal(activity.startTime);
  const endTime = activity.endTime ? DateService.toLocal(activity.endTime) : null;
  const dayNumber = startTime ? startTime.getDate() : '';
  const dayName = startTime ? startTime.toLocaleDateString([], { weekday: 'short' }) : '';

  const formatTime = (date) => {
    return DateService.formatTime(date);
  };

  const isCustom = activity.category === 'Custom' || activity.category === 8;
  const isActive = startTime <= now && (endTime ? endTime >= now : true);
  const isPast = (endTime || startTime) < now && !isActive;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layoutId={activity.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isActive ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`activity-card group relative mb-6 p-0 rounded-[2.5rem] border transition-all ${
        isActive 
          ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 shadow-[0_20px_50px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20' 
          : isPast
            ? 'border-[var(--color-outline-variant)]/5 bg-[var(--color-surface-container-low)]/40 grayscale-[0.6] opacity-60'
            : 'border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-high)] hover:border-[var(--color-outline-variant)]/20 shadow-lg shadow-black/5'
      } backdrop-blur-xl active:scale-[0.98] ${isDragging ? 'shadow-2xl shadow-[var(--color-primary)]/20' : ''}`}
    >
      {isActive && (
        <div className="absolute -top-3 right-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse z-30">
          En progreso
        </div>
      )}
      
      <div className="flex min-h-[120px] rounded-[2.5rem] overflow-hidden">
        {/* Day Number Column */}
        <div className={`w-24 sm:w-28 flex flex-col items-center justify-center border-r border-dashed border-[var(--color-outline-variant)]/20 shrink-0 ${isActive ? 'bg-indigo-500 text-white' : isPast ? 'bg-gray-500/10 text-gray-500' : 'bg-[var(--color-surface-container-high)]/30 text-[var(--color-primary)]'}`}>
          <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">{dayNumber}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60`}>{dayName}</span>
        </div>

        <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div 
              {...attributes} 
              {...listeners} 
              className="mt-1 cursor-grab active:cursor-grabbing p-1.5 text-[var(--color-text-muted)] opacity-30 hover:opacity-100 transition-opacity bg-[var(--color-surface-container-high)] rounded-xl"
            >
              <DragHandleIcon />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                   <span className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${categoryInfo.color}`}>
                    <span className="text-sm">{categoryInfo.icon}</span>
                    {isCustom ? activity.customCategory : categoryInfo.label}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-primary)] tracking-tight truncate">{activity.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/5 px-3 py-1.5 rounded-xl border border-[var(--color-primary)]/10">
                  <ClockIcon />
                  {formatTime(startTime)} 
                  {endTime && <span className="opacity-40 mx-1">→</span>}
                  {endTime && formatTime(endTime)}
                </div>
              </div>
              
              <p className="text-[var(--color-text-secondary)] mt-3 leading-relaxed text-sm line-clamp-2">
                {activity.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <button 
                onClick={() => onEdit(activity)}
                className="p-2.5 rounded-xl bg-[var(--color-surface-container-high)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-outline-variant)]/10 transition-all shadow-lg"
              >
                <EditIcon />
              </button>
              <button 
                onClick={() => onDelete(activity.id)}
                className="p-2.5 rounded-xl bg-red-500/5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 transition-all shadow-lg"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityModal = ({ isOpen, onClose, activity, onSave, eventId, lastEndTime }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 0, // Added duration in minutes
    category: 0,
    customCategory: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      // Find the ID even if the category is a string
      const categoryId = typeof activity.category === 'string' 
        ? (CATEGORIES[activity.category]?.id ?? 7)
        : (activity.category ?? 0);

      setFormData({
        title: activity.title || '',
        description: activity.description || '',
        startTime: DateService.toInputFormat(activity.startTime),
        endTime: DateService.toInputFormat(activity.endTime),
        category: categoryId,
        customCategory: activity.customCategory || '',
      });
    } else {
      let initialDate;
      if (lastEndTime) {
        initialDate = lastEndTime;
      } else if (eventId && localStorage.getItem(`eventDate_${eventId}`)) {
         const eventDate = localStorage.getItem(`eventDate_${eventId}`);
         initialDate = DateService.toInputFormat(eventDate);
      } else {
         initialDate = DateService.getNowInputFormat();
      }

      setFormData({
        title: '',
        description: '',
        startTime: initialDate,
        endTime: initialDate,
        duration: 0,
        category: 0,
        customCategory: '',
      });
    }
    setError('');
  }, [activity, isOpen, eventId]);

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value;
    setFormData(prev => {
      const updates = { ...prev, startTime: newStart };
      
      // If we have a duration, update endTime automatically
      if (prev.duration > 0) {
        const date = new Date(newStart);
        date.setMinutes(date.getMinutes() + prev.duration);
        updates.endTime = DateService.toInputFormat(date);
      } else if (prev.endTime && prev.endTime < newStart) {
        // Fallback: keep end time at least equal to start time
        updates.endTime = newStart;
      }
      return updates;
    });
    setError('');
  };

  const handleEndTimeChange = (e) => {
    const newEnd = e.target.value;
    if (newEnd && newEnd < formData.startTime) {
      setError('End time cannot be earlier than start time');
      return;
    }
    setFormData({ ...formData, endTime: newEnd, duration: 0 }); // Reset duration if manual end time set
    setError('');
  };

  const handleDurationChange = (e) => {
    const minutes = parseInt(e.target.value);
    setFormData(prev => {
      const updates = { ...prev, duration: minutes };
      if (minutes > 0) {
        const date = new Date(prev.startTime);
        date.setMinutes(date.getMinutes() + minutes);
        updates.endTime = DateService.toInputFormat(date);
      }
      return updates;
    });
    setError('');
  };

  const DURATIONS = [
    { label: 'No set duration', value: 0 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1:30 hours', value: 90 },
    { label: '2 hours', value: 120 },
    { label: '2:30 hours', value: 150 },
    { label: '3 hours', value: 180 },
    { label: '3:30 hours', value: 210 },
    { label: '4 hours', value: 240 },
    { label: '4:30 hours', value: 270 },
    { label: '5 hours', value: 300 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
        >
          <div className="p-8 border-b border-[var(--color-outline-variant)]/5 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent">
            <h2 className="text-3xl font-black text-[var(--color-primary)] tracking-tight">
              {activity ? 'Edit Activity' : 'New Activity'}
            </h2>
            <p className="text-[var(--color-text-muted)] mt-1 font-medium italic">Define the moment details</p>
          </div>
          
          <form className="p-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            if (formData.endTime && formData.endTime < formData.startTime) {
              setError('End time cannot be earlier than start time');
              return;
            }
            onSave(formData);
          }}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Activity Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all placeholder:text-[var(--color-text-muted)]/30"
                  placeholder="e.g. Welcome Ceremony"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Starts</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Duration</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 appearance-none transition-all cursor-pointer"
                      value={formData.duration}
                      onChange={handleDurationChange}
                    >
                      {DURATIONS.map(d => (
                        <option key={d.value} value={d.value} className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)]">
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] opacity-50">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Ends (optional)</label>
                  <input 
                    type="datetime-local" 
                    className={`w-full bg-[var(--color-surface-container-low)] border rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500/50 ring-red-500/20' : 'border-[var(--color-outline-variant)]/10 focus:ring-[var(--color-primary)]/50'}`}
                    value={formData.endTime}
                    min={formData.startTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Category</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 appearance-none transition-all cursor-pointer"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: parseInt(e.target.value)})}
                    >
                      {Object.entries(CATEGORIES).map(([name, info]) => (
                        <option key={name} value={info.id} className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)]">
                          {info.icon} {info.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] opacity-50">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                {formData.category === 8 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Category Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="e.g. Special Toast"
                      value={formData.customCategory}
                      onChange={e => setFormData({...formData, customCategory: e.target.value})}
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-2 ml-1">Description</label>
                <textarea 
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 rounded-2xl px-5 py-4 text-[var(--color-primary)] font-medium h-32 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-none placeholder:text-[var(--color-text-muted)]/30"
                  placeholder="Describe what will happen at this moment..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl bg-[var(--color-surface-container-high)] text-[var(--color-text-muted)] font-bold hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-all border border-[var(--color-outline-variant)]/10"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
              >
                {activity ? 'Update Activity' : 'Confirm Activity'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Main Component ---

const Schedule = () => {
  const { eventId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [now, setNow] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { apiClient } = await import('../../lib/api');
      const eventData = await apiClient.get(`/events/${eventId}`);
      if (eventData?.eventDate) {
        localStorage.setItem(`eventDate_${eventId}`, eventData.eventDate);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await scheduleApi.getAll(eventId);
      // Sort by date and time by default
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateA - dateB;
      });
      setActivities(sorted);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = activities.findIndex(a => a.id === active.id);
      const newIndex = activities.findIndex(a => a.id === over.id);
      
      const newActivities = arrayMove(activities, oldIndex, newIndex);
      setActivities(newActivities);

      try {
        await scheduleApi.reorder(eventId, newActivities.map(a => a.id));
      } catch (error) {
        console.error('Error reordering activities:', error);
        fetchActivities();
      }
    }
  };

  const handleSaveActivity = async (formData) => {
    try {
      // Ensure dates are sent in UTC format to the backend
      const payload = {
        ...formData,
        startTime: DateService.toUTC(formData.startTime),
        endTime: formData.endTime ? DateService.toUTC(formData.endTime) : null
      };

      if (editingActivity) {
        await scheduleApi.update(editingActivity.id, { ...payload, eventId });
      } else {
        await scheduleApi.create({ 
          ...payload, 
          eventId, 
          order: activities.length 
        });
      }
      setModalOpen(false);
      setEditingActivity(null);
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      try {
        await scheduleApi.delete(id, eventId);
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 max-w-5xl mx-auto overflow-hidden">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-primary)] tracking-tighter">Cronograma</h1>
          </div>
          <p className="text-[var(--color-text-muted)] font-medium text-lg">Gestiona el flujo de tu evento</p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 no-print">
          {/* Date Filter */}
          <div className="relative group">
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-3 pl-10 rounded-2xl bg-white border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all appearance-none cursor-pointer"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              const dataToExport = filterDate 
                ? activities.filter(a => new Date(a.startTime).toISOString().split('T')[0] === filterDate)
                : activities;
              exportToExcel(dataToExport, `cronograma_${filterDate || 'completo'}.csv`);
            }}
            className="p-3 px-5 rounded-2xl bg-white border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all flex items-center gap-2 group shadow-sm"
          >
            <svg className="w-5 h-5 text-green-600 opacity-80 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold text-sm">Exportar Excel</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setEditingActivity(null);
              setModalOpen(true);
            }}
            className="p-3 px-6 rounded-2xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 group"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight">Nueva Actividad</span>
          </motion.button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[var(--color-primary)]/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          </div>
          <p className="text-[var(--color-text-muted)] mt-6 font-black uppercase tracking-[0.3em] text-xs">Syncing</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-[var(--color-outline-variant)]/30">
          <div className="text-6xl mb-6">🗓️</div>
          <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">No hay actividades</h3>
          <p className="text-[var(--color-text-muted)] max-w-xs">
            {filterDate ? 'No hay actividades para esta fecha.' : 'Comienza agregando la primera actividad de tu cronograma.'}
          </p>
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')}
              className="mt-4 text-[var(--color-secondary)] font-bold hover:underline"
            >
              Ver todas las actividades
            </button>
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activities.map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activities
                  .filter(activity => {
                    if (!filterDate) return true;
                    // Format both to YYYY-MM-DD for comparison
                    const activityDateStr = new Date(activity.startTime).toISOString().split('T')[0];
                    return activityDateStr === filterDate;
                  })
                  .map((activity, index, filteredArray) => {
                    const activityDate = new Date(activity.startTime);
                    const currentMonth = activityDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
                    
                    let showMonthHeader = false;
                    if (index === 0) {
                      showMonthHeader = true;
                    } else {
                      const prevActivity = filteredArray[index - 1];
                      const prevMonth = new Date(prevActivity.startTime).toLocaleString('es-ES', { month: 'long' }).toUpperCase();
                      if (currentMonth !== prevMonth) {
                        showMonthHeader = true;
                      }
                    }

                    return (
                      <React.Fragment key={activity.id}>
                        {showMonthHeader && (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="pt-10 first:pt-4 pb-4"
                          >
                            <h2 className="text-5xl font-black uppercase tracking-[0.2em] text-[var(--color-primary)]/10 pointer-events-none select-none">
                              {currentMonth}
                            </h2>
                          </motion.div>
                        )}
                        <SortableActivity
                          activity={activity}
                          now={now}
                          onEdit={(a) => {
                            setEditingActivity(a);
                            setModalOpen(true);
                          }}
                          onDelete={handleDeleteActivity}
                        />
                      </React.Fragment>
                    );
                  })}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activity={editingActivity}
        onSave={handleSaveActivity}
        eventId={eventId}
        lastEndTime={activities.length > 0 ? DateService.toInputFormat(activities[activities.length - 1].endTime || activities[activities.length - 1].startTime) : null}
      />

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Schedule;
