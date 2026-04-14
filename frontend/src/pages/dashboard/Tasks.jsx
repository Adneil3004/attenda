import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskDrawer from '../../components/dashboard/TaskDrawer';
import { tasksApi } from '../../lib/tasks';

const COLUMNS = ['To Do', 'In Progress', 'Done', 'Cancelled'];

// ─── Droppable Column Component ───
const DroppableColumn = ({ column, children, columnTasks }) => {
  const { setNodeRef } = useDroppable({
    id: column,
  });

  const wipLimitValue = 3;
  const isWIP = column === 'In Progress';
  const overLimit = isWIP && columnTasks.length > wipLimitValue;

  return (
    <div 
      ref={setNodeRef}
      className="w-full lg:w-80 2xl:w-96 min-[1920px]:w-[26rem] flex-shrink-0 flex flex-col bg-[var(--color-surface-container-low)] dark:bg-[var(--color-surface-container-high)] rounded-2xl p-4 hide-scrollbar min-h-[150px] lg:h-full lg:overflow-hidden mb-6 lg:mb-0"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-sm text-[var(--color-primary)] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] opacity-60"></span>
          {column}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-container-high)] dark:bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full">
            {columnTasks.length}
          </span>
          {isWIP && (
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${overLimit ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]' : 'bg-[var(--color-card-bg)] text-[var(--color-primary)] shadow-sm border border-[var(--color-card-border)]'}`}>
              WIP Limit {wipLimitValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 lg:overflow-y-auto overflow-x-hidden space-y-4 pb-4 lg:pb-10 hide-scrollbar pt-2">
        {children}
        
        {columnTasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-[var(--color-card-border)] rounded-xl flex items-center justify-center text-xs font-semibold text-[var(--color-text-muted)]">
            Drag tasks here
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sortable Item Component ───
const SortableTaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: task });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group cursor-grab active:cursor-grabbing`}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick(task);
      }}
    >
      <TaskCard task={task} />
    </div>
  );
};

// ─── Base Card Component ───
const TaskCard = ({ task, isLayoutOverlay }) => {
  const priorityConfig = {
    'Urgent': { color: 'var(--color-error)', label: 'Urgent', bg: 'bg-red-500/10', text: 'text-red-500', pulse: true },
    'High': { color: '#f97316', label: 'High', bg: 'bg-orange-500/10', text: 'text-orange-500', pulse: false },
    'Medium': { color: 'var(--color-primary)', label: 'Medium', bg: 'bg-blue-500/10', text: 'text-blue-500', pulse: false },
    'Low': { color: '#94a3b8', label: 'Low', bg: 'bg-slate-500/10', text: 'text-slate-400', pulse: false }
  };

  const config = priorityConfig[task.priority] || priorityConfig['Medium'];

  return (
    <div className={`bg-[var(--color-card-bg)] rounded-xl p-5 border border-[var(--color-card-border)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${isLayoutOverlay ? 'shadow-2xl rotate-3 scale-105 cursor-grabbing z-50' : 'shadow-sm'}`}>
      {/* Priority Indicator Line */}
      <div 
        className={`absolute top-0 left-0 w-1.5 h-full ${config.pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      ></div>
      
      {config.pulse && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 to-transparent"></div>
      )}

      <div className="flex justify-between items-start mb-4 pl-1">
        <div className="flex flex-col gap-1">
          <span className="bg-[var(--color-surface-container-high)] text-[var(--color-text-secondary)] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded w-fit">
            {task.tag || 'General'}
          </span>
          <span className={`${config.bg} ${config.text} text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-current opacity-80 w-fit`}>
            {config.label}
          </span>
        </div>
        <div className="flex -space-x-2">
          <img src={task.avatar || 'https://ui-avatars.com/api/?name=User&background=0D1117&color=fff'} alt="assignee" className="w-6 h-6 rounded-full border-2 border-[var(--color-card-bg)] shadow-sm" />
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-[var(--color-primary)] font-display leading-snug mb-4 pl-1">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-card-border)] pl-1">
        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold">{task.dueDate || 'No date'}</span>
        </div>
        {task.status === 'Done' && (
          <span className="text-[var(--color-success)] animate-in zoom-in duration-300 drop-shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};

// ─── New Task Modal ───
const NewTaskModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setErrors({});
    }
  }, [isOpen]);

  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (dueDate < today) {
      newErrors.dueDate = 'Date must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), description, priority, dueDate: dueDate || null });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors({ ...errors, title: null });
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
    if (errors.dueDate) setErrors({ ...errors, dueDate: null });
  };

  return (
    <>
      <div className="fixed inset-0 bg-[var(--color-primary)]/10 dark:bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
          <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-primary)] dark:text-white">New Task</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create a new task</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className={`w-full px-5 py-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 text-[var(--color-primary)] dark:text-white font-semibold placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all ${errors.title ? 'border-red-400 ring-4 ring-red-50 dark:ring-red-900/30' : 'border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10'}`}
                placeholder="Task title"
                required
              />
              {errors.title && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 border-transparent text-[var(--color-primary)] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all resize-none"
                rows={3}
                placeholder="Task description (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 border-transparent text-[var(--color-primary)] dark:text-white font-bold text-xs outline-none transition-all"
                >
                  <option value="Low" className="dark:bg-gray-800">Low</option>
                  <option value="Medium" className="dark:bg-gray-800">Medium</option>
                  <option value="High" className="dark:bg-gray-800">High</option>
                  <option value="Urgent" className="dark:bg-gray-800">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={handleDateChange}
                  min={today}
                  className={`w-full px-5 py-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 text-[var(--color-primary)] dark:text-white font-semibold outline-none transition-all ${errors.dueDate ? 'border-red-400 ring-4 ring-red-50 dark:ring-red-900/30' : 'border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10'}`}
                />
                {errors.dueDate && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">{errors.dueDate}</p>}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 py-4 bg-[#030712] text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-gray-200 dark:shadow-gray-900 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─── Main Tasks Dashboard ───
const Tasks = () => {
  const { eventId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load tasks from API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!eventId) {
        console.warn('[TasksBoard] No event ID found in URL');
        setTasks([]);
        return;
      }

      const loadedTasks = await tasksApi.getAll(eventId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskItem = tasks.find(t => t.id === activeId);
    
    let newStatus = COLUMNS.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;

    if (activeTaskItem && newStatus && activeTaskItem.status !== newStatus) {
      // Optimistic update
      setTasks(tasks.map(t => {
        if (t.id === activeId) return { ...t, status: newStatus };
        return t;
      }));

      // Call API
      try {
        await tasksApi.updateStatus(activeId, newStatus, eventId);
      } catch (error) {
        console.error('Failed to update task status:', error);
        // Revert on error
        loadTasks();
      }
    }
  };

  const handleCreateTask = async (taskData) => {
    setCreating(true);
    try {
      if (!eventId) throw new Error('No active event selected.');
      
      const newTask = await tasksApi.create({ ...taskData, eventId });
      setTasks([...tasks, newTask]);
      setShowNewTaskModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTaskForDrawer(null);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTaskForDrawer(null);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      <header className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 flex-shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-outline-variant)]/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] font-headline tracking-tight">Event Task Management</h1>
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] font-black px-2 py-0.5 rounded-md border border-[var(--color-primary)]/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] opacity-60">
                ID: {eventId?.slice(0, 8)}...
              </p>
            </span>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">Manage logistics, vendors, and timelines in one place.</p>
        </div>
        <button 
          onClick={() => setShowNewTaskModal(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 sm:w-auto"
        >
          <span>+</span> New Task
        </button>
      </header>

      <div className="flex-1 lg:overflow-x-auto lg:overflow-y-hidden p-4 sm:p-6 lg:p-10">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col lg:flex-row gap-6 h-full lg:items-start lg:min-w-max">
              {COLUMNS.map(column => {
                const columnTasks = getTasksByStatus(column);
                
                return (
                  <DroppableColumn key={column} column={column} columnTasks={columnTasks}>
                    <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      {columnTasks.map(task => (
                        <SortableTaskCard 
                          key={task.id} 
                          task={task} 
                          onClick={() => setSelectedTaskForDrawer(task)}
                        />
                      ))}
                    </SortableContext>
                  </DroppableColumn>
                );
              })}
            </div>
            
            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
              {activeTask ? <TaskCard task={activeTask} isLayoutOverlay={true} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <TaskDrawer 
        isOpen={!!selectedTaskForDrawer} 
        onClose={() => setSelectedTaskForDrawer(null)} 
        task={selectedTaskForDrawer}
        eventId={eventId}
        onUpdate={handleTaskUpdated}
        onDelete={handleTaskDeleted}
      />
      
      <NewTaskModal 
        isOpen={showNewTaskModal} 
        onClose={() => setShowNewTaskModal(false)} 
        onSubmit={handleCreateTask}
        loading={creating}
      />
    </div>
  );
};

export default Tasks;