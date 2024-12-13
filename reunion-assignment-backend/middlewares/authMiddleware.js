const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to protect routes by verifying JWT tokens
const protect = async (req, res, next) => {
    try {
        // Check for the token in the cookies
        console.log("REQ COOKIES", req.cookies);
        const token = req.cookies.token;
        console.log("TOKEN", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token missing." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token." });
        }

        // Find the user based on the token's payload
        const user = await User.findById(decoded.id).select("-password"); // Exclude password for security

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found." });
        }

        // Attach user data to the request object
        req.user = user;
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("Authorization error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired." });
        }
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

module.exports = protect;