package com.campusmaster.controller;

import com.campusmaster.entity.Assignment;
import com.campusmaster.entity.Course;
import com.campusmaster.service.AssignmentService;
import com.campusmaster.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Assignment> getAllAssignments() {
        List<Assignment> assignments = assignmentService.getAllAssignments();
        System.out.println("=== RÉCUPÉRATION DEVOIRS ===");
        for (Assignment assignment : assignments) {
            System.out.println("Devoir: " + assignment.getTitle());
            System.out.println("Cours: " + (assignment.getCourse() != null ? assignment.getCourse().getTitle() : "null"));
        }
        return assignments;
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Map<String, Object> assignmentData) {
        System.out.println("=== CRÉATION DEVOIR ===");
        System.out.println("Données reçues: " + assignmentData);
        
        Assignment assignment = new Assignment();
        assignment.setTitle((String) assignmentData.get("title"));
        assignment.setDescription((String) assignmentData.get("description"));
        assignment.setMaxPoints((Integer) assignmentData.get("maxPoints"));
        
        // Gestion du cours
        Object courseObj = assignmentData.get("course");
        if (courseObj != null) {
            Long courseId = Long.parseLong(courseObj.toString());
            Course course = courseService.getCourseById(courseId).orElse(null);
            assignment.setCourse(course);
        }
        
        String dueDateStr = (String) assignmentData.get("dueDate");
        if (dueDateStr != null && !dueDateStr.isEmpty()) {
            assignment.setDueDate(LocalDateTime.parse(dueDateStr));
        } else {
            assignment.setDueDate(LocalDateTime.now().plusDays(7));
        }
        
        Assignment saved = assignmentService.saveAssignment(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Map<String, Object> assignmentData) {
        System.out.println("=== MODIFICATION DEVOIR ===");
        System.out.println("ID: " + id);
        System.out.println("Données: " + assignmentData);
        
        return assignmentService.getAssignmentById(id)
                .map(existing -> {
                    existing.setTitle((String) assignmentData.get("title"));
                    existing.setDescription((String) assignmentData.get("description"));
                    existing.setMaxPoints((Integer) assignmentData.get("maxPoints"));
                    
                    // Gestion du cours
                    Object courseObj = assignmentData.get("course");
                    System.out.println("Cours reçu: " + courseObj);
                    if (courseObj != null && !courseObj.toString().isEmpty()) {
                        try {
                            Long courseId;
                            if (courseObj instanceof Map) {
                                courseId = Long.parseLong(((Map<?, ?>) courseObj).get("id").toString());
                            } else {
                                courseId = Long.parseLong(courseObj.toString());
                            }
                            System.out.println("ID cours: " + courseId);
                            Course course = courseService.getCourseById(courseId).orElse(null);
                            System.out.println("Cours trouvé: " + (course != null ? course.getTitle() : "null"));
                            existing.setCourse(course);
                        } catch (Exception e) {
                            System.out.println("Erreur parsing cours: " + e.getMessage());
                        }
                    }
                    
                    String dueDateStr = (String) assignmentData.get("dueDate");
                    if (dueDateStr != null && !dueDateStr.isEmpty()) {
                        existing.setDueDate(LocalDateTime.parse(dueDateStr));
                    }
                    
                    Assignment saved = assignmentService.saveAssignment(existing);
                    System.out.println("Devoir sauvegardé avec cours: " + (saved.getCourse() != null ? saved.getCourse().getTitle() : "null"));
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}