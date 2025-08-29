import { Schema, model, InferSchemaType } from 'mongoose';

const SwipeSchema = new Schema({
  userId: { type: String, required: true },
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  // Change 'join' to 'dislike'
  action: { type: String, enum: ['like', 'dislike'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export type SwipeType = InferSchemaType<typeof SwipeSchema> & { _id: string };
export default model<SwipeType>('Swipe', SwipeSchema);