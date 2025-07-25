package ch.mitjakurath.klar.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_settings")
public class UserSettings {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private int workDuration = 25;
    private int shortBreakDuration = 5;
    private int longBreakDuration = 15;
    private int sessionsUntilLongBreak = 4;
    private boolean autoStartBreaks = false;
    private boolean autoStartPomodoros = false;
    private boolean notificationsEnabled = true;
    private boolean soundEnabled = true;
    private String theme = "light";

    public UserSettings() {}

    public UserSettings(String userId) {
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getWorkDuration() { return workDuration; }
    public void setWorkDuration(int workDuration) { this.workDuration = workDuration; }

    public int getShortBreakDuration() { return shortBreakDuration; }
    public void setShortBreakDuration(int shortBreakDuration) { this.shortBreakDuration = shortBreakDuration; }

    public int getLongBreakDuration() { return longBreakDuration; }
    public void setLongBreakDuration(int longBreakDuration) { this.longBreakDuration = longBreakDuration; }

    public int getSessionsUntilLongBreak() { return sessionsUntilLongBreak; }
    public void setSessionsUntilLongBreak(int sessionsUntilLongBreak) { this.sessionsUntilLongBreak = sessionsUntilLongBreak; }

    public boolean isAutoStartBreaks() { return autoStartBreaks; }
    public void setAutoStartBreaks(boolean autoStartBreaks) { this.autoStartBreaks = autoStartBreaks; }

    public boolean isAutoStartPomodoros() { return autoStartPomodoros; }
    public void setAutoStartPomodoros(boolean autoStartPomodoros) { this.autoStartPomodoros = autoStartPomodoros; }

    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }

    public boolean isSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(boolean soundEnabled) { this.soundEnabled = soundEnabled; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}