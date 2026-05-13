import { apiClient } from './api';

export const scheduleApi = {
  // Get all activities for an event
  async getAll(eventId) {
    if (!eventId) return [];
    return await apiClient.get(`/schedule/${eventId}`);
  },

  // Create a new activity
  async create({ eventId, title, description, startTime, endTime, category, customCategory, order }) {
    if (!eventId) throw new Error('No eventId provided to create activity');

    return await apiClient.post(`/schedule/${eventId}/activities`, {
      eventId,
      title,
      description,
      startTime,
      endTime,
      category: category ?? 7, // Default to Other (7)
      customCategory: customCategory || '',
      order: order || 0
    });
  },

  // Update an activity
  async update(activityId, { eventId, title, description, startTime, endTime, category, customCategory, order }) {
    if (!eventId) throw new Error('No eventId provided to update activity');
    
    return await apiClient.put(`/schedule/${eventId}/activities/${activityId}`, {
      eventId,
      activityId,
      title,
      description,
      startTime,
      endTime,
      category: category ?? 7,
      customCategory: customCategory || '',
      order: order || 0
    });
  },

  // Delete an activity
  async delete(activityId, eventId) {
    if (!eventId) throw new Error('No eventId provided to delete activity');
    return await apiClient.delete(`/schedule/${eventId}/activities/${activityId}`);
  },

  // Reorder activities
  async reorder(eventId, activityIds) {
    if (!eventId) throw new Error('No eventId provided to reorder activities');
    return await apiClient.put(`/schedule/${eventId}/reorder`, activityIds);
  }
};
