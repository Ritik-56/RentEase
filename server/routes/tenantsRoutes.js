import express from 'express';
import acceptTenant from '../controllers/tenantController.js'

const router = express.Router();


router.patch('/:tenantId/accept', acceptTenant);

router.post('/tenants',getTenants);