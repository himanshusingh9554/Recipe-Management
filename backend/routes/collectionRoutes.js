
import express from 'express';
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection
} from '../controllers/collectionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/',createCollection);
router.get('/', getCollections);
router.get('/:id',getCollectionById);
router.put('/:id',updateCollection);
router.delete('/:id',deleteCollection);

router.post('/:id/recipes/:recipeId',authenticateToken,addRecipeToCollection);
router.delete('/:id/recipes/:recipeId',removeRecipeFromCollection);

export default router;
