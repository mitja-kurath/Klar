package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.UserSettings;
import ch.mitjakurath.klar.service.UserSettingsService;
import ch.mitjakurath.klar.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private UserSettingsService settingsService;

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
    public ResponseEntity<UserSettings> getUserSettings(
            @RequestHeader("Authorization") String token) {

        String userId = getUserIdFromToken(token);
        UserSettings settings = settingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<UserSettings> updateUserSettings(
            @RequestHeader("Authorization") String token,
            @RequestBody UserSettings settings) {

        String userId = getUserIdFromToken(token);
        settings.setUserId(userId);
        UserSettings updatedSettings = settingsService.updateUserSettings(settings);
        return ResponseEntity.ok(updatedSettings);
    }
}
