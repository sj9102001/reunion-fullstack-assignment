const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    completedAt: {
        type: Date,
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "finished"],
        default: "pending",
    },
});

module.exports = mongoose.model("Task", taskSchema);