require("dotenv").config(); // Load environment variables from a .env file
const express = require("express"); // Import Express to create the application
const taskRoutes = require("./routes/taskRoutes"); // Import task routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express(); // Create an Express application
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        credentials: true, // Allow credentials (e.g., cookies)
    })
);

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Incoming Cookies:", req.cookies);
    console.log("Incoming Headers:", req.headers);
    next();
});

// Mount routes
app.use("/tasks", taskRoutes); // All task-related endpoints
app.use("/users", userRoutes); // All user-related endpoints

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Ensures compatibility with the latest MongoDB driver
    useUnifiedTopology: true, // Uses the new server discovery and monitoring engine
})
    .then(() => {
        // Start the server
        const PORT = process.env.PORT || 8080; // Use the port from environment variables or default to 5000
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log that the server is running
    })
    .catch(error => console.log(error));