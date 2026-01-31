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
        return courseRepository.save(course);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course course) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course courseToUpdate = existingCourse.get();
            if (course.getTitle() != null) courseToUpdate.setTitle(course.getTitle());
            if (course.getDescription() != null) courseToUpdate.setDescription(course.getDescription());
            if (course.getCode() != null) courseToUpdate.setCode(course.getCode());
            if (course.getCredits() != null) courseToUpdate.setCredits(course.getCredits());
            if (course.getSemester() != null) courseToUpdate.setSemester(course.getSemester());
            return courseRepository.save(courseToUpdate);
        }
        return null;
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}