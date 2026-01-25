#!/bin/bash

# 🚀 QUICK DEPLOY SCRIPT - Foxy Game
# Este script NO hace el deploy automáticamente, solo muestra los pasos

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🦊 FOXY - QUICK DEPLOY GUIDE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 PASO 1: VERIFICACIÓN PRE-DEPLOY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ejecutando verificación..."
./check-deploy.sh
echo ""

echo -e "${BLUE}📦 PASO 2: COMMIT Y PUSH A GITHUB${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Ejecuta estos comandos:${NC}"
echo ""
echo "  git add ."
echo "  git commit -m \"Ready for production deployment\""
echo "  git push origin main"
echo ""
read -p "¿Ya hiciste el push? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Debes hacer push a GitHub primero${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Código en GitHub${NC}"
echo ""

echo -e "${BLUE}🗄️ PASO 3: MONGODB ATLAS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a: https://www.mongodb.com/cloud/atlas/register"
echo "2. Crea una cuenta gratuita"
echo "3. Crea un cluster M0 (gratis)"
echo "4. Database Access → Add New Database User"
echo "   - Username: foxy-admin"
echo "   - Password: (guarda esto)"
echo "5. Network Access → Add IP Address → 0.0.0.0/0"
echo "6. Clusters → Connect → Connect your application"
echo "7. Copia el connection string:"
echo "   mongodb+srv://foxy-admin:<password>@cluster0.xxxxx.mongodb.net/"
echo ""
read -p "Ingresa tu MONGODB_URI completo (incluyendo /foxy al final): " MONGODB_URI
echo ""
if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}❌ MongoDB URI es requerido${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MongoDB URI guardado${NC}"
echo ""

echo -e "${BLUE}🔧 PASO 4: RENDER (BACKEND)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a: https://dashboard.render.com/register"
echo "2. Conecta tu cuenta de GitHub"
echo "3. New → Web Service"
echo "4. Conecta: git@github.com:FCamaggi/Foxy.git"
echo "5. Configuración:"
echo "   - Name: foxy-backend"
echo "   - Root Directory: server"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "   - Instance Type: Free"
echo "6. Environment Variables:"
echo "   - NODE_ENV = production"
echo "   - PORT = 3001"
echo "   - MONGODB_URI = $MONGODB_URI"
echo "   - CORS_ORIGIN = http://localhost:3000 (cambiar después)"
echo "7. Create Web Service"
echo "8. Espera a que termine el deploy (~5 min)"
echo ""
read -p "Ingresa la URL de tu backend en Render (ej: https://foxy-backend.onrender.com): " BACKEND_URL
echo ""
if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ Backend URL es requerido${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend URL guardado: $BACKEND_URL${NC}"
echo ""

echo -e "${BLUE}🌐 PASO 5: NETLIFY (FRONTEND)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a: https://app.netlify.com/signup"
echo "2. Conecta tu cuenta de GitHub"
echo "3. Add new site → Import an existing project"
echo "4. Conecta: git@github.com:FCamaggi/Foxy.git"
echo "5. Configuración:"
echo "   - Branch: main"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "6. Advanced: Environment variables"
echo "   - VITE_SERVER_URL = $BACKEND_URL"
echo "7. Deploy site"
echo "8. Espera a que termine (~3 min)"
echo ""
read -p "Ingresa la URL de tu app en Netlify (ej: https://foxy-game.netlify.app): " FRONTEND_URL
echo ""
if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}❌ Frontend URL es requerido${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend URL guardado: $FRONTEND_URL${NC}"
echo ""

echo -e "${BLUE}🔄 PASO 6: ACTUALIZAR CORS EN RENDER${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a tu servicio en Render"
echo "2. Environment → Edit"
echo "3. Cambia CORS_ORIGIN de 'http://localhost:3000' a:"
echo "   $FRONTEND_URL"
echo "4. Save Changes"
echo "5. El servicio se redesplegaráá automáticamente (~2 min)"
echo ""
read -p "¿Ya actualizaste CORS_ORIGIN? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️ Recuerda actualizar CORS_ORIGIN o la app no funcionará${NC}"
fi
echo -e "${GREEN}✅ CORS actualizado${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 ¡DEPLOY COMPLETADO!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Tu aplicación está lista en:${NC}"
echo ""
echo -e "  🌐 Frontend: ${BLUE}$FRONTEND_URL${NC}"
echo -e "  🔧 Backend:  ${BLUE}$BACKEND_URL${NC}"
echo -e "  🗄️ Database: ${BLUE}MongoDB Atlas${NC}"
echo ""
echo -e "${YELLOW}📝 NOTAS IMPORTANTES:${NC}"
echo ""
echo "  • Primera petición al backend puede tardar ~30s (free tier se duerme)"
echo "  • MongoDB M0 tiene límite de 512MB"
echo "  • Render free tier se duerme tras 15 min sin actividad"
echo "  • Netlify tiene 100GB/mes de ancho de banda"
echo ""
echo -e "${GREEN}🧪 TESTING:${NC}"
echo ""
echo "1. Ve a: $FRONTEND_URL"
echo "2. Crea una sala"
echo "3. Comparte el código con amigos"
echo "4. ¡Juega!"
echo ""
echo -e "${BLUE}📊 MONITOREO:${NC}"
echo ""
echo "  • Render Logs: https://dashboard.render.com"
echo "  • Netlify Logs: https://app.netlify.com"
echo "  • MongoDB Metrics: https://cloud.mongodb.com"
echo ""
echo -e "${YELLOW}🐛 TROUBLESHOOTING:${NC}"
echo ""
echo "  • Si el backend no responde: Espera 30s (está despertando)"
echo "  • Si hay error de CORS: Verifica CORS_ORIGIN en Render"
echo "  • Si no conecta a DB: Verifica MONGODB_URI y Network Access"
echo ""
echo "Para más ayuda, lee: DEPLOY_GUIDE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}¡Disfruta tu juego Foxy en producción! 🦊${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
