import express from 'express';
import tenantController from '../controllers/tenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const tenantrouter = express.Router();
 
// GET all tenants (with user info + status)
tenantrouter.get('/tenants',authMiddleware,tenantController.getTenants);

// PATCH to accept a pending tenant
tenantrouter.patch('/tenants/:tenantId/accept', tenantController.acceptTenant);

export default tenantrouter;