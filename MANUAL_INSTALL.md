# 🚨 INSTALLATION MANUELLE REQUISE

## PHP et Composer ne peuvent pas être installés automatiquement

### ⚠️ Problème
- Homebrew nécessite des droits administrateur
- Installation automatique impossible

### 🔧 Installation manuelle requise:

#### 1. Installer Homebrew (dans le terminal)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Installer PHP et Composer
```bash
brew install php@8.1 composer
brew link --force --overwrite php@8.1
```

#### 3. Vérifier l'installation
```bash
php --version
composer --version
```

#### 4. Démarrer le backend
```bash
cd backend
./setup.sh
```

### 📡 Une fois le backend démarré
Le frontend pourra communiquer avec l'API Laravel sur `http://localhost:8000`

**État**: Installation manuelle nécessaire pour activer la communication frontend-backend.