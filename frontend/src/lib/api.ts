const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },
  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },
  post(endpoint: string, data: any) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  },
  put(endpoint: string, data: any) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};