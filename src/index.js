import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import './utils/reminderScheduler.js';

dotenv.config();

const app = express();

// app level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ruotes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server] failed to start:', error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();

app.get('/', (req, res) => {
  res.send('hello world');
});
