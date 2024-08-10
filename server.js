const app = require("./app");

// Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const BACKEND_PORT = process.env.PORT || 5005;

// // Imports error handler
// const errorHandler = require("./middleware/errorHandling.middleware");
// app.use(errorHandler);

// Responsible for starting the Express server and making it listen for incoming requests on the specified port
app.listen(BACKEND_PORT, () =>
  console.log(`Server listening on port ${BACKEND_PORT}`)
);
