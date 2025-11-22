# 🚀 INSTRUCCIONES COMPLETAS: Deploy de Edge Functions en Supabase

**Fecha:** Enero 2025  
**Proyecto:** ARKAI LXP

---

## 📋 RESUMEN DE EDGE FUNCTIONS

Tu proyecto tiene **4 Edge Functions** que deben estar desplegadas en Supabase:

1. ✅ **`chatbot-kai`** - Chat con KAI usando Gemini
2. ✅ **`generate-image-kai`** - Generación de imágenes con Imagen 3.0
3. ✅ **`generate-quiz-ai`** - Generación de quizzes educativos
4. ✅ **`create-course-ai`** - Generación de cursos completos

---

## 🎯 PASO 1: ACCEDER A SUPABASE

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **ARKAI LXP** (o el nombre de tu proyecto)

---

## 🔧 PASO 2: VERIFICAR/CONFIGURAR SECRETS

**IMPORTANTE:** Antes de desplegar cualquier función, verifica que tienes los Secrets configurados.

1. En el Dashboard de Supabase, ve a **Project Settings** (⚙️ en el menú lateral)
2. Haz clic en **Edge Functions** en el submenú
3. Ve a la pestaña **Secrets**
4. Verifica que existen estos Secrets:

### Secrets Requeridos:

| Secret | Descripción | Obligatorio |
|--------|-------------|-------------|
| `GEMINI_API_KEY` | Clave de API de Google Gemini | ✅ **SÍ** (usado por todas las funciones) |
| `OPENAI_API_KEY` | Clave de API de OpenAI | ⚠️ Opcional (solo si usas OpenAI) |
| `CLAUDE_API_KEY` | Clave de API de Anthropic Claude | ⚠️ Opcional (solo si usas Claude) |

**Si falta `GEMINI_API_KEY`:**
1. Haz clic en **Add new secret**
2. **Name:** `GEMINI_API_KEY`
3. **Value:** Pega tu clave de API de Google Gemini
4. Haz clic en **Save**

---

## 📝 PASO 3: DESPLEGAR `generate-quiz-ai`

### 3.1 Crear/Editar la Función

1. En el Dashboard de Supabase, ve a **Edge Functions** en el menú lateral
2. Busca `generate-quiz-ai` en la lista
   - **Si existe:** Haz clic en ella para editarla
   - **Si NO existe:** Haz clic en **Create a new function** → Nombre: `generate-quiz-ai` → **Create function**

### 3.2 Copiar el Código

**Opción A - Archivo Principal:**
1. Abre el archivo `CODIGO_SUPABASE_EDGE_FUNCTION.txt` en tu proyecto local
2. **Copia TODO el código** (desde la línea 1 hasta el final)

**Opción B - Archivo Optimizado (Recomendado):**
1. Abre el archivo `supabase_functions_ready_to_deploy/generate-quiz-ai.ts`
2. **Copia TODO el código** (este archivo ya tiene las optimizaciones aplicadas)

3. En el editor de Supabase, **reemplaza todo el código existente** con el código copiado
4. Verifica que el código se vea correcto (sin errores de sintaxis visibles)

### 3.3 Verificar Configuración

**IMPORTANTE:** Antes de hacer deploy, verifica estas líneas en el código:

1. **Modelo (línea ~164):**
   ```typescript
   const model = 'gemini-1.5-flash' // ✅ Recomendado (más económico)
   // O si necesitas mejor calidad:
   // const model = 'gemini-2.0-flash-lite'
   ```

2. **maxTokens (línea ~166):**
   ```typescript
   const maxTokens = 3000 // ✅ Recomendado (suficiente para 5-10 preguntas)
   // O si generas quizzes largos:
   // const maxTokens = 4000
   // ⚠️ NO uses 8000 (muy costoso)
   ```

3. **CORS:** Verifica que incluye tus dominios:
   - `https://arkailxp.vercel.app`
   - `https://j-irizarry.info`
   - `http://localhost:5173` (dev)

**Si el archivo tiene `maxTokens = 8000`, cámbialo a 3000 o 4000 antes de hacer deploy.**

### 3.4 Deploy

