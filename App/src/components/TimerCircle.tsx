import React from 'react';
import { formatTime } from '../utils/timeUtils';
interface TimerCircleProps {
  timeLeft: number;
  progress: number;
  isBreak: boolean;
}
export const TimerCircle: React.FC<TimerCircleProps> = ({
  timeLeft,
  progress,
  isBreak
}) => {
  const strokeColor = isBreak ? '#06b6d4' : '#14b8a6';
  return (
    <div className="relative mb-8">
      <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
        <circle
          cx="128"
          cy="128"
          r="112"
          stroke={strokeColor}
          strokeWidth="4"
          fill="none"
          opacity="0.2"
        />
        <circle
          cx="128"
          cy="128"
          r="112"
          stroke={strokeColor}
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 112}`}
          strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
          className="transition-all duration-1000 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-light text-slate-100 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
      </div>
    </div>
  );
};


