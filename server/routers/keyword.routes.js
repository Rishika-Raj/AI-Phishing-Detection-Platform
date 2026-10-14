import express from 'express';
import {
  getKeywordsHandler,
  createKeywordHandler,
  updateKeywordHandler,
  deleteKeywordHandler
} from '../controllers/keywordController.js';
import { requireAuth, requireAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Authenticated users can list active keywords
router.get('/', requireAuth, getKeywordsHandler);

// Admin only endpoints for managing keywords
router.post('/', requireAuth, requireAdmin, createKeywordHandler);
router.patch('/:id', requireAuth, requireAdmin, updateKeywordHandler);
router.delete('/:id', requireAuth, requireAdmin, deleteKeywordHandler);

export default router;
