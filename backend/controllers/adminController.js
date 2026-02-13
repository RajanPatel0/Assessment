import User from '../models/User.js';
import Task from '../models/Task.js';
import { setCache, getCache, deleteCache } from '../config/redis.js';

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const cacheKey = `admin:users:${search || 'all'}:page${page}`;
        
        // Try cache
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...cachedData,
                fromCache: true
            });
        }

        // Build search query
        let query = {};
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        // Get task counts for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const taskCount = await Task.countDocuments({ createdBy: user._id });
                return {
                    ...user.toObject(),
                    taskCount
                };
            })
        );

        const response = {
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            users: usersWithStats
        };

        // Cache for 5 minutes
        await setCache(cacheKey, response, 300);

        res.status(200).json({
            ...response,
            fromCache: false
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, userId } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const cacheKey = `admin:tasks:${status || 'all'}:${userId || 'all'}:page${page}`;
        
        // Try cache
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...cachedData,
                fromCache: true
            });
        }

        // Build query
        let query = {};
        if (status) query.status = status;
        if (userId) query.createdBy = userId;

        const tasks = await Task.find(query)
            .populate('createdBy', 'fullName email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        const response = {
            success: true,
            count: tasks.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            tasks
        };

        // Cache for 5 minutes
        await setCache(cacheKey, response, 300);

        res.status(200).json({
            ...response,
            fromCache: false
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

export const deleteAnyUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Delete all tasks of this user
        await Task.deleteMany({ createdBy: user._id });
        
        // Delete the user
        await user.deleteOne();

        // Clear all related caches
        await deleteCache(`user:${user._id}`);
        await deleteCache(`tasks:${user._id}:*`);
        await deleteCache(`tasks:user:${user._id}:*`);
        await deleteCache('admin:users:*');
        await deleteCache('admin:tasks:*');

        res.status(200).json({
            success: true,
            message: `User ${user.fullName} and their ${user.taskCount || 0} tasks deleted successfully`
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

export const deleteAnyTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            });
        }

        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const creatorId = task.createdBy;
        await task.deleteOne();

        // Clear all related caches
        await deleteCache(`task:${id}`);
        await deleteCache(`tasks:${creatorId}:*`);
        await deleteCache(`tasks:user:${creatorId}:*`);
        await deleteCache('admin:tasks:*');

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully by admin'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

export const getAdminDashboard = async (req, res) => {
    try {
        const cacheKey = 'admin:dashboard:stats';
        
        // Try cache
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...cachedData,
                fromCache: true
            });
        }

        // Get total users
        const totalUsers = await User.countDocuments();
        
        // Get users by role
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = await User.countDocuments({ role: 'user' });
        
        // Get total tasks
        const totalTasks = await Task.countDocuments();
        
        // Get tasks by status
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        
        // Get recent activity
        const recentTasks = await Task.find()
            .populate('createdBy', 'fullName')
            .sort('-createdAt')
            .limit(5);
            
        const recentUsers = await User.find()
            .select('-password -refreshToken')
            .sort('-createdAt')
            .limit(5);

        const response = {
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    admins: adminCount,
                    regular: userCount
                },
                tasks: {
                    total: totalTasks,
                    pending: pendingTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
                    completionRate: totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
                }
            },
            recentActivity: {
                tasks: recentTasks,
                users: recentUsers
            }
        };

        // Cache for 10 minutes
        await setCache(cacheKey, response, 600);

        res.status(200).json({
            ...response,
            fromCache: false
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};