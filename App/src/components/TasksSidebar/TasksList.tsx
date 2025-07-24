import React from 'react';
import { Target } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { Task } from '../../types';

interface TasksListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
}

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  onToggleTask,
  onRemoveTask
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onRemove={() => onRemoveTask(task.id)}
          />
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tasks for today</p>
          <p className="text-sm mt-1">Click the + button to add one</p>
        </div>
      )}
    </div>
  );
};