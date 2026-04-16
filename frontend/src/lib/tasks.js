import { apiClient } from './api';

// Status mapping: backend enum → frontend UI string
const STATUS_MAP = {
  'Pending': 'To Do',
  'InProgress': 'In Progress',
  'Completed': 'Done',
  'Cancelled': 'Cancelled'
};

// Reverse mapping: frontend UI string → backend enum (PATCH status expects string)
const STATUS_REVERSE = {
  'To Do': 'Pending',
  'In Progress': 'InProgress',
  'Done': 'Completed',
  'Cancelled': 'Cancelled'
};

// Priority mapping: handles both integer (from API) and string (from DTO)
const PRIORITY_MAP = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Urgent',
  'Low': 'Low',
  'Medium': 'Medium',
  'High': 'High',
  'Urgent': 'Urgent'
};

// Reverse mapping: frontend UI string → backend enum integer (POST/PUT priority expects integer)
const PRIORITY_REVERSE = {
  'Low': 0,
  'Medium': 1,
  'High': 2,
  'Urgent': 3
};


// Convert backend task to frontend task format
const toFrontendTask = (backendTask) => ({
  id: backendTask.id,
  title: backendTask.title,
  description: backendTask.description || '',
  status: STATUS_MAP[backendTask.status] || 'To Do',
  priority: PRIORITY_MAP[backendTask.priority] || 'Normal',
  dueDate: backendTask.dueDate ? formatDate(backendTask.dueDate) : null,
  dueDateRaw: backendTask.dueDate,
  createdAt: backendTask.createdAt,
  // Frontend-specific fields (not from backend)
  tag: 'General',
  assignee: 'You',
  avatar: 'https://ui-avatars.com/api/?name=You&background=0D1117&color=fff'
});

// Format date for frontend display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get active event ID from localStorage
const getActiveEventId = () => {
  return localStorage.getItem('activeEventId');
};

export const tasksApi = {
  // Get all tasks for an event
  async getAll(eventId) {
    if (!eventId) {
      return [];
    }
    
    const tasks = await apiClient.get(`/tasks?eventId=${eventId}`);
    return tasks.map(toFrontendTask);
  },

  // Create a new task
  async create({ title, description, priority, dueDate, eventId }) {
    if (!eventId) throw new Error('No eventId provided to create task');

    const formattedDueDate = dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null;
    const backendPriority = priority in PRIORITY_REVERSE ? PRIORITY_REVERSE[priority] : 1; 
    
    const result = await apiClient.post('/tasks', {
      eventId,
      title,
      description,
      priority: backendPriority,
      dueDate: formattedDueDate
    });
    
    return toFrontendTask(result);
  },

  // Update a task
  async update(taskId, { title, description, priority, dueDate, eventId }) {
    if (!eventId) throw new Error('No eventId provided to update task');
    
    const formattedDueDate = dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null;
    const backendPriority = priority in PRIORITY_REVERSE ? PRIORITY_REVERSE[priority] : (parseInt(priority, 10) || 1);
    
    const result = await apiClient.put(`/tasks/${taskId}`, {
      eventId,
      title,
      description,
      priority: backendPriority,
      dueDate: formattedDueDate
    });
    return toFrontendTask(result);
  },

  // Delete a task
  async delete(taskId, eventId) {
    if (!eventId) throw new Error('No eventId provided to delete task');

    return await apiClient.delete(`/tasks/${taskId}`, { eventId, taskId });
  },

  // Update task status
  async updateStatus(taskId, newStatus, eventId) {
    if (!eventId) throw new Error('No eventId provided to update task status');

    const backendStatus = STATUS_REVERSE[newStatus] || 'Pending';
    
    const result = await apiClient.patch(`/tasks/${taskId}/status`, {
      eventId,
      taskId,
      status: backendStatus
    });
    
    return toFrontendTask(result);
  }
};