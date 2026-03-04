import express from 'express';
import { createReservation, getReservations, updateReservationStatus } from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createReservation).get(protect, admin, getReservations);
router.route('/:id/status').put(protect, admin, updateReservationStatus);

export default router;
