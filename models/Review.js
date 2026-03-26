import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    googleId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 80 },
    image: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, required: true },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 600,
    },
  },
  { timestamps: true },
);

// One review per user per 7 days — enforced at API, but index for fast lookup
ReviewSchema.index({ googleId: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
