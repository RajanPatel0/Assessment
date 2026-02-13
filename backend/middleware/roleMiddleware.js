// @desc    Check if user is admin
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

// @desc    Check if user is regular user
export const userOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    if (req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Users only.'
        });
    }
};

// @desc    Check task ownership (for routes that need it)
export const checkTaskOwnership = async (req, res, next) => {
    try {
        // Admin can do anything
        if (req.user.role === 'admin') {
            return next();
        }

        const { id } = req.params;
        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this task'
            });
        }

        req.task = task; // Attach task to request for reuse
        next();
    } catch (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking task ownership'
        });
    }
};