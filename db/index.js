// Import Required Modules
const mongoose = require("mongoose");

// Sets the MongoDB URI for our app to have access to it
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kindling-be";

// Mongoose connection
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
