# 🦊 Foxy Digital - Multiplayer Memory Game

Un juego de memoria y astucia donde los jugadores deben recordar cuántos animales de cada tipo han aparecido a lo largo de la partida.

<div align="center">

**🎮 Multijugador en Tiempo Real** | **🎲 4 Variantes de Juego** | **🏆 Sistema de Puntuación Competitivo**

</div>

---

## 📋 Características

- ✅ **Multijugador Online**: Hasta 5 jugadores simultáneos
- 🎯 **4 Variantes de Foxy**: Estándar, Animal más visto, Solitarios, Zorro Gatuno
- 📊 **3 Niveles de Dificultad**: Fácil, Medio, Difícil (con distribución dinámica de cartas)
- 🏆 **Sistema de Desempate Completo**: Con podio y estadísticas
- 💾 **Persistencia de Salas**: MongoDB Atlas para salas activas
- 🔄 **Sincronización en Tiempo Real**: Socket.io
- 📱 **Responsive**: Funciona en móvil, tablet y desktop

---

## 🚀 Inicio Rápido

### 🎮 Usar en Producción (Ya Desplegado)

Si el juego ya está desplegado, simplemente ve a la URL de producción y juega.

### 💻 Desarrollo Local

**Opción 1: Script Automático**

```bash
./start.sh
```

**Opción 2: Manual**

**Terminal 1 - Backend:**
```bash
cd server
npm install
cp .env.example .env
# Configura tu MONGODB_URI en .env (ver MONGODB_SETUP.md)
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 🚀 Desplegar a Producción

**Guía Rápida:**
1. Lee [DEPLOY_NOW.md](./DEPLOY_NOW.md) - Resumen de 5 minutos
2. Sigue [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - Guía paso a paso completa

**Tiempo total:** ~30 minutos | **Costo:** $0/mes (tier gratuito)

---

## 📚 Documentación

- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - 🚀 Resumen ejecutivo para deployment
- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - 📖 Guía completa paso a paso
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - 🗄️ Configuración detallada de MongoDB Atlas
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 🏗️ Arquitectura del sistema
- **[CHECKLIST.md](./CHECKLIST.md)** - ✅ Checklist de verificación
- **[docs/manual.md](./docs/manual.md)** - 📘 Manual del juego físico original

---

## 🏗️ Arquitectura

```
Frontend (React + Vite + Socket.io)
         ↓
    WebSocket Connection
         ↓
Backend (Node.js + Express + Socket.io)
         ↓
    MongoDB Atlas
