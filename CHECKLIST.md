# ✅ Checklist de Configuración

Usa esta lista para verificar que todo esté correctamente configurado.

## 📦 Paso 1: Dependencias

- [ ] `npm install` ejecutado en la raíz del proyecto
- [ ] `cd server && npm install` ejecutado en el servidor
- [ ] No hay errores de instalación

## 🗄️ Paso 2: MongoDB Atlas

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Cluster gratuito M0 creado
- [ ] Usuario de base de datos creado con contraseña
- [ ] Network Access configurado para 0.0.0.0/0
- [ ] Connection string copiado

## ⚙️ Paso 3: Variables de Entorno

**Frontend:**
- [ ] Archivo `.env` creado en la raíz
- [ ] `VITE_SERVER_URL=http://localhost:3001` configurado

**Backend:**
- [ ] Archivo `server/.env` creado
- [ ] `MONGODB_URI` configurado con tu connection string de Atlas
- [ ] `PORT=3001` configurado
- [ ] `CORS_ORIGIN=http://localhost:3000` configurado

## 🚀 Paso 4: Prueba Local

- [ ] Servidor backend inicia sin errores: `cd server && npm run dev`
- [ ] Ver mensaje: "✅ Connected to MongoDB Atlas"
- [ ] Ver mensaje: "🚀 Server running on port 3001"
- [ ] Frontend inicia sin errores: `npm run dev`
- [ ] Navegador abre en http://localhost:3000
- [ ] Indicador de conexión muestra "Conectado" (icono verde)

## 🎮 Paso 5: Funcionalidad Básica

- [ ] Puedes ingresar tu nombre
- [ ] Puedes seleccionar dificultad
- [ ] Puedes seleccionar variante de Foxy
- [ ] Botón "Crear Partida Nueva" funciona
- [ ] Se genera un código de sala de 6 caracteres
- [ ] Apareces en la lista de jugadores
- [ ] Se muestra configuración (dificultad y variante)

## 👥 Paso 6: Multijugador

**Opción A: Dos pestañas en el mismo navegador**
- [ ] Abre http://localhost:3000 en una segunda pestaña
- [ ] Ingresa un nombre diferente
- [ ] Ingresa el código de sala de la primera pestaña
- [ ] Click en "Entrar"
- [ ] El segundo jugador aparece en la sala de espera
- [ ] Ambas pestañas muestran 2 jugadores

**Opción B: Dos navegadores diferentes**
- [ ] Repite el proceso anterior en Chrome, Firefox, o navegador privado

## 🎲 Paso 7: Iniciar Partida

- [ ] Con 2+ jugadores, el anfitrión ve botón "¡Comenzar Partida!"
- [ ] Click en el botón
- [ ] La partida inicia para ambos jugadores
- [ ] Se muestra la primera carta
- [ ] Aparece el campo para ingresar respuesta
- [ ] Aparece el checkbox de apuesta (círculo)

## 🎯 Paso 8: Jugar Ronda

- [ ] Ambos jugadores ingresan un número
- [ ] Click en "Enviar Respuesta"
- [ ] La ronda avanza automáticamente cuando todos responden
- [ ] Se muestra la siguiente carta
- [ ] Contador de ronda incrementa (Ronda 2/20, 3/20, etc.)

## 🏆 Paso 9: Finalizar Partida

- [ ] Juega hasta la ronda 20 (o simula enviando respuestas rápidas)
- [ ] Al terminar, aparece la tabla de puntuación
- [ ] Se muestra el podio con top 3
- [ ] Las respuestas se revelan carta por carta
- [ ] Se muestran puntuaciones correctas/incorrectas
- [ ] Se muestra el total de cada jugador

## 🔍 Paso 10: MongoDB Atlas Verificación

- [ ] Accede a MongoDB Atlas dashboard
- [ ] Ve a Database → Browse Collections
- [ ] Debería aparecer la base de datos `foxy`
- [ ] Dentro, colección `rooms`
- [ ] Puedes ver las salas creadas con sus datos

---

## ❌ Si Algo Falla

### Frontend no inicia
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Backend no conecta a MongoDB
1. Verifica el connection string en `server/.env`
2. Asegúrate de reemplazar `<password>` con tu contraseña real
3. Verifica que Network Access en Atlas permite 0.0.0.0/0
4. Prueba la conexión directamente:
   ```bash
   cd server
   node -e "require('mongoose').connect(process.env.MONGODB_URI || require('dotenv').config() && process.env.MONGODB_URI).then(() => console.log('OK')).catch(e => console.error(e))"
   ```

### Socket.io no conecta
1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12)
3. Busca errores de WebSocket
4. Verifica CORS_ORIGIN en server/.env
5. Verifica VITE_SERVER_URL en .env

### Las salas no se sincronizan
1. Verifica que ambos clientes estén conectados al mismo servidor
2. Revisa los logs del servidor
3. Abre las DevTools del navegador en ambos clientes
4. Verifica que no hay errores en la consola

---

## ✅ Todo Funciona

Si todos los checks están marcados, ¡estás listo para desplegar! 

Sigue la guía en [DEPLOYMENT.md](./DEPLOYMENT.md) para llevar tu juego a producción.

---

## 🆘 Ayuda Adicional

Si sigues teniendo problemas:

1. Revisa los logs del servidor en la terminal
2. Abre DevTools (F12) en el navegador
3. Lee los mensajes de error completos
4. Busca en los archivos:
   - `MONGODB_SETUP.md` - Problemas con MongoDB
   - `DEPLOYMENT.md` - Problemas de despliegue
   - `README.md` - Troubleshooting general

¿Aún con problemas? Abre un issue en GitHub con:
- Descripción del problema
- Logs del servidor
- Errores de la consola del navegador
- Tu configuración (sin contraseñas)
