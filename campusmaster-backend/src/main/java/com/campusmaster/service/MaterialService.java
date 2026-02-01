package com.campusmaster.service;

import com.campusmaster.entity.Course;
import com.campusmaster.entity.Material;
import com.campusmaster.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    private final String uploadDir = "uploads/materials/";

    public Material saveMaterial(MultipartFile file, Course course) throws IOException {
        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath);

        // Créer l'entité Material
        Material material = new Material();
        material.setFileName(file.getOriginalFilename());
        material.setFilePath(filePath.toString());
        material.setFileType(file.getContentType());
        material.setFileSize(file.getSize());
        material.setCourse(course);

        return materialRepository.save(material);
    }

    public List<Material> getMaterialsByCourse(Long courseId) {
        return materialRepository.findByCourseId(courseId);
    }

    public void deleteMaterial(Long materialId) {
        materialRepository.deleteById(materialId);
    }
}