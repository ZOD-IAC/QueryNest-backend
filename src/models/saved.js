import mongoose, { Schema } from 'mongoose';

const Saved = new Schema({
  saveType: { type: String, enum: ['answer', 'question'] },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});
