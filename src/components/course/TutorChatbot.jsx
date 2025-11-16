import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { chatWithAI, createTutorPrompt } from '@/lib/aiClient';

const TutorChatbot = ({ lessonContext = '' }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu tutor de IA. Pregúntame lo que quieras sobre esta lección.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Crear el prompt del tutor con el contexto de la lección
      const tutorPrompt = lessonContext 
        ? createTutorPrompt(lessonContext, input)
        : input;

      // Preparar mensajes para la API
      const apiMessages = [
        ...messages.slice(1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: tutorPrompt
        }
      ];

      // Llamar a la API de IA (usando Gemini por defecto)
      const response = await chatWithAI({
        provider: 'gemini', // Puedes cambiar a 'openai' o 'claude' si prefieres
        messages: apiMessages,
        options: {
          temperature: 0.7,
          maxTokens: 1024,
        }
      });

      const aiResponse = {
        role: 'assistant',
        content: response.content || 'Lo siento, no pude generar una respuesta.'
      };

      setMessages([...newMessages, aiResponse]);

    } catch (error) {
      console.error('Error en TutorChatbot:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo obtener respuesta del tutor. Intenta de nuevo."
      });

      // Agregar mensaje de error al chat
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">AI Tutor</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
          placeholder="Escribe tu pregunta..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TutorChatbot;