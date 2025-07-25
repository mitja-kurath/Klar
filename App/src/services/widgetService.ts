import { emit } from '@tauri-apps/api/event';
import { Window } from '@tauri-apps/api/window';
class WidgetService {
  private timerWindow: Window | null = null;
  private tasksWindow: Window | null = null;
  async createTimerWidget() {
    console.log('Attempting to create timer widget...');
    if (this.timerWindow) {
      try {
        console.log('Timer widget already exists, showing it...');
        await this.timerWindow.show();
        await this.timerWindow.setFocus();
        return;
      } catch (error) {
        console.error('Failed to show existing timer widget:', error);
        this.timerWindow = null;
      }
    }
    try {
      console.log('Creating new timer widget...');
      const { invoke } = await import('@tauri-apps/api/core');
      console.log('Core imported, creating window...');
      await invoke('create_timer_widget_window');
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const { Window } = await import('@tauri-apps/api/window');
        this.timerWindow = await Window.getByLabel('timer-widget');
        console.log('Timer widget window reference obtained:', this.timerWindow);
      } catch (error) {
        console.error('Failed to get timer widget window reference:', error);
      }
      console.log('Timer widget window creation completed');
    } catch (error) {
      console.error('Failed to create timer widget:', error);
      this.timerWindow = null;
    }
  }
  async createTasksWidget() {
    console.log('Attempting to create tasks widget...');
    if (this.tasksWindow) {
      try {
        console.log('Tasks widget already exists, showing it...');
        await this.tasksWindow.show();
        await this.tasksWindow.setFocus();
        return;
      } catch (error) {
        console.error('Failed to show existing tasks widget:', error);
        this.tasksWindow = null;
      }
    }
    try {
      console.log('Creating new tasks widget...');
      const { invoke } = await import('@tauri-apps/api/core');
      console.log('Core imported, creating tasks window...');
      await invoke('create_tasks_widget_window');
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const { Window } = await import('@tauri-apps/api/window');
        this.tasksWindow = await Window.getByLabel('tasks-widget');
        console.log('Tasks widget window reference obtained:', this.tasksWindow);
      } catch (error) {
        console.error('Failed to get tasks widget window reference:', error);
      }
      console.log('Tasks widget window creation completed');
    } catch (error) {
      console.error('Failed to create tasks widget:', error);
      this.tasksWindow = null;
    }
  }
  async closeTimerWidget() {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('close_timer_widget');
      this.timerWindow = null;
      console.log('Timer widget closed successfully');
    } catch (error) {
      console.error('Failed to close timer widget:', error);
      throw error;
    }
  }
  async closeTasksWidget() {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('close_tasks_widget');
      this.tasksWindow = null;
      console.log('Tasks widget closed successfully');
    } catch (error) {
      console.error('Failed to close tasks widget:', error);
      throw error;
    }
  }
  async updateTimerWidget(timerData: {
    timeLeft: number;
    isActive: boolean;
    isPaused: boolean;
    isBreak: boolean;
    currentTask: string;
  }) {
    try {
      await emit('timer-update', timerData);
    } catch (error) {
      console.error('Failed to emit timer update:', error);
    }
  }
  async updateTasksWidget(tasksData: {
    tasks: any[];
    completedTasks: number;
    totalTasks: number;
  }) {
    try {
      await emit('tasks-update', tasksData);
    } catch (error) {
      console.error('Failed to emit tasks update:', error);
    }
  }
  isTimerWidgetOpen() {
    return this.timerWindow !== null;
  }
  isTasksWidgetOpen() {
    return this.tasksWindow !== null;
  }
  async closeAllWidgets() {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('close_all_widgets');
      this.timerWindow = null;
      this.tasksWindow = null;
      console.log('All widgets closed successfully');
    } catch (error) {
      console.error('Failed to close all widgets:', error);
      throw error;
    }
  }
}
export const widgetService = new WidgetService();



