import { Router } from 'express';
import { createTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

router.post('', createTask);
router.get('/:id', deleteTask);

export default router;
