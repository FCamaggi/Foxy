# 🚀 Guía Completa de Deployment - Foxy Digital

Esta es la guía paso a paso para desplegar Foxy en producción usando MongoDB Atlas, Render y Netlify.

---

## 📋 Prerrequisitos

- [ ] Cuenta de GitHub
- [ ] Cuenta de MongoDB Atlas (gratis)
- [ ] Cuenta de Render (gratis)
- [ ] Cuenta de Netlify (gratis)
- [ ] Git configurado localmente

---

## PARTE 1: PREPARAR EL CÓDIGO

### Paso 1: Subir el Código a GitHub

```bash
cd /home/fabrizio/code/gameboards/Foxy

# Inicializar Git (si no lo está)
git init

# Agregar el remoto
git remote add origin git@github.com:FCamaggi/Foxy.git

# Verificar que .env está en .gitignore
cat .gitignore | grep ".env"

# Hacer commit de todo
git add .
git commit -m "Initial commit - Foxy multiplayer game"

# Subir a GitHub
git branch -M main
git push -u origin main
```

**✅ Verifica:** Ve a https://github.com/FCamaggi/Foxy y confirma que el código está ahí.

---

## PARTE 2: CONFIGURAR MONGODB ATLAS

### Paso 2: Crear Cuenta y Cluster

1. **Ir a MongoDB Atlas**
   - Abre https://www.mongodb.com/cloud/atlas/register
   - Regístrate con tu email o GitHub

2. **Crear un Cluster Gratuito**
   - Click en **"Build a Database"** o **"Create"**
   - Selecciona **"M0 FREE"** (el plan gratuito)
   - Proveedor: **AWS** (recomendado)
   - Región: Selecciona la más cercana (ej: `us-east-1` o `South America`)
   - Cluster Name: `Foxy`
   - Click **"Create Cluster"** (toma 3-5 minutos)

### Paso 3: Crear Usuario de Base de Datos

1. **Ir a Database Access**
   - En el menú izquierdo, click en **"Security" → "Database Access"**
   - Click en **"+ ADD NEW DATABASE USER"**

2. **Configurar Usuario**
   - Authentication Method: **Password**
   - Username: `foxy_admin`
   - Password: Click en **"Autogenerate Secure Password"** 
   - **⚠️ IMPORTANTE:** Copia y guarda esta contraseña en un lugar seguro
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

### Paso 4: Permitir Acceso de Red

1. **Ir a Network Access**
   - En el menú izquierdo, click en **"Security" → "Network Access"**
   - Click en **"+ ADD IP ADDRESS"**

2. **Permitir todas las IPs**
   - Click en **"ALLOW ACCESS FROM ANYWHERE"**
   - Esto añadirá `0.0.0.0/0`
   - Click **"Confirm"**
   
   > **Nota:** Para producción esto es necesario porque Render usa IPs dinámicas. En un entorno más seguro, restringirías esto a IPs específicas.

### Paso 5: Obtener Connection String

1. **Ir a Database**
   - En el menú izquierdo, click en **"Database"**
   - En tu cluster, click en **"Connect"**

2. **Seleccionar método de conexión**
   - Click en **"Drivers"**
   - Driver: **Node.js**
   - Version: **5.5 or later**

3. **Copiar el Connection String**
   - Verás algo como:
     ```
     mongodb+srv://foxy_admin:<password>@foxy.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Copia este string completo**
   - Reemplaza `<password>` con la contraseña que copiaste antes
   - Añade `/foxy` después de `.net` para especificar la base de datos:
     ```
     mongodb+srv://foxy_admin:TU_PASSWORD_REAL@foxy.xxxxx.mongodb.net/foxy?retryWrites=true&w=majority
     ```

4. **Guardar para después**
   - Guarda este string completo en un archivo temporal
   - Lo necesitarás para configurar Render

**✅ Verifica:** Tu connection string debe verse así:
```
mongodb+srv://foxy_admin:abc123XYZ@foxy.abc123.mongodb.net/foxy?retryWrites=true&w=majority
```

---

## PARTE 3: DESPLEGAR EL BACKEND EN RENDER

### Paso 6: Crear Cuenta en Render

1. Ve a https://render.com
2. Click en **"Get Started"**
3. Regístrate con tu cuenta de GitHub

### Paso 7: Crear Web Service

1. **En el Dashboard de Render**
   - Click en **"New +"** (arriba a la derecha)
   - Selecciona **"Web Service"**

2. **Conectar Repositorio**
   - Si es la primera vez, autoriza a Render a acceder a tus repos de GitHub
   - Busca y selecciona **FCamaggi/Foxy**
   - Click en **"Connect"**

3. **Configurar el Servicio**
   - **Name:** `foxy-server` (o el nombre que prefieras)
   - **Region:** Selecciona la región más cercana
   - **Branch:** `main`
   - **Root Directory:** `server` ⚠️ **IMPORTANTE**
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

4. **Añadir Variables de Entorno**
   - Scroll down hasta **"Environment Variables"**
   - Click en **"Add Environment Variable"** para cada una:

   ```
   NODE_ENV = production
   ```
   
   ```
   PORT = 3001
   ```
   
   ```
   MONGODB_URI = (pega aquí tu connection string completo de MongoDB Atlas)
   ```
   
   ```
   CORS_ORIGIN = (déjalo vacío por ahora, lo actualizaremos después)
   ```

5. **Crear el Web Service**
   - Click en **"Create Web Service"** (abajo)
   - Render comenzará a desplegar (toma 5-10 minutos)

6. **Esperar el Deploy**
   - Verás logs en tiempo real
   - Espera a ver: ✅ "Deploy successful"

7. **Copiar la URL del Backend**
   - Arriba verás la URL, algo como:
     ```
     https://foxy-server-abc123.onrender.com
     ```
   - **Copia esta URL** (la necesitarás para Netlify)

**✅ Verifica:** 
- Abre `https://TU-URL-DE-RENDER.onrender.com/health`
- Deberías ver: `{"status":"ok","mongodb":"connected"}`

