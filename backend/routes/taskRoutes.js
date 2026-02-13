import express from 'express';
import { 
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controllers/taskController.js';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';

const router = express.Router();

router.use(userAuthMiddleware);

router.get('/stats', getTaskStats);

// User routes (Users can only access their own tasks)
router.route('/')
    .post(createTask)           // User & Admin: Create task
    .get(getTasks);             // User: Own tasks, Admin: All tasks

router.route('/:id')
    .get(getTask)              // User: Own task, Admin: Any task
    .put(updateTask)           // User: Own task, Admin: Any task
    .delete(deleteTask);       // User: Own task, Admin: Any task

export default router;