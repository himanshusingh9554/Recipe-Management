import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/:recipeId', authenticateToken, addFavorite);

router.delete('/:recipeId', authenticateToken, removeFavorite);

router.get('/', authenticateToken, getFavorites);

export default router;
