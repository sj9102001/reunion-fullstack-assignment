/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { toast } from "@/hooks/use-toast"
import { Task } from "@/lib/types";

interface AddTaskDialogProps {
    onAddTask: (task: Task) => void;
}

type FormData = {
    title: string
    startTime: Date
    endTime: Date
    priority: 1 | 2 | 3 | 4 | 5
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [minDate, setMinDate] = useState<Date>(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setMinDate(new Date())
        }, 60000)
        return () => clearInterval(interval)
    }, [])
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            title: "",
            startTime: new Date(),
            endTime: new Date(),
            priority: 3,
        },
    })

    const onSubmit = (data: FormData) => {
        const newTask: any = {
            ...data,
            status: "pending",
            priority: data.priority
        };
        onAddTask(newTask);
        toast({
            title: "Task added",
            description: `New task "${data.title}" has been added.`,
        })
        setOpen(false)
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add New Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add New Task</DialogTitle>
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
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
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

                    <Button type="submit" className="w-full">Add Task</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}