```

### Stack Tecnológico

**Frontend:**
- React 18 + TypeScript
- Vite
- Socket.io-client
- TailwindCSS
- Lucide Icons

**Backend:**
- Node.js + Express
- Socket.io
- MongoDB + Mongoose
- TypeScript

**Infraestructura:**
- Frontend: Netlify
- Backend: Render
- Base de Datos: MongoDB Atlas (Free Tier)

---

## 🎮 Cómo Jugar

1. **Crea una Sala**: Ingresa tu nombre, elige dificultad y variante
2. **Comparte el Código**: Comparte el código de 6 caracteres con tus amigos
3. **Juega 20 Rondas**: Observa cada carta y cuenta los animales acumulados
4. **Apuesta Sabiamente**: Usa tu apuesta x2 una vez por partida
5. **Revisa Puntuaciones**: Al final, compara tus resultados con el podio

---

## 🎯 Variantes del Juego

### 🦊 Estándar
Cuando sale Foxy, cuenta cuántos **tipos de animales diferentes** has visto.

### 📊 Animal Más Visto
Cuando sale Foxy, cuenta las veces que ha salido el **animal más repetido**.

### 🎯 Animales Solitarios
Cuando sale Foxy, cuenta cuántas cartas han tenido **solo un animal**.

### 🐱 Zorro Gatuno
Foxy cuenta como un **gato más** en todas las rondas.

---

## 🛠️ Desarrollo

### Estructura del Proyecto

```
foxy/
├── src/                    # Frontend React
│   ├── components/         # Componentes UI
│   ├── App.tsx            # Componente principal
│   ├── constants.tsx      # Configuración de cartas
│   ├── gameUtils.ts       # Lógica del juego
│   └── socket.ts          # Cliente Socket.io
├── server/                # Backend Node.js
│   └── src/
│       ├── server.ts      # Servidor principal
│       ├── models/        # Modelos MongoDB
│       ├── gameLogic.ts   # Generación de mazos
│       └── types.ts       # Tipos TypeScript
├── docs/                  # Documentación del juego
├── DEPLOY_GUIDE.md        # 📖 Guía completa de despliegue
├── DEPLOY_NOW.md          # 🚀 Resumen rápido de deploy
├── MONGODB_SETUP.md       # 🗄️ Configuración de MongoDB
├── ARCHITECTURE.md        # 🏗️ Arquitectura del sistema
└── CHECKLIST.md           # ✅ Checklist de verificación
```

### Scripts Disponibles

**Frontend:**
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

**Backend:**
- `npm run dev` - Servidor con hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor compilado

**Utilidades:**
- `./start.sh` - Iniciar frontend + backend automáticamente
- `./check-deploy.sh` - Verificar configuración antes de desplegar
- `./setup-deploy.sh` - Configurar Git para deployment

---

## 🌐 Despliegue

### Guía Rápida

1. **Lee primero:** [DEPLOY_NOW.md](./DEPLOY_NOW.md) (5 minutos)
2. **Sigue paso a paso:** [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) (30 minutos)
3. **Verifica antes:** `./check-deploy.sh`

### Orden de Deployment

1. **MongoDB Atlas** - Crea cluster M0 (gratis)
2. **Render** - Despliega backend con `server/` como Root Directory
3. **Netlify** - Despliega frontend desde `main` branch
4. **Actualiza CORS** - Añade URL de Netlify en Render

**Costo total:** $0/mes (tier gratuito) 🎉

---

## 🔒 Variables de Entorno

**Frontend (/.env):**
```env
VITE_SERVER_URL=http://localhost:3001
# Producción: https://tu-app-backend.onrender.com
```

**Backend (server/.env):**
```env
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/foxy?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
# Producción: https://tu-app.netlify.app
NODE_ENV=development
```

**Archivos de ejemplo disponibles:**
- `.env.example` - Variables del frontend
- `server/.env.example` - Variables del backend

⚠️ **Nunca subas archivos `.env` a Git** - Ya están protegidos en `.gitignore`

---

## 🧪 Verificación Pre-Deploy

Ejecuta antes de desplegar para verificar la configuración:

```bash
chmod +x check-deploy.sh
./check-deploy.sh
```

El script verifica:
- ✅ Git configurado con remote correcto
- ✅ Variables de entorno presentes
- ✅ Archivos de configuración (netlify.toml, render.yaml)
- ✅ Scripts de deployment disponibles

---

## 🐛 Troubleshooting

### El cliente muestra "Desconectado"
- ✅ Verifica que el servidor esté corriendo en el puerto 3001
- ✅ Verifica `VITE_SERVER_URL` en el frontend
- Revisa la consola del navegador para errores

### Error de MongoDB
- Verifica tu `MONGODB_URI` en `server/.env`
- Sigue la guía en `MONGODB_SETUP.md`
- Asegúrate de que Network Access permita 0.0.0.0/0

### Las salas no se sincronizan
- Verifica que todos los clientes usen el mismo servidor
- Revisa los logs del servidor
- Comprueba que CORS esté configurado correctamente

---

## 📝 Licencia

MIT

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

<div align="center">

**Desarrollado con ❤️ para la comunidad de jugadores de mesa**

¿Preguntas? Abre un [issue](../../issues)

</div>
