#!/bin/bash

echo "🦊 Foxy Digital - Setup & Start"
echo "================================"
echo ""

# Check if MongoDB URI is configured
if [ ! -f "server/.env" ]; then
    echo "❌ No se encontró server/.env"
    echo ""
    echo "📋 Pasos para configurar:"
    echo "1. Lee MONGODB_SETUP.md para configurar MongoDB Atlas"
    echo "2. Copia server/.env.example a server/.env"
    echo "3. Actualiza MONGODB_URI con tu connection string"
    echo ""
    exit 1
fi

echo "✅ Configuración encontrada"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd server && npm install && cd ..
fi

echo ""
echo "🚀 Iniciando servidores..."
echo ""

# Start both servers
echo "📡 Backend en http://localhost:3001"
echo "🌐 Frontend en http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"
echo ""

# Run both in parallel
(cd server && npm run dev) & 
npm run dev

# Wait for both
wait
