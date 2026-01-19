# CampusMaster Backend - Laravel API

Backend API pour la plateforme pédagogique CampusMaster développé avec Laravel.

## 🚀 Technologies

- **Laravel 10** - Framework PHP moderne
- **Laravel Sanctum** - Authentification API
- **MySQL/PostgreSQL** - Base de données
- **Eloquent ORM** - Modèles et relations
- **API Resources** - Transformation des données

## 📁 Structure du Projet

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # Contrôleurs API
│   │   ├── Requests/          # Validation des requêtes
│   │   └── Middleware/        # Middlewares personnalisés
│   ├── Models/                # Modèles Eloquent
│   └── Services/              # Services métier
├── database/
│   ├── migrations/            # Migrations de base de données
│   ├── seeders/              # Données de test
│   └── factories/            # Factories pour les tests
├── routes/
│   └── api.php               # Routes API
├── config/                   # Configuration Laravel
└── tests/                    # Tests automatisés
```

## 🛠️ Installation

### Prérequis
- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Node.js (pour les assets)

### Setup Rapide
```bash
# Cloner et installer
git clone <repo>
cd backend
composer install

# Configuration
cp .env.example .env
php artisan key:generate

# Base de données
php artisan migrate
php artisan db:seed

# Démarrer le serveur
php artisan serve
```

## 🗄️ Base de Données

### Migrations
```bash
# Créer une migration
php artisan make:migration create_table_name

# Exécuter les migrations
php artisan migrate

# Rollback
php artisan migrate:rollback
```

### Seeders
```bash
# Créer un seeder
php artisan make:seeder TableSeeder

# Exécuter les seeders
php artisan db:seed
```

## 🔐 Authentification

L'API utilise Laravel Sanctum pour l'authentification :

```javascript
// Headers requis
Authorization: Bearer <token>
```

### Comptes de test
- **Admin**: `admin@campus.fr` / `password`
- **Enseignant**: `prof@campus.fr` / `password`
- **Étudiant**: `etudiant@campus.fr` / `password`

## 📡 API Endpoints

### Authentification
```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
POST /api/auth/logout       # Déconnexion
GET  /api/auth/profile      # Profil utilisateur
PUT  /api/auth/profile      # Modifier profil
PUT  /api/auth/change-password # Changer mot de passe
```

### Ressources (à implémenter)
```
GET    /api/courses         # Liste des cours
POST   /api/courses         # Créer cours
GET    /api/courses/{id}    # Détails cours
PUT    /api/courses/{id}    # Modifier cours
DELETE /api/courses/{id}    # Supprimer cours

GET    /api/assignments     # Liste devoirs
POST   /api/assignments     # Créer devoir
GET    /api/assignments/{id} # Détails devoir

GET    /api/submissions     # Soumissions
POST   /api/submissions     # Soumettre devoir

GET    /api/messages        # Messages
POST   /api/messages        # Envoyer message
```

## 🏗️ Modèles et Relations

### User
- `hasMany(Course)` - Cours enseignés
- `belongsToMany(Course)` - Cours suivis
- `hasMany(Submission)` - Soumissions
- `hasMany(Message)` - Messages

### Course
- `belongsTo(User)` - Enseignant
- `belongsToMany(User)` - Étudiants inscrits
- `hasMany(Assignment)` - Devoirs
- `hasMany(Message)` - Messages du cours

### Assignment
- `belongsTo(Course)` - Cours
- `hasMany(Submission)` - Soumissions

### Submission
- `belongsTo(Assignment)` - Devoir
- `belongsTo(User)` - Étudiant

## 🧪 Tests

```bash
# Exécuter tous les tests
php artisan test

# Tests spécifiques
php artisan test --filter AuthTest

# Avec coverage
php artisan test --coverage
```

## 📝 Artisan Commands

```bash
# Créer un contrôleur API
php artisan make:controller Api/ControllerName --api

# Créer un modèle avec migration
php artisan make:model ModelName -m

# Créer une requête de validation
php artisan make:request RequestName

# Créer un middleware
php artisan make:middleware MiddlewareName

# Créer un seeder
php artisan make:seeder SeederName

# Créer une factory
php artisan make:factory ModelFactory
```

## 🚀 Déploiement

### Production
```bash
# Optimisations
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migrations
php artisan migrate --force
```

### Docker
```bash
# Build
docker build -t campusmaster-backend .

# Run
docker run -p 8000:8000 campusmaster-backend
```

## 🔧 Configuration

### Variables d'environnement importantes
```env
APP_NAME=CampusMaster
APP_ENV=production
APP_KEY=base64:...
APP_URL=https://api.campusmaster.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=campusmaster
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=https://campusmaster.com
```

## 📊 Monitoring

- **Health Check**: `GET /api/health`
- **Logs**: `storage/logs/laravel.log`
- **Queue**: Redis/Database
- **Cache**: Redis/File

## 🤝 Développement

### Standards de code
```bash
# PSR-12 avec Laravel Pint
./vendor/bin/pint

# Analyse statique avec PHPStan
./vendor/bin/phpstan analyse
```

### Git Workflow
```bash
# Branches
main          # Production
develop       # Développement
feature/*     # Nouvelles fonctionnalités
hotfix/*      # Corrections urgentes
```

## 📄 Licence

MIT License - voir LICENSE file

---

**CampusMaster Backend** - API Laravel moderne pour l'éducation 🎓