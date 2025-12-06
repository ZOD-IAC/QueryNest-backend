import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowecase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    reputation: { type: Number, required: 0 },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
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
