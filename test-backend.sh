#!/bin/bash

echo "=== TEST BACKEND CAMPUSMASTER ==="
echo ""

# Test 1: Connexion admin
echo "1. Test connexion admin..."
curl -s -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campus.sn","password":"password"}' | jq .
echo ""

# Test 2: Création de cours
echo "2. Test création de cours..."
curl -s -X POST http://localhost:8082/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Cours Test","description":"Description test","credits":3}' | jq .
echo ""

# Test 3: Liste des cours
echo "3. Test liste des cours..."
curl -s -X GET http://localhost:8082/api/courses | jq '. | length'
echo ""

# Test 4: Inscription nouvel utilisateur
echo "4. Test inscription..."
curl -s -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test'$(date +%s)'@example.com",
    "password":"password",
    "role":"STUDENT",
    "studentId":"ST'$(date +%s)'",
    "department":"INFO"
  }' | jq .
echo ""

echo "=== TESTS TERMINÉS ==="