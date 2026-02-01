package com.campusmaster.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DatabaseFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Exécuter le script de correction
            ClassPathResource resource = new ClassPathResource("fix_status.sql");
            String sql = new String(Files.readAllBytes(Paths.get(resource.getURI())));
            
            String[] statements = sql.split(";");
            for (String statement : statements) {
                if (!statement.trim().isEmpty()) {
                    jdbcTemplate.execute(statement.trim());
                }
            }
            
            System.out.println("Contrainte de statut corrigée avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de la correction de la contrainte: " + e.getMessage());
        }
    }
}