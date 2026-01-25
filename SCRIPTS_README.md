# 🛠️ Scripts de Deployment - Foxy

Esta carpeta (raíz del proyecto) contiene varios scripts útiles para facilitar el deployment y desarrollo.

---

## 📜 Scripts Disponibles

### 🚀 QUICK_DEPLOY.sh

**Propósito:** Guía interactiva paso a paso para el deployment completo.

**Uso:**
```bash
./QUICK_DEPLOY.sh
```

**Qué hace:**
1. ✅ Verifica la configuración con `check-deploy.sh`
2. 📦 Te guía para hacer push a GitHub
3. 🗄️ Instrucciones para configurar MongoDB Atlas
4. 🔧 Instrucciones para desplegar en Render (backend)
5. 🌐 Instrucciones para desplegar en Netlify (frontend)
6. 🔄 Te recuerda actualizar CORS_ORIGIN
7. 🎉 Muestra resumen final con URLs

**Duración:** ~30 minutos (primera vez)

---

### ✅ check-deploy.sh

**Propósito:** Verifica que todo esté listo para el deployment.

**Uso:**
```bash
./check-deploy.sh
```

**Qué verifica:**
- ✅ Git inicializado y remote configurado
- ✅ Archivos `.env.example` presentes
- ✅ `.gitignore` protegiendo `.env`
- ✅ Archivos de configuración (netlify.toml, render.yaml)
- ✅ Scripts disponibles
- ✅ package.json en lugares correctos

**Resultado:**
- 🟢 Todo OK → Puedes proceder con deployment
- 🔴 Hay errores → Soluciónalos antes de desplegar

---

### 🔧 setup-deploy.sh

**Propósito:** Configura Git con el remote correcto si no está configurado.

**Uso:**
```bash
./setup-deploy.sh
```

**Qué hace:**
- Verifica si Git está inicializado
- Añade remote `git@github.com:FCamaggi/Foxy.git`
- Confirma la configuración

**Cuándo usar:** Solo si `check-deploy.sh` reporta error de Git remote.

---

### ▶️ start.sh

**Propósito:** Inicia frontend y backend simultáneamente para desarrollo local.

**Uso:**
```bash
./start.sh
```

**Qué hace:**
1. Inicia el backend en terminal 1 (`cd server && npm run dev`)
2. Inicia el frontend en terminal 2 (`npm run dev`)
3. Abre http://localhost:3000 en el navegador

**Requisitos:**
- `.env` configurado en raíz
- `server/.env` configurado
- Dependencias instaladas (`npm install` en ambos lugares)

---

## 🔄 Flujo Recomendado

### Primera Vez (Desarrollo Local)

```bash
# 1. Instalar dependencias
npm install
cd server && npm install && cd ..

# 2. Configurar variables de entorno
cp .env.example .env
cp server/.env.example server/.env
# Edita los .env con tu MONGODB_URI

# 3. Iniciar en desarrollo
./start.sh
```

### Primera Vez (Deployment a Producción)

```bash
# 1. Verificar que todo está listo
./check-deploy.sh

# 2. Si hay problemas con Git
./setup-deploy.sh

# 3. Seguir la guía interactiva
./QUICK_DEPLOY.sh

# 4. O seguir la documentación detallada
# Leer DEPLOY_NOW.md (5 min)
# Seguir DEPLOY_GUIDE.md (30 min)
```

---

## 📋 Checklist Rápido

Antes de hacer deployment, asegúrate de:

- [ ] `./check-deploy.sh` pasa todas las verificaciones
- [ ] Tienes cuenta en MongoDB Atlas
- [ ] Tienes cuenta en Render
- [ ] Tienes cuenta en Netlify
- [ ] Git remote apunta a `git@github.com:FCamaggi/Foxy.git`
- [ ] Código committeado y pusheado a GitHub
- [ ] `.env` files NO están en Git (protegidos por `.gitignore`)

---

## 🐛 Troubleshooting

### Script no ejecutable

```bash
chmod +x QUICK_DEPLOY.sh
chmod +x check-deploy.sh
chmod +x setup-deploy.sh
chmod +x start.sh
```

### "Git remote not configured"

```bash
./setup-deploy.sh
# O manualmente:
git remote add origin git@github.com:FCamaggi/Foxy.git
```

### "Cannot find .env.example"

```bash
# Verifica que los archivos existan
ls -la .env.example
ls -la server/.env.example

# Si no existen, créalos basándote en los templates del DEPLOY_GUIDE.md
```

### "npm: command not found"

```bash
# Instala Node.js
# Linux: sudo apt install nodejs npm
# Mac: brew install node
# Windows: Descarga de nodejs.org
```

---

## 📚 Documentación Relacionada

| Documento | Cuándo leer |
|-----------|-------------|
| [README.md](../README.md) | Primero - Overview general |
| [DEPLOY_NOW.md](../DEPLOY_NOW.md) | Resumen rápido (5 min) |
| [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) | Guía completa paso a paso |
| [MONGODB_SETUP.md](../MONGODB_SETUP.md) | Configuración detallada de MongoDB |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Entender la arquitectura |
| [CHECKLIST.md](../CHECKLIST.md) | Verificación sistemática |
| [PROJECT_STATUS.md](../PROJECT_STATUS.md) | Estado actual del proyecto |

---

## 🎯 Orden Recomendado de Ejecución

### Para Desarrollo Local

```bash
./start.sh
```

### Para Deployment

```bash
# 1. Verificar
./check-deploy.sh

# 2. Configurar Git (si es necesario)
./setup-deploy.sh

# 3. Deployment interactivo
./QUICK_DEPLOY.sh

# O seguir documentación detallada
cat DEPLOY_NOW.md
```

---

## ⚠️ Notas Importantes

1. **Nunca commits .env files** - Están protegidos en `.gitignore`
2. **QUICK_DEPLOY.sh no hace deploy automático** - Es una guía interactiva
3. **check-deploy.sh es no-destructivo** - Solo lee, no modifica
4. **setup-deploy.sh solo configura Git** - No toca el código
5. **start.sh requiere .env configurados** - No funcionará sin ellos

---

## 🤝 Contribuir

Si mejoras algún script:

1. Testea que funcione en tu entorno
2. Actualiza esta documentación
3. Haz commit con mensaje descriptivo
4. Push a GitHub

---

**¿Dudas?** Consulta [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) o [PROJECT_STATUS.md](../PROJECT_STATUS.md)
