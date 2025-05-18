import express from 'express';
import {
  createReview,
  getReviewsForRecipe,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:recipeId', authenticateToken, createReview);


router.get('/:recipeId', getReviewsForRecipe);

router.put('/:id', authenticateToken, updateReview);

router.delete('/:id', authenticateToken, deleteReview);

export default router;
