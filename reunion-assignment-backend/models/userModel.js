const mongoose = require("mongoose"); // Import Mongoose to define a schema

// Define the schema for users
const userSchema = new mongoose.Schema({
    email: {
        type: String, // Email must be a string
        required: true, // Email is required
        unique: true, // Ensures no duplicate emails
    },
    password: {
        type: String, // Password must be a string
        required: true, // Password is required
    },
});

module.exports = mongoose.model("User", userSchema); // Export the User model