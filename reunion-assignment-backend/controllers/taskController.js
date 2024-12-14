const Task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, startTime, endTime, priority } = req.body;

        const newTask = new Task({
            user: req.user._id, // Assign the task to the logged-in user
            title,
            startTime,
            endTime,
            priority,
        });

        const savedTask = await newTask.save();
        res.status(201).json({ message: "Task created successfully.", task: savedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create task.", error: error.message });
    }
};

// Retrieve tasks with filtering and sorting
const getTasks = async (req, res) => {
    try {
        console.log("HERE");
        const { status, priority, sortBy = "startTime", order = "asc" } = req.query;

        const filter = { user: req.user._id };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        const tasks = await Task.find(filter).sort(sortOptions);
        res.status(200).json({ message: "Tasks retrieved successfully.", tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve tasks.", error: error.message });
    }
};

// Update a task's status
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({ message: "Task updated successfully.", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task.", error: error.message });
    }
};

// Get dashboard statistics
const getStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Task.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const formattedStats = stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.status(200).json({ message: "Statistics retrieved successfully.", stats: formattedStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve statistics.", error: error.message });
    }
};
// Delete a specific task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the task for the logged-in user
        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: "Task not found or does not belong to the user." });
        }

        res.status(200).json({ message: "Task deleted successfully.", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete task.", error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, getStats, deleteTask };