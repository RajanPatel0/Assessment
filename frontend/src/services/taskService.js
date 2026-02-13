import api from '../api/axios.js';

class TaskService {
  // Get all tasks with filters
  async getTasks(params = {}) {
    try {
      const response = await api.get('/task', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get single task
  async getTask(id) {
    try {
      const response = await api.get(`/task/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create task
  async createTask(taskData) {
    try {
      const response = await api.post('/task', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update task
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/task/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete task
  async deleteTask(id) {
    try {
      const response = await api.delete(`/task/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get task statistics - FIXED: Ensure we're getting the right structure
  async getTaskStats() {
    try {
      const response = await api.get('/task/stats');
      console.log('Raw stats response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

export default new TaskService();