const express = require("express");
const router = express.Router();

// Basic route for testing
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
