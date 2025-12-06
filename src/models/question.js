import mongoose, { Schema } from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    code: { type: String },
    tags: [{ type: String, required: true, trim: true }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);


questionSchema.virtual('answers', {
  ref: 'Answer',
  localField: "_id",
  foreignField: 'questionId',
});

questionSchema.set("toObject", { virtuals: true });
questionSchema.set("toJSON", { virtuals: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;
