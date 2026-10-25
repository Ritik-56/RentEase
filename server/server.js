import express from 'express'
import dotenv from 'dotenv'
import router from './routes/authRoutes.js'
import tenantrouter from './routes/tenantsRoutes.js'
import meterRouter from './routes/meterRoutes.js'
import settingsRouter from './routes/settingsRoutes.js'
import cors from 'cors'
import connectDB from './config/db.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', router);
app.use('/api', tenantrouter);
app.use('/api', meterRouter);
app.use('/api', settingsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})