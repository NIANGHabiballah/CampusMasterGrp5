package com.campusmaster.repository;

import com.campusmaster.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true AND (a.expiresAt IS NULL OR a.expiresAt > ?1) ORDER BY a.createdAt DESC")
    List<Announcement> findActiveAnnouncements(LocalDateTime now);
    
    List<Announcement> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    
    @Query("SELECT a FROM Announcement a WHERE a.course IS NULL AND a.isActive = true ORDER BY a.createdAt DESC")
    List<Announcement> findGeneralAnnouncements();
}