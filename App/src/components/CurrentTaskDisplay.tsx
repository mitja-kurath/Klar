interface CurrentTaskDisplayProps {
  currentTask: string;
}

export const CurrentTaskDisplay: React.FC<CurrentTaskDisplayProps> = ({
  currentTask
}) => {
  if (!currentTask) return null;

  return (
    <div className="text-center">
      <div className="text-slate-400 text-sm mb-1">Currently focusing on:</div>
      <div className="text-slate-200 font-medium">{currentTask}</div>
    </div>
  );
};