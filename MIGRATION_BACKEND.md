# Migration du Mock vers le Back-end Spring Boot

## ✅ Changements Effectués

### 1. Suppression du Mock
- ❌ Supprimé `/src/app/api/` (routes API Next.js mock)
- ✅ Configuré pour utiliser uniquement le back-end Spring Boot

### 2. Configuration Centralisée
- ✅ Créé `/src/lib/config.ts` avec tous les endpoints
- ✅ Mis à jour `.env.local` avec `NEXT_PUBLIC_API_URL=http://localhost:8080`

### 3. Services API Refactorisés
- ✅ `/src/services/api.ts` utilise maintenant l'intercepteur
- ✅ `/src/services/api-service.ts` unifié avec le back-end
- ✅ Créé `/src/lib/api-interceptor.ts` pour la gestion des tokens

### 4. Authentification Améliorée
- ✅ Store auth mis à jour avec gestion des cookies
- ✅ Middleware de protection des routes créé
- ✅ Gestion automatique des tokens JWT

### 5. Hooks Utilitaires
- ✅ `/src/hooks/use-api.ts` pour les appels API avec gestion d'erreur

## 🚀 Étapes pour Démarrer

### 1. Démarrer le Back-end
```bash
cd campusmaster-backend
./mvnw spring-boot:run
```

### 2. Vérifier la Connexion
```bash
curl http://localhost:8080/courses
```

### 3. Démarrer le Frontend
```bash
npm run dev
```

## 🔧 Points d'Attention

### Endpoints Mappés
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription  
- `GET /courses` - Liste des cours
- `GET /assignments` - Liste des devoirs
- `GET /users` - Liste des utilisateurs
- `GET /messages` - Messages
- `GET /notifications/user/{id}` - Notifications

### Authentification
- Les tokens JWT sont stockés dans les cookies
- Expiration automatique gérée par l'intercepteur
- Redirection automatique vers `/auth/login` si token expiré

### Gestion d'Erreur
- Toutes les erreurs API sont interceptées
- Messages d'erreur affichés via toast
- Logs détaillés en console pour le debug

## 🐛 Dépannage

### Back-end non accessible
```bash
# Vérifier si le port 8080 est utilisé
lsof -i :8080

# Démarrer le back-end en mode debug
cd campusmaster-backend
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug"
```

### Erreurs CORS
Le back-end doit autoriser les requêtes depuis `http://localhost:3000`

### Problèmes de Token
- Vérifier les cookies dans les DevTools
- Token automatiquement supprimé si expiré
- Reconnexion requise après expiration

## 📊 Avantages de la Migration

1. **Authentification Réelle** - JWT sécurisé
2. **Persistance des Données** - Base de données
3. **API Complète** - CRUD complet
4. **Sécurité** - Gestion des permissions
5. **Scalabilité** - Architecture microservices
6. **Monitoring** - Logs et métriques

## 🎯 Prochaines Étapes

1. Tester tous les endpoints
2. Vérifier l'authentification
3. Valider les permissions par rôle
4. Tester l'upload de fichiers
5. Vérifier les notifications temps réel