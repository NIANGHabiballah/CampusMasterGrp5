# Documentation API CampusMaster

Cette documentation contient tous les éléments nécessaires pour tester et utiliser l'API REST de CampusMaster.

## 📁 Contenu du dossier

### 1. `swagger.yaml`
**Documentation OpenAPI 3.0** complète de l'API
- Tous les endpoints documentés
- Schémas de données détaillés
- Exemples de requêtes et réponses
- Codes d'erreur

**Utilisation :**
- Ouvrir avec [Swagger Editor](https://editor.swagger.io/)
- Importer dans Swagger UI
- Générer du code client automatiquement

### 2. `CampusMaster-API.postman_collection.json`
**Collection Postman** prête à l'emploi
- Toutes les requêtes pré-configurées
- Variables d'environnement
- Tests organisés par fonctionnalité

**Utilisation :**
1. Ouvrir Postman
2. Importer la collection
3. Configurer les variables d'environnement
4. Exécuter les tests

### 3. `API-TEST-GUIDE.md`
**Guide de test manuel** avec exemples curl
- Commandes curl pour chaque endpoint
- Scénarios de test complets
- Codes de réponse attendus

### 4. `test-api.sh`
**Script de test automatisé**
- Tests automatiques de tous les endpoints
- Vérification des codes de réponse
- Rapport de test coloré

**Utilisation :**
```bash
./test-api.sh
```

## 🚀 Démarrage rapide

### Prérequis
1. **Backend Spring Boot** démarré sur `http://localhost:8082`
2. **Base de données** configurée et accessible

### Test rapide avec curl
```bash
# Vérifier que l'API est accessible
curl http://localhost:8082/api/users

# Tester la connexion
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "etudiant@campus.sn", "password": "password"}'
```

### Test avec Postman
1. Importer `CampusMaster-API.postman_collection.json`
2. Définir la variable `baseUrl` = `http://localhost:8082`
3. Exécuter la collection

### Test automatisé
```bash
cd api-documentation
./test-api.sh
```

## 📊 Endpoints disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialisation

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détails utilisateur
- `PUT /api/users/{id}` - Modifier utilisateur
- `PUT /api/users/{id}/approve` - Approuver utilisateur
- `PUT /api/users/{id}/suspend` - Suspendre utilisateur
- `DELETE /api/users/{id}` - Supprimer utilisateur

### Cours
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours
- `GET /api/courses/{id}` - Détails du cours
- `PUT /api/courses/{id}` - Modifier un cours
- `DELETE /api/courses/{id}` - Supprimer un cours
- `GET /api/courses/{id}/materials` - Matériaux du cours

### Devoirs
- `GET /api/assignments` - Liste des devoirs
- `POST /api/assignments` - Créer un devoir
- `PUT /api/assignments/{id}` - Modifier un devoir

### Messages
- `GET /api/messages` - Liste des messages
- `POST /api/messages` - Envoyer un message
- `POST /api/messages/{id}/star` - Marquer favori
- `POST /api/messages/{id}/archive` - Archiver
- `POST /api/messages/{id}/mark-read` - Marquer comme lu

### Notifications
- `GET /api/notifications/user/{userId}` - Notifications utilisateur
- `GET /api/notifications/user/{userId}/unread-count` - Nombre non lues
- `PUT /api/notifications/{id}/mark-read` - Marquer comme lue

## 🔧 Configuration

### Variables d'environnement Postman
```json
{
  "baseUrl": "http://localhost:8082",
  "userId": "1",
  "token": ""
}
```

### Headers requis
```
Content-Type: application/json
```

## 📝 Exemples de données

### Inscription étudiant
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@campusmaster.com",
  "password": "password123",
  "role": "STUDENT",
  "studentId": "20240001",
  "department": "Informatique"
}
```

### Création de cours
```json
{
  "title": "Programmation Java Avancée",
  "description": "Cours avancé sur la programmation Java",
  "semester": "S1",
  "credits": 6,
  "maxStudents": 30,
  "schedule": "Lundi 14h-16h, Mercredi 10h-12h",
  "teacher": {
    "id": 2
  }
}
```

### Création de devoir
```json
{
  "title": "TP1 - Structures de données",
  "description": "Implémentation d'une liste chaînée",
  "maxPoints": 20,
  "course": 1,
  "dueDate": "2024-02-15T23:59:00"
}
```

## 🐛 Dépannage

### Erreur de connexion
- Vérifier que le backend Spring Boot est démarré
- Vérifier l'URL : `http://localhost:8082`
- Vérifier les logs du backend

### Erreur 404
- Vérifier l'URL de l'endpoint
- Vérifier que la ressource existe

### Erreur 400
- Vérifier le format JSON
- Vérifier les champs requis
- Consulter les logs du backend

## 📞 Support

Pour toute question sur l'API :
1. Consulter la documentation Swagger
2. Vérifier les exemples dans le guide de test
3. Exécuter le script de test automatisé
4. Consulter les logs du backend Spring Boot