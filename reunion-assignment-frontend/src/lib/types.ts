export interface Task {
    id: number
    title: string
    startTime: string
    endTime: string
    priority: 1 | 2 | 3 | 4 | 5
    status: 'pending' | 'finished'
}