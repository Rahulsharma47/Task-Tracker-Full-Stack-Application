import axios from 'axios';

console.log('🚀 API.JS LOADED - VERSION 3.0 (ROBUST)'); 

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

// Helper function to get token from localStorage
const getToken = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const userData = JSON.parse(userStr);
    return userData?.accessToken || null;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// Helper function to create config with auth header
const getAuthConfig = () => {
  const token = getToken();
  if (!token) {
    console.warn('⚠️ No token found in localStorage');
    return {};
  }
  
  console.log('✅ Token found, adding to request');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// RESPONSE interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Clearing storage and redirecting');
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
    
    console.log('🔐 Attempting login...');
    const response = await api.post('/users/login', credentials);
    
    // Store user info AND tokens in localStorage
    if (response.data.data) {
      const userDataToStore = {
        ...response.data.data.user,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      };
      
      localStorage.setItem('user', JSON.stringify(userDataToStore));
      console.log('✅ Login successful, tokens saved');
      console.log('🔑 Token preview:', response.data.data.accessToken?.substring(0, 20) + '...');
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      const config = getAuthConfig();
      await api.post('/users/logout', {}, config);
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
    return !!getToken();
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
    
    const config = getAuthConfig();
    const response = await api.get(url, config);
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId) => {
    const config = getAuthConfig();
    const response = await api.get(`/tasks/${taskId}`, config);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    console.log('🔨 Creating task with data:', taskData);
    
    const config = getAuthConfig();
    console.log('📦 Request config:', config);
    
    const response = await api.post('/tasks', taskData, config);
    
    console.log('✅ Task created successfully');
    return response.data;
  },

  // Update existing task
  updateTask: async (taskId, taskData) => {
    console.log('✏️ Updating task:', taskId);
    
    const config = getAuthConfig();
    const response = await api.put(`/tasks/${taskId}`, taskData, config);
    
    console.log('✅ Task updated successfully');
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    console.log('🗑️ Deleting task:', taskId);
    
    const config = getAuthConfig();
    const response = await api.delete(`/tasks/${taskId}`, config);
    
    console.log('✅ Task deleted successfully');
    return response.data;
  }
};

export default api;
