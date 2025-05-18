import express from 'express';
import { getAllUsers, deleteUser, getAllRecipesAdmin, deleteRecipeAdmin,getUserRecipesAdmin,banUser,unbanUser } from '../controllers/adminController.js';
import { authenticateToken , isAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticateToken, isAdmin,getAllUsers);
router.delete('/users/:id', authenticateToken,isAdmin, deleteUser);
router.get('/users/:id/recipes', authenticateToken, isAdmin, getUserRecipesAdmin);
router.get('/recipes', authenticateToken,isAdmin, getAllRecipesAdmin);
router.post('/users/:id/ban',   authenticateToken, isAdmin, banUser);
router.post('/users/:id/unban', authenticateToken, isAdmin, unbanUser);
router.delete('/recipes/:id', authenticateToken,isAdmin, deleteRecipeAdmin);

export default router;
