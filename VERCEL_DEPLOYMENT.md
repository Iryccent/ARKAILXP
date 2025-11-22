# 🚀 Guía de Deployment en Vercel - ARKAI LXP

## ✅ Checklist Pre-Deploy

### 1. 📦 Verificar que todo está commiteado
```bash
git status
git add .
git commit -m "Ready for Vercel deployment"
```

### 2. 🔐 Variables de Entorno en Vercel

Ir a: **Vercel Dashboard > Tu Proyecto > Settings > Environment Variables**

Agregar estas **5 variables OBLIGATORIAS** (aplicar a: Production, Preview, Development):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://uzviszqevkddoszrxwen.supabase.co` | Frontend - URL Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Frontend - Anon Key |
| `SUPABASE_URL` | `https://uzviszqevkddoszrxwen.supabase.co` | Backend API - URL Supabase |
| `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Backend API - Anon Key |
| `GEMINI_API_KEY` | `AIzaSyAEUbF7YG3oGT86uQnVwhD6x6GIYpIdYqY` | ⭐ **CRÍTICO** - Para IA (chat, quiz) |

**Opcionales** (solo si usas estos providers):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Opcional - Para usar GPT |
| `CLAUDE_API_KEY` | `sk-ant-...` | Opcional - Para usar Claude |

⚠️ **IMPORTANTE**: 
- Los valores de `VITE_SUPABASE_URL` y `SUPABASE_URL` deben ser **idénticos**. Lo mismo para las keys.
- `GEMINI_API_KEY` es **OBLIGATORIA** - Sin ella, el chat de IA y generación de quiz no funcionarán.

### 3. 🗂️ Estructura de Archivos Verificada

```
ARKAILXP/
├── api/                          # ✅ Vercel Serverless Functions
│   └── kai/
│       ├── chatbot.js           # ✅ POST /api/kai/chatbot
│       └── generate-image.js    # ✅ POST /api/kai/generate-image
├── src/
│   ├── components/
│   │   └── kai/
│   │       └── KaiChatWindow.jsx # ✅ Actualizado con estilo Google Studio
│   ├── lib/
│   │   └── supabaseClient.js    # ✅ Cliente Supabase con fallbacks
│   └── main.jsx
├── index.html                    # ✅ Entry point
├── package.json                  # ✅ Build scripts configurados
├── vercel.json                   # ✅ Configuración Vercel
├── vite.config.js               # ✅ Vite config con alias @
└── .env.example                  # ✅ Template de variables

```

### 4. 📄 Archivos de Configuración

#### ✅ `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

#### ✅ `package.json` - Scripts
```json
{
  "scripts": {
    "dev": "vite --host :: --port 3000",
    "build": "vite build",
    "preview": "vite preview --host :: --port 3000"
  }
}
```

#### ✅ `vite.config.js` - Alias
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

## 🚀 Proceso de Deploy

### Opción 1: Deploy desde Git (Recomendado)

1. **Push a GitHub/GitLab**
   ```bash
   git push origin main
   ```

2. **Conectar en Vercel**
   - Ir a Vercel Dashboard
   - Click "Add New Project"
   - Importar el repositorio
   - Vercel detectará automáticamente Vite

3. **Configurar Variables**
   - Antes del primer deploy, agregar las 4 variables de entorno
   - Vercel las usará automáticamente

4. **Deploy**
   - Click "Deploy"
   - Vercel ejecutará `npm install` y `npm run build`
   - Tu app estará live en `https://tu-proyecto.vercel.app`

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🔍 Verificación Post-Deploy

### 1. Verificar que el sitio carga
- Visita `https://tu-proyecto.vercel.app`
- Debe cargar sin errores en la consola

### 2. Verificar API Routes
```bash
# Test chatbot endpoint
curl -X POST https://tu-proyecto.vercel.app/api/kai/chatbot \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola"}'

# Test generate-image endpoint
curl -X POST https://tu-proyecto.vercel.app/api/kai/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A futuristic AI"}'
```

### 3. Verificar KAI Chat
- Click en el botón de KAI
- Enviar un mensaje
- Debe responder sin errores
- Los Action Chips deben funcionar

### 4. Revisar Logs en Vercel
- Vercel Dashboard > Tu Proyecto > Deployments > [último deploy] > Logs
- Verificar que no hay errores 500

## ⚠️ Problemas Comunes y Soluciones

### Error: "Supabase configuration missing"
**Causa**: Variables de entorno no configuradas en Vercel
**Solución**: 
1. Ir a Settings > Environment Variables
2. Agregar las 5 variables obligatorias (ver arriba)
3. Hacer redeploy

### Error: "GEMINI_API_KEY no está configurada"
**Causa**: Falta la API Key de Gemini en Vercel
**Solución**: 
1. Obtener key en: https://makersuite.google.com/app/apikey
2. Agregar `GEMINI_API_KEY` en Vercel Environment Variables
3. Hacer redeploy

### Error: "Module not found: @/..."
**Causa**: Alias @ no resuelto
**Solución**: 
- Verificar que `vite.config.js` tiene el alias configurado
- Hacer `vercel --prod` para forzar rebuild

### Error: CORS en /api
**Causa**: Headers no configurados
**Solución**: 
- Verificar que `vercel.json` tiene la configuración de headers
- Los endpoints en `/api/kai` ya tienen CORS configurado

### Build falla con errores de linting
**Causa**: ESLint encuentra warnings
**Solución**: 
- Los warnings de complejidad son aceptables
- Si hay errores reales, corregirlos antes de deploy

## 📊 Métricas de Build Esperadas

- **Build Time**: ~30-60 segundos
- **Bundle Size**: ~500KB - 1MB
- **Function Size**: ~50KB por endpoint
- **Cold Start**: ~200-500ms

## 🎉 Deploy Exitoso

Si todo funciona:
- ✅ Sitio carga en `https://tu-proyecto.vercel.app`
- ✅ KAI responde a mensajes
- ✅ Action Chips funcionan (Visualize, Summarize, Quiz Me)
- ✅ Animaciones 3D y efectos visuales activos
- ✅ No hay errores en la consola del navegador
- ✅ No hay errores 500 en logs de Vercel

## 🔄 Redeploy Automático

Vercel está configurado para redeploy automático:
- **Push a main/master**: Deploy a producción
- **Push a otra rama**: Deploy preview
- **Pull Request**: Deploy preview con URL única

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en Vercel Dashboard
2. Verificar variables de entorno
3. Hacer rebuild limpio: `vercel --prod --force`
4. Revisar este documento paso a paso

---

**Última actualización**: Noviembre 2024
**Versión**: 1.0.0
**Status**: ✅ Listo para producción

