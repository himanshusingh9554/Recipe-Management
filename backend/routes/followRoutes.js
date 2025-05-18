import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers
} from '../controllers/followController.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/follow/:userId',   followUser);
router.delete('/follow/:userId', unfollowUser);
router.get('/following',         getFollowing);
router.get('/followers/:userId', getFollowers);

export default router;
