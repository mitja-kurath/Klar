package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.PomodoroSession;
import ch.mitjakurath.klar.service.PomodoroSessionService;
import ch.mitjakurath.klar.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private PomodoroSessionService sessionService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            return jwtUtil.getUserIdFromToken(jwt);
        }
        throw new RuntimeException("Invalid token");
    }

    @PostMapping
    public ResponseEntity<PomodoroSession> startSession(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {

        String userId = getUserIdFromToken(token);
        int duration = (Integer) request.get("duration");
        String type = (String) request.get("type");
        String taskId = (String) request.get("taskId");

        PomodoroSession session = sessionService.startSession(userId, duration, type, taskId);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PomodoroSession> updateSession(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody PomodoroSession session) {

        String userId = getUserIdFromToken(token);

        PomodoroSession existingSession = sessionService.getSessionById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!existingSession.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        session.setId(id);
        session.setUserId(userId);
        PomodoroSession updatedSession = sessionService.updateSession(session);
        return ResponseEntity.ok(updatedSession);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<PomodoroSession> completeSession(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) {

        String userId = getUserIdFromToken(token);

        PomodoroSession existingSession = sessionService.getSessionById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!existingSession.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PomodoroSession completedSession = sessionService.completeSession(id);
        return ResponseEntity.ok(completedSession);
    }

    @GetMapping
    public ResponseEntity<List<PomodoroSession>> getUserSessions(
            @RequestHeader("Authorization") String token) {

        String userId = getUserIdFromToken(token);
        List<PomodoroSession> sessions = sessionService.getUserSessions(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/today")
    public ResponseEntity<List<PomodoroSession>> getTodaySessions(
            @RequestHeader("Authorization") String token) {

        String userId = getUserIdFromToken(token);
        List<PomodoroSession> sessions = sessionService.getTodaySessions(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/focus-time/{period}")
    public ResponseEntity<Map<String, Object>> getFocusTimeStats(
            @RequestHeader("Authorization") String token,
            @PathVariable String period) {

        String userId = getUserIdFromToken(token);
        Map<String, Object> stats = sessionService.getFocusTimeStats(userId, period);
        return ResponseEntity.ok(stats);
    }
}
