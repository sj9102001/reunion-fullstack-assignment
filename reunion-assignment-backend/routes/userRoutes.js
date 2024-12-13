const express = require("express");
const { signup, signin } = require("../controllers/userController");

const router = express.Router();

// POST /api/users/signup - Register a new user
router.post("/signup", signup);

// POST /api/users/signin - Log in an existing user
router.post("/signin", signin);

module.exports = router;