---

## PARTE 4: DESPLEGAR EL FRONTEND EN NETLIFY

### Paso 8: Crear Cuenta en Netlify

1. Ve a https://app.netlify.com
2. Click en **"Sign up"**
3. Regístrate con tu cuenta de GitHub

### Paso 9: Crear Nuevo Site

1. **En el Dashboard de Netlify**
   - Click en **"Add new site"** → **"Import an existing project"**

2. **Conectar con GitHub**
   - Click en **"Deploy with GitHub"**
   - Autoriza a Netlify si es necesario
   - Busca y selecciona **FCamaggi/Foxy**

3. **Configurar Build Settings**
   - **Branch to deploy:** `main`
   - **Base directory:** (déjalo vacío)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Añadir Variable de Entorno**
   - Click en **"Add environment variables"**
   - Click en **"New variable"**
   
   ```
   VITE_SERVER_URL = (pega aquí la URL de tu servidor Render)
   ```
   
   Por ejemplo: `https://foxy-server-abc123.onrender.com`

5. **Deploy**
   - Click en **"Deploy"** (puede decir "Deploy site" o similar)
   - Netlify comenzará el build (toma 2-5 minutos)

6. **Esperar el Deploy**
   - Verás el progreso del build
   - Espera a ver: "Published" con una ✅

7. **Obtener la URL de tu Sitio**
   - Netlify te asignará una URL como:
     ```
     https://random-name-123.netlify.app
     ```
   - Puedes cambiarla:
     - Ve a **"Site settings" → "Domain management"**
     - Click en **"Options" → "Edit site name"**
     - Cámbiala a algo como: `foxy-game` → `https://foxy-game.netlify.app`

**✅ Verifica:** 
- Abre tu URL de Netlify
- Deberías ver el juego Foxy cargando

---

## PARTE 5: CONECTAR TODO

### Paso 10: Actualizar CORS en Render

1. **Volver a Render**
   - Ve a https://dashboard.render.com
   - Abre tu servicio `foxy-server`

2. **Editar Variables de Entorno**
   - Ve a **"Environment"** en el menú izquierdo
   - Encuentra la variable `CORS_ORIGIN`
   - Click en el botón de editar
   - Actualiza el valor con tu URL de Netlify:
     ```
     https://foxy-game.netlify.app
     ```
   - Click en **"Save Changes"**

3. **Esperar Redeploy Automático**
   - Render reiniciará el servicio automáticamente (2-3 minutos)

**✅ Verifica:** 
- Abre tu URL de Netlify de nuevo
- Verifica que el indicador de conexión esté en VERDE (Wifi icon)
- Si está rojo, espera 1 minuto más (Render puede tardar en despertar)

---

## 🎉 PARTE 6: PROBAR TODO

### Paso 11: Prueba Completa

1. **Abre tu juego en Netlify**
   - `https://tu-sitio.netlify.app`

2. **Verifica la conexión**
   - Debe mostrar el indicador VERDE (conectado)

3. **Crea una partida**
   - Ingresa tu nombre
   - Selecciona dificultad y variante
   - Click en **"Crear Partida Nueva"**
   - Debe generar un código de 6 caracteres

4. **Prueba multijugador**
   - Opción A: Abre una pestaña privada/incógnito
   - Opción B: Usa otro navegador o dispositivo
   - Ingresa con otro nombre
   - Usa el código para unirte
   - Verifica que ambos jugadores aparecen en la sala

