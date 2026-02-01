package com.campusmaster.controller;

import com.campusmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/update-emails")
    public ResponseEntity<String> updateEmails() {
        try {
            userRepository.updateEmailByOldEmail("admin@campus.fr", "admin@campus.sn");
            userRepository.updateEmailByOldEmail("prof@campus.fr", "prof@campus.sn");
            userRepository.updateEmailByOldEmail("etudiant@campus.fr", "etudiant@campus.sn");
            return ResponseEntity.ok("{\"message\":\"Emails updated successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}