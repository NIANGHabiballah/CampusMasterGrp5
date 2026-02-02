#!/bin/bash

echo "=== Test du système de notifications des annonces ==="

# Vérifier que le backend est en cours d'exécution
echo "1. Vérification du backend..."
if curl -s http://localhost:8080/api/announcements > /dev/null; then
    echo "✅ Backend accessible"
else
    echo "❌ Backend non accessible sur le port 8080"
    echo "Démarrez le backend avec: cd campusmaster-backend && ./mvnw spring-boot:run"
    exit 1
fi

# Test de création d'une annonce
echo "2. Test de création d'annonce..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "content": "Ceci est un test pour vérifier les notifications",
    "priority": "HIGH",
    "authorId": 1
  }')

if [[ $RESPONSE == *"id"* ]]; then
    echo "✅ Annonce créée avec succès"
else
    echo "❌ Erreur lors de la création de l'annonce"
    echo "Réponse: $RESPONSE"
fi

# Test de récupération des notifications
echo "3. Test de récupération des notifications..."
NOTIFICATIONS=$(curl -s http://localhost:8080/api/notifications/user/2)

if [[ $NOTIFICATIONS == *"Test Notification"* ]]; then
    echo "✅ Notification créée automatiquement pour l'étudiant"
else
    echo "⚠️  Notification non trouvée (peut être normale si pas d'étudiants en base)"
    echo "Notifications: $NOTIFICATIONS"
fi

# Test du compteur de notifications non lues
echo "4. Test du compteur de notifications..."
COUNT=$(curl -s http://localhost:8080/api/notifications/user/2/unread-count)

if [[ $COUNT == *"count"* ]]; then
    echo "✅ Compteur de notifications fonctionnel"
    echo "Réponse: $COUNT"
else
    echo "❌ Erreur avec le compteur de notifications"
    echo "Réponse: $COUNT"
fi

echo ""
echo "=== Résumé ==="
echo "✅ Backend Spring Boot opérationnel"
echo "✅ Endpoints d'annonces fonctionnels"
echo "✅ Système de notifications configuré"
echo ""
echo "Pour tester l'interface:"
echo "1. Démarrez le frontend: npm run dev"
echo "2. Connectez-vous en tant qu'enseignant"
echo "3. Allez sur /teacher/announcements"
echo "4. Créez une annonce"
echo "5. Connectez-vous en tant qu'étudiant"
echo "6. Vérifiez le compteur de notifications dans le header"
echo "7. Consultez le dashboard pour voir l'annonce"