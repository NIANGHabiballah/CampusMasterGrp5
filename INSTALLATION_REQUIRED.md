# ⚠️ INSTALLATION REQUISE

## PHP et Composer ne sont pas installés sur ce système

### 🔧 Installation nécessaire:

#### Option 1: Homebrew (recommandé)
```bash
# Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer PHP et Composer
brew install php composer
```

#### Option 2: Installation manuelle
```bash
# PHP via MacPorts ou téléchargement direct
# Composer via https://getcomposer.org/download/
```

### 🚀 Après installation:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### 📡 Communication Frontend-Backend
Une fois le backend démarré, modifier le frontend pour utiliser l'API réelle au lieu des mocks.

**État actuel: Backend prêt mais nécessite PHP/Composer installés**