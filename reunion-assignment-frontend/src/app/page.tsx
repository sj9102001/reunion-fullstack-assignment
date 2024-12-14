"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useAuthRedirect from "@/hooks/useAuthRedirect";
type TaskStats = {
  priority: number;
  total: number;
  pending: number;
  finished: number;
  averageCompletionTime: number; // Ensure this is typed as a number
  overallAverageCompletionTime: number;
};

export default function DashboardPage() {
  useAuthRedirect();
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [overallAverageCompletionTime, setOverallAverageCompletionTime] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/stats`, {
          credentials: "include"
        }); // Update to your stats API endpoint
        const data = await response.json();
        setStats(data.stats);
        setTotalTasks(data.totalTasks);
        setCompletedTasks(data.completedTasks);
        setPendingTasks(data.pendingTasks);
        setCompletedPercentage(data.completedPercentage);
        setOverallAverageCompletionTime(data.overallAverageCompletionTime);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

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
            {stats.map(({ priority, total, pending, finished, averageCompletionTime }) => (
              <div key={priority} className="text-xs mb-2">
                <div>Priority {priority}:</div>
                <div>Total: {total}, Pending: {pending}, Finished: {finished}</div>
                <div>Avg. Completion Time: {averageCompletionTime.toFixed(2)}h</div>
              </div>
            ))}
          </CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Overall Avg. Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overallAverageCompletionTime.toFixed(2)}h
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>
    </div>
  );
}