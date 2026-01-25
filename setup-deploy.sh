#!/bin/bash

echo "🚀 Setup de Deploy para Foxy"
echo "============================="
echo ""

# Inicializar Git
if ! git status &>/dev/null; then
    echo "📦 Inicializando Git..."
    git init
    echo "✅ Git inicializado"
else
    echo "✅ Git ya está inicializado"
fi
echo ""

# Configurar remoto
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Configurando remoto de GitHub..."
    git remote add origin git@github.com:FCamaggi/Foxy.git
    echo "✅ Remoto configurado"
else
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "ℹ️  Remoto actual: $CURRENT_REMOTE"
    read -p "¿Quieres cambiar el remoto a git@github.com:FCamaggi/Foxy.git? (s/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git remote set-url origin git@github.com:FCamaggi/Foxy.git
        echo "✅ Remoto actualizado"
    fi
fi
echo ""

# Verificar que .env no está en Git
echo "🔒 Verificando archivos sensibles..."
if git ls-files --error-unmatch .env &>/dev/null 2>&1; then
    echo "⚠️  Removiendo .env de Git..."
    git rm --cached .env
fi

if git ls-files --error-unmatch server/.env &>/dev/null 2>&1; then
    echo "⚠️  Removiendo server/.env de Git..."
    git rm --cached server/.env
fi
echo "✅ Archivos sensibles protegidos"
echo ""

# Hacer primer commit si no hay commits
if ! git rev-parse HEAD &>/dev/null; then
    echo "📝 Haciendo commit inicial..."
    git add .
    git commit -m "Initial commit - Foxy multiplayer game ready for deployment"
    echo "✅ Commit inicial creado"
else
    echo "ℹ️  Ya existen commits. Para actualizar ejecuta:"
    echo "   git add ."
    echo "   git commit -m 'Tu mensaje'"
fi
echo ""

# Configurar rama main
echo "🌿 Configurando rama main..."
git branch -M main
echo "✅ Rama configurada"
echo ""

echo "=================================="
echo "✅ SETUP COMPLETADO"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1️⃣  PUSH A GITHUB:"
echo "   git push -u origin main"
echo ""
echo "2️⃣  SEGUIR LA GUÍA DE DEPLOY:"
echo "   Abre DEPLOY_GUIDE.md y sigue los pasos"
echo ""
echo "3️⃣  ORDEN DE DEPLOYMENT:"
echo "   a) MongoDB Atlas (crear cluster y obtener URI)"
echo "   b) Render (backend con MONGODB_URI)"
echo "   c) Netlify (frontend con URL de Render)"
echo "   d) Volver a Render (actualizar CORS_ORIGIN)"
echo ""
echo "🔍 Para verificar todo antes de deploy:"
echo "   ./check-deploy.sh"
echo ""
echo "=================================="
