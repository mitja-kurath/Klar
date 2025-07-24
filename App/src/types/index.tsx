export interface Task {
    id: string;
    text: string;
    completed: boolean;
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