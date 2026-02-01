package com.campusmaster.repository;

import com.campusmaster.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = ?1 AND n.isRead = false")
    Long countUnreadByUserId(Long userId);
}