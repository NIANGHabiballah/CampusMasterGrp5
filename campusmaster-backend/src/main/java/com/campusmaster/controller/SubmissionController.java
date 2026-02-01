package com.campusmaster.controller;

import com.campusmaster.entity.Submission;
import com.campusmaster.entity.Assignment;
import com.campusmaster.entity.User;
import com.campusmaster.service.SubmissionService;
import com.campusmaster.service.AssignmentService;
import com.campusmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return submissionService.getSubmissionsByAssignmentId(assignmentId);
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<Submission> gradeSubmission(@PathVariable Long id, @RequestBody Map<String, Object> gradeData) {
        System.out.println("=== NOTATION SOUMISSION ===");
        System.out.println("ID: " + id);
        System.out.println("Données: " + gradeData);
        
        return submissionService.getSubmissionById(id)
                .map(submission -> {
                    submission.setGrade((Integer) gradeData.get("grade"));
                    submission.setFeedback((String) gradeData.get("feedback"));
                    submission.setGradedAt(LocalDateTime.now());
                    
                    Submission saved = submissionService.saveSubmission(submission);
                    System.out.println("Soumission notée: " + saved.getGrade() + "/100");
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}