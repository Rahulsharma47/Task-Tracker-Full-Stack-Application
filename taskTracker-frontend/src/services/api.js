import axios from 'axios';

console.log('🚀 API.JS LOADED - VERSION 2.0'); 

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST interceptor to add token from localStorage
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Add token to Authorization header if it exists
        if (userData.accessToken) {
          config.headers.Authorization = `Bearer ${userData.accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE interceptor to handle errors
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
    return response.data;
  },

  // Login user - accepts email OR username
  login: async (identifier, password) => {
    const isEmail = identifier.includes('@');
    
    const credentials = {
      password,
      ...(isEmail ? { email: identifier } : { username: identifier })
    };
    
    const response = await api.post('/users/login', credentials);
    
    // Store user info AND tokens in localStorage
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify({
        ...response.data.data.user,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      }));
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Return user data without the tokens (for UI purposes)
        const { accessToken, refreshToken, ...user } = userData;
        return user;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

// ============ TASK SERVICES ============

// ============ TASK SERVICES ============

export const taskService = {
  // Helper function to get auth config
  _getAuthConfig: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.accessToken) {
          return {
            headers: {
              'Authorization': `Bearer ${userData.accessToken}`
            }
          };
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return {};
  },

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
    
    const response = await api.get(url, taskService._getAuthConfig());
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`, taskService._getAuthConfig());
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    console.log('🔨 Creating task...'); // DEBUG
    const config = taskService._getAuthConfig();
    console.log('🔑 Auth config:', config); // DEBUG
    
    const response = await api.post('/tasks', taskData, config);
    return response.data;
  },

  // Update existing task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData, taskService._getAuthConfig());
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`, taskService._getAuthConfig());
    return response.data;
  }
};

export default api;
