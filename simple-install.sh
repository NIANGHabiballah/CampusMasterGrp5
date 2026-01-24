#!/bin/bash

echo "🔧 Installation PHP simplifiée"
echo "==============================="

# Télécharger PHP pré-compilé pour macOS
curl -O https://www.php.net/distributions/php-8.1.33.tar.gz
tar -xzf php-8.1.33.tar.gz

# Alternative: utiliser PHP système si disponible
if command -v /usr/bin/php &> /dev/null; then
    echo "✅ PHP système trouvé"
    ln -sf /usr/bin/php /usr/local/bin/php
fi

# Installer Composer
curl -sS https://getcomposer.org/installer -o composer-setup.php
php composer-setup.php --install-dir=/usr/local/bin --filename=composer

# Configurer Laravel
cd backend
/usr/local/bin/composer install
cp .env.example .env
php artisan key:generate

echo "✅ Installation terminée!"
echo "Démarrer avec: cd backend && php artisan serve"