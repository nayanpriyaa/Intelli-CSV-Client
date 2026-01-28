import api from './api';

/**
 * Sign up a new user
 */
export const signup = async (email, password) => {
  const response = await api.post('/api/auth/signup', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Sign in existing user
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data.user;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
};