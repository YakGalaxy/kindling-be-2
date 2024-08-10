// Import Required Modules
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

// Load environment variables from .env file
dotenv.config();

// Initialize Express Application
const app = express();

// Define Constants
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

// Middleware and Configuration
module.exports = (app) => {
  // Because this is a server that will accept requests from outside and it will be hosted on a server with a `proxy`, express needs to know that it should trust that setting.
  // Services like Heroku use something called a proxy and you need to add this to your server
  app.set("trust proxy", 1);

  // Controls a very specific header to pass headers from the frontend
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
