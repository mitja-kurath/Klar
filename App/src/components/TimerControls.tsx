import { Play, Pause, Square } from 'lucide-react';
interface TimerControlsProps {
    isActive: boolean;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
}
export const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onStop
}) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      {!isActive || isPaused ? (
        <button
          onClick={onStart}
          className="flex items-center justify-center w-14 h-14 bg-teal-600 hover:bg-teal-500 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        >
          <Play className="w-6 h-6 text-white ml-1" />
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center justify-center w-14 h-14 bg-yellow-600 hover:bg-yellow-500 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        >
          <Pause className="w-6 h-6 text-white" />
        </button>
      )}
      <button
        onClick={onStop}
        className="flex items-center justify-center w-14 h-14 bg-slate-700 hover:bg-slate-600 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
      >
        <Square className="w-5 h-5 text-slate-300" />
      </button>
    </div>
  );
};


