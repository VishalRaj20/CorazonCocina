import express from 'express';
import { getReviews, getAllReviews, createReview, approveReview, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getReviews).post(createReview);
router.route('/all').get(protect, admin, getAllReviews);
router.route('/:id/approve').put(protect, admin, approveReview);
router.route('/:id').delete(protect, admin, deleteReview);

export default router;
