package com.dhyan.webauthTest.WebAuthn;

import com.dhyan.webauthTest.Users.Users;
import com.dhyan.webauthTest.Users.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Lazy
    @Autowired
    private SecurityContextHolderStrategy contextHolderStrategy;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void registerUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        usersRepository.save(user);
    }

    public void loginUser(Users user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        System.out.println("Authentication successful for user: " + authentication.getName());
        if (authentication != null && authentication.isAuthenticated()) {
            System.out.println("Authentication successful for user: " + authentication.getName());
            // You can also check user authorities if needed
            authentication.getAuthorities().forEach(authority ->
                    System.out.println("Granted authority: " + authority.getAuthority())
            );
        } else {
            System.out.println("Authentication failed for user: " + user.getUsername());
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public Optional<Users> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }
}
