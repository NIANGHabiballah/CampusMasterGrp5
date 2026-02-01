package com.campusmaster.controller;

import com.campusmaster.entity.Message;
import com.campusmaster.entity.User;
import com.campusmaster.entity.Course;
import com.campusmaster.entity.Notification;
import com.campusmaster.repository.MessageRepository;
import com.campusmaster.repository.UserRepository;
import com.campusmaster.repository.CourseRepository;
import com.campusmaster.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<String> createMessage(@RequestBody Map<String, Object> request) {
        try {
            Message message = new Message();
            message.setSubject((String) request.get("subject"));
            message.setContent((String) request.get("content"));

            // Sender
            Long senderId = Long.valueOf(request.get("senderId").toString());
            User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
            message.setSender(sender);

            // Receiver (optionnel)
            if (request.get("receiverId") != null && !request.get("receiverId").toString().isEmpty()) {
                Long receiverId = Long.valueOf(request.get("receiverId").toString());
                User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));
                message.setReceiver(receiver);
            }

            // Course (optionnel)
            if (request.get("courseId") != null && !request.get("courseId").toString().isEmpty()) {
                Long courseId = Long.valueOf(request.get("courseId").toString());
                Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
                message.setCourse(course);
            }

            messageRepository.save(message);
            
            // Créer une notification pour le destinataire
            if (message.getReceiver() != null) {
                Notification notification = new Notification();
                notification.setUser(message.getReceiver());
                notification.setType("message");
                notification.setTitle("Nouveau message");
                notification.setMessage("Nouveau message de " + sender.getFirstName() + " " + sender.getLastName() + ": " + message.getSubject());
                notification.setActionUrl("/messages");
                notificationRepository.save(notification);
            }
            
            return ResponseEntity.ok("{\"message\":\"Message sent successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/star")
    public ResponseEntity<String> toggleStar(@PathVariable Long id) {
        try {
            Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
            
            // Utiliser une requête SQL native pour éviter les problèmes de colonnes manquantes
            messageRepository.updateStarred(id, message.getIsStarred() != null ? !message.getIsStarred() : true);
            
            return ResponseEntity.ok("{\"message\":\"Message starred updated\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<String> toggleArchive(@PathVariable Long id) {
        try {
            Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
            
            // Utiliser une requête SQL native pour éviter les problèmes de colonnes manquantes
            messageRepository.updateArchived(id, message.getIsArchived() != null ? !message.getIsArchived() : true);
            
            return ResponseEntity.ok("{\"message\":\"Message archived updated\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        try {
            // Vérifier si le message existe
            if (!messageRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Utiliser la requête native
            messageRepository.updateReadStatus(id, true);
            return ResponseEntity.ok("{\"success\":true}");
        } catch (Exception e) {
            System.err.println("Erreur mark-read pour ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(500).body("{\"error\":\"Erreur serveur\"}");
        }
    }

    @GetMapping
    public List<Message> getMessages() {
        return messageRepository.findAll();
    }
}