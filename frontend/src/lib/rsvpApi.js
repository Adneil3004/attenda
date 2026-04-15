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

  // Anonymous endpoint - no auth required
  fetchRsvpConfig: async (eventId) => {
    const url = ensureHttps(`${BACKEND_URL}/events/${eventId}/rsvp-config`);
    console.log('[fetchRsvpConfig] Requesting:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[fetchRsvpConfig] Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('[fetchRsvpConfig] Error response:', text);
      throw new Error(`Error ${response.status}: ${text || 'An error occurred'}`);
    }

    const data = await response.json();
    console.log('[fetchRsvpConfig] Data received:', data);
    return data;
  }
};
