import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' }, // SVG string or data URI
    reputation: { type: Number, default: 0 },
    stats: {
      questions: { type: Number, default: 0 },
      answers: { type: Number, default: 0 },
      accepted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
