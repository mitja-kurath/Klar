import React from 'react';

interface AddTaskInputProps {
  newTask: string;
  onNewTaskChange: (task: string) => void;
  onAddTask: () => void;
}

export const AddTaskInput: React.FC<AddTaskInputProps> = ({
  newTask,
  onNewTaskChange,
  onAddTask
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddTask();
    }
  };

  return (
    <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => onNewTaskChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
          autoFocus
        />
        <button
          onClick={onAddTask}
          className="px-3 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
};