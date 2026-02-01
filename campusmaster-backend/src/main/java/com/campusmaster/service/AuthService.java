package com.campusmaster.service;

import com.campusmaster.dto.*;
import com.campusmaster.entity.User;
import com.campusmaster.entity.Notification;
import com.campusmaster.repository.UserRepository;
import com.campusmaster.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }
        
        UserDto userDto = new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole().toString(),
            user.getStatus().toString()
        );
        
        return new LoginResponse("mock-jwt-token", userDto);
    }

    public RegisterResponse register(RegisterRequest request) throws Exception {
        // Validation des champs obligatoires
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new Exception("Le prénom est obligatoire");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new Exception("Le nom est obligatoire");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new Exception("L'email est obligatoire");
        }
        
        // Validation format email
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (!request.getEmail().matches(emailRegex)) {
            throw new Exception("Format d'email invalide");
        }
        
        // Validation téléphone si renseigné
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            String phoneRegex = "^[+]?[0-9\\s\\-()]{8,15}$";
            if (!request.getPhone().matches(phoneRegex)) {
                throw new Exception("Format de téléphone invalide");
            }
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Cet email existe déjà");
        }
        
        // Vérification unicité numéro étudiant
        if (request.getStudentId() != null && !request.getStudentId().trim().isEmpty()) {
            if (userRepository.existsByStudentId(request.getStudentId())) {
                throw new Exception("Ce numéro étudiant existe déjà");
            }
        }
        
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setStatus(User.Status.ACTIVE);
        
        // Ajouter les nouveaux champs
        if (request.getStudentId() != null && !request.getStudentId().isEmpty()) {
            user.setStudentId(request.getStudentId());
        }
        if (request.getDepartment() != null && !request.getDepartment().isEmpty()) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getSemester() != null && !request.getSemester().isEmpty()) {
            user.setSemester(request.getSemester());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        
        User savedUser = userRepository.save(user);
        
        UserDto userDto = new UserDto(
            savedUser.getId(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getEmail(),
            savedUser.getRole().toString(),
            savedUser.getStatus().toString()
        );
        
        return new RegisterResponse("User registered successfully", userDto);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        
        return Optional.empty();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}