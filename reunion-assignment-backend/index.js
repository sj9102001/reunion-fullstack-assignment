require("dotenv").config(); // Load environment variables from a .env file
const express = require("express"); // Import Express to create the application
const taskRoutes = require("./routes/taskRoutes"); // Import task routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express(); // Create an Express application

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

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