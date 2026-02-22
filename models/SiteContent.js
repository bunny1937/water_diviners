import "server-only";
import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      enum: ["h1", "h2", "h3", "h4", "p", "span", "img", "a"],
      required: true,
    },
    value: { type: String, required: true },
    label: String,
  },
  { timestamps: true },
);

SiteContentSchema.index({ section: 1, key: 1 }, { unique: true });

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);
