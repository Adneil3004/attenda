import { apiClient, ensureHttps } from './api';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5263/api';

export const rsvpApi = {
  saveRsvpConfig: async (eventId, config) => {
    // API Expects:
    // {
    //   eventId: Guid,
    //   headline: string,
    //   message: string,
    //   headerImageUrl: string | null,
    //   requireAttendanceTracking: bool,
    //   allowDietaryRequirements: bool,
    //   typographyTheme: string,
    //   colorTheme: string
    // }
    const payload = {
        eventId,
        ...config
    };
    return await apiClient.put(`/events/${eventId}/rsvp-config`, payload);
  },
  
  uploadRsvpImage: async (eventId, imageFile) => {
    return await apiClient.uploadImage(`/events/${eventId}/rsvp-image`, imageFile);
  },

  fetchRsvpConfig: async (eventId) => {
    return await apiClient.get(`/events/${eventId}/rsvp-config`);
  },

  // Public guest flow
  fetchGuestByToken: async (token) => {
    return await apiClient.get(`/rsvp/${token}`);
  },

  confirmRsvp: async (payload) => {
    // Payload: { token, status, plusOnes: [{ firstName, phoneNumber }] }
    return await apiClient.post(`/rsvp/confirm`, payload);
  }
};
