import { Task } from "./types"

let tasks: Task[] = [
    {
        id: 1,
        title: "Complete project proposal",
        startTime: "2023-04-01T09:00:00Z",
        endTime: "2023-04-01T17:00:00Z",
        priority: 3,
        status: "pending"
    },
    {
        id: 2,
        title: "Review code changes",
        startTime: "2023-04-02T10:00:00Z",
        endTime: "2023-04-02T12:00:00Z",
        priority: 2,
        status: "finished"
    },
    {
        id: 3,
        title: "Prepare presentation",
        startTime: "2023-04-03T13:00:00Z",
        endTime: "2023-04-03T16:00:00Z",
        priority: 4,
        status: "pending"
    },
    {
        id: 4,
        title: "Client meeting",
        startTime: "2023-04-04T15:00:00Z",
        endTime: "2023-04-04T16:30:00Z",
        priority: 5,
        status: "pending"
    },
    {
        id: 5,
        title: "Update documentation",
        startTime: "2023-04-05T09:00:00Z",
        endTime: "2023-04-05T11:00:00Z",
        priority: 1,
        status: "finished"
    }
]

export function getTasks(): Task[] {
    return tasks
}

export function updateTask(updatedTask: Task) {
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
}