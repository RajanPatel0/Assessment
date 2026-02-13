import api from '../api/axios.js';

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with filters
  async getUsers(params = {}) {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks with filters
  async getAllTasks(params = {}) {
    try {
      const response = await api.get('/admin/tasks', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete any user
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete any task
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/admin/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService();