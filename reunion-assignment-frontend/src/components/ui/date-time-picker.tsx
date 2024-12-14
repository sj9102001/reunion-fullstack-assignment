"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Calendar1 } from "lucide-react"

interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(value)

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            const newDateTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                selectedDateTime ? selectedDateTime.getHours() : 0,
                selectedDateTime ? selectedDateTime.getMinutes() : 0
            )
            setSelectedDateTime(newDateTime)
            onChange?.(newDateTime)
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number)
        if (selectedDateTime) {
            const newDateTime = new Date(selectedDateTime)
            newDateTime.setHours(hours)
            newDateTime.setMinutes(minutes)
            setSelectedDateTime(newDateTime)
            onChange?.(newDateTime)
        }
    }

    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDateTime && "text-muted-foreground"
                    )}
                >
                    <Calendar1 className="mr-2 h-4 w-4" />
                    {selectedDateTime ? format(selectedDateTime, "PPP HH:mm") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDateTime}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="p-3 border-t">
                    <Input
                        type="time"
                        onChange={handleTimeChange}
                        value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}