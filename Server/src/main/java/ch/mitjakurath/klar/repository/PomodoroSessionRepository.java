package ch.mitjakurath.klar.repository;

import ch.mitjakurath.klar.model.PomodoroSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PomodoroSessionRepository extends MongoRepository<PomodoroSession, String> {
    List<PomodoroSession> findByUserIdOrderByCreatedAtDesc(String userId);
    List<PomodoroSession> findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(String userId, LocalDateTime start, LocalDateTime end);
    long countByUserIdAndCompletedAndStartTimeBetween(String userId, boolean completed, LocalDateTime start, LocalDateTime end);
}