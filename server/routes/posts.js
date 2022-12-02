import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost
} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

/* READ */
// posts for the 'timeline'
router.get('/', verifyToken, getFeedPosts);

// get users' individual posts for their profile
router.get('/:userId/posts', verifyToken, getUserPosts);


/* UPDATE */
router.patch('/:id/like', verifyToken, likePost);

export default router;