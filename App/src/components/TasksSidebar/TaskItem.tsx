import { CheckCircle2, Circle, X } from 'lucide-react';
import { Task } from '../../types';
interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
}
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onRemove
}) => {
  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-slate-700/30 cursor-pointer ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="flex-shrink-0 transition-colors duration-200"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
        )}
      </button>
      <span className={`flex-1 text-sm ${
        task.completed 
          ? 'text-slate-500 line-through' 
          : 'text-slate-300'
      }`}>
        {task.text || task.title || ''}
      </span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600/50 rounded transition-all duration-200"
      >
        <X className="w-4 h-4 text-slate-500 hover:text-slate-400" />
      </button>
    </div>
  );
};



