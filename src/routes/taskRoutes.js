import { Router } from 'express';
import {
  createTask,
  deleteTask,
  filterTasks,
  getAllTasks,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('', createTask);
router.get('', filterTasks);
router.delete('/:id', deleteTask);
// get all task route
router.get('/all', getAllTasks);

export default router;
