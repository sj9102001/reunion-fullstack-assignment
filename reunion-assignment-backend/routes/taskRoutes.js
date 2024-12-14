const express = require("express");
const {
    createTask,
    getTasks,
    updateTask,
    getStats,
    deleteTask
} = require("../controllers/taskController");
const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();

// POST /api/tasks - Create a new task (Protected route)
router.post(
    "/",
    protect,
    [
        check("title").notEmpty().withMessage("Title is required."),
        check("startTime").notEmpty().withMessage("Start time is required.").isISO8601().withMessage("Start time must be a valid ISO8601 date."),
        check("endTime").notEmpty().withMessage("End time is required.").isISO8601().withMessage("End time must be a valid ISO8601 date."),
        check("priority").notEmpty().withMessage("Priority is required.").isInt({ min: 1, max: 5 }).withMessage("Priority must be between 1 and 5."),
    ],
    validate,
    createTask
);

// GET /api/tasks - Retrieve tasks with optional filtering and sorting (Protected route)
router.get("/", protect, getTasks);

// PUT /api/tasks/:id - Update a specific task (Protected route)
router.put(
    "/:id",
    protect,
    [
        check("status").notEmpty().withMessage("Status is required.").isIn(["pending", "finished"]).withMessage("Status must be 'pending' or 'finished'."),
    ],
    validate,
    updateTask
);

// GET /api/tasks/stats - Get task statistics (Protected route)
router.get("/stats", protect, getStats);

// DELETE /api/tasks/:id - Delete a specific task (Protected route)
router.delete("/:id", protect, deleteTask);

module.exports = router;