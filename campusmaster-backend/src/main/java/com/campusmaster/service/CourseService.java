package com.campusmaster.service;

import com.campusmaster.entity.Course;
import com.campusmaster.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public Course createCourse(Course course) {
        // Auto-generate course code if not provided
        if (course.getCode() == null || course.getCode().isEmpty()) {
            course.setCode(generateCourseCode(course.getTitle()));
        }
        
        // Set default semester if not provided
        if (course.getSemester() == null || course.getSemester().isEmpty()) {
            course.setSemester("2024-2025");
        }
        
        return courseRepository.save(course);
    }
    
    private String generateCourseCode(String title) {
        // Generate code from title (first 3 letters + random number)
        String prefix = title.replaceAll("[^A-Za-z]", "").toUpperCase();
        if (prefix.length() > 3) {
            prefix = prefix.substring(0, 3);
        } else if (prefix.length() < 3) {
            prefix = String.format("%-3s", prefix).replace(' ', 'X');
        }
        
        // Add random number to ensure uniqueness
        int randomNum = (int) (Math.random() * 1000);
        return prefix + String.format("%03d", randomNum);
    }

    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}