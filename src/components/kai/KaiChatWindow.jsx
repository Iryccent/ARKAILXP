import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { marked } from 'marked';

// Configurar marked para preservar espacios y formato
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
});


const KaiChatWindow = ({ isVisible, onClose }) => {
    const { session } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! Soy KAI, tu compañero oficial de aprendizaje. ¿Cómo puedo ayudarte hoy en tu viaje de aprendizaje?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        // Verificar autenticación
        if (!session) {
            toast({
                variant: "destructive",
                title: "Autenticación requerida",
                description: "Por favor, inicia sesión para usar KAI.",
            });
            return;
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsThinking(true);

        try {
            // ✅ Llamar a la función proxy de Vercel que evita problemas de CORS
            // Esta función llama a chatbot-kai de Supabase internamente
            const response = await fetch('/api/kai/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: currentInput
                })
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    const errorText = await response.text();
                    errorData = { error: errorText };
                }
                throw new Error(errorData.error || errorData.message || 'Error al conectar con KAI');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const aiResponseContent = data.content || "Lo siento, KAI respondió pero no encontré el mensaje.";

            // ✅ Detectar si KAI quiere generar una imagen (según especificaciones)
            // Si la respuesta contiene "Generating an image...", llamar a generate-image-kai
            if (aiResponseContent.includes('Generating an image...') || aiResponseContent.includes('generating an image')) {
                // Primero mostrar el mensaje de texto
                const aiMessage = { role: 'assistant', content: aiResponseContent };
                setMessages(prev => [...prev, aiMessage]);

                // Luego generar la imagen automáticamente
                try {
                    const imageResponse = await fetch('/api/kai/generate-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            prompt: currentInput // O extraer el prompt de la respuesta si es necesario
                        })
                    });

                    if (imageResponse.ok) {
                        const imageData = await imageResponse.json();

                        if (imageData?.imageUrl) {
                        const imageMessage = {
                            role: 'assistant',
                            content: `![Imagen generada](${imageData.imageUrl})`,
                            isImage: true,
                            imageUrl: imageData.imageUrl
                        };
                        setMessages(prev => [...prev, imageMessage]);
                        }
                    }
                } catch (imageError) {
                    console.error('Error generando imagen:', imageError);
                }
            } else {
                // Respuesta normal de texto
                const aiMessage = { role: 'assistant', content: aiResponseContent };
                setMessages(prev => [...prev, aiMessage]);
            }

        } catch (error) {
            console.error('Error al invocar chatbot-kai:', error);
            const errorMessage = {
                role: 'assistant',
                content: `Lo siento, estoy teniendo problemas para conectar: ${error.message}`
            };
            setMessages(prev => [...prev, errorMessage]);

            toast({
                variant: "destructive",
                title: "Error de Conexión con KAI",
                description: error.message,
            });
        } finally {
            setIsThinking(false);
        }
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-6 w-[90vw] max-w-md h-[70vh] flex flex-col glass-panel-kai rounded-2xl shadow-2xl"
            style={{ zIndex: 'var(--z-kai-chat)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src="https://i.imgur.com/q0OEIZ7.gif" alt="KAI GIF" className="w-12 h-12 rounded-full" />
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-background"></span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">KAI AI Companion</h3>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-text-secondary hover:text-text-primary">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && <Bot className="h-6 w-6 text-accent-primary self-start flex-shrink-0" />}
                            <div
                                className={`max-w-[85%] rounded-lg px-4 py-3 ${message.role === 'user'
                                        ? 'bg-accent-primary/80 text-white'
                                        : 'bg-background/50'
                                    }`}
                            >
                                {message.isImage && message.imageUrl ? (
                                    <img 
                                        src={message.imageUrl} 
                                        alt="Imagen generada por KAI" 
                                        className="max-w-full rounded-lg mt-2"
                                    />
                                ) : (
                                    <div
                                        className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap break-words"
                                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                        dangerouslySetInnerHTML={{ __html: marked.parse(message.content.replace(/\n/g, '\n\n')) }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-end gap-2 my-3 justify-start"
                    >
                        <Bot className="h-6 w-6 text-accent-primary self-start flex-shrink-0" />
                        <div className="max-w-[85%] rounded-lg px-4 py-3 bg-background/50 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
                            <span className="text-sm text-text-secondary">KAI is thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-glass-border">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask KAI anything..."
                        className="w-full pl-4 pr-12 py-3 rounded-lg bg-background/50 border border-glass-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        disabled={isThinking}
                    />
                    <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={isThinking || !input.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default KaiChatWindow;