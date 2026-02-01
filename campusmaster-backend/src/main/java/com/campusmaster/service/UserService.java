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
        System.out.println("Service updateUser - ID: " + id);
        System.out.println("Données à modifier: " + user);
        
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            System.out.println("Utilisateur existant trouvé: " + userToUpdate.getEmail());
            
            if (user.getFirstName() != null) {
                System.out.println("Modification firstName: " + userToUpdate.getFirstName() + " -> " + user.getFirstName());
                userToUpdate.setFirstName(user.getFirstName());
            }
            if (user.getLastName() != null) {
                System.out.println("Modification lastName: " + userToUpdate.getLastName() + " -> " + user.getLastName());
                userToUpdate.setLastName(user.getLastName());
            }
            if (user.getEmail() != null) {
                System.out.println("Modification email: " + userToUpdate.getEmail() + " -> " + user.getEmail());
                userToUpdate.setEmail(user.getEmail());
            }
            if (user.getRole() != null) userToUpdate.setRole(user.getRole());
            if (user.getStatus() != null) userToUpdate.setStatus(user.getStatus());
            if (user.getStudentId() != null) {
                System.out.println("Modification studentId: " + userToUpdate.getStudentId() + " -> " + user.getStudentId());
                userToUpdate.setStudentId(user.getStudentId());
            }
            if (user.getDepartment() != null) userToUpdate.setDepartment(user.getDepartment());
            if (user.getSemester() != null) userToUpdate.setSemester(user.getSemester());
            if (user.getSpecialty() != null) userToUpdate.setSpecialty(user.getSpecialty());
            if (user.getPhone() != null) {
                System.out.println("Modification phone: " + userToUpdate.getPhone() + " -> " + user.getPhone());
                userToUpdate.setPhone(user.getPhone());
            }
            if (user.getAddress() != null) {
                System.out.println("Modification address: " + userToUpdate.getAddress() + " -> " + user.getAddress());
                userToUpdate.setAddress(user.getAddress());
            }
            if (user.getBio() != null) {
                System.out.println("Modification bio: " + userToUpdate.getBio() + " -> " + user.getBio());
                userToUpdate.setBio(user.getBio());
            }
            
            try {
                User savedUser = userRepository.save(userToUpdate);
                System.out.println("Utilisateur sauvegardé avec succès");
                return savedUser;
            } catch (Exception e) {
                System.err.println("Erreur lors de la sauvegarde: " + e.getMessage());
                throw e;
            }
        }
        System.out.println("Utilisateur non trouvé avec ID: " + id);
        return null;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}