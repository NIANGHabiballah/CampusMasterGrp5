package com.campusmaster.repository;

import com.campusmaster.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);
    List<Message> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE messages SET is_starred = :starred WHERE id = :id", nativeQuery = true)
    void updateStarred(@Param("id") Long id, @Param("starred") Boolean starred);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE messages SET is_archived = :archived WHERE id = :id", nativeQuery = true)
    void updateArchived(@Param("id") Long id, @Param("archived") Boolean archived);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE messages SET is_read = :isRead WHERE id = :id", nativeQuery = true)
    void updateReadStatus(@Param("id") Long id, @Param("isRead") Boolean isRead);
}