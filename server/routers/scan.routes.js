import express from 'express';
import {
  scanUrlHandler,
  scanEmailHandler,
  scanMessageHandler,
  getHistoryHandler
} from '../controllers/scanController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = express.Router();

// All scan routes require an authenticated user Bearer token
router.use(requireAuth);

router.post('/url', scanUrlHandler);
router.post('/email', scanEmailHandler);
router.post('/message', scanMessageHandler);
router.get('/history', getHistoryHandler);

export default router;