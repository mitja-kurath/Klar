package ch.mitjakurath.klar.controller;

import ch.mitjakurath.klar.model.User;
import ch.mitjakurath.klar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String userId = authentication.getName();

        return userService
                .findById(userId)
                .map(ResponseEntity::ok)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with id: " + userId
                        )
                );
    }
}