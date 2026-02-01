package com.campusmaster.service;

import com.campusmaster.entity.Assignment;
import com.campusmaster.entity.Submission;
import com.campusmaster.repository.AssignmentRepository;
import com.campusmaster.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public List<Assignment> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseIdOrderByDueDateAsc(courseId);
    }

    public Assignment saveAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
    
    // Méthodes pour les soumissions
    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }
    
    public List<Submission> getUngraded() {
        return submissionRepository.findByGradeIsNull();
    }
    
    public Submission gradeSubmission(Long submissionId, Integer grade, String feedback, Long gradedById) {
        Optional<Submission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            submission.setGrade(grade);
            submission.setFeedback(feedback);
            submission.setGradedAt(LocalDateTime.now());
            // submission.setGradedBy(userService.getUserById(gradedById).orElse(null));
            return submissionRepository.save(submission);
        }
        return null;
    }
}