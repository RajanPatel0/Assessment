import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const [dashboardStats, setDashboardStats] = useState({
    stats: {
      users: { total: 0, admins: 0, regular: 0 },
      tasks: { total: 0, pending: 0, inProgress: 0, completed: 0, completionRate: 0 }
    },
    recentActivity: { tasks: [], users: [] }
  });
  
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState({
    dashboard: false,
    users: false,
    tasks: false
  });
  
  const [pagination, setPagination] = useState({
    users: { page: 1, totalPages: 1, total: 0 },
    tasks: { page: 1, totalPages: 1, total: 0 }
  });

  const [filters, setFilters] = useState({
    users: { page: 1, limit: 10, search: '' },
    tasks: { page: 1, limit: 10, status: '', userId: '', search: '' }
  });

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    try {
      const data = await adminService.getDashboardStats();
      if (data.success) {
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const data = await adminService.getUsers(filters.users);
      if (data.success) {
        setUsers(data.users || []);
        setPagination(prev => ({
          ...prev,
          users: {
            page: data.page || 1,
            totalPages: data.pages || 1,
            total: data.total || 0
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, [filters.users]);

  // Fetch all tasks
  const fetchAllTasks = useCallback(async () => {
    setLoading(prev => ({ ...prev, tasks: true }));
    try {
      const data = await adminService.getAllTasks(filters.tasks);
      if (data.success) {
        setTasks(data.tasks || []);
        setPagination(prev => ({
          ...prev,
          tasks: {
            page: data.page || 1,
            totalPages: data.pages || 1,
            total: data.total || 0
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  }, [filters.tasks]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchAllTasks();
  }, [fetchDashboardStats, fetchUsers, fetchAllTasks]);

  // Delete user
  const deleteUser = async (userId, userName) => {
    try {
      const data = await adminService.deleteUser(userId);
      if (data.success) {
        toast.success(`User ${userName} deleted successfully`);
        // Refresh all data
        await fetchDashboardStats();
        await fetchUsers();
        await fetchAllTasks();
        return data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const data = await adminService.deleteTask(taskId);
      if (data.success) {
        toast.success('Task deleted successfully');
        // Refresh all data
        await fetchDashboardStats();
        await fetchAllTasks();
        await fetchUsers(); // Users might have task counts updated
        return data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  };

  // Update filters
  const updateUserFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      users: { ...prev.users, ...newFilters, page: 1 }
    }));
  };

  const updateTaskFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      tasks: { ...prev.tasks, ...newFilters, page: 1 }
    }));
  };

  // Change page
  const changeUserPage = (page) => {
    setFilters(prev => ({
      ...prev,
      users: { ...prev.users, page }
    }));
  };

  const changeTaskPage = (page) => {
    setFilters(prev => ({
      ...prev,
      tasks: { ...prev.tasks, page }
    }));
  };

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchUsers(),
      fetchAllTasks()
    ]);
  };

  return {
    dashboardStats,
    users,
    tasks,
    loading,
    pagination,
    filters,
    updateUserFilters,
    updateTaskFilters,
    changeUserPage,
    changeTaskPage,
    deleteUser,
    deleteTask,
    refreshAllData
  };
};