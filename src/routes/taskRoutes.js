import { Router } from 'express';
import {
  createTask,
  deleteTask,
  filterTasks,
  getAllTasks,
  updateTask,
  getTaskById,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('', createTask);
router.get('', filterTasks);
router.delete('/:id', deleteTask);
// get all task route
router.get('/all', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
// router.patch('/:id', modify);

export default router;
