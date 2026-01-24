<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\CourseEnrollment;
use App\Models\Message;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create users
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Système',
            'email' => 'admin@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'status' => 'ACTIVE'
        ]);

        $teacher = User::create([
            'first_name' => 'Prof. Jean',
            'last_name' => 'Martin',
            'email' => 'prof@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'TEACHER',
            'status' => 'ACTIVE'
        ]);

        $student = User::create([
            'first_name' => 'Marie',
            'last_name' => 'Dupont',
            'email' => 'etudiant@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'student_id' => 'M2-2024-001'
        ]);

        // Create courses
        $course1 = Course::create([
            'title' => 'React Avancé',
            'description' => 'Développement d\'applications React complexes avec hooks avancés, context API et optimisations.',
            'teacher_id' => $teacher->id,
            'semester' => 'S1 2024',
            'credits' => 6
        ]);

        $course2 = Course::create([
            'title' => 'Node.js Backend',
            'description' => 'Création d\'APIs REST avec Node.js, Express et bases de données.',
            'teacher_id' => $teacher->id,
            'semester' => 'S1 2024',
            'credits' => 4
        ]);

        // Enroll student
        CourseEnrollment::create([
            'course_id' => $course1->id,
            'user_id' => $student->id,
            'enrolled_at' => now(),
            'status' => 'ACTIVE'
        ]);

        CourseEnrollment::create([
            'course_id' => $course2->id,
            'user_id' => $student->id,
            'enrolled_at' => now(),
            'status' => 'ACTIVE'
        ]);

        // Create assignments
        Assignment::create([
            'course_id' => $course1->id,
            'title' => 'Projet React - Todo App',
            'description' => 'Créer une application Todo avec React, TypeScript et localStorage.',
            'due_date' => now()->addDays(7),
            'max_points' => 20
        ]);

        Assignment::create([
            'course_id' => $course2->id,
            'title' => 'API REST avec Express',
            'description' => 'Développer une API complète avec authentification JWT.',
            'due_date' => now()->addDays(14),
            'max_points' => 25
        ]);

        // Create messages
        Message::create([
            'sender_id' => $teacher->id,
            'receiver_id' => $student->id,
            'subject' => 'Bienvenue dans le cours React',
            'content' => 'Bonjour Marie, bienvenue dans le cours React Avancé. N\'hésitez pas si vous avez des questions.',
            'is_read' => false
        ]);
    }
}