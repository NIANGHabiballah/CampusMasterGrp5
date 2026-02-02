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
        try {
            System.out.println("\n=== MODIFICATION COURS ===");
            System.out.println("ID: " + id);
            System.out.println("Données reçues: " + course);
            
            Optional<Course> existingCourseOpt = courseService.getCourseById(id);
            if (!existingCourseOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Course existingCourse = existingCourseOpt.get();
            
            // Mettre à jour les champs
            if (course.getTitle() != null) existingCourse.setTitle(course.getTitle());
            if (course.getDescription() != null) existingCourse.setDescription(course.getDescription());
            if (course.getSemester() != null) existingCourse.setSemester(course.getSemester());
            if (course.getCredits() != null) existingCourse.setCredits(course.getCredits());
            if (course.getMaxStudents() != null) existingCourse.setMaxStudents(course.getMaxStudents());
            if (course.getSchedule() != null) existingCourse.setSchedule(course.getSchedule());
            if (course.getTeacher() != null) existingCourse.setTeacher(course.getTeacher());
            
            Course updatedCourse = courseService.updateCourse(existingCourse);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            System.err.println("Erreur modification cours: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            System.out.println("\n=== SUPPRESSION COURS ===");
            System.out.println("ID: " + id);
            
            Optional<Course> courseOpt = courseService.getCourseById(id);
            if (!courseOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            courseService.deleteCourse(id);
            System.out.println("Cours supprimé avec succès: " + id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Erreur suppression cours: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
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