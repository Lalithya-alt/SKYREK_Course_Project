import Feedback from '../models/Feedback.js';

// POST /api/feedback — Submit new feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, rating, category, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.',
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      subject,
      rating: rating || null,
      category: category || 'General',
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted successfully.',
      data: feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// GET /api/feedback — Get all feedback (admin use)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};
