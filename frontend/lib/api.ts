import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Send cookies for CORS
});

// Request interceptor to add token to header
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Functions

// Authentication
export const authAPI = {
  register: async (data: { full_name: string; username: string; email: string; password: string; phone?: string; address?: string }) => {
    const response = await apiClient.post('/register', data);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { login: string; password: string }) => {
    const response = await apiClient.post('/login', data);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },
};

// Items
export const itemsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  getPublic: async () => {
    const response = await apiClient.get('/public/items');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/items', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
  },
};

// Listings
export const listingsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/listings');
    return response.data;
  },

  getPublic: async () => {
    const response = await apiClient.get('/public/listings');
    return response.data;
  },

  getPublicById: async (id: number) => {
    const response = await apiClient.get(`/public/listings/${id}`);
    return response.data;
  },

  getNewest: async () => {
    const response = await apiClient.get('/public/listings/newest');
    return response.data;
  },

  getMostBorrowed: async () => {
    const response = await apiClient.get('/public/listings/most-borrowed');
    return response.data;
  },

  getMostViewed: async () => {
    const response = await apiClient.get('/public/listings/most-viewed');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/listings', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/listings/${id}`);
    return response.data;
  },
};

// Loans
export const loansAPI = {
  getAll: async () => {
    const response = await apiClient.get('/loans');
    return response.data;
  },

  getMyLoans: async () => {
    const response = await apiClient.get('/my-loans');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/loans/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/loans', data);
    return response.data;
  },

  approve: async (id: number) => {
    const response = await apiClient.post(`/loans/${id}/approve`);
    return response.data;
  },

  reject: async (id: number) => {
    const response = await apiClient.post(`/loans/${id}/reject`);
    return response.data;
  },
};

// Categories
export const categoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/public/categories');
    return response.data;
  },

  create: async (data: { title: string; description?: string; parent_id?: number }) => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
  },

  update: async (id: number, data: { title?: string; description?: string; parent_id?: number }) => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

// Admin Users
export const adminAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
};

// Messages
export const messagesAPI = {
  getConversations: async () => {
    const response = await apiClient.get('/conversations');
    return response.data;
  },

  getMessages: async (conversationId: number) => {
    const response = await apiClient.get(`/messages/${conversationId}`);
    return response.data;
  },

  send: async (data: { conversation_id?: number; recipient_id?: number; message: string }) => {
    const response = await apiClient.post('/messages', {
      conversation_id: data.conversation_id,
      message_text: data.message,
    });
    return response.data;
  },
};

// Profile
export const profileAPI = {
  get: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  update: async (data: any) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },
};

// Export default client for custom requests
export default apiClient;

