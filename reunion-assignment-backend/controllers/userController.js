const User = require("../models/userModel"); // Import the User model
const jwt = require("jsonwebtoken"); // Import JSON Web Token library

// Function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Generate a token with user ID and 7 days expiry
};

// Sign Up (Register a new user)
const signup = async (req, res) => {

};

// Sign In (Log in an existing user)
const signin = async (req, res) => {

};

module.exports = { signup, signin }; // Export signup and signin functions