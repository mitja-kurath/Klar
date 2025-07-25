import { useState, useEffect } from 'react';
import { Task } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const initialTasks: Task[] = [
  { id: '1', title: 'Review quarterly analytics report', text: 'Review quarterly analytics report', completed: true },
  { id: '2', title: 'Prepare presentation slides', text: 'Prepare presentation slides', completed: true },
  { id: '3', title: 'Team standup meeting', text: 'Team standup meeting', completed: false },
  { id: '4', title: 'Code review for new feature', text: 'Code review for new feature', completed: false },
  { id: '5', title: 'Update project documentation', text: 'Update project documentation', completed: false },
];

export const useTasks = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    } else {
      // Use local tasks for unauthenticated users
      const localTasks = localStorage.getItem('local_tasks');
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      }
    }
  }, [isAuthenticated]);

  // Save to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('local_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isAuthenticated]);

  const loadTasks = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const loadedTasks = await apiService.getTasks();
      // Ensure we have an array before mapping
      if (Array.isArray(loadedTasks)) {
        // Ensure backward compatibility by adding text field
        const tasksWithText = loadedTasks.map(task => ({
          ...task,
          text: task.title || task.text || ''
        }));
        setTasks(tasksWithText);
      } else {
        console.warn('Tasks response is not an array:', loadedTasks);
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    if (isAuthenticated) {
      try {
        const updatedTask = await apiService.toggleTask(id);
        setTasks(tasks.map(task => 
          task.id === id ? updatedTask : task
        ));
      } catch (error) {
        console.error('Failed to toggle task:', error);
      }
    } else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const addTask = async (text: string): Promise<boolean> => {
    if (!text.trim()) return false;

    if (isAuthenticated) {
      try {
        const newTask = await apiService.createTask(text.trim());
        // Ensure backward compatibility by adding text field
        const taskWithText = { ...newTask, text: newTask.title || newTask.text || text.trim() };
        setTasks([...tasks, taskWithText]);
        return true;
      } catch (error) {
        console.error('Failed to add task:', error);
        return false;
      }
    } else {
      const task: Task = {
        id: Date.now().toString(),
        title: text.trim(),
        text: text.trim(),
        completed: false
      };
      setTasks([...tasks, task]);
      return true;
    }
  };

  const removeTask = async (id: string) => {
    if (isAuthenticated) {
      try {
        await apiService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Failed to remove task:', error);
      }
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    tasks,
    completedTasks,
    totalTasks,
    completionPercentage,
    isLoading,
    toggleTask,
    addTask,
    removeTask,
    refreshTasks: loadTasks,
  };
};