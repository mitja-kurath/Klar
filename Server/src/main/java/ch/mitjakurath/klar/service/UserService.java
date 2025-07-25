package ch.mitjakurath.klar.service;

import ch.mitjakurath.klar.model.User;
import ch.mitjakurath.klar.model.UserSettings;
import ch.mitjakurath.klar.repository.UserRepository;
import ch.mitjakurath.klar.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    public User findOrCreateUser(OAuth2User oAuth2User, String provider) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("id").toString();
        String avatarUrl = oAuth2User.getAttribute("avatar_url");

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User(email, name, provider, providerId);
        newUser.setAvatarUrl(avatarUrl);
        User savedUser = userRepository.save(newUser);

        UserSettings settings = new UserSettings(savedUser.getId());
        userSettingsRepository.save(settings);

        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
