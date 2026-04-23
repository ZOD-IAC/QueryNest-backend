import mongoose from "mongoose";
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Question body is required"],
      trim: true,
    },
    code: {
      type: String, // optional code snippet (frontend can syntax-highlight it)
      default: "",
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0, min: 0 },
    answersCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const questionVoteSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Qeustion" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  voteType: { type: Number, required: true },
});

questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "questionId",
});

questionSchema.set("toObject", { virtuals: true });
questionSchema.set("toJSON", { virtuals: true });

export const Question = mongoose.model("Question", questionSchema);
export const QuestionVote = mongoose.model("QuestionVote", questionVoteSchema);
