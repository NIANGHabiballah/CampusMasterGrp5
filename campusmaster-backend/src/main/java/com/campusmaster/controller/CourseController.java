package com.campusmaster.controller;

import com.campusmaster.entity.Course;
import com.campusmaster.service.CourseService;
import com.campusmaster.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        // Si professorId est fourni, récupérer le professeur
        if (course.getTeacher() != null && course.getTeacher().getId() != null) {
            // Le teacher sera automatiquement résolu par JPA
        }
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        course.setId(id);
        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        System.out.println("\n=== CONTROLLER: DELETE /api/courses/" + id + " ===");
        
        try {
            // Suppression SQL directe
            courseRepository.deleteSubmissionFilesByCourseId(id);
            courseRepository.deleteAssignmentFilesByCourseId(id);
            courseRepository.deleteSubmissionsByCourseId(id);
            courseRepository.deleteAssignmentsByCourseId(id);
            courseRepository.deleteMaterialsByCourseId(id);
            courseRepository.deleteById(id);
            
            System.out.println("Cours supprimé avec succès: " + id);
            return ResponseEntity.ok("{\"success\": true}");
        } catch (Exception e) {
            System.err.println("Erreur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok("{\"success\": false}");
        }
    }

    @GetMapping("/{id}/materials")
    public ResponseEntity<?> getCourseMaterials(@PathVariable Long id) {
        Optional<Course> courseOpt = courseService.getCourseById(id);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            return ResponseEntity.ok(course.getMaterials());
        }
        return ResponseEntity.notFound().build();
    }
}