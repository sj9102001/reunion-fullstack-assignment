export interface Task {
    id: string; // _id from MongoDB (converted to string in API response)
    user: string; // User ID (referenced from User model)
    title: string; // Title of the task
    startTime: string; // ISO8601 string for the start time
    endTime: string; // ISO8601 string for the end time
    priority: number; // Priority of the task (1 to 5)
    status: "pending" | "finished"; // Status of the task
}