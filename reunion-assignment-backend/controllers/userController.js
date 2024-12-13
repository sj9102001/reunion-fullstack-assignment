const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// controllers/authController.js
const logout = (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" },);
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Sign Up (Register a new user)
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Generate a JWT token
        const token = generateToken(savedUser._id);

        // Set the token in an HTTP-only secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "none"
        });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register user.", error: error.message });
    }
};

// Sign In (Log in an existing user)
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = generateToken(user._id);

        // Set the token in an HTTP-only secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "User logged in successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to log in user.", error: error.message });
    }
};

const verifyAuth = async (req, res) => {
    try {
        // Retrieve the token from the HTTP-only cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token." });
        }

        // If the token is valid, respond with success
        res.status(200).json({ message: "Authorized", userId: decoded.id });
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired." });
        }
        res.status(401).json({ message: "Unauthorized: Authentication failed." });
    }
};

module.exports = { signup, signin, logout, verifyAuth };