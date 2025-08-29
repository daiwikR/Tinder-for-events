import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db';

import cardsRoute from './routes/cards';
import swipeRoute from './routes/swipe';
import profileRoute from './routes/profile';
import eventsRoute from './routes/events';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin, credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/cards', cardsRoute);
app.use('/api/swipe', swipeRoute);
app.use('/api/profile', profileRoute);
app.use('/api/events', eventsRoute);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  // Try DB connect in the background; don’t block the server
  connectDB().catch(() => {
    console.error('[DB] Will keep retrying on next requests.');
  });
});
