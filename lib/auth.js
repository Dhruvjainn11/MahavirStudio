import api from './api';

// Token management
export const setAuthToken = (token) => {
  if (token) {
    // Store in localStorage
    localStorage.setItem('token', token);
    // Set axios default header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize token on app load
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Register user
export const registerUser = async (data) => {
  try {
    const response = await api.post('/api/auth/register', data);
    
    // Store token and set up auth
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (data) => {
  try {
    const response = await api.post('/api/auth/login', data);
    
    // Store token and set up auth
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  setAuthToken(null);
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await api.get('/api/auth/verify');
    return response.data;
  } catch (error) {
    // If token is invalid, remove it
    setAuthToken(null);
    throw error;
  }
};
