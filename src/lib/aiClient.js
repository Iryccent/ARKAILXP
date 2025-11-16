/**
 * 🤖 Cliente API para interactuar con las funciones de IA en Vercel
 * 
 * Este cliente maneja todas las llamadas a las API routes de IA,
 * protegiendo las claves API y manejando errores de forma centralizada.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Realiza una llamada a la API de chat con IA
 * 
 * @param {Object} params - Parámetros de la llamada
 * @param {string} params.provider - Proveedor de IA: 'gemini', 'openai', o 'claude'
 * @param {Array} params.messages - Array de mensajes en formato { role: 'user'|'assistant', content: string }
 * @param {Object} params.options - Opciones adicionales (temperature, maxTokens, model, etc.)
 * @returns {Promise<Object>} Respuesta de la IA
 * 
 * @example
 * const response = await chatWithAI({
 *   provider: 'gemini',
 *   messages: [
 *     { role: 'user', content: '¿Qué es React?' }
 *   ],
 *   options: { temperature: 0.7 }
 * });
 */
export async function chatWithAI({ provider, messages, options = {} }) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        messages,
        options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || errorData.message || 'Error en la API de IA');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error en chatWithAI:', error);
    throw error;
  }
}

/**
 * Genera un quiz usando IA basado en contenido educativo
 * 
 * @param {Object} params - Parámetros para generar el quiz
 * @param {string} params.content - Contenido educativo del cual generar el quiz
 * @param {Object} params.config - Configuración del quiz (length, complexity, customInstructions)
 * @param {string} params.provider - Proveedor de IA a usar (opcional, por defecto 'gemini')
 * @returns {Promise<Object>} Quiz generado
 * 
 * @example
 * const quiz = await generateQuiz({
 *   content: 'React es una biblioteca de JavaScript...',
 *   config: {
 *     length: 5,
 *     complexity: 'Intermedio',
 *     customInstructions: 'Enfócate en conceptos clave'
 *   },
 *   provider: 'gemini'
 * });
 */
export async function generateQuiz({ content, config = {}, provider = 'gemini' }) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        config,
        provider,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || errorData.message || 'Error generando quiz');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error en generateQuiz:', error);
    throw error;
  }
}

/**
 * Helper para crear mensajes de conversación
 * 
 * @param {string} userMessage - Mensaje del usuario
 * @param {string} systemPrompt - Prompt del sistema (opcional)
 * @param {Array} history - Historial de mensajes previos (opcional)
 * @returns {Array} Array de mensajes formateado
 */
export function createMessages(userMessage, systemPrompt = null, history = []) {
  const messages = [];
  
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  // Agregar historial
  messages.push(...history);

  // Agregar mensaje actual
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
}

/**
 * Helper para crear un prompt de tutor educativo
 * 
 * @param {string} lessonContext - Contexto de la lección
 * @param {string} userQuestion - Pregunta del usuario
 * @returns {string} Prompt formateado
 */
export function createTutorPrompt(lessonContext, userQuestion) {
  return `Eres un tutor educativo experto y amigable. Tu tarea es ayudar a los estudiantes a entender el contenido de la lección.

CONTEXTO DE LA LECCIÓN:
${lessonContext}

PREGUNTA DEL ESTUDIANTE:
${userQuestion}

INSTRUCCIONES:
- Responde de forma clara y educativa
- Usa ejemplos cuando sea apropiado
- Si la pregunta está fuera del contexto, indícalo amablemente
- Mantén un tono amigable y alentador
- Si es necesario, haz preguntas de seguimiento para ayudar al estudiante a pensar

Responde ahora:`;
}

