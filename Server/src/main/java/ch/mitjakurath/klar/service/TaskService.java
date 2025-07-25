package ch.mitjakurath.klar.service;

import ch.mitjakurath.klar.model.Task;
import ch.mitjakurath.klar.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasksForUser(String userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Task> getTaskById(String taskId) {
        return taskRepository.findById(taskId);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Task task) {
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public void deleteTask(String taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task toggleTaskCompletion(String taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setCompleted(!task.isCompleted());
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found");
    }

    public Map<String, Object> getTaskStats(String userId) {
        Map<String, Object> stats = new HashMap<>();

        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndCompleted(userId, true);

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        long todayCompleted = taskRepository.countByUserIdAndCompletedAndCreatedAtBetween(
                userId, true, startOfDay, endOfDay);

        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("todayCompleted", todayCompleted);
        stats.put("completionRate", totalTasks > 0 ? (double) completedTasks / totalTasks : 0.0);

        return stats;
    }
}