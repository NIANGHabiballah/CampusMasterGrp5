#!/bin/bash

echo "🔗 Test de connexion Frontend ↔ Backend"
echo ""

# Vérifier si le backend est démarré
echo "1. Vérification du backend..."
if curl -s http://localhost:8080/api/courses > /dev/null; then
    echo "   ✅ Backend accessible sur http://localhost:8080"
else
    echo "   ❌ Backend non accessible. Démarrez-le avec:"
    echo "      cd campusmaster-backend && ./mvnw spring-boot:run"
    exit 1
fi

# Test de l'API d'authentification
echo ""
echo "2. Test de l'API d'authentification..."
response=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campus.fr","password":"password"}')

if echo "$response" | grep -q "token"; then
    echo "   ✅ Authentification fonctionnelle"
else
    echo "   ❌ Problème d'authentification"
    echo "   Réponse: $response"
fi

# Test de l'API des cours
echo ""
echo "3. Test de l'API des cours..."
courses=$(curl -s http://localhost:8080/api/courses)
if echo "$courses" | grep -q "title"; then
    echo "   ✅ API des cours fonctionnelle"
    echo "   Nombre de cours: $(echo "$courses" | grep -o '"title"' | wc -l)"
else
    echo "   ❌ Problème avec l'API des cours"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📋 Pour tester le frontend :"
echo "   1. Démarrez le frontend: npm run dev"
echo "   2. Ouvrez http://localhost:3000"
echo "   3. Connectez-vous avec: admin@campus.fr / password"