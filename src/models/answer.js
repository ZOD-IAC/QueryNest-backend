import mongoose, { Schema } from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    body: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;
