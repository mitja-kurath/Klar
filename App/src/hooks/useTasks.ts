import { useState } from 'react';
import { Task } from '../types';

const initialTasks: Task[] = [
  { id: '1', text: 'Review quarterly analytics report', completed: true },
  { id: '2', text: 'Prepare presentation slides', completed: true },
  { id: '3', text: 'Team standup meeting', completed: false },
  { id: '4', text: 'Code review for new feature', completed: false },
  { id: '5', text: 'Update project documentation', completed: false },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (text: string) => {
    if (text.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false
      };
      setTasks([...tasks, task]);
      return true;
    }
    return false;
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    tasks,
    completedTasks,
    totalTasks,
    completionPercentage,
    toggleTask,
    addTask,
    removeTask
  };
};