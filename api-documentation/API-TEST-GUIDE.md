# Guide de Test API CampusMaster

## Configuration

**URL de base :** `http://localhost:8082`

## Tests d'Authentification

### 1. Connexion
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@campus.sn",
    "password": "password"
  }'
```

### 2. Inscription Étudiant
```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Pierre",
    "lastName": "Martin",
    "email": "pierre.martin@campus.sn",
    "password": "password",
    "role": "STUDENT",
    "studentId": "20240002",
    "department": "Informatique"
  }'
```

### 3. Inscription Enseignant
```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sophie",
    "lastName": "Durand",
    "email": "sophie.durand@campus.sn",
    "password": "password",
    "role": "TEACHER",
    "department": "Informatique"
  }'
```

### 4. Mot de passe oublié
```bash
curl -X POST http://localhost:8082/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@campus.sn"
  }'
```

## Tests Utilisateurs

### 1. Liste des utilisateurs
```bash
curl -X GET http://localhost:8082/api/users
```

### 2. Détails d'un utilisateur
```bash
curl -X GET http://localhost:8082/api/users/1
```

### 3. Modifier un utilisateur
```bash
curl -X PUT http://localhost:8082/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+33123456789",
    "semester": "S2"
  }'
```

### 4. Approuver un utilisateur
```bash
curl -X PUT http://localhost:8082/api/users/1/approve
```

## Tests Cours

### 1. Liste des cours
```bash
curl -X GET http://localhost:8082/api/courses
```

### 2. Créer un cours
```bash
curl -X POST http://localhost:8082/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Programmation Java Avancée",
    "description": "Cours avancé sur la programmation Java avec Spring Boot",
    "semester": "S1",
    "credits": 6,
    "maxStudents": 30,
    "schedule": "Lundi 14h-16h, Mercredi 10h-12h",
    "teacher": {
      "id": 2
    }
  }'
```

### 3. Modifier un cours
```bash
curl -X PUT http://localhost:8082/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Programmation Java Avancée - Mise à jour",
    "description": "Cours avancé sur la programmation Java avec Spring Boot et microservices",
    "credits": 8,
    "maxStudents": 25
  }'
```

### 4. Supprimer un cours
```bash
curl -X DELETE http://localhost:8082/api/courses/1
```

## Tests Devoirs

### 1. Liste des devoirs
```bash
curl -X GET http://localhost:8082/api/assignments
```

### 2. Créer un devoir
```bash
curl -X POST http://localhost:8082/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TP1 - Structures de données",
    "description": "Implémentation d une liste chaînée en Java",
    "maxPoints": 20,
    "course": 1,
    "dueDate": "2024-02-15T23:59:00"
  }'
```

### 3. Modifier un devoir
```bash
curl -X PUT http://localhost:8082/api/assignments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TP1 - Structures de données - Mise à jour",
    "description": "Implémentation d une liste chaînée et d un arbre binaire",
    "maxPoints": 25,
    "course": 1,
    "dueDate": "2024-02-20T23:59:00"
  }'
```

## Tests Messages

### 1. Liste des messages
```bash
curl -X GET http://localhost:8082/api/messages
```

### 2. Envoyer un message
```bash
curl -X POST http://localhost:8082/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Question sur le TP1",
    "content": "Bonjour, j ai une question concernant l exercice 2 du TP1.",
    "senderId": 1,
    "receiverId": 2,
    "courseId": 1
  }'
```

### 3. Marquer comme favori
```bash
curl -X POST http://localhost:8082/api/messages/1/star
```

### 4. Marquer comme lu
```bash
curl -X POST http://localhost:8082/api/messages/1/mark-read
```

## Tests Notifications

### 1. Notifications d'un utilisateur
```bash
curl -X GET http://localhost:8082/api/notifications/user/1
```

### 2. Nombre de notifications non lues
```bash
curl -X GET http://localhost:8082/api/notifications/user/1/unread-count
```

### 3. Marquer notification comme lue
```bash
curl -X PUT http://localhost:8082/api/notifications/1/mark-read
```

## Scénarios de Test Complets

### Scénario 1 : Inscription et connexion
1. Inscrire un nouvel étudiant
2. Se connecter avec les identifiants
3. Vérifier les informations utilisateur

### Scénario 2 : Gestion de cours
1. Se connecter en tant qu'enseignant
2. Créer un nouveau cours
3. Modifier le cours
4. Consulter les détails du cours

### Scénario 3 : Système de messagerie
1. Envoyer un message entre utilisateurs
2. Marquer le message comme lu
3. Ajouter aux favoris
4. Vérifier les notifications

## Codes de Réponse

- **200** : Succès
- **201** : Créé avec succès
- **400** : Erreur de validation
- **401** : Non autorisé
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## Variables d'Environnement

Pour Postman, définir ces variables :
- `baseUrl` : `http://localhost:8082`
- `userId` : `1` (ou l'ID de l'utilisateur connecté)
- `token` : Token d'authentification (si implémenté)

## Comptes de test

- **Admin** : admin@campus.sn / password
- **Enseignant** : prof@campus.sn / password
- **Étudiant** : etudiant@campus.sn / password