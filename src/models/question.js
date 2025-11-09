import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Question body is required'],
      trim: true,
    },
    code: {
      type: String, // optional code snippet (frontend can syntax-highlight it)
      default: '',
    },
    tags: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one tag is required',
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    answersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
