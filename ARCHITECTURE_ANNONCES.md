# 🏗️ Architecture du Système d'Annonces

## 📐 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │  Enseignant          │         │  Étudiant            │     │
│  │  /teacher/           │         │  /dashboard          │     │
│  │  announcements       │         │                      │     │
│  │                      │         │  ┌────────────────┐  │     │
│  │  ┌────────────────┐  │         │  │ Annonces       │  │     │
│  │  │ Formulaire     │  │         │  │ récentes       │  │     │
│  │  │ création       │  │         │  │                │  │     │
│  │  │ annonce        │  │         │  │ • Titre        │  │     │
│  │  └────────────────┘  │         │  │ • Contenu      │  │     │
│  │                      │         │  │ • Date         │  │     │
│  │  [Publier]           │         │  │ • Auteur       │  │     │
│  └──────────────────────┘         │  │ • Priorité     │  │     │
│           │                       │  └────────────────┘  │     │
│           │                       └──────────────────────┘     │
│           │                                  ▲                  │
│           │                                  │                  │
└───────────┼──────────────────────────────────┼──────────────────┘
            │                                  │
            │ POST /api/announcements          │ GET /api/announcements
            │                                  │
            ▼                                  │
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Spring Boot)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           AnnouncementController                          │  │
│  │                                                            │  │
│  │  POST   /api/announcements          ─┐                    │  │
│  │  GET    /api/announcements           │                    │  │
│  │  GET    /api/announcements/{id}      │                    │  │
│  │  PUT    /api/announcements/{id}      │                    │  │
│  │  DELETE /api/announcements/{id}      │                    │  │
│  └──────────────────────────────────────┼────────────────────┘  │
│                                         │                        │
│                                         ▼                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           AnnouncementService                             │  │
│  │                                                            │  │
│  │  createAnnouncement(announcement)                         │  │
│  │    │                                                       │  │
│  │    ├─► 1. Sauvegarder l'annonce                          │  │
│  │    │                                                       │  │
│  │    └─► 2. createNotificationsForStudents()               │  │
│  │           │                                                │  │
│  │           ├─► Récupérer TOUS les étudiants               │  │
│  │           │   (userRepository.findByRole(STUDENT))        │  │
│  │           │                                                │  │
│  │           └─► Pour chaque étudiant:                       │  │
│  │               • Créer une notification                    │  │
│  │               • Type: "announcement"                      │  │
│  │               • Titre: "Nouvelle annonce: [titre]"        │  │
│  │               • Message: [extrait contenu]                │  │
│  │               • ActionUrl: "/dashboard"                   │  │
│  │                                                            │  │
│  │  getActiveAnnouncements()                                 │  │
│  │    └─► Retourner annonces actives et non expirées        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                         │                        │
│                                         ▼                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Repositories                                 │  │
│  │                                                            │  │
│  │  AnnouncementRepository                                   │  │
│  │  NotificationRepository                                   │  │
│  │  UserRepository                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                         │                        │
└─────────────────────────────────────────┼────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BASE DE DONNÉES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │  announcements   │    │  notifications   │                  │
│  ├──────────────────┤    ├──────────────────┤                  │
│  │ id               │    │ id               │                  │
│  │ title            │    │ user_id          │◄─────┐           │
│  │ content          │    │ type             │      │           │
│  │ priority         │    │ title            │      │           │
│  │ course_id        │    │ message          │      │           │
│  │ author_id        │─┐  │ action_url       │      │           │
│  │ expires_at       │ │  │ is_read          │      │           │
│  │ is_active        │ │  │ created_at       │      │           │
│  │ created_at       │ │  └──────────────────┘      │           │
│  │ updated_at       │ │                            │           │
│  └──────────────────┘ │                            │           │
│                       │                            │           │
│  ┌──────────────────┐ │  ┌──────────────────┐     │           │
│  │  users           │◄┘  │  courses         │     │           │
│  ├──────────────────┤    ├──────────────────┤     │           │
│  │ id               │────┤ id               │     │           │
│  │ email            │    │ title            │     │           │
│  │ first_name       │    │ description      │     │           │
│  │ last_name        │    │ teacher_id       │     │           │
│  │ role             │    │ schedule         │     │           │
│  │ is_approved      │    │ max_students     │     │           │
│  └──────────────────┘    └──────────────────┘     │           │
│                                                    │           │
│  Relation: 1 annonce → N notifications            │           │
│  (1 notification par étudiant)                    │           │
│                                                    │           │
└────────────────────────────────────────────────────┼───────────┘
                                                     │
                                                     │
                                    Tous les étudiants reçoivent
                                    une notification
