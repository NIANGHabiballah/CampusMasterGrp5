#!/bin/bash

echo "🔍 Vérification du back-end Spring Boot"
echo "URL: http://localhost:8080"

if curl -s --connect-timeout 5 http://localhost:8080 > /dev/null; then
    echo "✅ Back-end accessible"
else
    echo "❌ Back-end non accessible"
    echo "💡 Démarrez avec: cd campusmaster-backend && ./mvnw spring-boot:run"
    exit 1
fi

echo "✅ Configuration OK - Backend Spring Boot actif"