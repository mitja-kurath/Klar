import { Task, User, UserSettings, PomodoroSession, ApiResponse } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
class ApiService {
  private token: string | null = null;
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('Making authenticated request to:', endpoint, 'with token:', this.token.substring(0, 20) + '...');
    } else {
      console.log('Making unauthenticated request to:', endpoint);
    }
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = {};
      }
      if (!response.ok) {
        console.error('API Request failed:', {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
  hasValidToken(): boolean {
    return !!this.token && this.token !== 'session-based';
  }
  async initiateOAuth(provider: 'github' | 'google'): Promise<{ url: string }> {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const url = `${baseUrl}/oauth2/authorization/${provider}`;
    return { url };
  }
  async handleOAuthCallback(_code: string, _state?: string): Promise<{ token: string; user: User }> {
    throw new Error('OAuth callback should be handled by backend redirect');
  }
  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No JWT token available');
    }
    console.log('Attempting to get current user with token...');
    try {
      console.log('Testing token with /auth/token endpoint...');
      const tokenResponse = await this.request<any>('/auth/token', { method: 'GET' });
      console.log('Token endpoint response:', tokenResponse);
    } catch (tokenError) {
      console.log('Token endpoint failed:', tokenError);
    }
    try {
      console.log('Testing /auth/me endpoint...');
      const response = await this.request<any>('/auth/me');
      console.log('Auth/me response:', response);
      const backendUser = response.data || response;
      return {
        id: backendUser.id || backendUser.sub,
        email: backendUser.email || '',
        name: backendUser.name || backendUser.login || '',
        avatar_url: backendUser.avatar_url || backendUser.picture,
        github_id: backendUser.github_id,
        google_id: backendUser.google_id,
        created_at: backendUser.created_at,
        updated_at: backendUser.updated_at,
      };
    } catch (error) {
      console.error('Auth/me failed:', error);
      throw new Error('JWT token authentication failed - backend not configured for JWT');
    }
  }
  async getToken(): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/auth/token', {
      method: 'POST',
    });
    return response.data;
  }
  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.setToken(null);
    }
  }
  async getUserSettings(): Promise<UserSettings> {
    const response = await this.request<UserSettings>('/settings');
    const settings = response.data || response;
    if (!settings) {
      console.warn('Settings response is empty:', settings);
      return {
        workDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 900,
        sessionsUntilLongBreak: 4,
        notificationsEnabled: true,
        theme: 'light'
      };
    }
    return settings;
  }
  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await this.request<UserSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    const updatedSettings = response.data || response;
    if (!updatedSettings) {
      console.warn('Settings update response is empty:', updatedSettings);
      throw new Error('Failed to update settings');
    }
    return updatedSettings;
  }
  async getTasks(): Promise<Task[]> {
    const response = await this.request<Task[]>('/tasks');
    const tasks = response.data || response;
    if (!Array.isArray(tasks)) {
      console.warn('Tasks response is not an array:', tasks);
      return [];
    }
    return tasks;
  }
  async createTask(text: string): Promise<Task> {
    const response = await this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: text, completed: false }),
    });
    const task = response.data || response;
    if (!task || !task.id) {
      console.warn('Task creation response missing id:', task);
      throw new Error('Invalid task response from server');
    }
    return task;
  }
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }
  async toggleTask(id: string): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.data;
  }
  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }
  async startSession(taskId?: string, duration: number = 25, type: string = "work"): Promise<PomodoroSession> {
    console.log('Starting session with:', { taskId, duration, type });
    const requestBody = { 
      duration: duration,
      type: type,
      taskId: taskId || null
    };
    console.log('Request body:', requestBody);
    const response = await this.request<PomodoroSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    console.log('Session creation response:', response);
    const session = response.data || response;
    console.log('Processed session data:', session);
    if (!session || typeof session !== 'object') {
      console.error('Session response is not an object:', session);
      throw new Error('Invalid session response format from server');
    }
    if (!session.id) {
      console.warn('Session response missing id. Available fields:', Object.keys(session));
      const possibleIds = ['id', '_id', 'session_id', 'sessionId'];
      let sessionId = null;
      for (const idField of possibleIds) {
        const sessionAny = session as any;
        if (sessionAny[idField]) {
          sessionId = sessionAny[idField];
          console.log(`Found session ID in field '${idField}':`, sessionId);
          break;
        }
      }
      if (!sessionId) {
        console.error('No session ID found in any expected field');
        throw new Error('Session created but no ID returned from server');
      }
      (session as any).id = sessionId;
    }
    return session;
  }
  async updateSession(id: string, updates: Partial<PomodoroSession>): Promise<PomodoroSession> {
    const response = await this.request<PomodoroSession>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }
  async completeSession(id: string): Promise<PomodoroSession> {
    const response = await this.request<PomodoroSession>(`/sessions/${id}/complete`, {
      method: 'POST',
    });
    return response.data;
  }
  async getTodayFocusTime(): Promise<{ total_focus_time: number; breaks_taken: number; breaks_missed: number }> {
    const response = await this.request<{ total_focus_time: number; breaks_taken: number; breaks_missed: number }>('/focus-time/today');
    const stats = response.data || response;
    if (!stats || typeof stats.total_focus_time === 'undefined') {
      console.warn('Focus time response missing total_focus_time:', stats);
      return { total_focus_time: 0, breaks_taken: 0, breaks_missed: 0 };
    }
    return stats;
  }
  async logBreak(): Promise<void> {
    await this.request('/breaks', { method: 'POST' });
  }
}
export const apiService = new ApiService();



