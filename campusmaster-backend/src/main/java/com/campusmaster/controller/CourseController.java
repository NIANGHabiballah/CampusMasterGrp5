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
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Course> createCourse(@RequestBody Map<String, Object> courseData) {
        try {
            String title = (String) courseData.get("title");
            String description = (String) courseData.get("description");
            String semester = (String) courseData.get("semester");
            Integer credits = (Integer) courseData.get("credits");
            
            // Générer un code automatique
            String code = title.toUpperCase().replaceAll("[^A-Z0-9]", "").substring(0, Math.min(8, title.length())) + "-M2";
            
            // Insérer directement avec SQL natif PostgreSQL
            String sql = "INSERT INTO courses (title, description, semester, credits, code, teacher_id, created_at, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id";
            
            Long courseId = ((Number) entityManager.createNativeQuery(sql)
                .setParameter(1, title)
                .setParameter(2, description)
                .setParameter(3, semester)
                .setParameter(4, credits)
                .setParameter(5, code)
                .getSingleResult()).longValue();
            
            // Récupérer le cours créé
            Course savedCourse = courseService.getCourseById(courseId).orElse(null);
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        return updatedCourse != null ? ResponseEntity.ok(updatedCourse) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}