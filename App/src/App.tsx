import { useState } from 'react';
import { StatusBar } from './components/StatusBar';
import { CurrentTaskInput } from './components/CurrentTaskInput';
import { TimerCircle } from './components/TimerCircle';
import { TimerControls } from './components/TimerControls';
import { CurrentTaskDisplay } from './components/CurrentTaskDisplay';
import { TasksSidebar } from './components/TasksSidebar/TasksSidebar';
import { useTimer } from './hooks/useTimer';
import { useTasks } from './hooks/useTasks';
import "./App.css";

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

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

  const handleAddTask = () => {
    if (addTask(newTask)) {
      setNewTask('');
      setShowTaskInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <StatusBar
          isBlocking={isBlocking}
          focusTimeToday={focusTimeToday}
          breaksToday={breaksToday}
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

      {/* Tasks Sidebar */}
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

export default App;