1. Haz clic en el botón **Deploy** (arriba a la derecha del editor)
2. Espera a que termine el proceso (verás un mensaje de éxito)
3. La función debería aparecer como **Active** (punto verde) en la lista

### 3.5 Probar (Opcional)

1. En la lista de Edge Functions, haz clic en `generate-quiz-ai`
2. Haz clic en **Invoke function**
3. En el campo de input, pega este JSON de prueba:
```json
{
  "content": "React es una biblioteca de JavaScript para construir interfaces de usuario. Fue creada por Facebook y permite crear componentes reutilizables.",
  "config": {
    "length": 3,
    "complexity": "Intermediate"
  },
  "provider": "gemini"
}
```
4. Haz clic en **Invoke**
5. Deberías ver una respuesta con un quiz generado (3 preguntas sobre React)

---

## 📝 PASO 4: DESPLEGAR `chatbot-kai`

### 4.1 Crear/Editar la Función

1. En **Edge Functions**, busca `chatbot-kai`
   - **Si existe:** Haz clic para editarla
   - **Si NO existe:** **Create a new function** → Nombre: `chatbot-kai` → **Create function**

### 4.2 Copiar el Código

**Opción A - Archivo Principal:**
1. Abre el archivo `Supa_base_edge_funct/chatbot-kai — Supabase Edge Functi.txt`
2. **Copia TODO el código**

**Opción B - Archivo Optimizado (Recomendado):**
1. Abre el archivo `supabase_functions_ready_to_deploy/chatbot-kai.ts`
2. **Copia TODO el código**

3. Pega en el editor de Supabase (reemplaza todo)

### 4.3 Deploy

1. Haz clic en **Deploy**
2. Espera confirmación de éxito

---

## 📝 PASO 5: DESPLEGAR `generate-image-kai`

### 5.1 Crear/Editar la Función

1. En **Edge Functions**, busca `generate-image-kai`
   - **Si existe:** Editar
   - **Si NO existe:** Crear nueva función

### 5.2 Copiar el Código

**Opción A - Archivo Principal:**
1. Abre el archivo `Supa_base_edge_funct/generate-image-kai — Supabase Edge.txt`
2. **Copia TODO el código**

**Opción B - Archivo Optimizado (Recomendado):**
1. Abre el archivo `supabase_functions_ready_to_deploy/generate-image-kai.ts`
2. **Copia TODO el código**

3. Pega en el editor de Supabase

### 5.3 Deploy

1. Haz clic en **Deploy**
2. Espera confirmación

---

## 📝 PASO 6: DESPLEGAR `create-course-ai`

### 6.1 Crear/Editar la Función

1. En **Edge Functions**, busca `create-course-ai`
   - **Si existe:** Editar
   - **Si NO existe:** Crear nueva función

### 6.2 Copiar el Código

1. Abre el archivo `Supa_base_edge_funct/createcurseai.txt`
2. **Copia TODO el código**
3. Pega en el editor de Supabase

### 6.3 Deploy

1. Haz clic en **Deploy**
2. Espera confirmación

---

## ✅ VERIFICACIÓN FINAL

Después de desplegar todas las funciones, verifica:

### Checklist:

- [ ] `chatbot-kai` aparece como **Active** (punto verde)
- [ ] `generate-image-kai` aparece como **Active**
- [ ] `generate-quiz-ai` aparece como **Active**
- [ ] `create-course-ai` aparece como **Active**
- [ ] `GEMINI_API_KEY` está configurado en Secrets
- [ ] Todas las funciones tienen CORS configurado para tus dominios

### Probar desde la App:

