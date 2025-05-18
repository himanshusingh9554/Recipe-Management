import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/', authenticateToken,upload.single('image') ,createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authenticateToken,upload.single('image'), updateRecipe);
router.delete('/:id', authenticateToken, deleteRecipe);
router.post('/:id/like', authenticateToken, likeRecipe);

export default router;
