"use client";
import { getTasks } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Task } from "@/lib/types";

export default function DashboardPage() {
  // const tasks = await getTasks();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data.tasks);
    }
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "finished").length;
  const pendingTasks = totalTasks - completedTasks;
  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const calculateTimeStats = () => {
    const now = new Date();
    const stats = {
      1: { elapsed: 0, remaining: 0 },
      2: { elapsed: 0, remaining: 0 },
      3: { elapsed: 0, remaining: 0 },
      4: { elapsed: 0, remaining: 0 },
      5: { elapsed: 0, remaining: 0 },
    };
    let totalActualTime = 0;
    let completedCount = 0;

    tasks.forEach((task) => {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);

      if (task.status === "pending") {
        stats[task.priority].elapsed += (now.getTime() - start.getTime()) / 3600000;
        stats[task.priority].remaining += (end.getTime() - now.getTime()) / 3600000;
      } else {
        totalActualTime += (end.getTime() - start.getTime()) / 3600000;
        completedCount++;
      }
    });

    const averageCompletionTime = completedCount > 0 ? totalActualTime / completedCount : 0;

    return { stats, averageCompletionTime };
  };

  const { stats, averageCompletionTime } = calculateTimeStats();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completedPercentage} className="mb-2" />
            <div className="text-xs text-muted-foreground">
              {completedTasks} completed, {pendingTasks} pending
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Stats by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(stats).map(([priority, { elapsed, remaining }]) => (
              <div key={priority} className="flex justify-between text-xs">
                <span>Priority {priority}:</span>
                <span>
                  {elapsed.toFixed(2)}h elapsed, {remaining.toFixed(2)}h remaining
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionTime.toFixed(2)}h</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}