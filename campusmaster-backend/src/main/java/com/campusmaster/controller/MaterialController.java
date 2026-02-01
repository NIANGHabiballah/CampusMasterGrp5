package com.campusmaster.controller;

import com.campusmaster.entity.Course;
import com.campusmaster.entity.Material;
import com.campusmaster.service.CourseService;
import com.campusmaster.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "http://localhost:3000")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private CourseService courseService;

    @PostMapping("/upload/{courseId}")
    public ResponseEntity<String> uploadMaterials(
            @PathVariable Long courseId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            Course course = courseService.getCourseById(courseId).orElse(null);
            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    materialService.saveMaterial(file, course);
                }
            }

            return ResponseEntity.ok("{\"message\":\"Fichiers uploadés avec succès\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Material>> getMaterialsByCourse(@PathVariable Long courseId) {
        List<Material> materials = materialService.getMaterialsByCourse(courseId);
        return ResponseEntity.ok(materials);
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Long materialId) {
        try {
            materialService.deleteMaterial(materialId);
            return ResponseEntity.ok("{\"message\":\"Support supprimé avec succès\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}