import { Schema, model, InferSchemaType } from 'mongoose';

const CardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  location: { type: String, default: 'Bangalore' },
  category: { type: String, enum: ['brewery', 'restaurant', 'event', 'activity', 'other'], default: 'event' },
  eventDate: { type: Date },
  likedCount: { type: Number, default: 0 },
  // UPDATED: Replaced 'joinedCount' with 'dislikedCount'
  dislikedCount: { type: Number, default: 0 },
  ownerId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export type CardType = InferSchemaType<typeof CardSchema> & { _id: string };
export default model<CardType>('Card', CardSchema);