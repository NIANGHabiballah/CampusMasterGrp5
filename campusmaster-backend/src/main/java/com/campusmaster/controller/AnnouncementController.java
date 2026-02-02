package com.campusmaster.controller;

import com.campusmaster.entity.Announcement;
import com.campusmaster.entity.Course;
import com.campusmaster.entity.User;
import com.campusmaster.service.AnnouncementService;
import com.campusmaster.service.CourseService;
import com.campusmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByAuthor(@PathVariable Long authorId) {
        List<Announcement> announcements = announcementService.getAnnouncementsByAuthor(authorId);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByCourse(@PathVariable Long courseId) {
        List<Announcement> announcements = announcementService.getAnnouncementsByCourse(courseId);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/general")
    public ResponseEntity<List<Announcement>> getGeneralAnnouncements() {
        List<Announcement> announcements = announcementService.getGeneralAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
        return announcement.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Map<String, Object> requestData) {
        try {
            Announcement announcement = new Announcement();
            announcement.setTitle((String) requestData.get("title"));
            announcement.setContent((String) requestData.get("content"));
            
            // Gestion de la priorité
            String priorityStr = (String) requestData.get("priority");
            if (priorityStr != null) {
                announcement.setPriority(Announcement.Priority.valueOf(priorityStr));
            }
            
            // Gestion du cours
            String courseIdStr = (String) requestData.get("courseId");
            if (courseIdStr != null && !courseIdStr.equals("general")) {
                Long courseId = Long.parseLong(courseIdStr);
                Optional<Course> course = courseService.getCourseById(courseId);
                course.ifPresent(announcement::setCourse);
            }
            
            // Gestion de l'auteur (temporaire - à remplacer par l'utilisateur connecté)
            Long authorId = Long.parseLong(requestData.get("authorId").toString());
            Optional<User> author = userService.getUserById(authorId);
            if (author.isPresent()) {
                announcement.setAuthor(author.get());
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            // Gestion de la date d'expiration
            String expiresAtStr = (String) requestData.get("expiresAt");
            if (expiresAtStr != null && !expiresAtStr.isEmpty()) {
                announcement.setExpiresAt(LocalDateTime.parse(expiresAtStr));
            }
            
            Announcement createdAnnouncement = announcementService.createAnnouncement(announcement);
            return ResponseEntity.ok(createdAnnouncement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        try {
            Optional<Announcement> existingAnnouncement = announcementService.getAnnouncementById(id);
            if (!existingAnnouncement.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Announcement announcement = existingAnnouncement.get();
            announcement.setTitle((String) requestData.get("title"));
            announcement.setContent((String) requestData.get("content"));
            
            String priorityStr = (String) requestData.get("priority");
            if (priorityStr != null) {
                announcement.setPriority(Announcement.Priority.valueOf(priorityStr));
            }
            
            String courseIdStr = (String) requestData.get("courseId");
            if (courseIdStr != null && !courseIdStr.equals("general")) {
                Long courseId = Long.parseLong(courseIdStr);
                Optional<Course> course = courseService.getCourseById(courseId);
                announcement.setCourse(course.orElse(null));
            } else {
                announcement.setCourse(null);
            }
            
            String expiresAtStr = (String) requestData.get("expiresAt");
            if (expiresAtStr != null && !expiresAtStr.isEmpty()) {
                announcement.setExpiresAt(LocalDateTime.parse(expiresAtStr));
            } else {
                announcement.setExpiresAt(null);
            }
            
            Announcement updatedAnnouncement = announcementService.updateAnnouncement(announcement);
            return ResponseEntity.ok(updatedAnnouncement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}