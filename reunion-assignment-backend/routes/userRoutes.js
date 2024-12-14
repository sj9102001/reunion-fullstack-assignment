const express = require("express");
const { signup, signin, logout, verifyAuth } = require("../controllers/userController");
const validate = require("../middlewares/validationMiddleware");
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

router.post("/logout", logout);

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

router.get("/verify", verifyAuth);

module.exports = router;