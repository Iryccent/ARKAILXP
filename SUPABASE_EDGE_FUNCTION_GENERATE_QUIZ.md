# 🚀 Supabase Edge Function: generate-quiz-ai

Este documento contiene el código completo para crear la Edge Function `generate-quiz-ai` en Supabase.

## 📋 Instrucciones de Deploy

### Paso 1: Crear la Edge Function en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Edge Functions** en el menú lateral
3. Haz clic en **Create a new function**
4. Nombre de la función: `generate-quiz-ai`
5. Haz clic en **Create function**

### Paso 2: Copiar el Código

Copia el código completo del archivo `generate-quiz-ai/index.ts` (ver abajo) y pégalo en el editor de Supabase.

### Paso 3: Verificar Variables de Entorno

Asegúrate de que tienes configurada la variable de entorno `GEMINI_API_KEY` en Supabase:

1. En el Dashboard de Supabase, ve a **Project Settings** → **Edge Functions** → **Secrets**
2. Verifica que existe `GEMINI_API_KEY` con tu clave de API de Google Gemini
3. Si no existe, añádela:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Tu clave de API de Gemini

### Paso 4: Deploy

1. Haz clic en **Deploy** en el editor de Supabase
2. Espera a que el deploy termine (verás un mensaje de éxito)

### Paso 5: Probar

Puedes probar la función desde el Dashboard de Supabase usando el botón **Invoke function** o desde tu aplicación.

---

## 📁 Estructura de Archivos

Crea la siguiente estructura en Supabase:

```
supabase/functions/generate-quiz-ai/
├── index.ts
```

---

## 📄 Código: `index.ts`

```typescript
// Supabase Edge Function: generate-quiz-ai
// Genera quizzes educativos usando IA (Gemini, OpenAI, Claude)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obtener variables de entorno
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? ''
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') ?? ''
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY') ?? ''

    // Parsear el body de la request
    const { content, config = {}, provider = 'gemini' } = await req.json()

    // Validar que hay contenido
    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const quizLength = config.length || 5
    const complexity = config.complexity || 'Intermedio'
    const customInstructions = config.customInstructions || ''

    // Crear el prompt para generar el quiz
    const prompt = `Eres un experto en educación. Genera un quiz educativo basado en el siguiente contenido.

CONTENIDO:
${content}

CONFIGURACIÓN:
- Número de preguntas: ${quizLength}
- Complejidad: ${complexity}
${customInstructions ? `- Instrucciones adicionales: ${customInstructions}` : ''}

IMPORTANTE: Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título del Quiz",
  "questions": [
    {
      "question": "Texto de la pregunta",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correct_answer": "Opción A",
      "explanation": "Explicación de por qué esta es la respuesta correcta"
    }
  ]
}

No incluyas texto adicional fuera del JSON. El JSON debe ser válido y parseable.`

    // Llamar a la API de IA según el proveedor
    let aiResponse
    const providerLower = provider.toLowerCase()

    switch (providerLower) {
      case 'gemini':
        if (!geminiApiKey) {
          throw new Error('GEMINI_API_KEY no está configurada en Supabase')
        }
        aiResponse = await callGeminiAPI(geminiApiKey, prompt)
        break

      case 'openai':
        if (!openaiApiKey) {
          throw new Error('OPENAI_API_KEY no está configurada en Supabase')
        }
        aiResponse = await callOpenAIAPI(openaiApiKey, prompt)
        break

      case 'claude':
        if (!claudeApiKey) {
          throw new Error('CLAUDE_API_KEY no está configurada en Supabase')
        }
        aiResponse = await callClaudeAPI(claudeApiKey, prompt)
        break

      default:
        throw new Error(`Proveedor no soportado: ${provider}. Usa 'gemini', 'openai' o 'claude'`)
    }

    // Intentar extraer y parsear el JSON de la respuesta
    let quizData
    try {
      // Intentar encontrar JSON en la respuesta (puede venir con markdown o texto adicional)
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0])
      } else {
        quizData = JSON.parse(aiResponse.content)
      }
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError)
      console.error('Raw response:', aiResponse.content)
      throw new Error('La IA no generó un JSON válido. Intenta de nuevo.')
    }

    // Validar estructura básica
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('El quiz generado no tiene la estructura correcta')
    }

    // Retornar respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        content: JSON.stringify(quizData), // Mantener compatibilidad con el formato anterior
        quiz: quizData,
        provider: aiResponse.provider,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error generando quiz:', error)
    return new Response(
      JSON.stringify({
        error: 'Error generating quiz',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

// Función para llamar a Gemini API
async function callGeminiAPI(apiKey: string, prompt: string) {
  const model = 'gemini-1.5-flash'
  const temperature = 0.7
  const maxTokens = 2000

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: { 
        temperature, 
        maxOutputTokens: maxTokens 
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  return { 
    success: true, 
    provider: 'gemini', 
    content: text 
  }
}

// Función para llamar a OpenAI API
async function callOpenAIAPI(apiKey: string, prompt: string) {
  const model = 'gpt-3.5-turbo'
  const temperature = 0.7
  const maxTokens = 2000

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: await response.text() }))
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  return {
    success: true,
    provider: 'openai',
    content: data.choices[0].message.content,
  }
}

// Función para llamar a Claude API
async function callClaudeAPI(apiKey: string, prompt: string) {
  const model = 'claude-3-haiku-20240307'
  const temperature = 0.7
  const maxTokens = 2000

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: await response.text() }))
    throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  return {
    success: true,
    provider: 'claude',
    content: data.content[0].text,
  }
}
```

---

## ✅ Verificación Post-Deploy

Después de hacer deploy, verifica que:

1. ✅ La función aparece en la lista de Edge Functions
2. ✅ El status es "Active"
3. ✅ Puedes hacer "Invoke function" desde el Dashboard
4. ✅ La función responde correctamente

---

## 🔗 Endpoint

Una vez deployada, la función estará disponible en:

```
https://[TU_PROJECT_REF].supabase.co/functions/v1/generate-quiz-ai
```

El proxy de Vercel (`/api/ai/generate-quiz`) llamará automáticamente a este endpoint.

---

## 📝 Notas

- Esta función usa la misma lógica que tenía el código de Vercel, pero ahora está centralizada en Supabase
- Las claves API deben estar configuradas como Secrets en Supabase (no en Vercel)
- El proxy de Vercel solo necesita `SUPABASE_URL` y `SUPABASE_ANON_KEY` (ya configuradas para el chatbot)

