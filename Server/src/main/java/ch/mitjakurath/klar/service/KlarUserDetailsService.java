package ch.mitjakurath.klar.service;

import ch.mitjakurath.klar.repository.UserRepository;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class KlarUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId)
            throws UsernameNotFoundException {
        ch.mitjakurath.klar.model.User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with id : " + userId
                        )
                );

        return new User(
                user.getId(),
                "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}