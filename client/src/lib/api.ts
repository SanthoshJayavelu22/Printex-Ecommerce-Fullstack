// src/lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, don't set Content-Type header so the browser can set the boundary automatically.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

  if (!response.ok) {
    const errorMsg = data.debugMsg || data.error || data.message || (response.status === 401 ? 'Unauthorized request' : 'Server Error');
    const error: any = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to server.');
    }
    throw err;
  }
};

export const getImageUrl = (url?: string) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  
  // Use API_URL directly to ensure requests go through the backend proxy (/api)
  return `${API_URL}/${url.replace(/\\/g, '/')}`;
};
