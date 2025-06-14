import { Router } from 'express';
import { createTask, deleteTask, filterTasks } from '../controllers/taskController.js';

const router = Router();

router.post('', createTask);
router.get('', filterTasks);
router.delete('', deleteTask);

export default router;
