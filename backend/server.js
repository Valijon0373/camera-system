import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'UrSPI Smart Camera System API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start Server after initializing database
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  UrSPI Camera System Backend Server is running!`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  API Endpoint: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
