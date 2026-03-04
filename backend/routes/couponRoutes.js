import express from 'express';
import { getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.post('/validate', validateCoupon);

router.route('/:id')
    .delete(protect, admin, deleteCoupon);

router.route('/:id/status')
    .put(protect, admin, toggleCouponStatus);

export default router;
