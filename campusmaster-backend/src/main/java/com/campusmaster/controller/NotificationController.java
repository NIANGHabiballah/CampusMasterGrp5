package com.campusmaster.controller;

import com.campusmaster.entity.Notification;
import com.campusmaster.repository.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<String> getUserNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
            
            StringBuilder json = new StringBuilder();
            json.append("[");
            
            for (int i = 0; i < notifications.size(); i++) {
                Notification n = notifications.get(i);
                if (i > 0) json.append(",");
                
                json.append("{")
                    .append("\"id\":").append(n.getId()).append(",")
                    .append("\"type\":\"").append(n.getType()).append("\",")
                    .append("\"title\":\"").append(n.getTitle().replace("\"", "\\\"")).append("\",")
                    .append("\"message\":\"").append(n.getMessage().replace("\"", "\\\"")).append("\",")
                    .append("\"isRead\":").append(n.getIsRead()).append(",")
                    .append("\"createdAt\":\"").append(n.getCreatedAt()).append("\"")
                    .append(n.getActionUrl() != null ? ",\"actionUrl\":\"" + n.getActionUrl() + "\"" : "")
                    .append("}");
            }
            
            json.append("]");
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(json.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<String> getUnreadCount(@PathVariable Long userId) {
        try {
            Long count = notificationRepository.countUnreadByUserId(userId);
            return ResponseEntity.ok("{\"count\":" + count + "}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationRepository.findById(id).orElse(null);
            if (notification != null) {
                notification.setIsRead(true);
                notificationRepository.save(notification);
                return ResponseEntity.ok("{\"success\":true}");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}