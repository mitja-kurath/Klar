// src/main/java/ch/mitjakurath/klar/config/OAuth2LoginSuccessHandler.java
package ch.mitjakurath.klar.config;

import ch.mitjakurath.klar.model.User;
import ch.mitjakurath.klar.service.UserService;
import ch.mitjakurath.klar.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OAuth2LoginSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.oauth2.redirectUri:http://localhost:1420/}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        User user = userService
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found in database after OAuth2 login"
                        )
                );

        String token = jwtUtil.generateToken(user.getId());

        String targetUrl = UriComponentsBuilder
                .fromUriString(redirectUri)
                .queryParam("success", "true")
                .queryParam("token", token)
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}