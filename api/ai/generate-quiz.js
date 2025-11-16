/**
 * 🔐 API Route Proxy para generate-quiz-ai de Supabase
 * 
 * Esta función actúa como proxy entre el frontend y la Supabase Edge Function
 * para evitar problemas de CORS. Llama a la función generate-quiz-ai de Supabase
 * y retorna la respuesta.
 * 
 * Uso desde el frontend:
 * POST /api/ai/generate-quiz
 * Body: { content: string, config: { length, complexity, customInstructions }, provider?: 'gemini' | 'openai' | 'claude' }
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
    const { content, config = {}, provider = 'gemini' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        error: 'Missing required field: content is required' 
      });
    }

    // Obtener las variables de entorno de Supabase
    // IMPORTANTE: Las funciones serverless de Vercel NO tienen acceso a variables VITE_*
    // Debes agregar SUPABASE_URL y SUPABASE_ANON_KEY (sin prefijo VITE_) en Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variables de entorno faltantes:', {
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_ANON_KEY: !!supabaseAnonKey,
        availableEnvVars: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
      });
      return res.status(500).json({ 
        error: 'Supabase configuration missing',
        message: 'Please add SUPABASE_URL and SUPABASE_ANON_KEY (without VITE_ prefix) in Vercel environment variables. These are different from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        hint: 'Copy the values from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, but name them SUPABASE_URL and SUPABASE_ANON_KEY'
      });
    }

    // Llamar a la Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-quiz-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        content,
        config,
        provider,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Supabase Edge Function error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Error en proxy de generate-quiz-ai:', error);
    return res.status(500).json({ 
      error: 'Error processing quiz generation request',
      message: error.message 
    });
  }
}

