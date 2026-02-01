package com.campusmaster.controller;

import com.campusmaster.entity.Course;
import com.campusmaster.entity.Material;
import com.campusmaster.repository.CourseRepository;
import com.campusmaster.repository.MaterialRepository;
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
import java.util.Optional;

@RestController
@RequestMapping("/materials")
@CrossOrigin(origins = "http://localhost:3000")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private CourseRepository courseRepository;

    private final String uploadDir = "uploads/materials/";

    @PostMapping("/upload/{courseId}")
    public ResponseEntity<?> uploadMaterials(
            @PathVariable Long courseId,
            @RequestParam("files") MultipartFile[] files) {
        
        try {
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (!courseOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Cours non trouvé");
            }

            Course course = courseOpt.get();
            List<Material> materials = new ArrayList<>();

            // Créer le répertoire s'il n'existe pas
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = file.getOriginalFilename();
                    String filePath = uploadDir + courseId + "_" + fileName;
                    
                    // Sauvegarder le fichier
                    Path path = Paths.get(filePath);
                    Files.write(path, file.getBytes());

                    // Créer l'entité Material
                    Material material = new Material();
                    material.setTitle(fileName);
                    material.setFileName(fileName);
                    material.setFilePath(filePath);
                    material.setFileSize(file.getSize());
                    material.setFileType(getFileExtension(fileName));
                    material.setCourse(course);

                    materials.add(materialRepository.save(material));
                }
            }

            return ResponseEntity.ok(materials);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'upload: " + e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Material>> getMaterialsByCourse(@PathVariable Long courseId) {
        List<Material> materials = materialRepository.findByCourseId(courseId);
        return ResponseEntity.ok(materials);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }
}