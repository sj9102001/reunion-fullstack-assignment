import { Task } from "./types";

export const getTasks = async (): Promise<Task[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        cache: "no-store", // Ensure fresh data on every request
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch tasks");
    }
    const data = await res.json();
    return data.tasks;
};

export const updateTask = async (taskId: string, newStatus: "pending" | "finished"): Promise<Task> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
        throw new Error("Failed to update task");
    }

    return res.json();
};

export const deleteTask = async (taskId: string): Promise<Task> => {
    console.log(taskId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error("Failed to delete task");
    }

    return res.json();
};