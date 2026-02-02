package com.campusmaster.repository;

import com.campusmaster.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);
    List<User> findByRole(User.Role role);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.email = :newEmail WHERE u.email = :oldEmail")
    void updateEmailByOldEmail(String oldEmail, String newEmail);
}