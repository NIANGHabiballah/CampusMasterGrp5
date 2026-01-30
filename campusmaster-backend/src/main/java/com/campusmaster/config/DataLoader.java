package com.campusmaster.config;

import com.campusmaster.entity.User;
import com.campusmaster.entity.Course;
import com.campusmaster.entity.Assignment;
import com.campusmaster.repository.UserRepository;
import com.campusmaster.repository.CourseRepository;
import com.campusmaster.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si les données existent déjà
        if (userRepository.count() > 0) {
            return; // Les données sont déjà chargées
        }

        // Créer des utilisateurs de test
        User admin = new User();
        admin.setEmail("admin@campus.fr");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setFirstName("Admin");
        admin.setLastName("Campus");
        admin.setRole(User.Role.ADMIN);
        admin.setStatus(User.Status.ACTIVE);
        userRepository.save(admin);

        User teacher = new User();
        teacher.setEmail("prof@campus.fr");
        teacher.setPassword(passwordEncoder.encode("password"));
        teacher.setFirstName("Jean");
        teacher.setLastName("Dupont");
        teacher.setRole(User.Role.TEACHER);
        teacher.setStatus(User.Status.ACTIVE);
        userRepository.save(teacher);

        User student = new User();
        student.setEmail("etudiant@campus.fr");
        student.setPassword(passwordEncoder.encode("password"));
        student.setFirstName("Marie");
        student.setLastName("Martin");
        student.setRole(User.Role.STUDENT);
        student.setStatus(User.Status.ACTIVE);
        userRepository.save(student);

        // Créer des cours de test
        Course course1 = new Course();
        course1.setTitle("Développement Web Avancé");
        course1.setDescription("Cours sur les technologies web modernes");
        course1.setCode("DWA-M2");
        course1.setCredits(6);
        course1.setSemester("S1");
        course1.setTeacher(teacher);
        courseRepository.save(course1);

        Course course2 = new Course();
        course2.setTitle("Base de Données");
        course2.setDescription("Conception et gestion de bases de données");
        course2.setCode("BDD-M2");
        course2.setCredits(4);
        course2.setSemester("S1");
        course2.setTeacher(teacher);
        courseRepository.save(course2);

        // Créer des devoirs de test
        Assignment assignment1 = new Assignment();
        assignment1.setTitle("Projet React");
        assignment1.setDescription("Créer une application React complète");
        assignment1.setCourse(course1);
        assignment1.setDueDate(LocalDateTime.now().plusDays(7));
        assignmentRepository.save(assignment1);

        Assignment assignment2 = new Assignment();
        assignment2.setTitle("Modélisation BDD");
        assignment2.setDescription("Concevoir un modèle de base de données");
        assignment2.setCourse(course2);
        assignment2.setDueDate(LocalDateTime.now().plusDays(14));
        assignmentRepository.save(assignment2);
    }
}