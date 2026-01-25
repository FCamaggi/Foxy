# 🦊 Foxy Digital - Guía de Despliegue Multijugador

## 📋 Arquitectura

- **Frontend (Cliente)**: React + Vite + Socket.io-client → **Netlify**
- **Backend (Servidor)**: Node.js + Express + Socket.io → **Render**
- **Base de Datos**: MongoDB → **MongoDB Atlas**

---

## 🗄️ Paso 1: Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (usa el tier gratuito M0)
4. En "Database Access", crea un usuario con contraseña
5. En "Network Access", añade `0.0.0.0/0` para permitir acceso desde Render
6. Obtén tu connection string:
   - Click en "Connect" → "Connect your application"
   - Copia el string (ej: `mongodb+srv://user:password@cluster.mongodb.net/foxy`)
7. Guarda este string, lo necesitarás después

---

## 🚀 Paso 2: Desplegar el Backend en Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `foxy-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Añade variables de entorno:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=<tu-connection-string-de-mongodb-atlas>
   CORS_ORIGIN=<tu-url-de-netlify>
   ```
   
6. Click en "Create Web Service"
7. Espera a que se despliegue (5-10 minutos)
8. **Guarda la URL** de tu servidor (ej: `https://foxy-server.onrender.com`)

---

## 🌐 Paso 3: Desplegar el Frontend en Netlify

1. Ve a [Netlify.com](https://netlify.com) y crea una cuenta
2. Click en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Configura el build:
   - **Base directory**: `/`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Añade una variable de entorno en Netlify:
   - Ve a "Site settings" → "Environment variables"
   - Añade:
     ```
     VITE_SERVER_URL=<url-de-tu-servidor-render>
     ```
     (ej: `https://foxy-server.onrender.com`)

6. Click en "Deploy site"
7. Espera a que se despliegue (2-5 minutos)
8. **Guarda tu URL de Netlify** (ej: `https://foxy-game.netlify.app`)

---

## 🔄 Paso 4: Actualizar CORS

1. Vuelve a Render
2. Ve a tu servicio → "Environment"
3. Actualiza la variable `CORS_ORIGIN` con tu URL de Netlify:
   ```
   CORS_ORIGIN=https://foxy-game.netlify.app
   ```
4. Guarda los cambios (el servidor se reiniciará automáticamente)

---

## ✅ Paso 5: Verificar el Despliegue

1. Abre tu URL de Netlify en el navegador
2. Deberías ver el indicador de conexión en verde (Wifi icon)
3. Intenta crear una partida
4. Comparte el código con un amigo (o abre en otra pestaña/dispositivo)
5. ¡Juega en multijugador!

---

## 🔧 Desarrollo Local

### Backend (Terminal 1):
```bash
cd server
npm install
cp .env.example .env
# Edita .env con tu MONGODB_URI local
npm run dev
```

### Frontend (Terminal 2):
```bash
npm install
npm run dev
```

### MongoDB Local (opcional):
```bash
# Instalar MongoDB localmente o usar Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🐛 Troubleshooting

### "Desconectado" en el frontend:
- Verifica que VITE_SERVER_URL apunte a tu backend de Render
- Verifica que CORS_ORIGIN en Render coincida con tu URL de Netlify
- Revisa los logs del servidor en Render

### "Error al crear sala":
- Verifica que MongoDB Atlas esté configurado correctamente
- Revisa los logs del servidor en Render
- Asegúrate de que la IP 0.0.0.0/0 esté permitida en Network Access de MongoDB

### El servidor se duerme (Render Free Tier):
- Render pone a dormir los servicios gratuitos después de 15 minutos de inactividad
- La primera petición después de dormir tomará ~30 segundos
- Considera usar un servicio de ping para mantenerlo activo

---

## 📊 Monitoreo

### Render:
- Ve a tu servicio → "Logs" para ver los logs en tiempo real
- Ve a "Metrics" para ver uso de CPU/RAM

### MongoDB Atlas:
- Ve a tu cluster → "Metrics" para ver conexiones y operaciones

---

## 💰 Costos

- **MongoDB Atlas**: Gratis hasta 512MB de almacenamiento
- **Render**: Gratis con limitaciones (se duerme después de 15 min de inactividad)
- **Netlify**: Gratis con 100GB de ancho de banda/mes

**Para producción real**, considera:
- Render Starter ($7/mes) - servidor siempre activo
- MongoDB Atlas M2 ($9/mes) - mejor rendimiento
- Netlify Pro ($19/mes) - más ancho de banda

---

## 🔐 Seguridad

- Nunca subas archivos `.env` a Git
- Usa variables de entorno para secretos
- MongoDB Atlas ya tiene autenticación incorporada
- CORS está configurado para permitir solo tu dominio de Netlify

---

## 📝 Notas Adicionales

### Actualizaciones:
- Frontend: Netlify redespliega automáticamente con cada push a main
- Backend: Render redespliega automáticamente con cada push a main

### Custom Domains:
- Tanto Netlify como Render permiten dominios personalizados en planes gratuitos
- Configura el dominio en cada plataforma y actualiza CORS_ORIGIN

---

¡Listo! Tu juego Foxy está desplegado y funcionando en la nube. 🎉
