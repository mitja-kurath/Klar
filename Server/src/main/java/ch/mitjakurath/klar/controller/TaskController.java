package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.Task;
import ch.mitjakurath.klar.service.TaskService;
import ch.mitjakurath.klar.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            return jwtUtil.getUserIdFromToken(jwt);
        }
        throw new RuntimeException("Invalid token");
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        List<Task> tasks = taskService.getAllTasksForUser(userId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody Task task) {

        String userId = getUserIdFromToken(token);
        task.setUserId(userId);
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @Valid @RequestBody Task task) {

        String userId = getUserIdFromToken(token);

        Task existingTask = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existingTask.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        task.setId(id);
        task.setUserId(userId);
        Task updatedTask = taskService.updateTask(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) {

        String userId = getUserIdFromToken(token);

        Task existingTask = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existingTask.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTask(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) {

        String userId = getUserIdFromToken(token);

        Task existingTask = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existingTask.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Task updatedTask = taskService.toggleTaskCompletion(id);
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats(
            @RequestHeader("Authorization") String token) {

        String userId = getUserIdFromToken(token);
        Map<String, Object> stats = taskService.getTaskStats(userId);
        return ResponseEntity.ok(stats);
    }
}