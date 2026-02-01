package com.campusmaster.controller;

import com.campusmaster.dto.LoginRequest;
import com.campusmaster.dto.RegisterRequest;
import com.campusmaster.dto.RegisterResponse;
import com.campusmaster.entity.User;
import com.campusmaster.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("user", user.get());
            response.put("token", "mock-token-" + user.get().getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerData) {
        try {
            System.out.println("=== INSCRIPTION ===");
            System.out.println("Données reçues: " + registerData);
            
            RegisterRequest request = new RegisterRequest();
            request.setFirstName(registerData.get("firstName"));
            request.setLastName(registerData.get("lastName"));
            request.setEmail(registerData.get("email"));
            request.setPassword(registerData.get("password"));
            request.setRole(registerData.get("role"));
            request.setStudentId(registerData.get("studentId"));
            request.setDepartment(registerData.get("department"));
            
            RegisterResponse response = authService.register(request);
            System.out.println("Utilisateur créé: " + response.getUser().getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Erreur inscription: " + e.getMessage());
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}