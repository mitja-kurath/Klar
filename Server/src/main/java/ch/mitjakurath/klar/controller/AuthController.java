package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.User;
import ch.mitjakurath.klar.service.UserService;
import ch.mitjakurath.klar.util.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private <T> ResponseEntity<T> processAuthenticatedUserRequest(
            OAuth2User oauth2User,
            Function<User, ResponseEntity<T>> onSuccess
    ) {
        if (oauth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = oauth2User.getAttribute("email");
        return userService
                .findByEmail(email)
                .map(onSuccess)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @AuthenticationPrincipal OAuth2User oauth2User
    ) {
        return processAuthenticatedUserRequest(
                oauth2User,
                user -> {
                    String token = jwtUtil.generateToken(user.getId());
                    Map<String, Object> response = new HashMap<>();
                    response.put("user", user);
                    response.put("token", token);
                    return ResponseEntity.ok(response);
                }
        );
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(
            @AuthenticationPrincipal OAuth2User oauth2User
    ) {
        return processAuthenticatedUserRequest(
                oauth2User,
                user -> {
                    String token = jwtUtil.generateToken(user.getId());
                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    return ResponseEntity.ok(response);
                }
        );
    }
}