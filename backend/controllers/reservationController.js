import Reservation from '../models/Reservation.js';

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public
export const createReservation = async (req, res) => {
    try {
        const { name, phone, email, guests, date, time, specialRequest } = req.body;

        const reservation = new Reservation({
            name,
            phone,
            email,
            guests,
            date,
            time,
            specialRequest
        });

        const createdReservation = await reservation.save();
        res.status(201).json(createdReservation);
    } catch (error) {
        res.status(400).json({ message: 'Invalid reservation data' });
    }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({}).sort({ createdAt: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);

        if (reservation) {
            reservation.status = status;
            const updatedReservation = await reservation.save();
            res.json(updatedReservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};
