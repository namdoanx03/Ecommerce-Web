import { Router } from 'express';
import auth from '../middleware/auth.js';
import { submitReviewController, checkReviewController } from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.post('/submit', auth, submitReviewController);
reviewRouter.get('/check', auth, checkReviewController);

export default reviewRouter;


