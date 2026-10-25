import express from 'express';
import settingsController from '../controllers/settingsController.js';

const settingsRouter = express.Router();

// GET current settings (waterCharge etc.)
settingsRouter.get('/settings', settingsController.getSettings);

// PATCH update water charge (admin only)
settingsRouter.patch('/settings/water-charge', settingsController.updateWaterCharge);

export default settingsRouter;
