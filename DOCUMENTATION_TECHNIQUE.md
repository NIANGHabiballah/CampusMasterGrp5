# Documentation Technique CampusMaster

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Technologies](#technologies)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Base de données](#base-de-données)
7. [API REST](#api-rest)
8. [Sécurité](#sécurité)
9. [Tests](#tests)
10. [Déploiement](#déploiement)
11. [Maintenance](#maintenance)

## 🎯 Vue d'ensemble

CampusMaster est une plateforme pédagogique moderne développée avec une architecture full-stack :
- **Frontend** : Next.js 14 avec TypeScript
- **Backend** : Spring Boot 3.5.10 avec Java 17
- **Base de données** : PostgreSQL 15
- **API** : REST avec documentation OpenAPI

### Fonctionnalités principales
- Gestion des utilisateurs (étudiants, enseignants, administrateurs)
- Système de cours et devoirs
- Messagerie interne
- Notifications temps réel
- Interface responsive

## 🏗️ Architecture

### Architecture générale
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JPA/Hibernate    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │   Backend       │ ◄──────────────────► │   PostgreSQL    │
│   Next.js       │                 │   Spring Boot   │                     │   Database      │
│   Port 3000     │                 │   Port 8082     │                     │   Port 5432     │
└─────────────────┘                 └─────────────────┘                     └─────────────────┘
```

### Structure Backend
```
src/main/java/com/campusmaster/
├── config/          # Configuration (Security, CORS, DataLoader)
├── controller/      # Contrôleurs REST
├── dto/            # Data Transfer Objects
├── entity/         # Entités JPA
├── repository/     # Repositories Spring Data
├── service/        # Services métier
└── CampusmasterBackendApplication.java
```

### Structure Frontend
```
src/
├── app/            # Pages Next.js (App Router)
├── components/     # Composants réutilisables
├── contexts/       # Contextes React
├── hooks/          # Hooks personnalisés
├── lib/            # Utilitaires
├── services/       # Services API
├── store/          # État global (Zustand)
└── types/          # Types TypeScript
```

## 🛠️ Technologies

### Backend
- **Framework** : Spring Boot 3.5.10
- **Langage** : Java 17
- **Base de données** : PostgreSQL 15
- **ORM** : Hibernate/JPA
- **Sécurité** : Spring Security
- **Build** : Maven
- **Documentation** : OpenAPI/Swagger

### Frontend
- **Framework** : Next.js 14
- **Langage** : TypeScript
- **Styling** : TailwindCSS + Shadcn UI
- **État** : Zustand
- **Formulaires** : React Hook Form + Zod
- **HTTP** : Axios avec intercepteurs

### Outils de développement
- **IDE** : IntelliJ IDEA / VS Code
- **Contrôle de version** : Git
- **Tests API** : Postman, curl
- **Base de données** : pgAdmin, H2 Console

## 🚀 Installation

### Prérequis
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Installation Backend
```bash
cd campusmaster-backend

# Installer les dépendances
./mvnw clean install

# Démarrer l'application
./mvnw spring-boot:run
```

### Installation Frontend
```bash
cd campusmaster

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement Backend
```properties
# application.properties
server.port=8082
spring.datasource.url=jdbc:postgresql://localhost:5432/campusmaster
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Variables d'environnement Frontend
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8082
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configuration CORS
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    return source;
}
```

## 🗄️ Base de données

### Schéma principal
```sql
-- Utilisateurs
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    student_id VARCHAR(100),
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cours
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    semester VARCHAR(50),
    credits INTEGER,
    max_students INTEGER,
    schedule VARCHAR(255),
    teacher_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devoirs
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_points INTEGER,
    due_date TIMESTAMP,
    course_id BIGINT REFERENCES courses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relations
- **User** ↔ **Course** (Many-to-One : teacher)
- **Course** ↔ **Assignment** (One-to-Many)
- **User** ↔ **Message** (Many-to-One : sender/receiver)
- **User** ↔ **Notification** (One-to-Many)

## 🔌 API REST

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié

#### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détails utilisateur
- `PUT /api/users/{id}` - Modifier utilisateur
- `PUT /api/users/{id}/approve` - Approuver utilisateur

#### Cours
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours
- `PUT /api/courses/{id}` - Modifier un cours
- `DELETE /api/courses/{id}` - Supprimer un cours

#### Devoirs
- `GET /api/assignments` - Liste des devoirs
- `POST /api/assignments` - Créer un devoir
- `PUT /api/assignments/{id}` - Modifier un devoir

### Format des réponses
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@campus.sn",
  "role": "STUDENT",
  "status": "APPROVED",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Codes de statut
- **200** : Succès
- **201** : Créé
- **400** : Erreur de validation
- **401** : Non autorisé
- **404** : Non trouvé
- **500** : Erreur serveur

## 🔒 Sécurité

### Configuration Spring Security
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
```

### Validation des données
- Validation côté client avec Zod
- Validation côté serveur avec Bean Validation
- Sanitisation des entrées utilisateur

### Mots de passe
- Hachage avec BCrypt
- Politique de mot de passe forte
- Réinitialisation sécurisée

## 🧪 Tests

### Tests automatisés
```bash
# Script de test complet
./api-documentation/test-api.sh

# Test manuel avec curl
curl -X GET http://localhost:8082/api/users
```

### Tests avec Postman
1. Importer `CampusMaster-API.postman_collection.json`
2. Configurer `baseUrl = http://localhost:8082`
3. Exécuter la collection

### Comptes de test
- **Admin** : admin@campus.sn / password
- **Enseignant** : prof@campus.sn / password
- **Étudiant** : etudiant@campus.sn / password

## 🚀 Déploiement

### Environnement de développement
```bash
# Backend
cd campusmaster-backend
./mvnw spring-boot:run

# Frontend
cd campusmaster
npm run dev
```

### Build de production
```bash
# Backend
./mvnw clean package
java -jar target/campusmaster-backend-1.0.0.jar

# Frontend
npm run build
npm start
```

### Docker (optionnel)
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jdk-slim
COPY target/campusmaster-backend-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🔧 Maintenance

### Logs
- **Backend** : Logs Spring Boot dans la console
- **Frontend** : Logs Next.js dans la console
- **Base de données** : Logs PostgreSQL

### Monitoring
- Vérification de l'état des services
- Surveillance des performances
- Alertes en cas d'erreur

### Sauvegarde
```bash
# Sauvegarde PostgreSQL
pg_dump -U postgres campusmaster > backup.sql

# Restauration
psql -U postgres -d campusmaster < backup.sql
```

### Mise à jour
1. Sauvegarder la base de données
2. Mettre à jour le code
3. Exécuter les migrations
4. Redémarrer les services
5. Vérifier le fonctionnement

## 📞 Support

### Dépannage courant
- **Port déjà utilisé** : Changer le port dans application.properties
- **Erreur de connexion DB** : Vérifier PostgreSQL et les credentials
- **Erreur CORS** : Vérifier la configuration CORS
- **Build failed** : Nettoyer le cache Maven/npm

### Contacts
- **Équipe technique** : Groupe 5 Master 2 IL
- **Documentation** : Voir README.md et api-documentation/
- **Issues** : Créer une issue sur le repository Git

---

**Version** : 1.0.0  
**Dernière mise à jour** : Février 2024  
**Auteurs** : Équipe Master 2 IL - Groupe 5