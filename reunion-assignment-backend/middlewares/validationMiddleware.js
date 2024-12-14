const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const missingFields = errors.array().map((error) => ({
            field: error.param,
            message: error.msg,
        }));

        return res.status(400).json({
            message: "Validation failed: Missing or invalid fields.",
            errors: missingFields,
        });
    }
    next();
};

module.exports = validate;