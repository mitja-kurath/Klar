package ch.mitjakurath.klar.service;

import ch.mitjakurath.klar.model.PomodoroSession;
import ch.mitjakurath.klar.repository.PomodoroSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PomodoroSessionService {

    @Autowired
    private PomodoroSessionRepository sessionRepository;

    public PomodoroSession startSession(String userId, int duration, String type, String taskId) {
        PomodoroSession session = new PomodoroSession(userId, duration, type);
        session.setTaskId(taskId);
        return sessionRepository.save(session);
    }

    public Optional<PomodoroSession> getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public PomodoroSession updateSession(PomodoroSession session) {
        return sessionRepository.save(session);
    }

    public PomodoroSession completeSession(String sessionId) {
        Optional<PomodoroSession> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            PomodoroSession session = sessionOpt.get();
            session.setCompleted(true);
            return sessionRepository.save(session);
        }
        throw new RuntimeException("Session not found");
    }

    public List<PomodoroSession> getUserSessions(String userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<PomodoroSession> getTodaySessions(String userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        return sessionRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(
                userId, startOfDay, endOfDay);
    }

    public Map<String, Object> getFocusTimeStats(String userId, String period) {
        Map<String, Object> stats = new HashMap<>();
        LocalDateTime start, end;

        switch (period) {
            case "today":
                start = LocalDate.now().atStartOfDay();
                end = start.plusDays(1);
                break;
            case "week":
                start = LocalDate.now().minusDays(6).atStartOfDay();
                end = LocalDate.now().plusDays(1).atStartOfDay();
                break;
            case "month":
                start = LocalDate.now().minusDays(29).atStartOfDay();
                end = LocalDate.now().plusDays(1).atStartOfDay();
                break;
            default:
                start = LocalDate.now().atStartOfDay();
                end = start.plusDays(1);
        }

        List<PomodoroSession> sessions = sessionRepository
                .findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(userId, start, end);

        int totalMinutes = sessions.stream()
                .filter(PomodoroSession::isCompleted)
                .filter(s -> "work".equals(s.getType()))
                .mapToInt(PomodoroSession::getDuration)
                .sum();

        long completedSessions = sessions.stream()
                .filter(PomodoroSession::isCompleted)
                .filter(s -> "work".equals(s.getType()))
                .count();

        stats.put("totalMinutes", totalMinutes);
        stats.put("completedSessions", completedSessions);
        stats.put("period", period);

        return stats;
    }
}