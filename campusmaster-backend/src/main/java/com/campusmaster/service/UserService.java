package com.campusmaster.service;

import com.campusmaster.entity.User;
import com.campusmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User user) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            if (user.getFirstName() != null) userToUpdate.setFirstName(user.getFirstName());
            if (user.getLastName() != null) userToUpdate.setLastName(user.getLastName());
            if (user.getEmail() != null) userToUpdate.setEmail(user.getEmail());
            if (user.getRole() != null) userToUpdate.setRole(user.getRole());
            if (user.getStatus() != null) userToUpdate.setStatus(user.getStatus());
            if (user.getStudentId() != null) userToUpdate.setStudentId(user.getStudentId());
            if (user.getDepartment() != null) userToUpdate.setDepartment(user.getDepartment());
            if (user.getSemester() != null) userToUpdate.setSemester(user.getSemester());
            if (user.getSpecialty() != null) userToUpdate.setSpecialty(user.getSpecialty());
            if (user.getPhone() != null) userToUpdate.setPhone(user.getPhone());
            
            try {
                return userRepository.save(userToUpdate);
            } catch (Exception e) {
                System.err.println("Erreur lors de la sauvegarde: " + e.getMessage());
                throw e;
            }
        }
        return null;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}