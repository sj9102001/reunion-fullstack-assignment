const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to protect routes by verifying JWT tokens
const protect = async (req, res, next) => {

};

module.exports = protect;