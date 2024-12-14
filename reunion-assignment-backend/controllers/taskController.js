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

// Update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime, priority, status } = req.body;

        // Create an object with the fields that are present in the request body
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (startTime !== undefined) updateFields.startTime = new Date(startTime);
        if (endTime !== undefined) updateFields.endTime = new Date(endTime);
        if (priority !== undefined) updateFields.priority = priority;
        if (status !== undefined) {
            updateFields.status = status;
            if (status === "finished") {
                updateFields.completedAt = new Date(); // Set completedAt to the current date
            } else if (status === "pending") {
                updateFields.completedAt = null; // Reset completedAt if reverted to pending
            }
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updateFields,
            { new: true, runValidators: true }
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
                    _id: "$priority",
                    total: { $sum: 1 },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
                        },
                    },
                    finished: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "finished"] }, 1, 0],
                        },
                    },
                    totalElapsedTime: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "finished"] },
                                { $subtract: ["$completedAt", "$startTime"] },
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const formattedStats = stats.map((item) => ({
            priority: item._id,
            total: item.total,
            pending: item.pending,
            finished: item.finished,
            averageCompletionTime: item.finished > 0
                ? item.totalElapsedTime / (item.finished * 3600000)
                : 0, // Convert milliseconds to hours
        }));

        const totalTasks = stats.reduce((sum, item) => sum + item.total, 0);
        const completedTasks = stats.reduce((sum, item) => sum + item.finished, 0);
        const pendingTasks = stats.reduce((sum, item) => sum + item.pending, 0);

        const overallElapsedTime = stats.reduce((sum, item) => sum + item.totalElapsedTime, 0);
        const overallAverageCompletionTime = completedTasks > 0
            ? overallElapsedTime / (completedTasks * 3600000)
            : 0;

        res.status(200).json({
            message: "Statistics retrieved successfully.",
            stats: formattedStats,
            totalTasks,
            completedTasks,
            pendingTasks,
            completedPercentage: totalTasks > 0
                ? (completedTasks / totalTasks) * 100
                : 0,
            overallAverageCompletionTime,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve statistics.", error: error.message });
    }
};

// Delete a specific task
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        // Find and delete the task for the logged-in user
        const task = await Task.findOneAndDelete({ _id: taskId, user: req.user._id });

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