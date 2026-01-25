# 📚 Índice Completo de Documentación - Foxy

**Proyecto:** Foxy - Juego Multijugador Digital  
**Repositorio:** `git@github.com:FCamaggi/Foxy.git`  
**Estado:** ✅ Production Ready

---

## 🎯 Empezar Aquí

Si es tu primera vez con este proyecto, lee en este orden:

1. **[README.md](./README.md)** ⭐ - COMIENZA AQUÍ
   - Overview del proyecto
   - Cómo jugar
   - Instalación local
   - Guía rápida

2. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** 📊 - Estado actual
   - Resumen del proyecto
   - Características implementadas
   - Archivos clave
   - Próximos pasos

3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏗️ - Arquitectura técnica
   - Stack tecnológico
   - Flujo de datos
   - Estructura de carpetas
   - Decisiones de diseño

---

## 🚀 Guías de Deployment

### Quick Start

| Documento | Tiempo | Para quién | Cuándo usar |
|-----------|--------|------------|-------------|
| **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** | 5 min | 🏃 Rápido | Resumen ejecutivo |
| **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** | 30 min | 📖 Detallado | Primera vez |
| **[CHECKLIST.md](./CHECKLIST.md)** | 10 min | ✅ Verificación | Antes de desplegar |

### Configuración Específica

| Documento | Contenido | Cuándo consultar |
|-----------|-----------|------------------|
| **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** | Setup MongoDB Atlas | Configurando base de datos |
| **[SCRIPTS_README.md](./SCRIPTS_README.md)** | Uso de scripts | Usando herramientas de CLI |

### Guía Obsoleta

| Documento | Estado | Nota |
|-----------|--------|------|
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | ⚠️ Obsoleto | Usar DEPLOY_GUIDE.md en su lugar |

---

## 🛠️ Scripts Disponibles

Todos los scripts están en la raíz del proyecto:

| Script | Propósito | Uso | Duración |
|--------|-----------|-----|----------|
| **start.sh** | Desarrollo local | `./start.sh` | Instantáneo |
| **check-deploy.sh** | Verificar config | `./check-deploy.sh` | 5 seg |
| **setup-deploy.sh** | Configurar Git | `./setup-deploy.sh` | 10 seg |
| **QUICK_DEPLOY.sh** | Guía interactiva | `./QUICK_DEPLOY.sh` | 30 min |

**Documentación:** [SCRIPTS_README.md](./SCRIPTS_README.md)

---

## 📖 Documentación Técnica

### Arquitectura y Diseño

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura completa del sistema
  - Frontend: React + TypeScript + Vite + Socket.io-client
  - Backend: Node.js + Express + Socket.io
  - Database: MongoDB Atlas + Mongoose
  - Deployment: Netlify + Render

### Mecánicas del Juego

- **[docs/manual.md](./docs/manual.md)** - Manual del juego físico original
  - Reglas oficiales
  - Componentes
  - Variantes
  - Nota: La versión digital implementa todas las variantes

---

## 🗂️ Estructura del Proyecto

```
foxy/
├── 📚 DOCUMENTACIÓN
│   ├── README.md                 ⭐ Inicio - Lee primero
│   ├── PROJECT_STATUS.md         📊 Estado actual
│   ├── DEPLOY_NOW.md             🚀 Deploy rápido (5 min)
│   ├── DEPLOY_GUIDE.md           📖 Deploy completo (30 min)
│   ├── MONGODB_SETUP.md          🗄️ Setup base de datos
│   ├── ARCHITECTURE.md           🏗️ Arquitectura técnica
│   ├── CHECKLIST.md              ✅ Pre-deploy checklist
│   ├── SCRIPTS_README.md         🛠️ Guía de scripts
│   ├── DEPLOYMENT.md             ⚠️ (Obsoleto)
│   └── INDEX.md                  📚 Este archivo
│
├── 🛠️ SCRIPTS
│   ├── start.sh                  ▶️ Desarrollo local
│   ├── check-deploy.sh           ✅ Verificar config
│   ├── setup-deploy.sh           🔧 Setup Git
│   └── QUICK_DEPLOY.sh           🚀 Deploy interactivo
│
├── ⚙️ CONFIGURACIÓN
│   ├── .env.example              📝 Template frontend
│   ├── .gitignore                🔒 Protege secrets
│   ├── netlify.toml              🌐 Config Netlify
│   ├── package.json              📦 Deps frontend
│   ├── tsconfig.json             🔷 TypeScript config
│   └── vite.config.ts            ⚡ Vite config
│
├── 🎮 FRONTEND (src/)
│   ├── App.tsx                   🏠 App principal
│   ├── socket.ts                 🔌 Socket.io client
│   ├── constants.tsx             🎴 Generación de cartas
│   ├── gameUtils.ts              🎯 Lógica del juego
│   ├── types.ts                  🔷 Tipos TypeScript
│   ├── components/               🧩 Componentes React
│   │   ├── CardDisplay.tsx
│   │   ├── ManualModal.tsx
│   │   ├── PlayerInput.tsx
│   │   └── ScoringTable.tsx
│   └── ...
│
├── 🔧 BACKEND (server/)
│   ├── .env.example              📝 Template backend
│   ├── package.json              📦 Deps backend
│   ├── render.yaml               🔧 Config Render
│   ├── tsconfig.json             🔷 TypeScript config
│   └── src/
│       ├── server.ts             🚀 Servidor principal
│       ├── gameLogic.ts          🎮 Generación de mazos
│       ├── types.ts              🔷 Tipos compartidos
│       └── models/
│           └── Room.ts           🗄️ Schema MongoDB
│
└── 📘 DOCS ADICIONALES
    └── docs/
        └── manual.md             📖 Manual juego original
```

