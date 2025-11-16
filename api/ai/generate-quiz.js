/**
 * 🔐 API Route Segura para Generar Quizzes con IA
 * 
 * Esta función genera quizzes usando IA basándose en contenido educativo.
 * Puede usar cualquier proveedor de IA configurado.
 * 
 * Uso desde el frontend:
 * POST /api/ai/generate-quiz
 * Body: { content: string, config: { length, complexity, customInstructions }, provider?: 'gemini' | 'openai' | 'claude' }
 */

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, config = {}, provider = 'gemini' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        error: 'Missing required field: content is required' 
      });
    }

    const quizLength = config.length || 5;
    const complexity = config.complexity || 'Intermedio';
    const customInstructions = config.customInstructions || '';

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

No incluyas texto adicional fuera del JSON. El JSON debe ser válido y parseable.`;

    // Llamar a la API de chat con el prompt
    const chatResponse = await handleAIRequest(provider, [
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Intentar extraer y parsear el JSON de la respuesta
    let quizData;
    try {
      // Intentar encontrar JSON en la respuesta (puede venir con markdown o texto adicional)
      const jsonMatch = chatResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        quizData = JSON.parse(chatResponse.content);
      }
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      console.error('Raw response:', chatResponse.content);
      throw new Error('La IA no generó un JSON válido. Intenta de nuevo.');
    }

    // Validar estructura básica
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('El quiz generado no tiene la estructura correcta');
    }

    return res.status(200).json({
      success: true,
      content: JSON.stringify(quizData), // Mantener compatibilidad con el formato anterior
      quiz: quizData,
      provider: chatResponse.provider,
    });

  } catch (error) {
    console.error('❌ Error generando quiz:', error);
    return res.status(500).json({ 
      error: 'Error generating quiz',
      message: error.message 
    });
  }
}

/**
 * Función auxiliar para hacer requests a la IA
 */
async function handleAIRequest(provider, messages, options) {
  const apiKey = getApiKey(provider);
  
  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()}_API_KEY no está configurada`);
  }

  switch (provider.toLowerCase()) {
    case 'gemini':
      return await handleGemini(messages, options);
    case 'openai':
      return await handleOpenAI(messages, options);
    case 'claude':
      return await handleClaude(messages, options);
    default:
      throw new Error(`Proveedor no soportado: ${provider}`);
  }
}

function getApiKey(provider) {
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
  };
  return keys[provider.toLowerCase()];
}

async function handleGemini(messages, options) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = options.model || 'gemini-1.5-flash';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 2000;

  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: geminiMessages,
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return { success: true, provider: 'gemini', content: text };
}

async function handleOpenAI(messages, options) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = options.model || 'gpt-3.5-turbo';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 2000;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: await response.text() }));
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    success: true,
    provider: 'openai',
    content: data.choices[0].message.content,
  };
}

async function handleClaude(messages, options) {
  const apiKey = process.env.CLAUDE_API_KEY;
  const model = options.model || 'claude-3-haiku-20240307';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 2000;

  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

  const requestBody = {
    model,
    messages: conversationMessages,
    temperature,
    max_tokens: maxTokens,
  };

  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: await response.text() }));
    throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    success: true,
    provider: 'claude',
    content: data.content[0].text,
  };
}

