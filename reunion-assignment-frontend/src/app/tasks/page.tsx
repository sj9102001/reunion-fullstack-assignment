"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTasks, updateTask } from "@/lib/data"
import { Task } from "@/lib/types"

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("startTime")

    // Fetch tasks after the component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            const fetchedTasks = await getTasks()
            setTasks(fetchedTasks)
        }
        fetchTasks()
    }, [])

    const filteredTasks = tasks
        .filter(task => priorityFilter === "all" || task.priority.toString() === priorityFilter)
        .filter(task => statusFilter === "all" || task.status === statusFilter)
        .sort((a, b) => {
            if (sortBy === "startTime") {
                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            } else {
                return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
            }
        })

    const handleStatusChange = (taskId: number, newStatus: 'pending' | 'finished') => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const updatedTask = { ...task, status: newStatus }
                if (newStatus === 'finished') {
                    updatedTask.endTime = new Date().toISOString()
                }
                updateTask(updatedTask)
                return updatedTask
            }
            return task
        })
        setTasks(updatedTasks)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Tasks</h1>
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <Label htmlFor="priority-filter">Filter by Priority</Label>
                    <Select onValueChange={setPriorityFilter} defaultValue="all">
                        <SelectTrigger id="priority-filter">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {[1, 2, 3, 4, 5].map(priority => (
                                <SelectItem key={priority} value={priority.toString()}>{priority}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="status-filter">Filter by Status</Label>
                    <Select onValueChange={setStatusFilter} defaultValue="all">
                        <SelectTrigger id="status-filter">
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
                    <Label htmlFor="sort-by">Sort by</Label>
                    <Select onValueChange={setSortBy} defaultValue="startTime">
                        <SelectTrigger id="sort-by">
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
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTasks.map(task => (
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                            <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange(task.id, task.status === 'pending' ? 'finished' : 'pending')}
                                >
                                    {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}