import React, { useState, useEffect } from 'react';
import { tasksApi } from '../../lib/tasks';

const TaskDrawer = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDateRaw ? new Date(task.dueDateRaw).toISOString().split('T')[0] : ''
      });
      setIsEditing(false);
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!task?.id) return;
    
    setIsEditing(false);
    try {
      const updated = await tasksApi.update(task.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || null
      });
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await tasksApi.delete(task.id);
      onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task?.id) return;
    
    try {
      const updated = await tasksApi.updateStatus(task.id, newStatus);
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const isDone = task?.status === 'Done';

  return (
    <>
      <div 
        className="fixed inset-0 bg-white/30 backdrop-blur-md z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-[440px] bg-white z-50 shadow-2xl border-l border-[var(--color-outline-variant)]/20 animate-in slide-in-from-right duration-300 flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-outline-variant)]/10">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-[var(--color-surface-container-low)] text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
              Task
            </span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
              task?.priority === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 
              task?.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
              task?.priority === 'Medium' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
              'bg-slate-50 text-slate-500 border border-slate-200'
            }`}>
              {task?.priority || 'Medium'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-1 transition-colors"
                title="Edit task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/20 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/20 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all resize-none"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/20 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all font-bold text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/20 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-[var(--color-outline-variant)]/20 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold font-headline text-[var(--color-primary)] leading-tight">
                  {task?.title || 'Task Details'}
                </h2>
                <div className="flex items-center gap-4 mt-6 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Status</span>
                    <select
                      value={task?.status || 'To Do'}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[var(--color-outline-variant)]/20 text-xs font-bold uppercase tracking-widest bg-white"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="w-px h-8 bg-[var(--color-surface-container-low)]"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Due Date</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-[var(--color-primary)]">{task?.dueDate || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-[var(--color-outline-variant)]/10" />

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--color-primary)]">Description</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {task?.description || 'No description provided for this task yet.'}
                </p>
              </div>

              <hr className="border-[var(--color-outline-variant)]/10" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--color-primary)]">Checklist</h3>
                <div className="space-y-3">
                  <p className="text-sm text-[var(--color-text-muted)]">No checklist items yet.</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-lowest)] space-y-3">
          {!isDone && (
            <button 
              onClick={() => handleStatusChange('Done')}
              className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex justify-center items-center gap-2"
            >
              Mark as Done
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
};

export default TaskDrawer;