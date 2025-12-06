import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
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

// Virtual: User -> Questions
userSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "user",
});


// User -> gives many Answers
userSchema.virtual("answer", {
  ref: "Answer",
  localField: "_id",
  foreignField: "user",
});


userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
