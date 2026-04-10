import React, { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskDrawer from '../../components/dashboard/TaskDrawer';

// ─── Dummy Data ───
const initialTasks = [
  { id: 't1', status: 'Backlog', title: 'Compile guest addresses', tag: 'Logistics', priority: 'Normal', assignee: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=0D1117&color=fff', dueDate: 'Oct 12' },
  { id: 't2', status: 'Backlog', title: 'Request dietary restrictions', tag: 'Catering', priority: 'High', assignee: 'Sarah Miller', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=0D1117&color=fff', dueDate: 'Oct 15' },
  { id: 't3', status: 'To Do', title: 'Confirm Floral Arrangements', tag: 'Vendor', priority: 'High', assignee: 'Alex Ivory', avatar: 'https://ui-avatars.com/api/?name=Alex+Ivory&background=0D1117&color=fff', dueDate: 'Sep 30' },
  { id: 't4', status: 'In Progress', title: 'Design seating chart layout', tag: 'Planning', priority: 'Normal', assignee: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=0D1117&color=fff', dueDate: 'Sep 25' },
  { id: 't5', status: 'In Progress', title: 'Review evening playlist', tag: 'Entertainment', priority: 'Normal', assignee: 'James Chen', avatar: 'https://ui-avatars.com/api/?name=James+Chen&background=0D1117&color=fff', dueDate: 'Sep 26' },
  { id: 't6', status: 'Review', title: 'Deposit for photographer', tag: 'Finance', priority: 'High', assignee: 'Alex Ivory', avatar: 'https://ui-avatars.com/api/?name=Alex+Ivory&background=0D1117&color=fff', dueDate: 'Sep 20' },
];

const COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

// ─── Sortable Item Component ───
const SortableTaskCard = ({ task, onClick, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isNodeDragging
  } = useSortable({ id: task.id, data: task });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isNodeDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group cursor-grab active:cursor-grabbing ${isNodeDragging ? 'invisible' : ''}`}
      onClick={(e) => {
        // Prevent click when dragging
        if (e.defaultPrevented) return;
        onClick(task);
      }}
    >
      <TaskCard task={task} />
    </div>
  );
};

// ─── Base Card Component (For normal render & Drag Overlay) ───
const TaskCard = ({ task, isLayoutOverlay }) => (
  <div className={`bg-white rounded-xl p-5 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${isLayoutOverlay ? 'shadow-xl rotate-3 scale-105 cursor-grabbing' : 'shadow-sm'}`}>
    {/* High Priority indicator border */}
    {task.priority === 'High' && (
      <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
    )}
    <div className="flex justify-between items-start mb-4">
      <span className="bg-[#f8f9fa] text-gray-500 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">
        {task.tag}
      </span>
      <div className="flex -space-x-2">
        <img src={task.avatar} alt="assignee" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
      </div>
    </div>
    <h4 className="text-sm font-semibold text-[var(--color-primary)] font-display leading-snug mb-4">
      {task.title}
    </h4>
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
      <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-bold">{task.dueDate}</span>
      </div>
      {task.status === 'Done' && (
        <span className="text-emerald-500 animate-in zoom-in duration-300 drop-shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  </div>
);

// ─── Main Tasks Dashboard Component ───
const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState(null);

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dragging over a column directly or over another task
    const activeTask = tasks.find(t => t.id === activeId);
    let newStatus = COLUMNS.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;

    if (activeTask && newStatus && activeTask.status !== newStatus) {
      setTasks(tasks.map(t => {
        if (t.id === activeId) return { ...t, status: newStatus };
        return t;
      }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      
      {/* Header */}
      <header className="px-10 py-8 flex-shrink-0 flex items-end justify-between border-b border-[var(--color-outline-variant)]/10">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] font-headline tracking-tight">Event Task Management</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">Manage logistics, vendors, and timelines in one place.</p>
        </div>
        <button className="bg-[#001b44] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
          <span>+</span> New Task
        </button>
      </header>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-10">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start min-w-max">
            {COLUMNS.map(column => {
              const columnTasks = getTasksByStatus(column);
              
              // WIP Limit Logic
              const wipLimitValue = 3;
              const isWIP = column === 'In Progress';
              const overLimit = isWIP && columnTasks.length > wipLimitValue;

              return (
                <div 
                  key={column} 
                  id={column}
                  className="w-80 flex-shrink-0 flex flex-col h-full bg-[#f3f4f5] rounded-2xl p-4 hide-scrollbar"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-sm text-[var(--color-primary)] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-60"></span>
                      {column}
                    </h3>
                    
                    {/* Tags / Counts */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                      {isWIP && (
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${overLimit ? 'bg-red-100 text-red-600' : 'bg-white text-indigo-600 shadow-sm'}`}>
                          WIP Limit {wipLimitValue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pb-10 hide-scrollbar pt-2">
                    <SortableContext items={columnTasks.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                      {columnTasks.map(task => (
                        <SortableTaskCard 
                          key={task.id} 
                          task={task} 
                          onClick={() => setSelectedTaskForDrawer(task)}
                        />
                      ))}
                    </SortableContext>
                    
                    {/* Empty State / Drop Zone Extender */}
                    {columnTasks.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-xs font-semibold text-gray-400">
                        Drag tasks here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Active Drag Overlay */}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isLayoutOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Drawer */}
      <TaskDrawer 
        isOpen={!!selectedTaskForDrawer} 
        onClose={() => setSelectedTaskForDrawer(null)} 
        task={selectedTaskForDrawer} 
      />
      
    </div>
  );
};

export default Tasks;
