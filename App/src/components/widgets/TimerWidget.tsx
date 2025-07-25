import React from 'react';
import { Timer, Play, Pause, Square, X } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';
import { useDraggable } from '../../hooks/useDraggable';
interface TimerWidgetProps {
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  isBreak: boolean;
  progress: number;
  currentTask: string;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  isVisible: boolean;
  onClose: () => void;
}
export const TimerWidget: React.FC<TimerWidgetProps> = ({
  timeLeft,
  isActive,
  isPaused,
  isBreak,
  progress,
  currentTask,
  onStart,
  onPause,
  onStop,
  isVisible,
  onClose
}) => {
  const { position, dragRef, isDragging } = useDraggable('timer-widget', { x: window.innerWidth - 300, y: window.innerHeight - 200 });
  const strokeColor = isBreak ? '#06b6d4' : '#14b8a6';
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  if (!isVisible) return null;
  return (
    <div 
      className={`fixed w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-2xl z-[9999] transition-opacity ${
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
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-teal-500 dark:text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Focus Timer</h3>
          <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
            isBreak 
              ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300' 
              : 'bg-teal-500/20 text-teal-600 dark:text-teal-300'
          }`}>
            {isBreak ? 'Break' : 'Focus'}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      </div>
      {}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {}
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke={strokeColor}
                strokeWidth="3"
                fill="none"
                opacity="0.2"
              />
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke={strokeColor}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatTime(timeLeft).split(':')[0]}
              </span>
            </div>
          </div>
          {}
          <div className="flex-1">
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {formatTime(timeLeft)}
            </div>
            {currentTask && (
              <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {currentTask}
              </div>
            )}
          </div>
        </div>
        {}
        <div className="flex items-center justify-center gap-2 mt-4">
          {!isActive || isPaused ? (
            <button
              onClick={onStart}
              className="flex items-center justify-center w-8 h-8 bg-teal-600 hover:bg-teal-500 rounded-full transition-all duration-200"
            >
              <Play className="w-4 h-4 text-white ml-0.5" />
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center justify-center w-8 h-8 bg-yellow-600 hover:bg-yellow-500 rounded-full transition-all duration-200"
            >
              <Pause className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            onClick={onStop}
            className="flex items-center justify-center w-8 h-8 bg-slate-400 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 rounded-full transition-all duration-200"
          >
            <Square className="w-3 h-3 text-white dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};



