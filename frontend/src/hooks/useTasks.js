import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.pages || 1,
        total: data.total || 0,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics - FIXED VERSION
  const fetchStats = useCallback(async () => {
    try {
      const data = await taskService.getTaskStats();
      console.log('Stats from API:', data); // Debug log
      
      if (data.success) {
        // Make sure we're setting the stats correctly
        setStats({
          total: data.stats?.total || 0,
          pending: data.stats?.pending || 0,
          'in-progress': data.stats?.['in-progress'] || 0,
          completed: data.stats?.completed || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const data = await taskService.createTask(taskData);
      if (data.success) {
        toast.success('Task created successfully!');
        // Refresh both tasks and stats
        await fetchTasks();
        await fetchStats();
        return data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const data = await taskService.updateTask(id, taskData);
      if (data.success) {
        toast.success('Task updated successfully!');
        // Refresh both tasks and stats
        await fetchTasks();
        await fetchStats();
        return data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const data = await taskService.deleteTask(id);
      if (data.success) {
        toast.success('Task deleted successfully!');
        // Refresh both tasks and stats
        await fetchTasks();
        await fetchStats();
        return data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Change page
  const changePage = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Refresh data
  const refreshData = async () => {
    await Promise.all([fetchTasks(), fetchStats()]);
  };

  return {
    tasks,
    stats,
    loading,
    pagination,
    filters,
    updateFilters,
    changePage,
    createTask,
    updateTask,
    deleteTask,
    refreshData
  };
};