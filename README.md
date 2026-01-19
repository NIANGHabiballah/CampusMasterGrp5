# CampusMaster - Plateforme Pédagogique

Une plateforme pédagogique moderne et complète développée avec Next.js 14 pour les étudiants de Master 2.

## 🚀 Fonctionnalités

### 🎓 Pour les Étudiants
- **Dashboard personnalisé** avec statistiques académiques
- **Gestion des cours** avec filtres et recherche
- **Système de devoirs** avec soumission de fichiers
- **Suivi des notes** avec graphiques de progression
- **Messagerie interne** avec système de tags
- **Profil utilisateur** complet et personnalisable

### 👨‍🏫 Pour les Enseignants
- **Gestion des cours** (création, modification, suppression)
- **Création et gestion des devoirs**
- **Correction et notation** des soumissions
- **Suivi des étudiants** et statistiques de classe
- **Communication** avec les étudiants

### 👨‍💼 Pour les Administrateurs
- **Gestion des utilisateurs** (approbation, suspension)
- **Analytiques avancées** de la plateforme
- **Métriques système** et monitoring
- **Gestion des rôles** et permissions
- **Statistiques d'utilisation**

## 🛠️ Technologies Utilisées

- **Framework**: Next.js 14 avec App Router
- **Langage**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **État global**: Zustand
- **Formulaires**: React Hook Form + Zod
- **Graphiques**: Recharts
- **Notifications**: Sonner
- **Authentification**: Mock system (prêt pour NextAuth)

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── admin/             # Pages administrateur
│   │   ├── analytics/     # Statistiques plateforme
│   │   └── users/         # Gestion utilisateurs
│   ├── auth/              # Authentification
│   │   ├── login/         # Page de connexion
│   │   └── register/      # Page d'inscription
│   ├── courses/           # Gestion des cours
│   ├── assignments/       # Gestion des devoirs
│   ├── grades/            # Consultation des notes
│   ├── messages/          # Messagerie
│   ├── profile/           # Profil utilisateur
│   ├── settings/          # Paramètres
│   ├── teacher/           # Pages enseignant
│   │   ├── assignments/   # Gestion devoirs prof
│   │   └── courses/       # Gestion cours prof
│   └── dashboard/         # Tableau de bord
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI (Shadcn)
│   ├── dashboard/        # Composants dashboard
│   ├── layout/           # Composants de mise en page
│   └── [feature]/        # Composants par fonctionnalité
├── contexts/             # Contextes React
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires et constantes
├── services/             # Services API
├── store/                # État global (Zustand)
└── types/                # Types TypeScript
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd campusmaster

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run start    # Démarrage production
npm run lint     # Linting du code
```

## 🔐 Authentification

Le système utilise actuellement un mock d'authentification avec des comptes de démonstration :

### Comptes de test
- **Étudiant**: `etudiant@campus.fr` / `password`
- **Enseignant**: `prof@campus.fr` / `password`  
- **Administrateur**: `admin@campus.fr` / `password`

## 🎨 Design System

### Palette de couleurs
- **Primaire**: Bleu académique (#2563eb)
- **Secondaire**: Gris moderne
- **Accent**: Vert, Orange, Rouge selon le contexte

### Composants UI
- Basé sur Shadcn UI
- Design responsive mobile-first
- Animations fluides avec Tailwind
- Thème cohérent et professionnel

## 📱 Responsive Design

- **Mobile First**: Optimisé pour tous les écrans
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Menu hamburger sur mobile
- **Cartes adaptatives**: Grilles flexibles

## 🔧 Configuration

### Variables d'environnement
```env
# À créer : .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Ajouter d'autres variables selon les besoins
```

### Tailwind Config
Configuration personnalisée avec :
- Couleurs académiques
- Animations personnalisées
- Composants utilitaires

## 📊 Fonctionnalités Avancées

### Système de Notifications
- Notifications temps réel simulées
- Toast messages avec Sonner
- Compteur de notifications non lues

### Gestion des Fichiers
- Upload de fichiers avec react-dropzone
- Prévisualisation des fichiers
- Gestion des types de fichiers

### Graphiques et Analytics
- Graphiques interactifs avec Recharts
- Métriques de performance
- Statistiques d'utilisation

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Build et déploiement automatique
vercel --prod
```

### Autres plateformes
```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

### Version 2.0
- [ ] Authentification réelle avec NextAuth
- [ ] Base de données (PostgreSQL/MongoDB)
- [ ] API REST complète
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Intégration calendrier
- [ ] Système de badges/récompenses

### Améliorations techniques
- [ ] Tests unitaires (Jest/Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring avec Sentry
- [ ] Performance optimization

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement**: Équipe Master 2 IL
- **Design**: Interface moderne et intuitive
- **Architecture**: Next.js 14 + TypeScript

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation

---

**CampusMaster** - Révolutionner l'expérience pédagogique universitaire 🎓