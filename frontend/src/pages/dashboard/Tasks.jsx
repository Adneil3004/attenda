import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { tasksApi } from '../../lib/tasks';
import { DateService } from '../../lib/dateUtils';
import TaskDrawer from '../../components/dashboard/TaskDrawer';

// --- Icons (Inline SVGs for reliability) ---
const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const FilterIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const ChevronLeftIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const BoardIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// --- Components ---

const TaskCard = ({ task, onClick, isOverlay = false }) => {
  const priorityColors = {
    'Urgent': 'bg-red-500/10 text-red-600 border-red-500/20',
    'High': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    'Medium': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Low': 'bg-slate-500/10 text-slate-600 border-slate-500/20'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        group relative p-4 mb-3 bg-[var(--color-surface-container-lowest)] 
        rounded-2xl border border-[var(--color-outline-variant)]/10 
        hover:border-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-primary/5 
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isOverlay ? 'shadow-2xl ring-2 ring-[var(--color-primary)]/20 rotate-2' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
          {task.priority}
        </span>
        <div className="flex -space-x-2">
          <img src={task.avatar} alt={task.assignee} className="w-6 h-6 rounded-full border-2 border-[var(--color-surface-container-lowest)] shadow-sm" />
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-[var(--color-primary)] mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
        {task.title}
      </h4>
      
      <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-4 leading-relaxed opacity-80">
        {task.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-outline-variant)]/5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          <CalendarIcon />
          <span>{task.dueDate || 'No date'}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
      </div>
    </div>
  );
};

const SortableTaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onClick(task)} />
    </div>
  );
};

const BoardColumn = ({ title, status, tasks, onTaskClick, onAddTask }) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'Column', status }
  });

  return (
    <div className="flex flex-col w-80 min-w-[20rem] h-full bg-[var(--color-surface-container-low)]/30 rounded-3xl p-4 border border-[var(--color-outline-variant)]/5">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            status === 'To Do' ? 'bg-slate-400' :
            status === 'In Progress' ? 'bg-amber-400' :
            status === 'Done' ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-[0.2em]">{title}</h3>
          <span className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] px-2 py-0.5 rounded text-[10px] font-bold">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="p-1.5 hover:bg-[var(--color-primary)]/10 rounded-full transition-colors text-[var(--color-primary)]"
        >
          <PlusIcon />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--color-outline-variant)]/10 rounded-2xl opacity-40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">No tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BoardView = ({ tasks, onTaskClick, onAddTask, onDragEnd }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="h-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex gap-6 h-full min-w-max px-2">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          {columns.map(status => (
            <BoardColumn 
              key={status} 
              title={status} 
              status={status}
              tasks={tasks.filter(t => t.status === status)}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

const CalendarView = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const days = useMemo(() => {
    const arr = [];
    // Previous month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
      arr.push({ date: d, currentMonth: false });
    }
    // Current month
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      arr.push({ date: d, currentMonth: true });
    }
    // Next month padding
    const remaining = 42 - arr.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      arr.push({ date: d, currentMonth: false });
    }
    return arr;
  }, [currentDate, startDay, endOfMonth]);

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDateRaw) return false;
      const tDate = new Date(task.dueDateRaw);
      return (
        tDate.getDate() === date.getDate() &&
        tDate.getMonth() === date.getMonth() &&
        tDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface-container-lowest)] rounded-3xl border border-[var(--color-outline-variant)]/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)]/30">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-[var(--color-primary)] uppercase tracking-tighter">
            {monthName} <span className="text-[var(--color-secondary)] opacity-50">{year}</span>
          </h2>
          <div className="flex items-center gap-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 p-1 rounded-xl">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 hover:bg-[var(--color-surface-container-low)] rounded-lg transition-colors"
            >
              <ChevronLeftIcon />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-surface-container-low)] rounded-lg transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 hover:bg-[var(--color-surface-container-low)] rounded-lg transition-colors"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)]/10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((item, idx) => {
            const dayTasks = getTasksForDate(item.date);
            const today = isToday(item.date);
            
            return (
              <div 
                key={idx} 
                className={`
                  min-h-[120px] p-2 border-r border-b border-[var(--color-outline-variant)]/5 
                  ${!item.currentMonth ? 'bg-[var(--color-surface-container-low)]/20 opacity-30' : 'bg-[var(--color-surface-container-lowest)]'}
                  hover:bg-[var(--color-secondary)]/5 transition-colors group
                `}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`
                    text-xs font-black p-1.5 w-7 h-7 flex items-center justify-center rounded-lg transition-all
                    ${today ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]'}
                  `}>
                    {item.date.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className={`
                        px-2 py-1 text-[10px] font-bold rounded-lg truncate cursor-pointer transition-all border
                        ${task.priority === 'Urgent' ? 'bg-red-500/10 text-red-600 border-red-500/10' : 
                          task.priority === 'High' ? 'bg-orange-500/10 text-orange-600 border-orange-500/10' :
                          'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] border-transparent'}
                        hover:scale-105 hover:shadow-md
                      `}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { eventId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('board'); // 'board' or 'calendar'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [initialStatus, setInitialStatus] = useState('To Do');

  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getAll(eventId);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleAddTask = (status = 'To Do') => {
    setInitialStatus(status);
    setSelectedTask(null);
    setIsDrawerOpen(true);
    setIsCreating(true);
  };

  const handleUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setIsDrawerOpen(false);
  };

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsDrawerOpen(false);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === taskId);
    if (!activeTask) return;

    // Check if dropped over a column
    const columns = ['To Do', 'In Progress', 'Done'];
    if (columns.includes(overId)) {
      if (activeTask.status !== overId) {
        // Update status
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: overId } : t));
        try {
          await tasksApi.updateStatus(taskId, overId, eventId);
        } catch (error) {
          console.error('Failed to update status:', error);
          fetchTasks(); // Rollback
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with Glassmorphism */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-[var(--color-primary)] rounded-xl text-white shadow-lg shadow-primary/20">
              <BoardIcon />
            </div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tight">Mission Control</h1>
          </div>
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)] opacity-70">Orchestrate your event operations with precision.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--color-surface-container-low)] p-1 rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-inner">
            <button 
              onClick={() => setView('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                view === 'board' ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <BoardIcon />
              Board
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                view === 'calendar' ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <CalendarIcon />
              Calendar
            </button>
          </div>
          
          <button 
            onClick={() => handleAddTask()}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusIcon />
            New Task
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {view === 'board' ? (
            <motion.div 
              key="board"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <BoardView 
                tasks={tasks} 
                onTaskClick={handleTaskClick} 
                onAddTask={handleAddTask}
                onDragEnd={handleDragEnd}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Drawer for Details / Creation */}
      <TaskDrawer 
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsCreating(false);
        }}
        task={selectedTask}
        eventId={eventId}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Tasks;