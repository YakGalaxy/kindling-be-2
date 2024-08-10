const express = require("express");
const router = express.Router();

// Import other route modules
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const handoverKitRoutes = require("./handoverKit.routes");
const profileRoutes = require("./profile.routes");

// Use specific routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/handover-kits", handoverKitRoutes);
router.use("/profiles", profileRoutes);

// Basic route for testing
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
