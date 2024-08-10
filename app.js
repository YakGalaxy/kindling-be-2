// Import Required Modules
const dotenv = require("dotenv");
const express = require("express");

// Load Environment Variables
dotenv.config();

// Connect to the Database
require("./db");

// Initialize Express Application
const app = express();

// Load Configuration and Middleware
require("./config")(app);

// Define Routes
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const profileRouter = require("./routes/profile.routes");
app.use("/profiles", profileRouter);

const handoverKitRouter = require("./routes/handoverkit.routes");
app.use("/handover-kits", handoverKitRouter);

const userRouter = require("./routes/user.routes");
app.use("/users", userRouter);

// Set Up Error Handling
require("./error-handling")(app);

// Export the Application
module.exports = app;
