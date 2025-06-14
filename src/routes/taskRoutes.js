import { Router } from 'express';
import { createTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

router.post('', createTask);
router.delete('', deleteTask)

export default router;
