import Task from '../models/Task.js';
import User from '../models/User.js';
import { setCache, getCache, deleteCache } from '../config/redis.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status = 'pending' } = req.body;

        //validation
        if (!title || title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Title must be at least 3 characters long'
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            status,
            createdBy: req.user.id
        });

        // Populate creator details
        await task.populate('createdBy', 'fullName email');

        // Clear relevant caches
        await deleteCache(`tasks:${req.user.id}:*`);
        await deleteCache(`tasks:user:${req.user.id}:*`);
        
        // If admin, clear admin tasks cache
        if (req.user.role === 'admin') {
            await deleteCache('admin:tasks:*');
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build cache key based on query params
        const cacheKey = `tasks:${req.user.role === 'admin' ? 'all' : req.user.id}:${status || 'all'}:${search || 'nosearch'}:page${page}`;
        
        // Try cache first
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...cachedData,
                fromCache: true
            });
        }

        // Build query based on role
        let query = {};
        
        // Regular users see only their tasks
        if (req.user.role === 'user') {
            query.createdBy = req.user.id;
        }

        // Add status filter
        if (status) {
            query.status = status;
        }

        // Add search functionality
        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const tasks = await Task.find(query)
            .populate('createdBy', 'fullName email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Task.countDocuments(query);

        const response = {
            success: true,
            count: tasks.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            tasks,
            role: req.user.role
        };

        // Cache for 5 minutes (300 seconds)
        await setCache(cacheKey, response, 300);

        res.status(200).json({
            ...response,
            fromCache: false
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

export const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Try cache first
        const cacheKey = `task:${id}`;
        const cachedTask = await getCache(cacheKey);
        
        if (cachedTask) {
            const creatorId = cachedTask.createdBy?._id?.toString() || cachedTask.createdBy?.toString();
            // Check ownership for cached task
            if (req.user.role !== 'admin' && creatorId !== req.user.id?.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to view this task'
                });
            }
            
            return res.status(200).json({
                success: true,
                task: cachedTask,
                fromCache: true
            });
        }

        // Get from database
        const task = await Task.findById(id)
            .populate('createdBy', 'fullName email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const creatorId = task.createdBy?._id?.toString() || task.createdBy?.toString();
        
        if (req.user.role !== 'admin' && creatorId !== req.user.id?.toString()) {
            console.log('Access denied:', {
                userRole: req.user.role,
                userId: req.user.id,
                creatorId: creatorId,
                taskCreator: task.createdBy
            });
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this task'
            });
        }

        // Cache for 10 minutes
        await setCache(cacheKey, task, 600);

        res.status(200).json({
            success: true,
            task,
            fromCache: false
        });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task',
            error: error.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        // Find task
        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const creatorId = task.createdBy?.toString();
        
         if (req.user.role !== 'admin' && creatorId !== req.user.id?.toString()) {
            console.log('Update permission denied:', {
                userRole: req.user.role,
                userId: req.user.id,
                creatorId: creatorId
            });
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this task'
            });
        }

        // Update fields
        if (title) task.title = title.trim();
        if (description !== undefined) task.description = description?.trim() || '';
        if (status) task.status = status;
        
        task.updatedAt = Date.now();
        await task.save();
        
        // Populate creator details
        await task.populate('createdBy', 'fullName email');

        // Clear all related caches
        await deleteCache(`task:${id}`);
        await deleteCache(`tasks:${task.createdBy._id || task.createdBy}:*`);
        await deleteCache(`tasks:user:${task.createdBy._id || task.createdBy}:*`);
        await deleteCache('admin:tasks:*');
        
        // If user is updating someone else's task (admin), clear that user's cache too
        if (req.user.role === 'admin' && req.user.id?.toString() !== creatorId) {
            await deleteCache(`tasks:${req.user.id}:*`);
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check ownership (Admin can delete any task)
        const creatorId = task.createdBy?.toString();
        
        if (req.user.role !== 'admin' && creatorId !== req.user.id?.toString()) {
            console.log('Delete permission denied:', {
                userRole: req.user.role,
                userId: req.user.id,
                creatorId: creatorId
            });
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this task'
            });
        }

        await task.deleteOne();

        // Clear all related caches
        await deleteCache(`task:${id}`);
        await deleteCache(`tasks:${creatorId}:*`);
        await deleteCache(`tasks:user:${creatorId}:*`);
        await deleteCache('admin:tasks:*');

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
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

export const getTaskStats = async (req, res) => {
    try {
        const cacheKey = `stats:${req.user.role === 'admin' ? 'all' : req.user.id}`;
        
        // Try cache
        const cachedStats = await getCache(cacheKey);
        if (cachedStats) {
            return res.status(200).json({
                success: true,
                ...cachedStats,
                fromCache: true
            });
        }

        let query = {};
        if (req.user.role === 'user') {
            query.createdBy = req.user.id;
        }

        const stats = await Task.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Task.countDocuments(query);
        
        // Format stats
        const formattedStats = {
            total,
            pending: stats.find(s => s._id === 'pending')?.count || 0,
            'in-progress': stats.find(s => s._id === 'in-progress')?.count || 0,
            completed: stats.find(s => s._id === 'completed')?.count || 0
        };

        const response = {
            success: true,
            stats: formattedStats,
            role: req.user.role
        };

        // Cache for 10 minutes
        await setCache(cacheKey, response, 600);

        res.status(200).json({
            ...response,
            fromCache: false
        });
    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task statistics',
            error: error.message
        });
    }
};