package ch.mitjakurath.klar.service;

import ch.mitjakurath.klar.model.UserSettings;
import ch.mitjakurath.klar.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSettingsService {

    @Autowired
    private UserSettingsRepository settingsRepository;

    public UserSettings getUserSettings(String userId) {
        Optional<UserSettings> settings = settingsRepository.findByUserId(userId);
        if (settings.isPresent()) {
            return settings.get();
        }

        UserSettings defaultSettings = new UserSettings(userId);
        return settingsRepository.save(defaultSettings);
    }

    public UserSettings updateUserSettings(UserSettings settings) {
        return settingsRepository.save(settings);
    }
}