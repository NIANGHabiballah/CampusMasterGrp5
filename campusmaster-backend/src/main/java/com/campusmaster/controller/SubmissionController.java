package com.campusmaster.controller;

import com.campusmaster.entity.Submission;
import com.campusmaster.entity.SubmissionFile;
import com.campusmaster.entity.Assignment;
import com.campusmaster.entity.User;
import com.campusmaster.service.SubmissionService;
import com.campusmaster.service.AssignmentService;
import com.campusmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.HashMap;

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

    private final String UPLOAD_DIR = "uploads/submissions/";

    @PostMapping("/test")
    public ResponseEntity<?> testSubmission() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Test endpoint works");
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {
        
        try {
            Assignment assignment = assignmentService.getAssignmentById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Devoir non trouvé"));
            
            User student = userService.getUserById(studentId)
                    .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

            // Vérifier si la date limite n'est pas dépassée
            if (assignment.getDueDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("La date limite de soumission est dépassée");
            }

            // Vérifier s'il existe déjà une soumission (pour modification)
            List<Submission> existingSubmissions = submissionService.getSubmissionsByAssignmentIdAndStudentId(assignmentId, studentId);
            Submission submission;
            
            if (!existingSubmissions.isEmpty()) {
                // Modifier la soumission existante
                submission = existingSubmissions.get(0);
                submission.setContent(content);
                submission.setSubmittedAt(LocalDateTime.now()); // Mettre à jour la date
                
                // Supprimer les anciens fichiers si de nouveaux sont fournis
                if (files != null && files.length > 0) {
                    submission.getFiles().clear();
                }
            } else {
                // Créer une nouvelle soumission
                submission = new Submission();
                submission.setAssignment(assignment);
                submission.setStudent(student);
                submission.setContent(content);
            }
            
            // Sauvegarder d'abord la soumission
            Submission savedSubmission = submissionService.saveSubmission(submission);
            
            // Traiter les fichiers si présents
            if (files != null && files.length > 0) {
                List<SubmissionFile> submissionFiles = new ArrayList<>();
                
                // Créer le dossier s'il n'existe pas
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get(UPLOAD_DIR + fileName);
                        Files.write(filePath, file.getBytes());
                        
                        SubmissionFile submissionFile = new SubmissionFile();
                        submissionFile.setSubmission(savedSubmission);
                        submissionFile.setFileName(fileName);
                        submissionFile.setOriginalName(file.getOriginalFilename());
                        submissionFile.setFilePath(filePath.toString());
                        submissionFile.setFileSize(file.getSize());
                        submissionFile.setMimeType(file.getContentType());
                        
                        submissionFiles.add(submissionFile);
                    }
                }
                
                savedSubmission.setFiles(submissionFiles);
                savedSubmission = submissionService.saveSubmission(savedSubmission);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Soumission créée avec succès");
            response.put("submissionId", savedSubmission.getId());
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'upload des fichiers: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

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