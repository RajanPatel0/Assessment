import express from 'express';
import { 
    getAllUsers,
    getAllTasks,
    deleteAnyTask,
    deleteAnyUser,
    getAdminDashboard
} from '../controllers/adminController.js';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(userAuthMiddleware);
router.use(adminOnly);

router.get('/dashboard', getAdminDashboard);

router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.delete('/users/:id', deleteAnyUser);
router.delete('/tasks/:id', deleteAnyTask);


export default router;