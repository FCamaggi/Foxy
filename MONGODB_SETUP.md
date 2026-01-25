# 🗄️ Configuración de MongoDB Atlas

## Paso 1: Crear Cuenta y Cluster

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Regístrate con tu email o cuenta de Google/GitHub
3. Selecciona el plan **FREE (M0)** - perfecto para desarrollo y pequeña escala
4. Elige la región más cercana a ti (ej: `us-east-1` o `europe-west-1`)
5. Nombre del cluster: `Foxy` (o el que prefieras)
6. Click en **Create Cluster** (tomará 3-5 minutos)

## Paso 2: Crear Usuario de Base de Datos

1. En el sidebar izquierdo, ve a **Security → Database Access**
2. Click en **Add New Database User**
3. Configuración:
   - **Authentication Method**: Password
   - **Username**: `foxy_admin` (o el que prefieras)
   - **Password**: Genera una contraseña segura (guárdala)
   - **Database User Privileges**: `Atlas admin` o `Read and write to any database`
4. Click en **Add User**

## Paso 3: Permitir Acceso desde Cualquier IP

1. En el sidebar izquierdo, ve a **Security → Network Access**
2. Click en **Add IP Address**
3. Selecciona **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ Para producción, deberías restringir esto a las IPs de Render
4. Click en **Confirm**

## Paso 4: Obtener Connection String

1. Click en **Database** en el sidebar
2. En tu cluster, click en **Connect**
3. Selecciona **Drivers**
4. Elige:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copia el connection string, se verá así:
   ```
   mongodb+srv://foxy_admin:<password>@foxy.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Paso 5: Configurar en tu Proyecto

### Para Desarrollo Local:

1. Edita `server/.env`:
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://foxy_admin:TU_PASSWORD@foxy.xxxxx.mongodb.net/foxy?retryWrites=true&w=majority
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

2. **Importante**: Reemplaza:
   - `TU_PASSWORD` con la contraseña real del usuario
   - `foxy.xxxxx.mongodb.net` con tu cluster real
   - Añade `/foxy` después del `.net` para especificar la base de datos

### Para Producción (Render):

En Render, añade la variable de entorno:
```
MONGODB_URI=mongodb+srv://foxy_admin:TU_PASSWORD@foxy.xxxxx.mongodb.net/foxy?retryWrites=true&w=majority
```

## ✅ Verificar Conexión

Inicia el servidor:
```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 3001
```

## 🔍 Monitorear tu Base de Datos

1. Ve a **Database → Collections** en Atlas
2. Verás una base de datos llamada `foxy`
3. Dentro verás la colección `rooms` con las salas activas
4. Puedes ver, editar y eliminar documentos desde aquí

## 📊 Estadísticas y Límites (Free Tier)

- **Almacenamiento**: 512 MB
- **RAM**: 512 MB compartida
- **Conexiones simultáneas**: 500
- **Backups**: No incluidos en el tier gratuito

**Suficiente para:**
- Miles de partidas completadas
- ~50 usuarios simultáneos
- Desarrollo y producción inicial

## 🚀 Cuando Escalar

Si tu juego crece, considera actualizar a:
- **M2** ($9/mes): 2 GB storage, 2 GB RAM
- **M5** ($25/mes): 5 GB storage, 8 GB RAM
- Backups automáticos incluidos

## 🔒 Seguridad Adicional

Para producción, mejora la seguridad:

1. **Restricción de IPs**:
   - Elimina `0.0.0.0/0`
   - Añade solo las IPs de Render

2. **Variables de Entorno**:
   - Nunca subas `.env` a Git
   - Usa secretos de Render para variables sensibles

3. **Usuario de Solo Lectura**:
   - Crea un usuario con permisos limitados para monitoreo

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Verifica usuario y contraseña
- Asegúrate de escapar caracteres especiales en la contraseña (usa `%40` para `@`)

### Error: "Connection timeout"
- Verifica que 0.0.0.0/0 esté en Network Access
- Revisa tu conexión a internet

### Error: "No database selected"
- Asegúrate de añadir `/foxy` después del dominio en la URI

---

¡Listo! Tu MongoDB Atlas está configurado y listo para usar. 🎉
