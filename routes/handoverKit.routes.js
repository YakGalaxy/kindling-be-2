const express = require("express");
const router = express.Router();
const HandoverKit = require("../models/HandoverKit.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// CREATE a new handover kit (protected route)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, contentItems } = req.body;

    // Validate input
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const user = req.payload._id; // Get the user ID from the token payload
    const handoverKit = new HandoverKit({
      title,
      description,
      contentItems,
      user,
    }); // Associate the handover kit with the user
    await handoverKit.save();
    res.status(201).json(handoverKit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all handover kits for a specific user (protected route)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = req.payload._id; // Get the user ID from the token payload
    const handoverKits = await HandoverKit.find({ user }).exec(); // Find handover kits for the authenticated user
    res.status(200).json(handoverKits);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ a specific handover kit (protected route) - Ensure that the user can only access their own kit
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.payload._id; // Get the user ID from the token payload
    const handoverKit = await HandoverKit.findOne({
      _id: req.params.id,
      user,
    }).exec(); // Find the kit if it belongs to the user
    if (!handoverKit) {
      return res
        .status(404)
        .json({ error: "Handover kit not found or not authorized" });
    }
    res.status(200).json(handoverKit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a handover kit (protected route) - Ensure the user can only update their own kit
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.payload._id; // Get the user ID from the token payload
    const { title, description, contentItems } = req.body;

    // Update the handover kit only if it belongs to the user
    const handoverKit = await HandoverKit.findOneAndUpdate(
      { _id: req.params.id, user }, // Update if the kit belongs to the user
      { title, description, contentItems },
      { new: true }
    ).exec();

    if (!handoverKit) {
      return res
        .status(404)
        .json({ error: "Handover kit not found or not authorized" });
    }
    res.status(200).json(handoverKit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a handover kit (protected route) - Ensure the user can only delete their own kit
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.payload._id; // Get the user ID from the token payload
    const handoverKit = await HandoverKit.findOneAndDelete({
      _id: req.params.id,
      user,
    }).exec(); // Delete if the kit belongs to the user

    if (!handoverKit) {
      return res
        .status(404)
        .json({ error: "Handover kit not found or not authorized" });
    }
    res.status(200).json({ message: "Handover kit deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
