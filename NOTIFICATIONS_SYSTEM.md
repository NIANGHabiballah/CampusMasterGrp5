# Système de Notifications des Annonces

## 🎯 Fonctionnalités Implémentées

### ✅ Pour les Enseignants
- **Création d'annonces complètes** avec tous les champs :
  - Titre et contenu
  - Priorité (Info, Normal, Urgent)
  - Cours concerné (ou annonce générale)
  - Date d'expiration optionnelle
- **Modification d'annonces** avec formulaire complet
- **Suppression d'annonces**
- **Interface intuitive** avec validation des formulaires

### ✅ Pour les Étudiants
- **Notifications automatiques** lors de nouvelles annonces
- **Compteur de notifications** dans l'icône du header
- **Affichage des annonces** dans le dashboard
- **Notifications temps réel** (rafraîchissement automatique)

### ✅ Backend Spring Boot
- **Création automatique de notifications** pour tous les étudiants
- **Endpoints complets** pour les annonces et notifications
- **Gestion des rôles** et permissions
- **Base de données** avec toutes les relations

## 🔧 Architecture Technique

### Frontend (Next.js)
```
src/
├── app/teacher/announcements/     # Page de gestion des annonces
├── components/
│   ├── dashboard/StudentDashboard.tsx  # Affichage des annonces
│   └── layout/NotificationBell.tsx     # Icône de notifications
├── hooks/use-notifications.ts     # Hook pour les notifications
├── store/notifications.ts         # État global des notifications
└── services/api.ts               # Appels API
```

### Backend (Spring Boot)
```
src/main/java/com/campusmaster/
├── controller/
│   ├── AnnouncementController.java    # API des annonces
│   └── NotificationController.java    # API des notifications
├── entity/
│   ├── Announcement.java             # Entité annonce
│   └── Notification.java            # Entité notification
├── service/
│   └── AnnouncementService.java      # Logique métier + notifications
└── repository/
    ├── AnnouncementRepository.java
    ├── NotificationRepository.java
    └── UserRepository.java
```

## 🚀 Flux de Fonctionnement

### 1. Création d'Annonce
```
Enseignant crée annonce → Backend sauvegarde → 
Notifications créées pour tous les étudiants → 
Compteur mis à jour
```

### 2. Notification Étudiant
```
Étudiant se connecte → Hook charge les notifications → 
Compteur affiché dans header → Annonces visibles dans dashboard
```

### 3. Rafraîchissement Automatique
```
Toutes les 30 secondes → Vérification nouvelles notifications → 
Mise à jour du compteur → Interface mise à jour
```

## 📊 Endpoints API

### Annonces
- `GET /api/announcements` - Toutes les annonces actives
- `GET /api/announcements/author/{id}` - Annonces par auteur
- `POST /api/announcements` - Créer une annonce
- `PUT /api/announcements/{id}` - Modifier une annonce
- `DELETE /api/announcements/{id}` - Supprimer une annonce

### Notifications
- `GET /api/notifications/user/{id}` - Notifications d'un utilisateur
- `GET /api/notifications/user/{id}/unread-count` - Compteur non lues
- `PUT /api/notifications/{id}/mark-read` - Marquer comme lue

## 🎨 Interface Utilisateur

### Page Enseignant (/teacher/announcements)
- **Formulaire complet** avec validation
- **Liste des annonces** avec actions (modifier/supprimer)
- **Badges de priorité** colorés
- **Dates d'expiration** visibles

### Dashboard Étudiant
- **Section annonces** en haut du dashboard
- **Badges de priorité** et cours concerné
- **Design attractif** avec dégradés
- **Dates de création** et expiration

### Icône de Notifications
- **Compteur rouge** pour les non lues
- **Popup détaillé** avec liste des notifications
- **Actions** : marquer lu, supprimer
- **Liens directs** vers les pages concernées

## 🔄 Gestion des États

### Store Zustand (notifications.ts)
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  fetchNotifications: (userId?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  addNotification: (notification) => void;
}
```

### Hook Personnalisé (use-notifications.ts)
- **Chargement automatique** au démarrage
- **Rafraîchissement périodique** (30s)
- **Gestion des erreurs** et fallbacks

## 🧪 Tests et Validation

### Script de Test
```bash
./test-notifications.sh
```

### Tests Manuels
1. **Créer une annonce** en tant qu'enseignant
2. **Vérifier le compteur** en tant qu'étudiant
3. **Consulter le dashboard** pour voir l'annonce
4. **Marquer comme lue** et vérifier la mise à jour

## 🔧 Configuration Requise

### Variables d'Environnement
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Base de Données
- Tables : `announcements`, `notifications`, `users`, `courses`
- Relations : Foreign Keys configurées
- Index : Sur les colonnes fréquemment utilisées

## 🚀 Démarrage

### 1. Backend
```bash
cd campusmaster-backend
./mvnw spring-boot:run
```

### 2. Frontend
```bash
npm run dev
```

### 3. Test
```bash
./test-notifications.sh
```

## 📈 Améliorations Futures

- [ ] **Notifications push** en temps réel (WebSocket)
- [ ] **Filtres avancés** pour les annonces
- [ ] **Notifications par email**
- [ ] **Historique des notifications**
- [ ] **Préférences utilisateur** pour les types de notifications
- [ ] **Notifications mobiles** (PWA)

## 🐛 Dépannage

### Problèmes Courants
1. **Compteur à 0** : Vérifier que des étudiants existent en base
2. **Notifications non créées** : Vérifier les logs du backend
3. **API non accessible** : Vérifier que le backend tourne sur le port 8080
4. **Erreurs CORS** : Vérifier la configuration `@CrossOrigin`

### Logs Utiles
```bash
# Backend
tail -f campusmaster-backend/backend.log

# Frontend
# Ouvrir les DevTools du navigateur
```

---

**✅ Système complet et fonctionnel !**

Les enseignants peuvent créer des annonces avec tous les champs requis, et les étudiants reçoivent automatiquement des notifications avec un compteur visible dans le header.