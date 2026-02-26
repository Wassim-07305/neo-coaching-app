"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface MyTasksProps {
  initialTasks: Task[];
}

export function MyTasks({ initialTasks }: MyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const today = new Date("2026-02-26");

  function isOverdue(dueDate: string, completed: boolean): boolean {
    if (completed) return false;
    return new Date(dueDate) < today;
  }

  function toggleComplete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Travaux</h2>

      {/* Pending tasks */}
      {pendingTasks.length > 0 ? (
        <div className="space-y-2 mb-4">
          {pendingTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.completed);
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  overdue ? "border-danger/30 bg-danger/5" : "border-gray-100 bg-white"
                )}
              >
                <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-danger bg-danger/10 px-1.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        En retard
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-success rounded-lg hover:bg-success/90 transition-colors shrink-0"
                >
                  C&apos;est fait !
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 mb-4">
          <CheckCircle2 className="w-8 h-8 text-success/40 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Tous les travaux sont termines !</p>
        </div>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Termines ({completedTasks.length})
          </p>
          <div className="space-y-1.5">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2.5 rounded-lg opacity-60"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <p className="text-sm text-gray-500 line-through flex-1">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
