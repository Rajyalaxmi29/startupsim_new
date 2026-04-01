import express from 'express';
import * as communityController from '../../controllers/community/communityController.ts';

const router = express.Router();

router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.get('/posts/:id/comments', communityController.getComments);
router.post('/comments', communityController.createComment);

export default router;