```

## 🔄 Flux de données détaillé

### 1. Création d'une annonce

```
Enseignant                Frontend              Backend                Database
    │                        │                     │                      │
    │  Remplit formulaire    │                     │                      │
    │───────────────────────►│                     │                      │
    │                        │                     │                      │
    │  Clique "Publier"      │                     │                      │
    │───────────────────────►│                     │                      │
    │                        │                     │                      │
    │                        │ POST /api/          │                      │
    │                        │ announcements       │                      │
    │                        │────────────────────►│                      │
    │                        │                     │                      │
    │                        │                     │ INSERT announcement  │
    │                        │                     │─────────────────────►│
    │                        │                     │                      │
    │                        │                     │ SELECT * FROM users  │
    │                        │                     │ WHERE role='STUDENT' │
    │                        │                     │─────────────────────►│
    │                        │                     │                      │
    │                        │                     │ ◄────────────────────│
    │                        │                     │ [Liste étudiants]    │
    │                        │                     │                      │
    │                        │                     │ Pour chaque étudiant:│
    │                        │                     │ INSERT notification  │
    │                        │                     │─────────────────────►│
    │                        │                     │                      │
    │                        │ ◄───────────────────│                      │
    │                        │ {announcement}      │                      │
    │                        │                     │                      │
    │ ◄──────────────────────│                     │                      │
    │ "Annonce publiée"      │                     │                      │
    │                        │                     │                      │
```

### 2. Consultation par un étudiant

```
Étudiant                  Frontend              Backend                Database
    │                        │                     │                      │
    │  Accède au dashboard   │                     │                      │
    │───────────────────────►│                     │                      │
    │                        │                     │                      │
    │                        │ GET /api/           │                      │
    │                        │ announcements       │                      │
    │                        │────────────────────►│                      │
    │                        │                     │                      │
    │                        │                     │ SELECT * FROM        │
    │                        │                     │ announcements        │
    │                        │                     │ WHERE is_active=true │
    │                        │                     │ AND (expires_at IS   │
    │                        │                     │ NULL OR expires_at   │
    │                        │                     │ > NOW())             │
    │                        │                     │ ORDER BY created_at  │
    │                        │                     │ DESC                 │
    │                        │                     │─────────────────────►│
    │                        │                     │                      │
    │                        │                     │ ◄────────────────────│
    │                        │                     │ [Liste annonces]     │
    │                        │                     │                      │
    │                        │ ◄───────────────────│                      │
    │                        │ [announcements]     │                      │
    │                        │                     │                      │
    │                        │ Tri + Limite à 5    │                      │
    │                        │                     │                      │
    │ ◄──────────────────────│                     │                      │
    │ Affichage annonces     │                     │                      │
    │                        │                     │                      │
```

## 📊 Modèle de données

### Announcement (Annonce)

```typescript
{
  id: number,
  title: string,                    // "Changement d'horaire"
  content: string,                  // "Le cours est reporté..."
  priority: 'LOW' | 'MEDIUM' | 'HIGH',
  course: {                         // Optionnel
    id: number,
    title: string
  },
  author: {                         // Enseignant
    id: number,
    firstName: string,
    lastName: string
  },
  expiresAt: Date | null,          // Date d'expiration
  isActive: boolean,               // true/false
  createdAt: Date,
  updatedAt: Date
}
```

### Notification

```typescript
{
  id: number,
  user: {                          // Étudiant destinataire
    id: number,
    email: string
  },
  type: 'announcement',
  title: string,                   // "Nouvelle annonce: [titre]"
  message: string,                 // Extrait du contenu
  actionUrl: string,               // "/dashboard"
  isRead: boolean,                 // false par défaut
  createdAt: Date
}
```

## 🎯 Points clés de l'architecture

### 1. Distribution universelle
- ✅ **Tous les étudiants** reçoivent les annonces
- ✅ Pas de filtrage par cours au niveau des notifications
- ✅ Une boucle crée une notification par étudiant

### 2. Séparation des responsabilités
- **Controller** : Gère les requêtes HTTP
- **Service** : Logique métier (création annonce + notifications)
- **Repository** : Accès aux données

### 3. Données dynamiques
- ✅ Pas de données en dur
- ✅ Chargement depuis la base de données
- ✅ Mise à jour en temps réel

### 4. Filtrage intelligent
- Seules les annonces **actives** sont affichées
- Les annonces **expirées** sont exclues
- Tri par **date décroissante**
- Limitation à **5 annonces** dans le dashboard

## 🔐 Sécurité

- ✅ Authentification JWT requise
- ✅ Seuls les enseignants peuvent créer des annonces
- ✅ Les étudiants peuvent uniquement consulter
- ✅ Validation des données côté backend

## 🚀 Performance

- ✅ Requêtes optimisées avec JPA
- ✅ Chargement asynchrone des données
- ✅ Limitation du nombre d'annonces affichées
- ✅ Indexation sur les champs de recherche

## 📈 Évolutivité

Le système est conçu pour évoluer facilement :

1. **Filtrage par cours** : Ajouter une condition WHERE sur course_id
2. **Notifications temps réel** : Intégrer WebSocket
3. **Pagination** : Ajouter des paramètres page/size
4. **Recherche** : Ajouter un endpoint de recherche
5. **Statistiques** : Tracker les lectures et interactions
