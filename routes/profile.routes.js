const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const mongoose = require("mongoose"); // Import mongoose
const bcrypt = require('bcryptjs'); //
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET a profile by ID (protected route)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    console.log("Fetching profile with ID:", req.params.id); // Debug log

    // Ensure that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid profile ID format" });
    }

    const profile = await Profile.findById(req.params.id)
      .populate("user", "username email") // Populate the username and email from the User model
      .lean();
    console.log("Fetched profile:", profile); // Debug log

    if (!profile) {
      console.log("Profile not found - Back End"); // Debug log
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err.message); // Debug log
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a profile (protected route)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    // Log the incoming request data
    console.log("Received request to update profile with ID:", req.params.id);
    console.log("Request body:", req.body);

    const { username, email, password, bio, preferences } = req.body;

    // Fetch the profile and log the result
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      console.log("Profile not found with ID:", req.params.id);
      return res.status(404).json({ error: "Profile not found" });
    }
    console.log("Fetched profile:", profile);

    // Handle updates to the User model and log each step
    if (username || email || password) {
      const user = await User.findById(profile.user);
      if (!user) {
        console.log("User not found for profile with ID:", req.params.id);
        return res.status(404).json({ error: "User not found" });
      }

      if (username) {
        console.log("Updating username to:", username);
        user.username = username;
      }

      if (email) {
        console.log("Updating email to:", email);
        user.email = email;
      }

      // Only update password if it's provided
      if (password) {
        console.log("Updating password (hashing it first)");
        user.password = await bcrypt.hash(password, 10);
      }

      // Save the updated user
      await user.save();
      console.log("User updated successfully");
    }

    // Handle updates to the Profile model and log each step
    if (bio) {
      console.log("Updating bio to:", bio);
      profile.bio = bio;
    }

    if (preferences) {
      console.log("Updating preferences to:", preferences);
      profile.preferences = preferences;
    }

    // Update the email in the Profile model if it's provided
    if (email) {
      console.log("Updating profile email to:", email);
      profile.email = email;
    }

    // Save the updated profile
    await profile.save();
    console.log("Profile updated successfully");

    // Send back the updated profile
    res.status(200).json(profile);
  } catch (err) {
    console.error("Error during profile update:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;




module.exports = router;
