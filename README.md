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

### Opción 1: Script Automático

```bash
./start.sh
```

### Opción 2: Manual

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

---

## 📚 Documentación

- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Guía completa para configurar MongoDB Atlas
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue en Netlify + Render
- **[docs/manual.md](./docs/manual.md)** - Manual del juego físico original

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
├── docs/                  # Documentación
└── DEPLOYMENT.md          # Guía de despliegue
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

---

## 🌐 Despliegue

Sigue la guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

**Resumen:**
1. Crea cluster en MongoDB Atlas
2. Despliega backend en Render
3. Despliega frontend en Netlify
4. Configura variables de entorno

**Costos:** Gratis con limitaciones (tier gratuito de todos los servicios)

---

## 🔒 Variables de Entorno

**Frontend (.env):**
```env
VITE_SERVER_URL=http://localhost:3001
```

**Backend (server/.env):**
```env
PORT=3001
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### El cliente muestra "Desconectado"
- Verifica que el servidor esté corriendo en el puerto 3001
- Verifica `VITE_SERVER_URL` en el frontend
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
