package com.dhyan.webauthTest.WebAuthn;

import com.dhyan.webauthTest.DTO.LoginRequest;
import com.dhyan.webauthTest.DTO.SignUpDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
public class UsersController {

    @Autowired
    UsersService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignUpDTO signupRequest) {
        Map<String, String> response = new HashMap<>();
        if (userService.existsByUsername(signupRequest.getUsername())) {
            response.put("message", "Username is already taken");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        try {
            userService.registerUser(signupRequest);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "An error occurred during registration.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        return "User logged in successfully";
    }

    @GetMapping("/logout")
    public String logout() {
        return "User logged out successfully";
    }

    @GetMapping("/session")
    public String session(HttpSession session) {
        long creationTime = session.getCreationTime();
        Date creationDate = new Date(creationTime);

        // Format the date to a readable string
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateFormat.format(creationDate);
    }

    @GetMapping("/api/welcome")
    public ResponseEntity<String> welcome(HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            System.out.println("Session ID at welcome: " + session.getId());
        } else {
            System.out.println("No session found at welcome.");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        String username = auth.getName();
        return ResponseEntity.ok("Welcome " + username);
    }

}
