const express = require("express");
const { signup, signin } = require("../controllers/userController");
const validate = require("../middleware/validate");
const { check } = require("express-validator");

const router = express.Router();

// POST /api/users/signup - Register a new user
router.post(
    "/signup",
    [
        check("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Invalid email format."),
        check("password").notEmpty().withMessage("Password is required.").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    ],
    validate,
    signup
);

// POST /api/users/signin - Log in an existing user
router.post(
    "/signin",
    [
        check("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Invalid email format."),
        check("password").notEmpty().withMessage("Password is required."),
    ],
    validate,
    signin
);

module.exports = router;