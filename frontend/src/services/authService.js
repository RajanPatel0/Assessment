import api from '../api/axios.js';
import toast from 'react-hot-toast';

class AuthService {
  // Register user or admin
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  // Login (works for both user and admin)
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Get user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  // Check if user is admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  // Check if user is regular user
  isUser() {
    return this.getUserRole() === 'user';
  }
}

export default new AuthService();