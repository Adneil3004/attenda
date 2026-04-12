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
  // Get all tasks for the active event
  async getAll() {
    const eventId = getActiveEventId();
    console.log('[tasksApi] Fetching tasks for eventId:', eventId);
    
    if (!eventId) {
      console.warn('[tasksApi] No active event ID found in localStorage');
      return [];
    }
    
    const tasks = await apiClient.get(`/tasks?eventId=${eventId}`);
    console.log('[tasksApi] Fetched tasks:', tasks?.length || 0);
    return tasks.map(toFrontendTask);
  },

  // Create a new task
  async create({ title, description, priority, dueDate }) {
    const eventId = getActiveEventId();
    console.log('[tasksApi] Creating task for eventId:', eventId, { title, priority });

    if (!eventId) {
      throw new Error('No active event selected');
    }

    const formattedDueDate = dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null;
    const backendPriority = priority in PRIORITY_REVERSE ? PRIORITY_REVERSE[priority] : 1; // Default to 1 (Medium)
    
    const result = await apiClient.post('/tasks', {
      eventId,
      title,
      description,
      priority: backendPriority,
      dueDate: formattedDueDate
    });
    
    console.log('[tasksApi] Task created successfully:', result?.id);
    return toFrontendTask(result);
  },

  // Update a task (edit details)
  async update(taskId, { title, description, priority, dueDate, eventId }) {
    console.log('[tasksApi] Updating task:', { taskId, eventId, priority });
    
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
  async delete(taskId) {
    const eventId = getActiveEventId();
    console.log('[tasksApi] Deleting task:', { taskId, eventId });
    if (!eventId) {
      throw new Error('No active event selected');
    }

    return await apiClient.delete(`/tasks/${taskId}`, { eventId, taskId });
  },

  // Update task status (for drag & drop)
  async updateStatus(taskId, newStatus) {
    const eventId = getActiveEventId();
    if (!eventId) {
      throw new Error('No active event selected');
    }

    const backendStatus = STATUS_REVERSE[newStatus] || 'Pending';
    
    const result = await apiClient.patch(`/tasks/${taskId}/status`, {
      eventId,
      taskId,
      status: backendStatus
    });
    
    return toFrontendTask(result);
  }
};