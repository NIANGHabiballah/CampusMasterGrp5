#!/bin/bash

# Script de test automatisé pour l'API CampusMaster
# Usage: ./test-api.sh

BASE_URL="http://localhost:8082"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Test API CampusMaster ===${NC}"
echo "URL de base: $BASE_URL"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -n "Test: $description... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
    fi
}

# Vérifier que le serveur est démarré
echo -e "${YELLOW}1. Vérification du serveur...${NC}"
if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓ Serveur accessible${NC}"
else
    echo -e "${RED}✗ Serveur non accessible. Assurez-vous que le backend Spring Boot est démarré.${NC}"
    exit 1
fi
echo ""

# Tests d'authentification
echo -e "${YELLOW}2. Tests d'authentification${NC}"

# Test inscription étudiant
test_endpoint "POST" "/api/auth/register" '{
    "firstName": "Test",
    "lastName": "Student",
    "email": "test.student@campusmaster.com",
    "password": "password123",
    "role": "STUDENT",
    "studentId": "TEST001",
    "department": "Informatique"
}' 200 "Inscription étudiant"

# Test inscription enseignant
test_endpoint "POST" "/api/auth/register" '{
    "firstName": "Test",
    "lastName": "Teacher",
    "email": "test.teacher@campusmaster.com",
    "password": "password123",
    "role": "TEACHER",
    "department": "Informatique"
}' 200 "Inscription enseignant"

# Test connexion
test_endpoint "POST" "/api/auth/login" '{
    "email": "etudiant@campus.sn",
    "password": "password"
}' 200 "Connexion utilisateur"

# Test mot de passe oublié
test_endpoint "POST" "/api/auth/forgot-password" '{
    "email": "etudiant@campus.sn"
}' 200 "Mot de passe oublié"

echo ""

# Tests utilisateurs
echo -e "${YELLOW}3. Tests utilisateurs${NC}"

test_endpoint "GET" "/api/users" "" 200 "Liste des utilisateurs"
test_endpoint "GET" "/api/users/1" "" 200 "Détails utilisateur"

# Test modification utilisateur
test_endpoint "PUT" "/api/users/1" '{
    "firstName": "Jean Modifié",
    "phone": "+33123456789"
}' 200 "Modification utilisateur"

test_endpoint "PUT" "/api/users/1/approve" "" 200 "Approbation utilisateur"

echo ""

# Tests cours
echo -e "${YELLOW}4. Tests cours${NC}"

test_endpoint "GET" "/api/courses" "" 200 "Liste des cours"

# Test création cours
test_endpoint "POST" "/api/courses" '{
    "title": "Test Course",
    "description": "Cours de test automatisé",
    "semester": "S1",
    "credits": 6,
    "maxStudents": 30,
    "schedule": "Lundi 14h-16h"
}' 200 "Création cours"

test_endpoint "GET" "/api/courses/1" "" 200 "Détails cours"

# Test modification cours
test_endpoint "PUT" "/api/courses/1" '{
    "title": "Test Course Modifié",
    "credits": 8
}' 200 "Modification cours"

test_endpoint "GET" "/api/courses/1/materials" "" 200 "Matériaux cours"

echo ""

# Tests devoirs
echo -e "${YELLOW}5. Tests devoirs${NC}"

test_endpoint "GET" "/api/assignments" "" 200 "Liste des devoirs"

# Test création devoir
test_endpoint "POST" "/api/assignments" '{
    "title": "Test Assignment",
    "description": "Devoir de test automatisé",
    "maxPoints": 20,
    "course": 1,
    "dueDate": "2024-12-31T23:59:00"
}' 200 "Création devoir"

# Test modification devoir
test_endpoint "PUT" "/api/assignments/1" '{
    "title": "Test Assignment Modifié",
    "maxPoints": 25
}' 200 "Modification devoir"

echo ""

# Tests messages
echo -e "${YELLOW}6. Tests messages${NC}"

test_endpoint "GET" "/api/messages" "" 200 "Liste des messages"

# Test envoi message
test_endpoint "POST" "/api/messages" '{
    "subject": "Test Message",
    "content": "Ceci est un message de test automatisé",
    "senderId": 1,
    "receiverId": 2
}' 200 "Envoi message"

test_endpoint "POST" "/api/messages/1/star" "" 200 "Marquer favori"
test_endpoint "POST" "/api/messages/1/archive" "" 200 "Archiver message"
test_endpoint "POST" "/api/messages/1/mark-read" "" 200 "Marquer comme lu"

echo ""

# Tests notifications
echo -e "${YELLOW}7. Tests notifications${NC}"

test_endpoint "GET" "/api/notifications/user/1" "" 200 "Notifications utilisateur"
test_endpoint "GET" "/api/notifications/user/1/unread-count" "" 200 "Nombre non lues"
test_endpoint "PUT" "/api/notifications/1/mark-read" "" 200 "Marquer notification lue"

echo ""

# Tests d'erreur
echo -e "${YELLOW}8. Tests d'erreur${NC}"

test_endpoint "GET" "/api/users/999" "" 404 "Utilisateur inexistant"
test_endpoint "GET" "/api/courses/999" "" 404 "Cours inexistant"
test_endpoint "POST" "/api/auth/login" '{
    "email": "wrong@email.com",
    "password": "wrongpassword"
}' 401 "Connexion échouée"

echo ""
echo -e "${YELLOW}=== Tests terminés ===${NC}"
echo ""
echo -e "${GREEN}Pour des tests plus détaillés :${NC}"
echo "1. Importez la collection Postman : CampusMaster-API.postman_collection.json"
echo "2. Consultez la documentation Swagger : swagger.yaml"
echo "3. Lisez le guide de test : API-TEST-GUIDE.md"