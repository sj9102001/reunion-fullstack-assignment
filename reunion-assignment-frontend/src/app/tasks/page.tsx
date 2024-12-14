"use client";

import { useState, useEffect } from "react";
import { getTasks, updateTask } from "@/lib/api";
import { Task } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/modals/AddTaskDialog";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("startTime");

    useEffect(() => {
        const fetchData = async () => {
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks.tasks);
        };

        fetchData();
    }, []);
    const filteredTasks = tasks.filter((task) => priorityFilter === "all" || task.priority.toString() === priorityFilter).filter((task) => statusFilter === "all" || task.status === statusFilter).sort((a, b) => {
        if (sortBy === "startTime") {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        }
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    });

    const handleStatusChange = async (taskId: string, newStatus: "pending" | "finished") => {
        try {
            const updatedTask = await updateTask(taskId, newStatus);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <AddTaskDialog />
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
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                            <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleStatusChange(task.id.toString(), task.status === "pending" ? "finished" : "pending")
                                    }
                                >
                                    {task.status === "pending" ? "Complete" : "Revert"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}