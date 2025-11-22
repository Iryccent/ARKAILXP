# 🔧 SOLUCIÓN: Error de Deploy en Supabase

## ❌ Error Encontrado

```
Failed to bundle the function (reason: The module's source code could not be parsed: 
Expected ';', '}' or <eof> at file:///tmp/.../source/index.ts:6:8
6 import { serve } from ~~~~~~).
```

## 🔍 Causa

Este error generalmente ocurre por:
1. **Caracteres invisibles** copiados al pegar el código
2. **Espacios o saltos de línea** incorrectos antes del `import`
3. **Código incompleto** o mal copiado

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Usar el Archivo Limpio (Recomendado)

1. Abre el archivo **`CODIGO_LIMPIO_GENERATE_QUIZ_AI.ts`** en tu proyecto
2. **Selecciona TODO** el contenido (Ctrl+A)
3. **Copia** (Ctrl+C)
4. En Supabase:
   - Ve a **Edge Functions** → `generate-quiz-ai`
   - **Borra TODO** el código existente
   - **Pega** el código nuevo (Ctrl+V)
   - Haz clic en **Deploy**

### Opción 2: Verificar Manualmente

Si prefieres usar el archivo original, verifica:

1. **La primera línea** debe ser EXACTAMENTE:
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   ```

2. **NO debe haber:**
   - Espacios antes del `import`
   - Comentarios antes del `import`
   - Caracteres invisibles
   - Saltos de línea extra

3. **El código debe empezar directamente con:**
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   ```

## 📋 PASOS DETALLADOS

### Paso 1: Limpiar el Editor

1. En Supabase, ve a **Edge Functions** → `generate-quiz-ai`
2. **Selecciona TODO** el código en el editor (Ctrl+A)
3. **Borra** todo (Delete o Backspace)
4. Asegúrate de que el editor esté completamente vacío

### Paso 2: Copiar Código Limpio

1. Abre `CODIGO_LIMPIO_GENERATE_QUIZ_AI.ts` en tu editor local
2. **Selecciona TODO** (Ctrl+A)
3. **Copia** (Ctrl+C)

### Paso 3: Pegar en Supabase

1. Haz clic en el editor de Supabase (debe estar vacío)
2. **Pega** el código (Ctrl+V)
3. Verifica que la primera línea es:
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   ```

### Paso 4: Deploy

1. Haz clic en **Deploy**
2. Espera la confirmación
3. Si hay error, revisa los logs en Supabase

## 🔍 VERIFICACIÓN

Después de pegar, verifica que:

- ✅ La primera línea es `import { serve } from ...`
- ✅ No hay espacios o caracteres antes del `import`
- ✅ El código tiene todas las funciones (`callGeminiAPI`, `callOpenAIAPI`, `callClaudeAPI`)
- ✅ El código termina correctamente (última línea es `}`)

## ⚠️ SI EL ERROR PERSISTE

1. **Verifica que copiaste TODO el código:**
   - Debe tener ~340 líneas
   - Debe incluir las 3 funciones al final

2. **Prueba copiar línea por línea:**
   - Copia solo la primera línea (`import`)
   - Pega en Supabase
   - Si funciona, copia el resto

3. **Usa el archivo TypeScript:**
   - Abre `supabase_functions_ready_to_deploy/generate-quiz-ai.ts`
   - Copia TODO el contenido
   - Pega en Supabase

## 📝 NOTA IMPORTANTE

El archivo `CODIGO_LIMPIO_GENERATE_QUIZ_AI.ts` ya tiene:
- ✅ Modelo optimizado: `gemini-1.5-flash`
- ✅ maxTokens optimizado: `3000`
- ✅ Sin caracteres invisibles
- ✅ Sintaxis correcta verificada

**Este archivo está listo para copiar y pegar directamente en Supabase.**

