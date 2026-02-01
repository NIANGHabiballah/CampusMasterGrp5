#!/bin/bash

echo "🎓 CampusMaster - Démarrage du système"
echo "====================================="

# Vérifier Java
if ! command -v java &> /dev/null; then
    echo "❌ Java requis pour le back-end"
    exit 1
fi

# Démarrer le back-end
if [ -d "campusmaster-backend" ]; then
    echo "🚀 Démarrage du back-end..."
    cd campusmaster-backend
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    cd ..
    echo "✅ Back-end démarré (PID: $BACKEND_PID)"
else
    echo "❌ Dossier campusmaster-backend non trouvé"
    exit 1
fi

# Attendre le back-end
echo "⏳ Attente du back-end (10s)..."
sleep 10

# Démarrer le frontend
echo "🚀 Démarrage du frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Système démarré!"
echo "🔧 Back-end: http://localhost:8080"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🛑 Pour arrêter: kill $BACKEND_PID $FRONTEND_PID"
echo "💡 Ctrl+C pour arrêter"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait