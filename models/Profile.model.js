const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true, unique: true }, // Ensure the email is unique
});

module.exports = mongoose.model("Profile", profileSchema);
