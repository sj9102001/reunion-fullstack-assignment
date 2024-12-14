"use client"

import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Task } from "@/lib/types"
import { useEffect, useState } from "react"

interface EditTaskDialogProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, updatedTask: Partial<Task>) => void;
}

export function EditTaskDialog({ task, isOpen, onClose, onUpdate }: EditTaskDialogProps) {
    const [minDate, setMinDate] = useState<Date>(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setMinDate(new Date())
        }, 60000)
        return () => clearInterval(interval)
    }, [])
    const { control, handleSubmit } = useForm<Task>({
        defaultValues: {
            title: task.title,
            startTime: new Date(task.startTime),
            endTime: new Date(task.endTime),
            priority: task.priority,
            status: task.status,
        },
    })

    const onSubmit = (data: Task) => {
        onUpdate(task._id, data);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Title is required" }}
                            render={({ field }) => (
                                <Input id="title" {...field} />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Controller
                            name="startTime"
                            control={control}
                            rules={{ required: "Start time is required" }}
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    minDate={minDate}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Controller
                            name="endTime"
                            control={control}
                            rules={{ required: "End time is required" }}
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Controller
                            name="priority"
                            control={control}
                            rules={{ required: "Priority is required" }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 - Highest</SelectItem>
                                        <SelectItem value="2">2 - High</SelectItem>
                                        <SelectItem value="3">3 - Medium</SelectItem>
                                        <SelectItem value="4">4 - Low</SelectItem>
                                        <SelectItem value="5">5 - Lowest</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="finished">Finished</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}