---

## 🎯 Casos de Uso

### "Quiero jugar localmente"

1. Lee: [README.md](./README.md) → Sección "Desarrollo Local"
2. Ejecuta: `./start.sh`
3. Abre: http://localhost:3000

### "Quiero desplegar a producción (primera vez)"

1. Lee: [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 5 minutos
2. Ejecuta: `./check-deploy.sh` - Verificar
3. Sigue: [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - Paso a paso
4. O ejecuta: `./QUICK_DEPLOY.sh` - Guía interactiva

### "Quiero desplegar a producción (ya lo hice antes)"

1. Verifica: `./check-deploy.sh`
2. Push: `git push origin main`
3. Netlify y Render redesplegarán automáticamente

### "Tengo un error en MongoDB"

1. Lee: [MONGODB_SETUP.md](./MONGODB_SETUP.md) → Sección Troubleshooting
2. Verifica: Network Access (0.0.0.0/0)
3. Verifica: Connection String incluye `/foxy`

### "El backend no responde en producción"

1. Causa: Render free tier se duerme tras 15min
2. Solución: Espera 30s (primera petición despierta el servidor)
3. Opcional: Usa UptimeRobot para ping cada 5 min

### "Quiero entender cómo funciona el código"

1. Lee: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Revisa: [PROJECT_STATUS.md](./PROJECT_STATUS.md) → Sección "Archivos Clave"
3. Explora: El código con los comentarios

### "Quiero añadir una nueva característica"

1. Lee: [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender estructura
2. Lee: [PROJECT_STATUS.md](./PROJECT_STATUS.md) - "Desarrollo Futuro"
3. Desarrolla localmente con `./start.sh`
4. Testea y haz commit
5. Despliega con `git push`

---

## 🔍 Búsqueda Rápida

### Por Tema

**Deployment**
- Quick: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- Completo: [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- Checklist: [CHECKLIST.md](./CHECKLIST.md)

**Base de Datos**
- Setup: [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- Schema: [server/src/models/Room.ts](./server/src/models/Room.ts)

**Código**
- Frontend: [App.tsx](./App.tsx), [components/](./components/)
- Backend: [server/src/server.ts](./server/src/server.ts)
- Game Logic: [gameUtils.ts](./gameUtils.ts), [constants.tsx](./constants.tsx)

**Configuración**
- Frontend: [.env.example](./.env.example), [vite.config.ts](./vite.config.ts)
- Backend: [server/.env.example](./server/.env.example), [render.yaml](./server/render.yaml)
- Deployment: [netlify.toml](./netlify.toml)

### Por Tipo de Archivo

**Markdown (.md)**
- 10 archivos de documentación
- Ver lista completa arriba

**Scripts (.sh)**
- 4 scripts ejecutables
- Documentados en [SCRIPTS_README.md](./SCRIPTS_README.md)

**Configuración**
- `.env.example` (frontend y backend)
- `package.json` (frontend y backend)
- `tsconfig.json` (frontend y backend)
- `netlify.toml`, `render.yaml`

---

## 📊 Estadísticas del Proyecto

- **Líneas de documentación:** ~3000+
- **Archivos de documentación:** 10
- **Scripts de utilidad:** 4
- **Variantes de juego:** 4
- **Niveles de dificultad:** 3
- **Jugadores por sala:** 2-4
- **Rondas por partida:** 10
- **Combinaciones de cartas:** 52 por entorno

---

## 🔄 Actualizaciones

Este índice se actualiza con cada cambio significativo en la documentación.

**Última actualización:** Deployment completo documentado  
**Próxima revisión:** Después del primer deployment exitoso

---

## 🤝 Contribuciones

Si añades nueva documentación:

1. Actualiza este índice (INDEX.md)
2. Añade referencia en el README.md si es relevante
3. Actualiza PROJECT_STATUS.md si cambia el estado
4. Haz commit descriptivo

---

## 📞 Soporte

**¿No encuentras lo que buscas?**

1. Usa Ctrl+F en este índice
2. Revisa [PROJECT_STATUS.md](./PROJECT_STATUS.md)
3. Lee el [README.md](./README.md)

**¿Errores en la documentación?**

1. Abre un issue en GitHub
2. O haz un PR con la corrección

---

## ✨ Documentos Esenciales

Si solo puedes leer 3 documentos, lee estos:

1. **[README.md](./README.md)** - Todo lo básico
2. **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - Desplegar a producción
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Entender el código

---

**¿Listo para comenzar?** → [README.md](./README.md) ⭐
