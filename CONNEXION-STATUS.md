🔗 CONNEXION FRONTEND ↔ BACKEND CAMPUSMASTER

✅ BACKEND SPRING BOOT CRÉÉ :
   - Entités JPA : User, Course, Assignment, Submission
   - Repositories avec Spring Data
   - Services : AuthService, CourseService, etc.
   - Contrôleurs REST avec CRUD complet
   - Base H2 en mémoire
   - Données de test pré-chargées

✅ FRONTEND NEXT.JS CONNECTÉ :
   - Service API (/src/services/api.ts)
   - Store Zustand mis à jour (/src/store/auth.ts)
   - Store courses (/src/store/courses.ts)
   - Page courses connectée au backend

🌐 ENDPOINTS API :
   - POST /api/auth/login
   - POST /api/auth/register  
   - GET /api/courses
   - GET /api/assignments
   - GET /api/submissions

📋 COMPTES DE TEST :
   - admin@campus.fr / password
   - prof@campus.fr / password
   - etudiant@campus.fr / password

🚀 POUR TESTER :
   1. Backend : cd campusmaster-backend && ./mvnw spring-boot:run
   2. Frontend : npm run dev
   3. Ouvrir http://localhost:3000
   4. Se connecter avec un compte de test

⚡ PROCHAINES ÉTAPES :
   - Tester la connexion complète
   - Connecter les autres pages (assignments, etc.)
   - Ajouter la gestion d'erreurs
   - Implémenter JWT réel