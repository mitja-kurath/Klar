interface CurrentTaskInputProps {
  currentTask: string;
  onTaskChange: (task: string) => void;
}

export const CurrentTaskInput: React.FC<CurrentTaskInputProps> = ({
  currentTask,
  onTaskChange
}) => {
  return (
    <div className="mb-8 w-full max-w-md">
      <label className="block text-sm font-medium text-slate-300 mb-3 text-center">
        What are you working on?
      </label>
      <input
        type="text"
        value={currentTask}
        onChange={(e) => onTaskChange(e.target.value)}
        placeholder="Enter your current focus..."
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 text-center transition-all duration-200"
      />
    </div>
  );
};