1. Ve a tu aplicación en Vercel: `https://arkailxp.vercel.app`
2. Inicia sesión como admin
3. Pasa el Auditor Override (#405527)
4. Ve a **Admin Panel** → **Quiz Builder**
5. Pega contenido y genera un quiz
6. Debería funcionar sin errores

---

## 🔍 TROUBLESHOOTING

### Error: "GEMINI_API_KEY no está configurada"

**Solución:**
1. Ve a **Project Settings** → **Edge Functions** → **Secrets**
2. Verifica que `GEMINI_API_KEY` existe
3. Si no existe, añádela con tu clave de API

### Error: "Function not found" o 404

**Solución:**
1. Verifica que el nombre de la función es exacto (con guiones, sin espacios)
2. Verifica que el deploy fue exitoso
3. Espera 1-2 minutos después del deploy (puede tardar en propagarse)

### Error: "Supabase Edge Function error: 500"

**Solución:**
1. Ve a **Edge Functions** → [nombre de la función] → **Logs**
2. Revisa los logs para ver el error exacto
3. Verifica que las variables de entorno están correctamente configuradas
4. Verifica que el código no tiene errores de sintaxis

### Error: "CORS" o problemas de CORS

**Solución:**
1. Verifica que los dominios están en `allowedOrigins`:
   - `https://arkailxp.vercel.app`
   - `https://j-irizarry.info`
   - `http://localhost:5173` (dev)
2. Verifica que el proxy de Vercel está configurado correctamente

### Error: "Invalid JWT" o 401

**Solución:**
1. Verifica que el proxy de Vercel envía los headers:
   - `Authorization: Bearer ${supabaseAnonKey}`
   - `apikey: ${supabaseAnonKey}`
   - `x-client-info: arkailxp-vercel`
2. Verifica que `SUPABASE_ANON_KEY` está configurado en Vercel (sin prefijo VITE_)

---

## 📊 CONFIGURACIÓN RECOMENDADA

### Para `generate-quiz-ai`:

**Modelo:**
```typescript
const model = 'gemini-1.5-flash' // ✅ Más económico, suficiente calidad
// O si necesitas mejor calidad:
// const model = 'gemini-2.0-flash-lite' // Balance precio/calidad
```

**maxTokens:**
```typescript
const maxTokens = 3000 // ✅ Suficiente para 5-10 preguntas
// O si generas quizzes largos (15+ preguntas):
// const maxTokens = 4000
```

**Cálculo Dinámico (Opcional):**
```typescript
// Ajusta tokens según número de preguntas
const maxTokens = Math.min(4000, quizLength * 500)
```

---

## 🔗 ENDPOINTS FINALES

Una vez desplegadas, las funciones estarán disponibles en:

```
https://[TU_PROJECT_REF].supabase.co/functions/v1/chatbot-kai
https://[TU_PROJECT_REF].supabase.co/functions/v1/generate-image-kai
https://[TU_PROJECT_REF].supabase.co/functions/v1/generate-quiz-ai
https://[TU_PROJECT_REF].supabase.co/functions/v1/create-course-ai
```

**Nota:** El `[TU_PROJECT_REF]` es tu referencia de proyecto (ej: `uzviszqevkddoszrxwen`)

Los proxies de Vercel llamarán automáticamente a estos endpoints.

---

## 📝 NOTAS IMPORTANTES

1. **Después de cada cambio en el código:**
   - Debes hacer **Deploy** nuevamente
   - Los cambios no se aplican automáticamente

2. **Variables de Entorno:**
   - Los Secrets en Supabase son diferentes a las variables de Vercel
   - Supabase Secrets: Para Edge Functions (GEMINI_API_KEY, etc.)
   - Vercel Env Vars: Para API Routes (SUPABASE_URL, SUPABASE_ANON_KEY)

3. **CORS:**
   - Cada función debe tener CORS configurado
   - Los dominios permitidos deben incluir tu dominio de producción

4. **Logs:**
   - Siempre revisa los logs en Supabase si hay errores
   - Los logs muestran errores detallados de las Edge Functions

---

## ✅ CHECKLIST DE DEPLOYMENT

- [ ] Secrets configurados en Supabase (GEMINI_API_KEY)
- [ ] `chatbot-kai` desplegada y Active
- [ ] `generate-image-kai` desplegada y Active
- [ ] `generate-quiz-ai` desplegada y Active
- [ ] `create-course-ai` desplegada y Active
- [ ] Todas las funciones probadas desde el Dashboard
- [ ] App probada en producción (generar quiz funciona)
- [ ] CORS configurado para todos los dominios

---

**Última Actualización:** Enero 2025  
**Versión:** 1.0

