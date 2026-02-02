package com.campusmaster.repository;

import com.campusmaster.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    
    @Modifying
    @Query(value = "DELETE FROM submission_files WHERE submission_id IN (SELECT id FROM submissions WHERE assignment_id IN (SELECT id FROM assignments WHERE course_id = ?1))", nativeQuery = true)
    void deleteSubmissionFilesByCourseId(Long courseId);
    
    @Modifying
    @Query(value = "DELETE FROM assignment_files WHERE assignment_id IN (SELECT id FROM assignments WHERE course_id = ?1)", nativeQuery = true)
    void deleteAssignmentFilesByCourseId(Long courseId);
    
    @Modifying
    @Query("DELETE FROM Submission s WHERE s.assignment.id IN (SELECT a.id FROM Assignment a WHERE a.course.id = ?1)")
    void deleteSubmissionsByCourseId(Long courseId);
    
    @Modifying
    @Query("DELETE FROM Assignment a WHERE a.course.id = ?1")
    void deleteAssignmentsByCourseId(Long courseId);
    
    @Modifying
    @Query("DELETE FROM Material m WHERE m.course.id = ?1")
    void deleteMaterialsByCourseId(Long courseId);
}