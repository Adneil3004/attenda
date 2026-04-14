import { supabase } from './supabase';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5263/api';

/**
 * Ensures that URLs pointing to the backend use HTTPS in production environments
 * to avoid Mixed Content errors.
 */
export const ensureHttps = (url) => {
  if (!url) return url;
  if (url.includes('onrender.com') && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

export const apiClient = {
  async get(endpoint) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `Error: ${response.status}`);
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json().catch(() => null);
  },

  async post(endpoint, body) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        if (error.error || error.details) {
            console.error('[apiClient] Error Details:', { 
                status: response.status,
                message: error.message,
                error: error.error,
                details: error.details
            });
        }
        throw new Error(error.message || `Error: ${response.status}`);
    }

    // Handle empty responses (204 No Content or content-length: 0)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json().catch(() => null);
  },

  async put(endpoint, body) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `Error: ${response.status}`);
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json().catch(() => null);
  },

  async patch(endpoint, body) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `Error: ${response.status}`);
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json().catch(() => null);
  },

  async delete(endpoint, body) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `Error: ${response.status}`);
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json().catch(() => null);
  },

  async uploadImage(endpoint, file) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Upload failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || `Error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
};
