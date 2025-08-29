import { Schema, model, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  uid: { type: String, unique: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export type UserType = InferSchemaType<typeof UserSchema> & { _id: string };
export default model<UserType>('User', UserSchema);
