import React, { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { CheckSquare, CheckCircle2, Circle, GripVertical, Trash2 } from 'lucide-react';
import { Task } from '../../types';
export const TasksWidgetApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    let unlistenFunction: (() => void) | null = null;
    const setupListener = async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        unlistenFunction = await listen('tasks-update', (event: any) => {
          console.log('Tasks update received:', event.payload);
          const { tasks, completed_tasks, total_tasks } = event.payload;
          setTasks(tasks);
          setCompletedTasks(completed_tasks);
          setTotalTasks(total_tasks);
        });
      } catch (error) {
        console.error('Failed to setup task update listener:', error);
      }
    };
    setupListener();
    loadTasks();
    return () => {
      if (unlistenFunction) {
        unlistenFunction();
      }
    };
  }, []);
  const loadTasks = async () => {
    try {
      const result = await invoke('get_tasks');
      if (result) {
        const data = result as { tasks: Task[], completed_tasks: number, total_tasks: number };
        setTasks(data.tasks);
        setCompletedTasks(data.completed_tasks);
        setTotalTasks(data.total_tasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };
  const handleToggleTask = async (id: string) => {
    try {
      await invoke('toggle_task', { id });
      await loadTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };
  const handleRemoveTask = async (id: string) => {
    try {
      await invoke('remove_task', { id });
      await loadTasks();
    } catch (error) {
      console.error('Failed to remove task:', error);
    }
  };
  const handleMouseDown = async (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      try {
        const appWindow = getCurrentWindow();
        await appWindow.startDragging();
      } catch (error) {
        console.error('Failed to start dragging:', error);
      }
      setIsDragging(false);
    }
  };
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <div 
      className="w-80 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 select-none max-h-96 flex flex-col"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {}
      <div className="drag-handle flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <GripVertical className="w-4 h-4" />
          <CheckSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Tasks</span>
        </div>
      </div>
      {}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      {}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-4">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <button
                onClick={() => handleToggleTask(task.id)}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
                )}
              </button>
              <span 
                className={`flex-1 text-sm ${
                  task.completed 
                    ? 'line-through text-slate-500 dark:text-slate-400' 
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      {}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          {completedTasks > 0 && (
            <span>{Math.round(completionPercentage)}% Complete</span>
          )}
        </div>
      </div>
    </div>
  );
};



