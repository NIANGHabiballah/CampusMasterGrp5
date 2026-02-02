package com.campusmaster.service;

import com.campusmaster.entity.Announcement;
import com.campusmaster.entity.Notification;
import com.campusmaster.entity.User;
import com.campusmaster.repository.AnnouncementRepository;
import com.campusmaster.repository.NotificationRepository;
import com.campusmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public List<Announcement> getAnnouncementsByAuthor(Long authorId) {
        return announcementRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }

    public List<Announcement> getAnnouncementsByCourse(Long courseId) {
        return announcementRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    public List<Announcement> getGeneralAnnouncements() {
        return announcementRepository.findGeneralAnnouncements();
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        
        // Créer des notifications pour tous les étudiants
        createNotificationsForStudents(savedAnnouncement);
        
        return savedAnnouncement;
    }
    
    private void createNotificationsForStudents(Announcement announcement) {
        try {
            // Récupérer tous les étudiants
            List<User> students = userRepository.findByRole(User.Role.STUDENT);
            
            for (User student : students) {
                Notification notification = new Notification();
                notification.setUser(student);
                notification.setType("announcement");
                notification.setTitle("Nouvelle annonce: " + announcement.getTitle());
                notification.setMessage(announcement.getContent().length() > 100 ? 
                    announcement.getContent().substring(0, 100) + "..." : 
                    announcement.getContent());
                notification.setActionUrl("/dashboard"); // Redirection vers le dashboard
                notification.setIsRead(false);
                
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            // Log l'erreur mais ne pas faire échouer la création de l'annonce
            System.err.println("Erreur lors de la création des notifications: " + e.getMessage());
        }
    }

    public Announcement updateAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}