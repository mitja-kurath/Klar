export interface Task {
    id: string;
    userId?: string;
    title: string;
    description?: string;
    completed: boolean;
    priority?: string;
    dueDate?: string;
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
    // Keep old interface for compatibility
    text?: string;
}

export interface BreakStats {
    taken: number;
    missed: number;
}

export interface TimerState {
    timeLeft: number;
    isActive: boolean;
    isPaused: boolean;
    isBreak: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    github_id?: string;
    google_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserSettings {
    id?: string;
    userId?: string;
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    autoStartBreaks?: boolean;
    autoStartPomodoros?: boolean;
    notificationsEnabled: boolean;
    soundEnabled?: boolean;
    theme: 'light' | 'dark' | 'system';
    // Keep old interface for compatibility
    user_id?: string;
    work_duration?: number;
    short_break_duration?: number;
    long_break_duration?: number;
    sessions_until_long_break?: number;
    notifications_enabled?: boolean;
    blocking_enabled?: boolean;
}

export interface PomodoroSession {
    id: string;
    userId?: string;
    taskId?: string;
    duration: number;
    type: 'work' | 'break';
    completed: boolean;
    startTime?: string;
    endTime?: string;
    createdAt?: string;
    // Keep old interface for compatibility
    user_id?: string;
    task_id?: string;
    session_type?: 'work' | 'break';
    planned_duration?: number;
    actual_duration?: number;
    started_at?: string;
    ended_at?: string;
}

export interface AuthContextType {
    user: User | null;
    settings: UserSettings | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (provider: 'github' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export type Theme = 'light' | 'dark' | 'system';