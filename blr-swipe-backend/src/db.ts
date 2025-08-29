import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let connecting: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[DB] MONGODB_URI missing. API will run, but DB calls will fail.');
    return;
  }
  if (mongoose.connection.readyState >= 1) return;

  if (!connecting) {
    connecting = mongoose.connect(uri, { bufferCommands: false })
      .then((m) => {
        console.log('[DB] Connected');
        return m;
      })
      .catch((err) => {
        console.error('[DB] Connection error:', err.message);
        connecting = null; // allow retry later
        throw err;
      });
  }
  return connecting;
}
