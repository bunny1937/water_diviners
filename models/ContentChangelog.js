import mongoose from "mongoose";

const ChangelogSchema = new mongoose.Schema({
  section: String,
  key: String,
  oldValue: String,
  newValue: String,
  changedBy: String, // admin email
  changedAt: { type: Date, default: Date.now, expires: 2592000 }, // TTL: 30 days auto-delete
});

export default mongoose.models.ContentChangelog ||
  mongoose.model("ContentChangelog", ChangelogSchema);
