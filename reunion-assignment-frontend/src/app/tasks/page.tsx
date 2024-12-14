/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { deleteTask, getTasks } from "@/lib/api";
import { Task } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/modals/AddTaskDialog";
import { EditTaskDialog } from "@/components/modals/EditTaskDialog";
import { toast } from "@/hooks/use-toast";
import { Edit2Icon, Trash2Icon } from 'lucide-react';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("startTime");
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks);
        };
        fetchData();
    }, []);

    const handleDelete = async (taskId: string) => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteTask(taskId);
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredTasks = tasks.filter((task) => priorityFilter === "all" || task.priority.toString() === priorityFilter).filter((task) => statusFilter === "all" || task.status === statusFilter).sort((a, b) => {
        if (sortBy === "startTime") {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        }
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    });

    const updateTask = async (taskId: string, updatedTask: Partial<Task>): Promise<Task> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedTask),
            });

            if (!res.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTaskData = await res.json();
            // Update the tasks state
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? updatedTaskData.task : task))
            );

            toast({
                title: "Task updated successfully",
                variant: "default",
            });

            return updatedTaskData;
        } catch (error) {
            console.error("Failed to update task:", error);
            toast({
                title: "Failed to update task",
                variant: "destructive",
            });
            throw error;
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: "pending" | "finished") => {
        try {
            const updatedTask: Partial<Task> = { status: newStatus };

            // Add the completedAt field when marking as finished
            if (newStatus === "finished") {
                updatedTask.completedAt = new Date(); // Set the current date
            }

            await updateTask(taskId, updatedTask);
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const addTaskHandler = async (newTask: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newTask.title,
                    startTime: newTask.startTime.toISOString(),
                    endTime: newTask.endTime.toISOString(),
                    priority: newTask.priority,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to add task");
            }

            const createdTask = await response.json();
            console.log(createdTask);
            setTasks((prevTasks) => [...prevTasks, createdTask.task]);
            toast({
                title: "Task added successfully",
                variant: "default"
            })
        } catch (error) {
            toast({
                title: "Failed to add task",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <AddTaskDialog onAddTask={addTaskHandler} />
            </div>
            <div className="mb-6 flex flex-wrap gap-4">
                <div>
                    <Label>Priority</Label>
                    <Select onValueChange={setPriorityFilter} defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {[1, 2, 3, 4, 5].map((p) => (
                                <SelectItem key={p} value={p.toString()}>
                                    Priority {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Status</Label>
                    <Select onValueChange={setStatusFilter} defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="finished">Finished</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Sort By</Label>
                    <Select onValueChange={setSortBy} defaultValue="startTime">
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="startTime">Start Time</SelectItem>
                            <SelectItem value="endTime">End Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTasks.map((task) => (
                        <TableRow key={task._id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                            <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell className="flex items-center justify-start space-x-1">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleStatusChange(task._id, task.status === "pending" ? "finished" : "pending")
                                    }
                                >
                                    {task.status === "pending" ? "Complete" : "Revert"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingTask(task)}
                                >
                                    <Edit2Icon />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDelete(task._id)}
                                >
                                    <Trash2Icon className="text-red-700" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingTask && (
                <EditTaskDialog
                    task={editingTask}
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={updateTask}
                />
            )}
        </div>
    );
}