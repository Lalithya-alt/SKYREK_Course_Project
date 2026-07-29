import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// Public route — anyone can submit feedback
feedbackRouter.post('/', submitFeedback);

// Admin/internal route — view all submitted feedback
feedbackRouter.get('/', getAllFeedback);

export default feedbackRouter;
