# 🚀 Arkai LXP - Guía Rápida de Migración a Vercel

## ✅ ¿Qué se ha configurado?

Tu proyecto ya está **100% listo** para desplegarse en Vercel con:

- ✅ **API Routes seguras** para proteger tus claves de IA
- ✅ **Cliente API** (`src/lib/aiClient.js`) para llamar a las funciones desde el frontend
- ✅ **Componentes actualizados** (TutorChatbot, QuizBuilder) usando las nuevas APIs
- ✅ **Configuración de Vercel** (`vercel.json`)
- ✅ **Documentación completa** en `MIGRACION_VERCEL.md`

---

## 🎯 Pasos Rápidos para Deploy

### 1. Sube tu código a GitHub

```bash
git add .
git commit -m "Preparar para Vercel"
git push
```

### 2. Conecta con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es Vite

### 3. Configura Variables de Entorno

En Vercel > Settings > Environment Variables, agrega:

**Frontend (públicas - con prefijo VITE_):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Backend (secretas - SIN prefijo VITE_):**
- `GEMINI_API_KEY` (o `OPENAI_API_KEY`, `CLAUDE_API_KEY`)

### 4. Deploy

Click en "Deploy" y espera 2-3 minutos. ¡Listo! 🎉

---

## 📁 Estructura del Proyecto

```
ARKAILXP/
├── api/                    # 🔐 API Routes de Vercel (protegen claves)
│   └── ai/
│       ├── chat.js        # Chat con IA (Gemini, OpenAI, Claude)
│       └── generate-quiz.js # Generación de quizzes
│
├── src/
│   ├── lib/
│   │   ├── aiClient.js    # 🤖 Cliente para llamar a las APIs
│   │   └── supabaseClient.js
│   │
│   └── components/
│       ├── course/
│       │   └── TutorChatbot.jsx  # ✅ Actualizado para usar API routes
│       └── admin/
│           └── QuizBuilder.jsx   # ✅ Actualizado para usar API routes
│
├── vercel.json            # ⚙️ Configuración de Vercel
├── MIGRACION_VERCEL.md    # 📖 Guía completa paso a paso
└── INSTALACION_SHADCN.md  # 🎨 Guía de Shadcn UI
```

---

## 🔐 Seguridad de Claves API

**ANTES (Hostinger - ❌ Inseguro):**
```javascript
// ❌ Claves expuestas en el frontend
const response = await fetch('https://api.openai.com/...', {
  headers: { 'Authorization': `Bearer ${API_KEY}` } // ¡Expuesto!
});
```

**AHORA (Vercel - ✅ Seguro):**
```javascript
// ✅ Frontend solo llama a tu API route
const response = await chatWithAI({
  provider: 'gemini',
  messages: [...]
});

// ✅ La clave API está solo en el servidor (api/ai/chat.js)
// ✅ Nunca se expone al navegador
```

---

## 🧪 Probar las APIs

### Desde el Frontend (React)

```javascript
import { chatWithAI, generateQuiz } from '@/lib/aiClient';

// Chat con IA
const response = await chatWithAI({
  provider: 'gemini',
  messages: [
    { role: 'user', content: '¿Qué es React?' }
  ]
});

// Generar Quiz
const quiz = await generateQuiz({
  content: 'Contenido educativo...',
  config: { length: 5, complexity: 'Intermedio' }
});
```

### Desde la Consola del Navegador

```javascript
// Probar chat
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

## 🎨 Integrar Shadcn UI

Ya tienes algunos componentes. Para agregar más:

```bash
# Inicializar (si no lo has hecho)
npx shadcn@latest init

# Agregar componentes
npx shadcn@latest add card input textarea select tabs alert badge
```

Ver `INSTALACION_SHADCN.md` para más detalles.

---

## 🐛 Troubleshooting

### "API route not found"
- Verifica que las funciones estén en `api/` (no `src/api/`)
- Revisa los logs en Vercel > Functions

### "API Key not found"
- Verifica variables de entorno en Vercel
- Asegúrate de que NO tengan prefijo `VITE_` (solo las del frontend)
- Reinicia el deploy después de agregar variables

### CORS errors
- Ya está configurado en `vercel.json`
- Si persiste, verifica el dominio

---

## 📚 Documentación Completa

- **`MIGRACION_VERCEL.md`** - Guía paso a paso completa
- **`INSTALACION_SHADCN.md`** - Guía de Shadcn UI
- [Documentación de Vercel](https://vercel.com/docs)
- [Shadcn UI Docs](https://ui.shadcn.com/)

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo seguir usando Supabase Edge Functions?**
R: Sí, úsalas para lógica de base de datos. Las API Routes de Vercel son solo para proteger claves de IA.

**P: ¿Cuánto cuesta?**
R: El plan gratuito de Vercel es muy generoso. Perfecto para proyectos pequeños/medianos.

**P: ¿Las claves están seguras?**
R: Sí, están en variables de entorno del servidor y nunca se exponen al frontend.

---

## 🎉 ¡Listo!

Tu proyecto está configurado y listo para desplegar. Sigue los pasos arriba y en 5 minutos tendrás tu plataforma funcionando en Vercel.

**¿Problemas?** Revisa `MIGRACION_VERCEL.md` para la guía detallada.

