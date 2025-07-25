import { Target, Plus } from 'lucide-react';
interface TasksHeaderProps {
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  onToggleTaskInput: () => void;
}
export const TasksHeader: React.FC<TasksHeaderProps> = ({
  completedTasks,
  totalTasks,
  completionPercentage,
  onToggleTaskInput
}) => {
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-teal-400" />
          Today's Tasks
        </h2>
        <button
          onClick={onToggleTaskInput}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{completedTasks} of {totalTasks} completed</span>
        <span>{completionPercentage}%</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
        <div 
          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
};


