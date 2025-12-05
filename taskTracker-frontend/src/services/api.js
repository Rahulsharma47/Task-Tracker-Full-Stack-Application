import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: This sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH SERVICES ============

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    
    // Don't store user info yet - let them login first
    // Just return the response
    return response.data;
  },

  // Login user - accepts email OR username
  login: async (identifier, password) => {
    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    
    const credentials = {
      password,
      ...(isEmail ? { email: identifier } : { username: identifier })
    };
    
    const response = await api.post('/users/login', credentials);
    
    // Tokens are automatically stored in httpOnly cookies by the browser
    // We only store user info in localStorage for UI purposes
    if (response.data.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    
    // Don't store anything on registration - user needs to login to get token
    // Just return the response
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

// ============ TASK SERVICES ============

export const taskService = {
  // Get all tasks for current user
  getAllTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.priority) {
      queryParams.append('priority', filters.priority);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

export default api;