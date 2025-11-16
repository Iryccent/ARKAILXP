# 📋 Instrucciones Completas: Deploy de generate-quiz-ai en Supabase

## 🎯 Objetivo

Crear la Edge Function `generate-quiz-ai` en Supabase para centralizar la generación de quizzes con IA, siguiendo el mismo patrón arquitectónico que `chatbot-kai`.

---

## 📝 Paso a Paso

### 1️⃣ Acceder al Dashboard de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **ARKAI LXP**

### 2️⃣ Crear la Edge Function

1. En el menú lateral izquierdo, busca y haz clic en **Edge Functions**
2. Haz clic en el botón **Create a new function** (o **+ New Function**)
3. En el modal que aparece:
   - **Function name:** `generate-quiz-ai`
   - Haz clic en **Create function**

### 3️⃣ Copiar el Código

1. Se abrirá el editor de código en Supabase
2. Abre el archivo `SUPABASE_EDGE_FUNCTION_GENERATE_QUIZ.md` en este proyecto
3. Copia **TODO** el código que está dentro del bloque de código de `index.ts`
4. Pega el código en el editor de Supabase (reemplaza cualquier código que esté ahí por defecto)

### 4️⃣ Verificar Variables de Entorno (Secrets)

Antes de hacer deploy, verifica que tienes las claves API configuradas:

1. En el Dashboard de Supabase, ve a **Project Settings** (⚙️ en el menú lateral)
2. Haz clic en **Edge Functions** en el submenú
3. Ve a la pestaña **Secrets**
4. Verifica que existe:
   - ✅ `GEMINI_API_KEY` (obligatoria, ya debería estar porque chatbot-kai la usa)
   - ⚠️ `OPENAI_API_KEY` (opcional, solo si quieres usar OpenAI)
   - ⚠️ `CLAUDE_API_KEY` (opcional, solo si quieres usar Claude)

**Si falta `GEMINI_API_KEY`:**
1. Haz clic en **Add new secret**
2. **Name:** `GEMINI_API_KEY`
3. **Value:** Pega tu clave de API de Google Gemini
4. Haz clic en **Save**

### 5️⃣ Deploy de la Función

1. En el editor de código de Supabase, haz clic en el botón **Deploy** (arriba a la derecha)
2. Espera a que termine el proceso (verás un mensaje de éxito)
3. La función debería aparecer como **Active** en la lista de Edge Functions

### 6️⃣ Verificar el Deploy

1. En la lista de Edge Functions, busca `generate-quiz-ai`
2. Verifica que el status es **Active** (punto verde)
3. (Opcional) Haz clic en **Invoke function** para probar:
   - En el campo de input, pega:
   ```json
   {
     "content": "React es una biblioteca de JavaScript para construir interfaces de usuario.",
     "config": {
       "length": 3,
       "complexity": "Básico"
     },
     "provider": "gemini"
   }
   ```
   - Haz clic en **Invoke**
   - Deberías ver una respuesta con un quiz generado

---

## ✅ Verificación Final

### En Vercel

No necesitas hacer nada en Vercel. El código ya está actualizado para usar el proxy.

### Probar desde tu Aplicación

1. Ve a tu aplicación en Vercel
2. Navega a la sección donde generas quizzes (Admin Panel → Quiz Builder)
3. Pega algún contenido educativo
4. Haz clic en generar quiz
5. Debería funcionar sin errores 500

---

## 🔍 Troubleshooting

### Error: "GEMINI_API_KEY no está configurada"

**Solución:** Ve a Project Settings → Edge Functions → Secrets y añade `GEMINI_API_KEY`

### Error: "Function not found" o 404

**Solución:** 
1. Verifica que el nombre de la función es exactamente `generate-quiz-ai` (con guiones, sin espacios)
2. Verifica que el deploy fue exitoso
3. Espera 1-2 minutos después del deploy (puede tardar en propagarse)

### Error: "Supabase Edge Function error: 500"

**Solución:**
1. Ve a Edge Functions → `generate-quiz-ai` → **Logs**
2. Revisa los logs para ver el error exacto
3. Verifica que las variables de entorno están correctamente configuradas

### Error: "CORS" o problemas de CORS

**Solución:** El código ya incluye headers CORS. Si persiste, verifica que el proxy de Vercel está configurado correctamente.

---

## 📊 Arquitectura Final

```
Frontend (React)
    ↓
/api/ai/generate-quiz (Vercel Proxy)
    ↓
/functions/v1/generate-quiz-ai (Supabase Edge Function)
    ↓
Gemini/OpenAI/Claude API
```

**Ventajas:**
- ✅ Claves API centralizadas en Supabase
- ✅ Consistencia con chatbot-kai
- ✅ No necesitas GEMINI_API_KEY en Vercel
- ✅ Más fácil de mantener

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu generador de quizzes debería funcionar correctamente usando la arquitectura consistente con el resto de tu aplicación.

