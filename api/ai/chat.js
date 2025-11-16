/**
 * 🔐 API Route Segura para Chat con IA
 * 
 * Esta función protege tus claves API y actúa como intermediario
 * entre tu frontend y los servicios de IA (Gemini, OpenAI, Claude).
 * 
 * Uso desde el frontend:
 * POST /api/ai/chat
 * Body: { provider: 'gemini' | 'openai' | 'claude', messages: [...], options: {...} }
 */

export default async function handler(req, res) {
  // Configurar CORS - Permitir dominio de Vercel y dominio personalizado
  const allowedOrigins = [
    'https://arkailxp.vercel.app',
    'https://www.arkailxp.vercel.app',
    'https://j-irizarry.info',
    'https://www.j-irizarry.info',
    'http://localhost:5173', // Desarrollo local
    'http://localhost:3000', // Desarrollo local alternativo
  ];
  
  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, messages, options = {} } = req.body;

    if (!provider || !messages) {
      return res.status(400).json({ 
        error: 'Missing required fields: provider and messages are required' 
      });
    }

    // Validar provider
    const validProviders = ['gemini', 'openai', 'claude'];
    if (!validProviders.includes(provider.toLowerCase())) {
      return res.status(400).json({ 
        error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` 
      });
    }

    let result;

    switch (provider.toLowerCase()) {
      case 'gemini':
        result = await handleGemini(messages, options);
        break;
      case 'openai':
        result = await handleOpenAI(messages, options);
        break;
      case 'claude':
        result = await handleClaude(messages, options);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported provider' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error en API de IA:', error);
    return res.status(500).json({ 
      error: 'Error processing AI request',
      message: error.message 
    });
  }
}

/**
 * 🤖 Maneja requests a Google Gemini
 */
async function handleGemini(messages, options) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
  }

  const model = options.model || 'gemini-1.5-flash';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 1024;

  // Convertir mensajes al formato de Gemini
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: geminiMessages,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  // Extraer el texto de la respuesta
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
               'No se pudo generar una respuesta';

  return {
    success: true,
    provider: 'gemini',
    content: text,
    usage: data.usageMetadata || null,
  };
}

/**
 * 🧠 Maneja requests a OpenAI (GPT)
 */
async function handleOpenAI(messages, options) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
  }

  const model = options.model || 'gpt-3.5-turbo';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 1024;

  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
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
    usage: data.usage || null,
  };
}

/**
 * 🎭 Maneja requests a Anthropic Claude
 */
async function handleClaude(messages, options) {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY no está configurada en las variables de entorno');
  }

  const model = options.model || 'claude-3-haiku-20240307';
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 1024;

  // Convertir mensajes al formato de Claude (solo system, user, assistant)
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

  const url = 'https://api.anthropic.com/v1/messages';

  const requestBody = {
    model,
    messages: conversationMessages,
    temperature,
    max_tokens: maxTokens,
  };

  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }

  const response = await fetch(url, {
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
    usage: data.usage || null,
  };
}

