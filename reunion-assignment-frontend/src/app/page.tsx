"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getTasks } from "@/lib/data"

export default function DashboardPage() {
  const tasks = getTasks()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'finished').length
  const pendingTasks = totalTasks - completedTasks
  const completedPercentage = (completedTasks / totalTasks) * 100

  const calculateTimeStats = () => {
    const now = new Date()
    const stats = { 1: { elapsed: 0, remaining: 0 }, 2: { elapsed: 0, remaining: 0 }, 3: { elapsed: 0, remaining: 0 }, 4: { elapsed: 0, remaining: 0 }, 5: { elapsed: 0, remaining: 0 } }
    let totalActualTime = 0
    let completedCount = 0

    tasks.forEach(task => {
      const start = new Date(task.startTime)
      const end = new Date(task.endTime)

      if (task.status === 'pending') {
        stats[task.priority].elapsed += (now.getTime() - start.getTime()) / 3600000 // Convert to hours
        stats[task.priority].remaining += (end.getTime() - now.getTime()) / 3600000 // Convert to hours
      } else {
        totalActualTime += (end.getTime() - start.getTime()) / 3600000 // Convert to hours
        completedCount++
      }
    })

    const averageCompletionTime = completedCount > 0 ? totalActualTime / completedCount : 0

    return { stats, averageCompletionTime }
  }

  const { stats, averageCompletionTime } = calculateTimeStats()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completedPercentage} className="mb-2" />
            <div className="text-xs text-muted-foreground">
              {completedTasks} completed, {pendingTasks} pending
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Stats by Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats).map(([priority, { elapsed, remaining }]) => (
              <div key={priority} className="flex justify-between text-xs">
                <span>Priority {priority}:</span>
                <span>{elapsed.toFixed(2)}h elapsed, {remaining.toFixed(2)}h remaining</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionTime.toFixed(2)}h</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}