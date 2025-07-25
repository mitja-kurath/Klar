import { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { CurrentTaskInput } from './components/CurrentTaskInput';
import { TimerCircle } from './components/TimerCircle';
import { TimerControls } from './components/TimerControls';
import { CurrentTaskDisplay } from './components/CurrentTaskDisplay';
import { TasksSidebar } from './components/TasksSidebar/TasksSidebar';
import { LoginScreen } from './components/LoginScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthSuccess } from './components/AuthSuccess';
import { OAuthCallback } from './components/OAuthCallback';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTimer } from './hooks/useTimer';
import { useTasks } from './hooks/useTasks';
import { widgetService } from './services/widgetService';
import "./App.css";
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTask, setCurrentTask] = useState('');
  const [isBlocking] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showTimerWidget, setShowTimerWidget] = useState(false);
  const [showTasksWidget, setShowTasksWidget] = useState(false);
  const {
    timeLeft,
    isActive,
    isPaused,
    isBreak,
    progress,
    focusTimeToday,
    breaksToday,
    handleStart,
    handlePause,
    handleStop
  } = useTimer();
  const {
    tasks,
    completedTasks,
    totalTasks,
    completionPercentage,
    toggleTask,
    addTask,
    removeTask
  } = useTasks();
  useEffect(() => {
    if (widgetService.isTimerWidgetOpen()) {
      widgetService.updateTimerWidget({
        timeLeft,
        isActive,
        isPaused,
        isBreak,
        currentTask
      });
    }
  }, [timeLeft, isActive, isPaused, isBreak, currentTask]);
  useEffect(() => {
    if (widgetService.isTasksWidgetOpen()) {
      widgetService.updateTasksWidget({
        tasks,
        completedTasks,
        totalTasks
      });
    }
  }, [tasks, completedTasks, totalTasks]);
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await widgetService.closeAllWidgets();
      } catch (error) {
        console.error('Failed to close widgets on app close:', error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      widgetService.closeAllWidgets().catch(console.error);
    };
  }, []);
  const urlParams = new URLSearchParams(window.location.search);
  const oauthSuccess = urlParams.get('success');
  const showSuccessPage = oauthSuccess === 'true';
  const isOAuthCallback = window.location.pathname === '/oauth/callback' || 
                          window.location.search.includes('code=');
  if (isOAuthCallback) {
    return <OAuthCallback />;
  }
  if (showSuccessPage) {
    return <AuthSuccess />;
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  const handleAddTask = async () => {
    if (await addTask(newTask)) {
      setNewTask('');
      setShowTaskInput(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors">
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <StatusBar
          isBlocking={isBlocking}
          focusTimeToday={focusTimeToday}
          breaksToday={breaksToday}
          isTimerWidgetActive={showTimerWidget}
          isTasksWidgetActive={showTasksWidget}
          onToggleTimerWidget={async () => {
            if (showTimerWidget) {
              await widgetService.closeTimerWidget();
              setShowTimerWidget(false);
            } else {
              await widgetService.createTimerWidget();
              setShowTimerWidget(true);
            }
          }}
          onToggleTasksWidget={async () => {
            if (showTasksWidget) {
              await widgetService.closeTasksWidget();
              setShowTasksWidget(false);
            } else {
              await widgetService.createTasksWidget();
              setShowTasksWidget(true);
            }
          }}
        />
        <CurrentTaskInput
          currentTask={currentTask}
          onTaskChange={setCurrentTask}
        />
        <TimerCircle
          timeLeft={timeLeft}
          progress={progress}
          isBreak={isBreak}
        />
        <TimerControls
          isActive={isActive}
          isPaused={isPaused}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
        />
        <CurrentTaskDisplay currentTask={currentTask} />
      </div>
      <TasksSidebar
        tasks={tasks}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        completionPercentage={completionPercentage}
        focusTimeToday={focusTimeToday}
        breaksToday={breaksToday}
        showTaskInput={showTaskInput}
        newTask={newTask}
        onToggleTask={toggleTask}
        onRemoveTask={removeTask}
        onAddTask={handleAddTask}
        onNewTaskChange={setNewTask}
        onToggleTaskInput={() => setShowTaskInput(!showTaskInput)}
      />
    </div>
  );
}
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;


