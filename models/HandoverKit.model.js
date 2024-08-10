const mongoose = require("mongoose");

const contentItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., "title", "description", "paragraph"
    value: { type: String, required: true },
  },
  { timestamps: true }
);

const handoverKitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    contentItems: [contentItemSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added this line
  },
  { timestamps: true }
);

const HandoverKit = mongoose.model("HandoverKit", handoverKitSchema);

module.exports = HandoverKit;
