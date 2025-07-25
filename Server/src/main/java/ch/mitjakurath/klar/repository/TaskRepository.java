package ch.mitjakurath.klar.repository;

import ch.mitjakurath.klar.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Task> findByUserIdAndCompletedOrderByCreatedAtDesc(String userId, boolean completed);
    long countByUserIdAndCompleted(String userId, boolean completed);
    long countByUserIdAndCompletedAndCreatedAtBetween(String userId, boolean completed, LocalDateTime start, LocalDateTime end);
}