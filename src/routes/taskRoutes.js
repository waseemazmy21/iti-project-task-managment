import { Router } from 'express';
import {
  createTask,
  deleteTask,
  filterTasks,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('', createTask);
router.get('', filterTasks);
router.delete('/:id', deleteTask);

export default router;
