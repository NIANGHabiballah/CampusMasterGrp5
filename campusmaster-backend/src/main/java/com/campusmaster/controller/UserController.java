package com.campusmaster.controller;

import com.campusmaster.entity.User;
import com.campusmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            System.out.println("\n=== MODIFICATION UTILISATEUR ===");
            System.out.println("ID: " + id);
            System.out.println("Données reçues: " + user);
            
            Optional<User> existingUserOpt = userService.getUserById(id);
            if (!existingUserOpt.isPresent()) {
                System.out.println("Utilisateur non trouvé avec ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            User existingUser = existingUserOpt.get();
            
            // Mettre à jour seulement les champs non null
            if (user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
            if (user.getLastName() != null) existingUser.setLastName(user.getLastName());
            if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
            if (user.getRole() != null) existingUser.setRole(user.getRole());
            if (user.getStatus() != null) existingUser.setStatus(user.getStatus());
            if (user.getStudentId() != null) existingUser.setStudentId(user.getStudentId());
            if (user.getDepartment() != null) existingUser.setDepartment(user.getDepartment());
            if (user.getSemester() != null) existingUser.setSemester(user.getSemester());
            if (user.getSpecialty() != null) existingUser.setSpecialty(user.getSpecialty());
            if (user.getPhone() != null) existingUser.setPhone(user.getPhone());
            
            User updatedUser = userService.updateUser(existingUser);
            System.out.println("Utilisateur modifié avec succès: " + updatedUser.getEmail());
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception e) {
            System.err.println("Erreur lors de la modification: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setStatus(User.Status.APPROVED);
                User updatedUser = userService.updateUser(user);
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setStatus(User.Status.SUSPENDED);
                User updatedUser = userService.updateUser(user);
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}