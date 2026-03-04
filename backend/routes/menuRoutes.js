import express from 'express';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getMenus).post(protect, admin, createMenu);
router.route('/:id').put(protect, admin, updateMenu).delete(protect, admin, deleteMenu);

export default router;
