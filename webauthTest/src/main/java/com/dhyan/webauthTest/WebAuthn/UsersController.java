package com.dhyan.webauthTest.WebAuthn;

import com.dhyan.webauthTest.Users.Users;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Optional;

@Controller
public class UsersController {

    @Autowired
    UsersService userService;

    @PostMapping("/api/signup")
    public ResponseEntity<String> signup(@RequestBody Users user) {

        Optional<Users> existingUserByUsername = userService.getUserByUsername(user.getUsername());
        if (existingUserByUsername.isPresent()) {
            return ResponseEntity.badRequest().body("Username already in use");
        }
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        try {
            userService.loginUser(user);
            Optional<Users> foundUser = userService.getUserByUsername(user.getUsername());

            if (foundUser.isPresent()) {
                return ResponseEntity.ok().body(Map.of(
                        "message", "Login successful",
                        "username", foundUser.get().getUsername(),
                        "email", foundUser.get().getEmail(),
                        "role", foundUser.get().getRole()
                ));

            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @GetMapping("/api/welcome")
    public ResponseEntity<String> welcome() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok("Welcome from backend "+username);
    }

}
