import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      unique: true, // prevent duplicates
      trim: true,
      lowercase: true, // consistency
    },

    slug: {
      type: String,
      required: true,
      unique: true, // for URLs
    },

    description: {
      type: String,
      default: '',
    },

    usageCount: {
      type: Number,
      default: 0, // track popularity
    },
  },
  { timestamps: true },
);

const Tags = mongoose.model('Tags', tagSchema);
export default Tags;
