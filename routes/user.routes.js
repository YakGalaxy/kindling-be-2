const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware"); // Import JWT middleware

// CREATE a new user (public route)
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all users (protected route)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ a specific user (protected route)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a user (protected route)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a user (protected route)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
