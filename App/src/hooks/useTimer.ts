import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
const DEFAULT_WORK_DURATION = 25 * 60;
const DEFAULT_BREAK_DURATION = 5 * 60;
export const useTimer = () => {
  const { isAuthenticated, settings } = useAuth();
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusTimeToday, setFocusTimeToday] = useState(0);
  const [breaksToday, setBreaksToday] = useState({ taken: 0, missed: 0 });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const workDuration = settings?.work_duration || DEFAULT_WORK_DURATION;
  const breakDuration = settings?.short_break_duration || DEFAULT_BREAK_DURATION;
  const totalDuration = isBreak ? breakDuration : workDuration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  useEffect(() => {
    if (isAuthenticated) {
      loadTodayStats();
    } else {
      const localStats = localStorage.getItem('local_timer_stats');
      if (localStats) {
        const stats = JSON.parse(localStats);
        const today = new Date().toDateString();
        if (stats.date === today) {
          setFocusTimeToday(stats.focusTime || 0);
          setBreaksToday(stats.breaks || { taken: 0, missed: 0 });
        }
      }
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isBreak ? breakDuration : workDuration);
    }
  }, [workDuration, breakDuration, isBreak, isActive]);
  const loadTodayStats = async () => {
    if (!isAuthenticated) return;
    try {
      const stats = await apiService.getTodayFocusTime();
      setFocusTimeToday(stats?.total_focus_time || 0);
      setBreaksToday({ 
        taken: stats?.breaks_taken || 0, 
        missed: stats?.breaks_missed || 0 
      });
    } catch (error) {
      console.warn('Backend API not available, using local values:', error);
      const localFocusTime = parseInt(localStorage.getItem('local_focus_time') || '0');
      const localBreaksTaken = parseInt(localStorage.getItem('local_breaks_taken') || '0');
      const localBreaksMissed = parseInt(localStorage.getItem('local_breaks_missed') || '0');
      setFocusTimeToday(localFocusTime);
      setBreaksToday({ taken: localBreaksTaken, missed: localBreaksMissed });
    }
  };
  const saveLocalStats = () => {
    if (!isAuthenticated) {
      const stats = {
        date: new Date().toDateString(),
        focusTime: focusTimeToday,
        breaks: breaksToday
      };
      localStorage.setItem('local_timer_stats', JSON.stringify(stats));
    }
  };
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return isBreak ? workDuration : breakDuration;
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
  }, [isActive, isPaused, isBreak, workDuration, breakDuration]);
  const handleSessionComplete = async () => {
    setIsActive(false);
    setIsPaused(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(workDuration);
      const newBreaksToday = { ...breaksToday, taken: breaksToday.taken + 1 };
      setBreaksToday(newBreaksToday);
      if (isAuthenticated) {
        try {
          await apiService.logBreak();
          if (currentSessionId) {
            await apiService.completeSession(currentSessionId);
          }
        } catch (error) {
          console.error('Failed to log break:', error);
        }
      } else {
        saveLocalStats();
      }
    } else {
      setIsBreak(true);
      setTimeLeft(breakDuration);
      const newFocusTime = focusTimeToday + workDuration;
      setFocusTimeToday(newFocusTime);
      if (isAuthenticated) {
        try {
          if (currentSessionId) {
            await apiService.completeSession(currentSessionId);
          }
        } catch (error) {
          console.error('Failed to complete session:', error);
        }
      } else {
        saveLocalStats();
      }
    }
    setCurrentSessionId(null);
  };
  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);
    if (isAuthenticated && !currentSessionId) {
      try {
        console.log('Attempting to start session...');
        const sessionType = isBreak ? "break" : "work";
        const sessionDuration = isBreak ? Math.round(breakDuration / 60) : Math.round(workDuration / 60);
        console.log('Session parameters:', {
          type: sessionType,
          duration: sessionDuration
        });
        const session = await apiService.startSession(
          undefined,
          sessionDuration, 
          sessionType
        );
        console.log('Session creation result:', session);
        if (session?.id) {
          setCurrentSessionId(session.id);
          console.log('Session started with ID:', session.id);
        } else {
          console.warn('Session created but no ID returned:', session);
        }
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    }
  };
  const handlePause = async () => {
    setIsPaused(!isPaused);
    if (isAuthenticated && currentSessionId) {
      try {
        await apiService.updateSession(currentSessionId, {
          actual_duration: totalDuration - timeLeft
        });
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
  };
  const handleStop = async () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(isBreak ? breakDuration : workDuration);
    if (isAuthenticated && currentSessionId) {
      try {
        await apiService.updateSession(currentSessionId, {
          actual_duration: totalDuration - timeLeft,
          completed: false
        });
      } catch (error) {
        console.error('Failed to stop session:', error);
      }
    }
    setCurrentSessionId(null);
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
    handleStop,
    refreshStats: loadTodayStats,
  };
};


