<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\CourseEnrollment;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Système',
            'email' => 'admin@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        // Create teacher users
        $teacher1 = User::create([
            'first_name' => 'Prof. Jean',
            'last_name' => 'Martin',
            'email' => 'prof@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'TEACHER',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        $teacher2 = User::create([
            'first_name' => 'Dr. Sophie',
            'last_name' => 'Bernard',
            'email' => 'prof2@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'TEACHER',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        // Create student user
        $student = User::create([
            'first_name' => 'Marie',
            'last_name' => 'Dupont',
            'email' => 'etudiant@campus.fr',
            'password' => Hash::make('password'),
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'student_id' => '20240001',
            'email_verified_at' => now(),
        ]);

        // Create additional students
        for ($i = 2; $i <= 10; $i++) {
            User::create([
                'first_name' => "Étudiant{$i}",
                'last_name' => "Test{$i}",
                'email' => "etudiant{$i}@campus.fr",
                'password' => Hash::make('password'),
                'role' => 'STUDENT',
                'status' => 'ACTIVE',
                'student_id' => '202400' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'email_verified_at' => now(),
            ]);
        }

        // Create courses
        $course1 = Course::create([
            'title' => 'Architecture Logicielle',
            'description' => 'Conception et développement d\'architectures logicielles modernes',
            'teacher_id' => $teacher1->id,
            'semester' => '2024-1',
            'credits' => 4,
            'status' => 'ACTIVE',
            'max_students' => 30,
        ]);

        $course2 = Course::create([
            'title' => 'Intelligence Artificielle',
            'description' => 'Introduction aux concepts et techniques d\'IA',
            'teacher_id' => $teacher2->id,
            'semester' => '2024-1',
            'credits' => 3,
            'status' => 'ACTIVE',
            'max_students' => 25,
        ]);

        $course3 = Course::create([
            'title' => 'Sécurité Informatique',
            'description' => 'Principes et pratiques de la sécurité informatique',
            'teacher_id' => $teacher1->id,
            'semester' => '2024-1',
            'credits' => 3,
            'status' => 'ACTIVE',
            'max_students' => 35,
        ]);

        // Enroll students in courses
        $students = User::where('role', 'STUDENT')->take(5)->get();
        
        foreach ([$course1, $course2, $course3] as $course) {
            foreach ($students as $student) {
                CourseEnrollment::create([
                    'course_id' => $course->id,
                    'student_id' => $student->id,
                    'enrolled_at' => now(),
                    'status' => 'ENROLLED',
                ]);
            }
        }

        // Create assignments
        Assignment::create([
            'title' => 'Projet Microservices',
            'description' => 'Développer une architecture microservices complète',
            'course_id' => $course1->id,
            'due_date' => now()->addDays(30),
            'max_points' => 100,
            'status' => 'PUBLISHED',
            'allow_late_submission' => true,
            'late_penalty_percent' => 10,
        ]);

        Assignment::create([
            'title' => 'Analyse IA',
            'description' => 'Analyser un algorithme d\'intelligence artificielle',
            'course_id' => $course2->id,
            'due_date' => now()->addDays(25),
            'max_points' => 80,
            'status' => 'PUBLISHED',
            'allow_late_submission' => false,
        ]);

        echo "✅ Database seeded successfully!\n";
        echo "📧 Test accounts:\n";
        echo "   Admin: admin@campus.fr / password\n";
        echo "   Teacher: prof@campus.fr / password\n";
        echo "   Student: etudiant@campus.fr / password\n";
    }
}