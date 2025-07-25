package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.UserSettings;
import ch.mitjakurath.klar.service.UserSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private UserSettingsService settingsService;

    @GetMapping
    public ResponseEntity<UserSettings> getUserSettings(
            Authentication authentication
    ) {
        String userId = authentication.getName();
        UserSettings settings = settingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<UserSettings> updateUserSettings(
            Authentication authentication,
            @RequestBody UserSettings settings
    ) {
        String userId = authentication.getName();
        settings.setUserId(userId);
        UserSettings updatedSettings = settingsService.updateUserSettings(settings);
        return ResponseEntity.ok(updatedSettings);
    }
}