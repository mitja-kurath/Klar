import { Shield, Clock, Coffee, Timer, CheckSquare } from 'lucide-react';
import { formatDuration } from '../utils/timeUtils';
import { BreakStats } from '../types';
import { UserMenu } from './UserMenu';
import { useAuth } from '../contexts/AuthContext';
interface StatusBarProps {
  isBlocking: boolean;
  focusTimeToday: number;
  breaksToday: BreakStats;
  onToggleTimerWidget?: () => void;
  onToggleTasksWidget?: () => void;
  isTimerWidgetActive?: boolean;
  isTasksWidgetActive?: boolean;
}
export const StatusBar: React.FC<StatusBarProps> = ({
  isBlocking,
  focusTimeToday,
  breaksToday,
  onToggleTimerWidget,
  onToggleTasksWidget,
  isTimerWidgetActive = false,
  isTasksWidgetActive = false
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="absolute top-6 right-6 flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <Shield className={`w-4 h-4 ${isBlocking ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span>Blocking {isBlocking ? 'Active' : 'Inactive'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" />
        <span>{formatDuration(focusTimeToday)} focused today</span>
      </div>
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        <span>{breaksToday.taken} breaks taken</span>
      </div>
      {onToggleTimerWidget && (
        <button
          onClick={onToggleTimerWidget}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            isTimerWidgetActive 
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Toggle Timer Widget"
        >
          <Timer className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          <span>{isTimerWidgetActive ? 'Close' : 'Open'} Timer Widget</span>
        </button>
      )}
      {onToggleTasksWidget && (
        <button
          onClick={onToggleTasksWidget}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            isTasksWidgetActive 
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Toggle Tasks Widget"
        >
          <CheckSquare className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>{isTasksWidgetActive ? 'Close' : 'Open'} Tasks Widget</span>
        </button>
      )}
      {isAuthenticated && (
        <div className="ml-4 border-l border-slate-300 dark:border-slate-700 pl-4">
          <UserMenu />
        </div>
      )}
    </div>
  );
};


