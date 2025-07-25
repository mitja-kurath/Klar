import React from 'react';
import { CheckSquare, CheckCircle2, Circle, X } from 'lucide-react';
import { Task } from '../../types';
import { useDraggable } from '../../hooks/useDraggable';
interface TasksWidgetProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  completedTasks: number;
  totalTasks: number;
  isVisible: boolean;
  onClose: () => void;
}
export const TasksWidget: React.FC<TasksWidgetProps> = ({
  tasks,
  onToggleTask,
  onRemoveTask,
  completedTasks,
  totalTasks,
  isVisible,
  onClose
}) => {
  const { position, dragRef, isDragging } = useDraggable('tasks-widget', { x: 20, y: 20 });
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const visibleTasks = tasks.slice(0, 5);
  if (!isVisible) return null;
  return (
    <div 
      className={`fixed w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-2xl z-[9999] max-h-[400px] overflow-hidden transition-opacity ${
        isDragging ? 'opacity-80' : 'opacity-100'
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
    >
      {}
      <div 
        ref={dragRef}
        className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-teal-500 dark:text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Today's Tasks</h3>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {completedTasks}/{totalTasks}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
        {}
        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-center">
          {completionPercentage}% Complete
        </div>
      </div>
      {}
      <div className="p-3 max-h-[280px] overflow-y-auto">
        {visibleTasks.length > 0 ? (
          <div className="space-y-2">
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/30 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex-shrink-0 transition-colors duration-200"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                  )}
                </button>
                <span className={`flex-1 text-xs ${
                  task.completed 
                    ? 'text-slate-500 dark:text-slate-500 line-through' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {task.title || task.text}
                </span>
                <button
                  onClick={() => onRemoveTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600/50 rounded transition-all duration-200"
                >
                  <X className="w-3 h-3 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400" />
                </button>
              </div>
            ))}
            {tasks.length > 5 && (
              <div className="text-xs text-slate-500 dark:text-slate-500 text-center py-2 border-t border-slate-200 dark:border-slate-700/30">
                +{tasks.length - 5} more tasks in main app
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-500">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No tasks for today</p>
          </div>
        )}
      </div>
    </div>
  );
};



