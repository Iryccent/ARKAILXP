# 🔐 Variables de Entorno - ARKAI LXP

## ⚡ INSTRUCCIONES RÁPIDAS

### Para Desarrollo Local (Opcional)

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```bash
# Frontend (Vite)
VITE_SUPABASE_URL=https://uzviszqevkddoszrxwen.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY

# Backend API
SUPABASE_URL=https://uzviszqevkddoszrxwen.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY

# ⭐ Gemini AI (CRÍTICO)
GEMINI_API_KEY=TU_GEMINI_API_KEY_AQUI
```

---

## 🚀 Para Vercel (OBLIGATORIO)

### Ir a: Vercel Dashboard > Settings > Environment Variables

Agregar estas **5 variables** (aplicar a: Production, Preview, Development):

### 1. VITE_SUPABASE_URL
```
Name:  VITE_SUPABASE_URL
Value: https://uzviszqevkddoszrxwen.supabase.co
Apply: ☑️ Production ☑️ Preview ☑️ Development
```

### 2. VITE_SUPABASE_ANON_KEY
```
Name:  VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY
Apply: ☑️ Production ☑️ Preview ☑️ Development
```

### 3. SUPABASE_URL
```
Name:  SUPABASE_URL
Value: https://uzviszqevkddoszrxwen.supabase.co
Apply: ☑️ Production ☑️ Preview ☑️ Development
```

### 4. SUPABASE_ANON_KEY
```
Name:  SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY
Apply: ☑️ Production ☑️ Preview ☑️ Development
```

### 5. GEMINI_API_KEY ⭐ (CRÍTICO)
```
Name:  GEMINI_API_KEY
Value: TU_GEMINI_API_KEY_AQUI
Apply: ☑️ Production ☑️ Preview ☑️ Development
```

---

## ✅ CHECKLIST

```
☐ 1. Agregar VITE_SUPABASE_URL en Vercel
☐ 2. Agregar VITE_SUPABASE_ANON_KEY en Vercel
☐ 3. Agregar SUPABASE_URL en Vercel
☐ 4. Agregar SUPABASE_ANON_KEY en Vercel
☐ 5. Agregar GEMINI_API_KEY en Vercel ⭐ CRÍTICO
☐ 6. Hacer redeploy o push a Git
```

---

## 🎯 Acceso Rápido

**Vercel Dashboard:**
```
https://vercel.com/[tu-usuario]/arkailxp/settings/environment-variables
```

**Google AI Studio (si necesitas regenerar key):**
```
https://makersuite.google.com/app/apikey
```

---

## ⚠️ IMPORTANTE

- **NO** subas el archivo `.env` a Git (ya está en `.gitignore`)
- Las variables en Vercel son diferentes del `.env` local
- Después de agregar variables en Vercel, haz redeploy
- Sin `GEMINI_API_KEY`, el chat de IA no funcionará

---

**Status**: ✅ Todas las keys están listas
**Última actualización**: Noviembre 2024

