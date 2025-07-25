import React, { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { Timer, Play, Pause, Square, GripVertical } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';
export const TimerWidgetApp: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTask, setCurrentTask] = useState('Focus Session');
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    console.log('TimerWidgetApp component mounted!');
    document.title = 'Timer Widget - Loaded';
    return () => {
      console.log('TimerWidgetApp component unmounted');
    };
  }, []);
  useEffect(() => {
    let unlistenFunction: (() => void) | null = null;
    const setupListener = async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        unlistenFunction = await listen('timer-update', (event: any) => {
          console.log('Timer update received:', event.payload);
          const { time_left, is_active, is_paused, is_break } = event.payload;
          setTimeLeft(time_left);
          setIsActive(is_active);
          setIsPaused(is_paused);
          setIsBreak(is_break);
          setCurrentTask(is_break ? 'Break Time' : 'Focus Session');
        });
      } catch (error) {
        console.error('Failed to setup timer update listener:', error);
      }
    };
    setupListener();
    loadTimerState();
    return () => {
      if (unlistenFunction) {
        unlistenFunction();
      }
    };
  }, []);
  const loadTimerState = async () => {
    try {
      const result = await invoke('get_timer_state');
      if (result) {
        const data = result as { time_left: number, is_active: boolean, is_paused: boolean, is_break: boolean };
        setTimeLeft(data.time_left);
        setIsActive(data.is_active);
        setIsPaused(data.is_paused);
        setIsBreak(data.is_break);
        setCurrentTask(data.is_break ? 'Break Time' : 'Focus Session');
      }
    } catch (error) {
      console.error('Failed to load timer state:', error);
    }
  };
  const handleStart = async () => {
    try {
      await invoke('timer_start');
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };
  const handlePause = async () => {
    try {
      await invoke('timer_pause');
    } catch (error) {
      console.error('Failed to pause timer:', error);
    }
  };
  const handleStop = async () => {
    try {
      await invoke('timer_stop');
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };
  const handleMouseDown = async (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      try {
        const appWindow = getCurrentWindow();
        await appWindow.startDragging();
      } catch (error) {
        console.error('Failed to start dragging:', error);
      }
      setIsDragging(false);
    }
  };
  const progress = isBreak ? 
    ((300 - timeLeft) / 300) * 100 :
    ((1500 - timeLeft) / 1500) * 100;
  return (
    <div 
      className="w-80 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 select-none"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {}
      <div className="drag-handle flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <GripVertical className="w-4 h-4" />
          <Timer className="w-4 h-4" />
          <span className="text-sm font-medium">Timer</span>
        </div>
      </div>
      {}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {currentTask}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
      </div>
      {}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                isBreak 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-emerald-500 dark:text-emerald-400'
              }`}
              strokeLinecap="round"
            />
          </svg>
          {}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
      {}
      <div className="flex justify-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
};



