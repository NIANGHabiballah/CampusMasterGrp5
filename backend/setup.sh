#!/bin/bash

echo "🔧 CampusMaster Backend Setup"
echo "=============================="

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed"
    echo "Please install PHP 8.1+ first:"
    echo "  - macOS: brew install php"
    echo "  - Ubuntu: sudo apt install php8.1"
    echo "  - Windows: Download from php.net"
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "📦 Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

echo "✅ Installing Laravel dependencies..."
composer install

echo "🔑 Generating application key..."
cp .env.example .env
php artisan key:generate

echo "🗄️ Setting up database..."
php artisan migrate

echo "🌱 Seeding database..."
php artisan db:seed

echo "🚀 Starting Laravel server..."
php artisan serve

echo "✅ Backend ready at http://localhost:8000"