5. **Inicia la partida**
   - Como anfitrión, click en "¡Comenzar Partida!"
   - Ambos jugadores deben ver la primera carta
   - Juega algunas rondas para verificar sincronización

**✅ TODO FUNCIONA:** Si llegaste hasta aquí, ¡tu juego está en producción! 🎉

---

## 📊 MONITOREO Y MANTENIMIENTO

### Ver Logs del Backend (Render)

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio `foxy-server`
3. Click en **"Logs"** (menú izquierdo)
4. Verás logs en tiempo real

### Ver Base de Datos (MongoDB Atlas)

1. Ve a https://cloud.mongodb.com
2. Click en **"Database"** → **"Browse Collections"**
3. Selecciona tu cluster `Foxy`
4. Verás la base de datos `foxy` y colección `rooms`
5. Puedes ver las salas activas en tiempo real

### Analytics del Frontend (Netlify)

1. Ve a https://app.netlify.com
2. Selecciona tu sitio
3. Click en **"Analytics"**
4. Verás visitas, banda ancha usada, etc.

---

## ⚠️ LIMITACIONES DEL TIER GRATUITO

### Render (Backend)
- 🔴 **Auto-sleep:** El servidor se duerme después de 15 min de inactividad
- Primera petición después de dormir toma ~30 segundos
- **Solución:** Upgrade a Render Starter ($7/mes) para servidor siempre activo

### Netlify (Frontend)
- ✅ 100 GB de bandwidth/mes (suficiente para cientos de usuarios)
- ✅ Sin auto-sleep
- ✅ CDN global

### MongoDB Atlas
- ✅ 512 MB de storage (suficiente para miles de partidas)
- ✅ Sin límite de tiempo

---

## 🔄 ACTUALIZACIONES

Cada vez que hagas cambios y quieras actualizarlos en producción:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

- **Netlify:** Se redesplega automáticamente (2-3 min)
- **Render:** Se redesplega automáticamente (5-8 min)

---

## 🐛 TROUBLESHOOTING

### "Desconectado" en el frontend

**Causas:**
1. Render se durmió (primera carga toma 30s)
2. CORS_ORIGIN mal configurado
3. Backend caído

**Solución:**
1. Espera 30-60 segundos y recarga
2. Verifica CORS_ORIGIN en Render = URL de Netlify exacta
3. Revisa logs en Render

### MongoDB "Authentication failed"

**Causas:**
1. Contraseña incorrecta en MONGODB_URI
2. Usuario no creado correctamente

**Solución:**
1. Verifica el connection string en Render
2. Recrea el usuario en MongoDB Atlas
3. Copia/pega con cuidado (sin espacios extras)

### Build falla en Netlify

**Causas:**
1. Error de TypeScript
2. Variable de entorno faltante

**Solución:**
1. Revisa los logs del build en Netlify
2. Verifica que VITE_SERVER_URL esté configurada
3. Prueba el build localmente: `npm run build`

### Build falla en Render

**Causas:**
1. Root Directory incorrecto
2. Comandos mal configurados

**Solución:**
1. Verifica Root Directory = `server`
2. Build Command = `npm install && npm run build`
3. Start Command = `npm start`

---

## 💰 COSTOS Y ESCALABILIDAD

### Actual (TODO GRATIS)
- MongoDB Atlas M0: **$0**
- Render Free: **$0**
- Netlify Free: **$0**
- **TOTAL: $0/mes**

### Para Escalar (Producción Seria)
- MongoDB Atlas M2: **$9/mes**
- Render Starter: **$7/mes**
- Netlify Pro: **$19/mes** (opcional)
- **TOTAL: ~$16-35/mes**

---

## 🎯 RESUMEN DE URLs

Al final de este proceso tendrás:

```
Frontend (Netlify):
https://foxy-game.netlify.app

Backend (Render):
https://foxy-server.onrender.com

Base de Datos (MongoDB Atlas):
mongodb+srv://foxy_admin:PASSWORD@foxy.xxxxx.mongodb.net/foxy

Repositorio (GitHub):
https://github.com/FCamaggi/Foxy
```

---

## ✅ CHECKLIST FINAL

- [ ] Código subido a GitHub
- [ ] MongoDB Atlas cluster creado
- [ ] Usuario de BD creado
- [ ] Connection string obtenido
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas en Render
- [ ] Backend funcionando (health check OK)
- [ ] Frontend desplegado en Netlify
- [ ] VITE_SERVER_URL configurado en Netlify
- [ ] CORS_ORIGIN actualizado en Render
- [ ] Juego carga correctamente
- [ ] Indicador "Conectado" en verde
- [ ] Multijugador probado y funcionando

---

**¡Felicidades! Tu juego Foxy está en producción y disponible para el mundo. 🎮🦊**

¿Preguntas? Revisa los logs en Render y Netlify para debugging.
