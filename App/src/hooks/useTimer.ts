import { useState, useEffect, useRef } from 'react';

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusTimeToday, setFocusTimeToday] = useState(4 * 3600 + 32 * 60); // 4h 32m
  const [breaksToday, setBreaksToday] = useState({ taken: 6, missed: 2 });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = isBreak ? BREAK_DURATION : WORK_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsPaused(false);
            
            if (isBreak) {
              setIsBreak(false);
              setTimeLeft(WORK_DURATION);
              setBreaksToday(prev => ({ ...prev, taken: prev.taken + 1 }));
            } else {
              setIsBreak(true);
              setTimeLeft(BREAK_DURATION);
              setFocusTimeToday(prev => prev + WORK_DURATION);
            }
            
            return isBreak ? WORK_DURATION : BREAK_DURATION;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, isBreak]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
  };

  return {
    timeLeft,
    isActive,
    isPaused,
    isBreak,
    progress,
    focusTimeToday,
    breaksToday,
    totalDuration,
    handleStart,
    handlePause,
    handleStop
  };
};