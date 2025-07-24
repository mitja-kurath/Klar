import { TasksHeader } from './TasksHeader';
import { AddTaskInput } from './AddTaskInput';
import { TasksList } from './TasksList';
import { StatsFooter } from './StatsFooter';
import { Task, BreakStats } from '../../types';

interface TasksSidebarProps {
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  focusTimeToday: number;
  breaksToday: BreakStats;
  showTaskInput: boolean;
  newTask: string;
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onAddTask: () => void;
  onNewTaskChange: (task: string) => void;
  onToggleTaskInput: () => void;
}

export const TasksSidebar: React.FC<TasksSidebarProps> = ({
  tasks,
  completedTasks,
  totalTasks,
  completionPercentage,
  focusTimeToday,
  breaksToday,
  showTaskInput,
  newTask,
  onToggleTask,
  onRemoveTask,
  onAddTask,
  onNewTaskChange,
  onToggleTaskInput
}) => {
  return (
    <div className="w-96 bg-slate-800/30 border-l border-slate-700/50 flex flex-col">
      <TasksHeader
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        completionPercentage={completionPercentage}
        onToggleTaskInput={onToggleTaskInput}
      />

      {showTaskInput && (
        <AddTaskInput
          newTask={newTask}
          onNewTaskChange={onNewTaskChange}
          onAddTask={onAddTask}
        />
      )}

      <TasksList
        tasks={tasks}
        onToggleTask={onToggleTask}
        onRemoveTask={onRemoveTask}
      />

      <StatsFooter
        focusTimeToday={focusTimeToday}
        breaksToday={breaksToday}
      />
    </div>
  );
};