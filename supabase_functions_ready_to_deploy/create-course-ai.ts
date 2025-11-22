// ============================================
// CÓDIGO COMPLETO PARA SUPABASE EDGE FUNCTION
// Función: create-course-ai
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Configurar CORS
const allowedOrigins = [
  'https://arkailxp.vercel.app',
  'https://www.arkailxp.vercel.app',
  'https://j-irizarry.info',
  'https://www.j-irizarry.info',
  'http://localhost:5173',
  'http://localhost:3000',
]

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? ''
    const { content, title } = await req.json()

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prompt para generar un CURSO completo
    const prompt = `Eres un experto diseñador instruccional. Crea un curso estructurado basado en el siguiente contenido.

    TÍTULO SUGERIDO: ${title || 'Genera un título relevante'}
    CONTENIDO BASE:
    ${content.substring(0, 8000)} // Limitar input para no exceder tokens

    Genera un objeto JSON con la siguiente estructura exacta:
    {
      "title": "Título final del curso",
      "description": "Breve descripción persuasiva (max 200 caracteres)",
      "difficulty_level": "Intro" | "Intermediate" | "Advanced",
      "course_content": "Contenido del curso en formato Markdown. Debe incluir Módulos y Lecciones. Usa encabezados ## para Módulos y ### para Lecciones."
    }
    `

    const aiResponse = await callGeminiAPI(geminiApiKey, prompt)

    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('❌ Error creating course:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function callGeminiAPI(apiKey: string, prompt: string) {
  const model = 'gemini-1.5-flash'
  const responseSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      difficulty_level: { type: 'string', enum: ["Intro", "Intermediate", "Advanced"] },
      course_content: { type: 'string', description: "Markdown formatted course content" }
    },
    required: ['title', 'description', 'difficulty_level', 'course_content']
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 8000,
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      },
    }),
  })

  if (!response.ok) {
    const txt = await response.text()
    throw new Error(`Gemini API Error: ${txt}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  return JSON.parse(text)
}
