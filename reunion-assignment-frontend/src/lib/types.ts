export interface Task {
    _id: string
    title: string
    startTime: Date
    endTime: Date
    priority: 1 | 2 | 3 | 4 | 5
    status: 'pending' | 'finished'
    completedAt: Date | null | undefined
}