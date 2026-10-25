import express from 'express';
import meterController from '../controllers/meterController.js';

const meterRouter = express.Router();

// GET all meters with tenant info
meterRouter.get('/meters', meterController.getMeters);

// GET meter for a specific user (tenant home page) — must be before /:meterId
meterRouter.get('/meters/user/:userId', meterController.getMeterByUserId);

// POST create a new meter
meterRouter.post('/meters', meterController.addMeter);

// PATCH update current reading of a meter
meterRouter.patch('/meters/:meterId', meterController.updateMeterReading);

export default meterRouter;
