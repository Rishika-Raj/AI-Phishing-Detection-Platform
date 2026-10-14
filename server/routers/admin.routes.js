import express from 'express';
import {
  getAllScansAdminHandler,
  getAdminStatsHandler,
  getUsersAdminHandler
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// All admin routes require both authentication and admin role
router.use(requireAuth, requireAdmin);

router.get('/scans', getAllScansAdminHandler);
router.get('/stats', getAdminStatsHandler);
router.get('/users', getUsersAdminHandler);

export default router;
