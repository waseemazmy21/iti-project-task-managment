import { Router } from 'express';
import {
  createTask,
  deleteTask,
  filterTasks,
  searchTasks,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('', createTask);
router.get('', filterTasks);
router.delete('/:id', deleteTask);
router.get('/search', searchTasks);

export default router;
