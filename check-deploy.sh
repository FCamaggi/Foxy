#!/bin/bash

echo "🔍 Verificación Pre-Deploy de Foxy"
echo "==================================="
echo ""

ERRORS=0

# Check Git
echo "📦 Verificando Git..."
if git status &>/dev/null; then
    echo "✅ Git inicializado"
    
    if git remote get-url origin &>/dev/null; then
        REMOTE=$(git remote get-url origin)
        echo "✅ Remoto configurado: $REMOTE"
    else
        echo "❌ No hay remoto configurado"
        echo "   Ejecuta: git remote add origin git@github.com:FCamaggi/Foxy.git"
        ERRORS=$((ERRORS+1))
    fi
else
    echo "❌ Git no inicializado"
    echo "   Ejecuta: git init"
    ERRORS=$((ERRORS+1))
fi
echo ""

# Check .gitignore
echo "🔒 Verificando .gitignore..."
if grep -q "\.env" .gitignore; then
    echo "✅ .env está en .gitignore"
else
    echo "⚠️  .env NO está en .gitignore (PELIGRO)"
    ERRORS=$((ERRORS+1))
fi
echo ""

# Check .env files
echo "⚙️  Verificando archivos de configuración..."

if [ -f ".env.example" ]; then
    echo "✅ .env.example existe (frontend)"
else
    echo "❌ .env.example no encontrado"
    ERRORS=$((ERRORS+1))
fi

if [ -f "server/.env.example" ]; then
    echo "✅ server/.env.example existe"
else
    echo "❌ server/.env.example no encontrado"
    ERRORS=$((ERRORS+1))
fi

# Check if .env files are staged for commit
if git ls-files --error-unmatch .env &>/dev/null; then
    echo "❌ ¡PELIGRO! .env está en Git (contiene secretos)"
    echo "   Ejecuta: git rm --cached .env"
    ERRORS=$((ERRORS+1))
else
    echo "✅ .env NO está en Git (correcto)"
fi

if git ls-files --error-unmatch server/.env &>/dev/null; then
    echo "❌ ¡PELIGRO! server/.env está en Git (contiene secretos)"
    echo "   Ejecuta: git rm --cached server/.env"
    ERRORS=$((ERRORS+1))
else
    echo "✅ server/.env NO está en Git (correcto)"
fi
echo ""

# Check dependencies
echo "📚 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "⚠️  Dependencias del frontend no instaladas"
    echo "   Ejecuta: npm install"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "⚠️  Dependencias del backend no instaladas"
    echo "   Ejecuta: cd server && npm install"
fi
echo ""

# Check build configs
echo "🔧 Verificando configuraciones..."

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml existe"
else
    echo "❌ netlify.toml no encontrado"
    ERRORS=$((ERRORS+1))
fi

if [ -f "server/render.yaml" ]; then
    echo "✅ server/render.yaml existe"
else
    echo "⚠️  server/render.yaml no encontrado (opcional)"
fi

if [ -f "package.json" ]; then
    if grep -q "\"build\":" package.json; then
        echo "✅ Script de build configurado (frontend)"
    else
        echo "❌ Script de build no encontrado en package.json"
        ERRORS=$((ERRORS+1))
    fi
fi

if [ -f "server/package.json" ]; then
    if grep -q "\"build\":" server/package.json; then
        echo "✅ Script de build configurado (backend)"
    else
        echo "❌ Script de build no encontrado en server/package.json"
        ERRORS=$((ERRORS+1))
    fi
fi
echo ""

# Check documentation
echo "📖 Verificando documentación..."
if [ -f "DEPLOY_GUIDE.md" ]; then
    echo "✅ DEPLOY_GUIDE.md existe"
else
    echo "⚠️  DEPLOY_GUIDE.md no encontrado"
fi

if [ -f "README.md" ]; then
    echo "✅ README.md existe"
else
    echo "⚠️  README.md no encontrado"
fi
echo ""

# Summary
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ TODO LISTO PARA DEPLOY"
    echo ""
    echo "Próximos pasos:"
    echo "1. Sigue la guía en DEPLOY_GUIDE.md"
    echo "2. Configura MongoDB Atlas primero"
    echo "3. Luego despliega en Render"
    echo "4. Finalmente despliega en Netlify"
    echo ""
    echo "Comandos rápidos:"
    echo "  git add ."
    echo "  git commit -m 'Ready for deployment'"
    echo "  git push origin main"
else
    echo "❌ ENCONTRADOS $ERRORS PROBLEMAS"
    echo ""
    echo "Por favor, corrige los errores antes de hacer deploy."
fi
echo "=================================="
