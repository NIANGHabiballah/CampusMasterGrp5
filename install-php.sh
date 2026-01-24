#!/bin/bash

echo "🔧 Compilation PHP 8.1.33 depuis les sources"
echo "============================================="

# Aller dans le dossier PHP
cd php-src-php-8.1.33

# Configuration
./configure --prefix=/usr/local/php --enable-fpm --with-mysqli --with-pdo-mysql --enable-mbstring --with-curl --with-openssl --with-zlib

# Compilation
make

# Installation
sudo make install

# Ajouter PHP au PATH
echo 'export PATH="/usr/local/php/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile

# Vérifier l'installation
php --version

echo "✅ PHP installé avec succès!"

# Installer Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

echo "✅ Composer installé!"

# Maintenant configurer Laravel
cd ../backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

echo "🚀 Backend Laravel démarré sur http://localhost:8000"