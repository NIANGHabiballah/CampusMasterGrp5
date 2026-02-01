package com.campusmaster.controller;

import com.campusmaster.entity.Course;
import com.campusmaster.entity.User;
import com.campusmaster.service.CourseService;
import com.campusmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserService userService;
    
    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        System.out.println("\n=== GET /api/courses APPELÉ ===");
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        System.out.println("\n=== GET /api/courses/" + id + " APPELÉ ===");
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createCourse(@RequestBody Map<String, Object> courseData) {
        System.out.println("\n=== POST /api/courses APPELÉ ===");
        try {
            String title = (String) courseData.get("title");
            String description = (String) courseData.get("description");
            String semester = (String) courseData.get("semester");
            Integer credits = (Integer) courseData.get("credits");
            
            System.out.println("Création cours: " + courseData);
            
            Course course = new Course();
            course.setTitle(title);
            course.setDescription(description);
            course.setSemester(semester);
            course.setCredits(credits);
            course.setMaxStudents((Integer) courseData.get("maxStudents"));
            course.setCode(title.toUpperCase().replaceAll("[^A-Z0-9]", "").substring(0, Math.min(8, title.length())) + "-M2");
            
            // Assigner l'enseignant
            Integer teacherId = (Integer) courseData.get("teacherId");
            if (teacherId != null) {
                User teacher = userService.getUserById(teacherId.longValue()).orElse(null);
                if (teacher != null) {
                    course.setTeacher(teacher);
                }
            }
            
            Course savedCourse = courseService.createCourse(course);
            System.out.println("Cours créé: " + savedCourse.getId());
            
            return ResponseEntity.ok("{\"id\":" + savedCourse.getId() + ",\"message\":\"Cours créé avec succès\"}");
        } catch (Exception e) {
            System.err.println("Erreur création cours: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<String> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> courseData) {
        System.out.println("\n\n=== ENDPOINT PUT APPELÉ ===");
        System.out.println("URL: /api/courses/" + id);
        System.out.println("Méthode: PUT");
        System.out.println("ID: " + id);
        System.out.println("Données reçues: " + courseData);
        System.out.println("Taille des données: " + courseData.size());
        System.out.println("=== DÉBUT TRAITEMENT ===");
        
        try {
            // Vérifier que l'ID existe
            Optional<Course> existingCourseOpt = courseService.getCourseById(id);
            if (!existingCourseOpt.isPresent()) {
                System.out.println("ERREUR: Cours non trouvé avec ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            Course existingCourse = existingCourseOpt.get();
            System.out.println("Cours existant trouvé: " + existingCourse.getTitle());
            
            // Modification directe avec EntityManager
            Course managedCourse = entityManager.find(Course.class, id);
            if (managedCourse == null) {
                System.out.println("ERREUR: Cours non trouvé dans EntityManager");
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Cours managé trouvé: " + managedCourse.getTitle());
            
            // Appliquer les modifications
            boolean modified = false;
            
            if (courseData.containsKey("title")) {
                String newTitle = (String) courseData.get("title");
                System.out.println("Modification titre: " + managedCourse.getTitle() + " -> " + newTitle);
                managedCourse.setTitle(newTitle);
                modified = true;
            }
            
            if (courseData.containsKey("description")) {
                String newDesc = (String) courseData.get("description");
                System.out.println("Modification description: " + managedCourse.getDescription() + " -> " + newDesc);
                managedCourse.setDescription(newDesc);
                modified = true;
            }
            
            if (courseData.containsKey("semester")) {
                String newSemester = (String) courseData.get("semester");
                System.out.println("Modification semestre: " + managedCourse.getSemester() + " -> " + newSemester);
                managedCourse.setSemester(newSemester);
                modified = true;
            }
            
            if (courseData.containsKey("credits")) {
                Integer newCredits = (Integer) courseData.get("credits");
                System.out.println("Modification crédits: " + managedCourse.getCredits() + " -> " + newCredits);
                managedCourse.setCredits(newCredits);
                modified = true;
            }
            
            if (courseData.containsKey("maxStudents")) {
                Integer newMaxStudents = (Integer) courseData.get("maxStudents");
                System.out.println("Modification maxStudents: " + managedCourse.getMaxStudents() + " -> " + newMaxStudents);
                managedCourse.setMaxStudents(newMaxStudents);
                modified = true;
            }
            
            if (courseData.containsKey("teacherId")) {
                Integer teacherId = (Integer) courseData.get("teacherId");
                System.out.println("Modification teacherId: " + (managedCourse.getTeacher() != null ? managedCourse.getTeacher().getId() : "null") + " -> " + teacherId);
                if (teacherId != null) {
                    User teacher = userService.getUserById(teacherId.longValue()).orElse(null);
                    if (teacher != null) {
                        managedCourse.setTeacher(teacher);
                        modified = true;
                    } else {
                        System.out.println("ATTENTION: Enseignant non trouvé avec ID: " + teacherId);
                    }
                }
            }
            
            if (!modified) {
                System.out.println("ATTENTION: Aucune modification détectée");
                return ResponseEntity.ok("{\"message\":\"Aucune modification nécessaire\"}");
            }
            
            System.out.println("Forcer la synchronisation avec la base...");
            entityManager.flush();
            
            System.out.println("=== MODIFICATION RÉUSSIE ===");
            return ResponseEntity.ok("{\"message\":\"Cours modifié avec succès\"}");
            
        } catch (Exception e) {
            System.err.println("=== ERREUR MODIFICATION ===");
            System.err.println("Message: " + e.getMessage());
            System.err.println("Type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        System.out.println("\n=== DELETE /api/courses/" + id + " APPELÉ ===");
        try {
            System.out.println("Suppression cours ID: " + id);
            courseService.deleteCourse(id);
            System.out.println("Cours supprimé avec succès: " + id);
            return ResponseEntity.ok("{\"message\":\"Cours supprimé avec succès\"}");
        } catch (Exception e) {
            System.err.println("Erreur suppression cours: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}