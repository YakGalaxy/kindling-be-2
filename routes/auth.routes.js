const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Profile = require("../models/Profile.model"); // Ensure Profile model is imported
const router = express.Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const saltRounds = 10;

// POST /auth/signup - Creates a new user and associated profile in the database
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: "Provide email, password, and username" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  const passwordRegex = /^.{3,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must have at least 3 characters.",
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Create a profile for the new user
    const createdProfile = await Profile.create({ user: createdUser._id, email: createdUser.email });

    // Update the created user with the profileId
    createdUser.profile = createdProfile._id;
    await createdUser.save();

    const { _id, email: userEmail, username: userUsername } = createdUser;
    const authToken = jwt.sign(
      { _id, email: userEmail, username: userUsername },
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "6h",
      }
    );

    res.status(201).json({ authToken, profileId: createdProfile._id });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email }).populate("profile");
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    if (passwordCorrect) {
      const { _id, email: userEmail, username } = foundUser;
      const payload = { _id, email: userEmail, username };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken, profileId: foundUser.profile._id }); // Return profileId
    } else {
      return res
        .status(401)
        .json({ message: "Unable to authenticate the user" });
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
