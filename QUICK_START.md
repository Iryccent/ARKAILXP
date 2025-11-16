# ⚡ Quick Start - Deploy en 5 Minutos

## 🎯 Lo que ya está listo

✅ API Routes creadas (`api/ai/chat.js`, `api/ai/generate-quiz.js`)
✅ Cliente API configurado (`src/lib/aiClient.js`)
✅ Componentes actualizados (TutorChatbot, QuizBuilder)
✅ Configuración de Vercel (`vercel.json`)

---

## 🚀 Deploy Rápido

### Paso 1: Variables de Entorno

Crea un archivo `.env.local` en la raíz (para desarrollo local):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
GEMINI_API_KEY=tu-gemini-key
```

**IMPORTANTE:** En Vercel, agrega estas mismas variables en Settings > Environment Variables.

### Paso 2: Subir a GitHub

```bash
git add .
git commit -m "Ready for Vercel"
git push
```

### Paso 3: Deploy en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. "Add New Project" > Importa tu repo
3. Agrega las variables de entorno
4. Click "Deploy"

¡Listo! 🎉

---

## 🧪 Probar

### 1. Probar Chatbot

Abre tu app y ve a una lección con el TutorChatbot. Escribe una pregunta y debería responder usando Gemini.

### 2. Probar Quiz Builder

Ve al Admin Panel > Quiz Builder, pega contenido y genera un quiz.

### 3. Verificar APIs

Abre la consola del navegador y ejecuta:

```javascript
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'gemini',
    messages: [{ role: 'user', content: 'Hola' }]
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 📖 Documentación Completa

- **`README_VERCEL.md`** - Resumen general
- **`MIGRACION_VERCEL.md`** - Guía paso a paso detallada
- **`INSTALACION_SHADCN.md`** - Guía de Shadcn UI

---

## ❓ Problemas Comunes

**"API route not found"**
→ Verifica que `api/` esté en la raíz del proyecto

**"API Key not found"**
→ Verifica variables de entorno en Vercel (sin prefijo `VITE_` para las claves de IA)

**CORS errors**
→ Ya está configurado en `vercel.json`

---

¡Todo listo! 🚀

