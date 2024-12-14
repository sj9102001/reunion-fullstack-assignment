require("dotenv").config(); // Load environment variables from a .env file
const express = require("express"); // Import Express to create the application
const taskRoutes = require("./routes/taskRoutes"); // Import task routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
const cookieParser = require("cookie-parser");

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

// Mount routes
app.use("/api/tasks", taskRoutes); // All task-related endpoints
app.use("/api/users", userRoutes); // All user-related endpoints

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Ensures compatibility with the latest MongoDB driver
    useUnifiedTopology: true, // Uses the new server discovery and monitoring engine
})
    .then(() => {
        // Start the server
        const PORT = process.env.PORT || 5000; // Use the port from environment variables or default to 5000
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log that the server is running
    })
    .catch(error => console.log(error));