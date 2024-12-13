const express = require("express");
const {
    createTask,
    getTasks,
    updateTask,
    getStats,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/tasks - Create a new task (Protected route)
router.post("/", protect, createTask);

// GET /api/tasks - Retrieve tasks with optional filtering and sorting (Protected route)
router.get("/", protect, getTasks);

// PUT /api/tasks/:id - Update a specific task (Protected route)
router.put("/:id", protect, updateTask);

// GET /api/tasks/stats - Get task statistics (Protected route)
router.get("/stats", protect, getStats);

module.exports = router;