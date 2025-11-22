import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';

// ==========================================
// 🎨 SUB-COMPONENTS: KaiThinkingIndicator
// ==========================================
const KaiThinkingIndicator = ({ text = "Processing..." }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20 self-start ml-4 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]"
    >
        <div className="flex space-x-1">
            <motion.div 
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_currentColor]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div 
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_currentColor]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_currentColor]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
        </div>
        <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">{text}</span>
    </motion.div>
);

// ==========================================
// 🎨 SUB-COMPONENTS: ActionChip
// ==========================================
const ActionChip = ({ label, onClick, disabled, icon, color = 'cyan' }) => {
    const colorStyles = {
        cyan: 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 shadow-cyan-500/10',
        purple: 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 shadow-purple-500/10',
        green: 'border-green-500/30 text-green-300 hover:bg-green-500/10 shadow-green-500/10',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md border bg-black/40 backdrop-blur-md 
                text-[10px] font-bold uppercase tracking-wider transition-all duration-200
                shadow-lg disabled:opacity-30 disabled:cursor-not-allowed
                ${colorStyles[color]}
            `}
        >
            {icon}
            {label}
        </motion.button>
    );
};

// ==========================================
// 🎨 HELPER: Format Message (Custom Markdown Parser)
// ==========================================
const formatMessage = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    const formattedElements = [];
    let currentList = [];
    
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (line.startsWith('### ')) {
            if (currentList.length > 0) {
                formattedElements.push(<ul key={`ul-${index}`} className="list-disc pl-6 mb-4 space-y-2 text-cyan-50/90">{currentList}</ul>);
                currentList = [];
            }
            formattedElements.push(<h3 key={index} className="text-cyan-400 font-bold text-sm mt-6 mb-3 uppercase tracking-wider border-b border-cyan-500/30 pb-1 w-full text-shadow-sm">{line.replace('### ', '')}</h3>);
            return;
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const listContent = trimmed.replace(/^[\*\-]\s/, '');
            const parts = listContent.split(/(\*\*.*?\*\*)/g);
            const renderedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-cyan-200 font-bold">{part.slice(2, -2)}</strong>;
                return part;
            });
            currentList.push(<li key={index} className="text-sm leading-relaxed text-gray-300/90 pl-2 border-l-2 border-cyan-500/20 mb-2">{renderedLine}</li>);
            return;
        }
        if (currentList.length > 0) {
            formattedElements.push(<ul key={`ul-${index}`} className="list-none pl-2 mb-4 space-y-2 text-cyan-50/90">{currentList}</ul>);
            currentList = [];
        }
        if (trimmed !== '') {
             const parts = line.split(/(\*\*.*?\*\*)/g);
             const renderedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-cyan-200 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">{part.slice(2, -2)}</strong>;
                return part;
            });
            formattedElements.push(<p key={index} className="mb-3 text-sm leading-relaxed text-gray-300">{renderedLine}</p>);
        }
    });
     if (currentList.length > 0) {
        formattedElements.push(<ul key={`ul-last`} className="list-none pl-2 mb-4 space-y-2 text-cyan-50/90">{currentList}</ul>);
    }
    return formattedElements;
};


const KaiChatWindow = ({ isVisible, onClose }) => {
    const { session } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 'init',
            role: 'assistant',
            content: '¡Hola! Soy KAI, tu compañero oficial de aprendizaje. ¿Cómo puedo ayudarte hoy en tu viaje de aprendizaje?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isThinking, isGeneratingImage]);

    // ==========================================
    // 🎯 PROCESS RESPONSE (Main Message Handler)
    // ==========================================
    const processResponse = async (textInput) => {
        if (!textInput.trim() || isThinking || isGeneratingImage) return;

        // Verificar autenticación
        if (!session) {
            toast({
                variant: "destructive",
                title: "Autenticación requerida",
                description: "Por favor, inicia sesión para usar KAI.",
            });
            return;
        }

        const userMsg = { id: crypto.randomUUID(), role: 'user', content: textInput };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const response = await fetch('/api/kai/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: textInput
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
            const aiMessage = { id: crypto.randomUUID(), role: 'assistant', content: aiResponseContent };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error al invocar chatbot-kai:', error);
            const errorMessage = {
                id: crypto.randomUUID(),
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

    // ==========================================
    // 🎨 IMAGE GENERATION HANDLER
    // ==========================================
    const handleImageGeneration = async (prompt) => {
        if (!prompt.trim() || isThinking || isGeneratingImage) return;

        if (!session) {
            toast({
                variant: "destructive",
                title: "Autenticación requerida",
                description: "Por favor, inicia sesión para usar KAI.",
            });
            return;
        }

        const userMsg = { id: crypto.randomUUID(), role: 'user', content: `Visualize: ${prompt}` };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsGeneratingImage(true);
        const assistantId = crypto.randomUUID();
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const imageResponse = await fetch('/api/kai/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                const successMsg = `Visual synthesis complete: "${prompt}"`;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: successMsg, imageUrl: imageData.imageUrl } : m));
            } else {
                throw new Error('Failed to generate image');
            }
        } catch (err) {
            const errorMsg = "Visual synthesis failed. Systems overloaded.";
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: errorMsg } : m));
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        processResponse(input);
    };

    if (!isVisible) return null;

    // Get last user message for quick actions
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || 'Futuristic Technology';

    return (
        <motion.div
            key="kai-hover-craft"
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, y: [0, -5, 0], scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ 
                opacity: { duration: 0.3 }, 
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="fixed bottom-28 right-6 w-[90vw] sm:w-[420px] h-[70vh] sm:h-[650px] flex flex-col relative overflow-hidden z-50 rounded-3xl shadow-2xl"
            style={{ perspective: '1000px', zIndex: 'var(--z-kai-chat)' }}
        >
            {/* --- THE CRAFT CHASSIS --- */}
            <div className="absolute inset-0 bg-[#050A14] bg-opacity-95 backdrop-blur-xl z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0 mix-blend-overlay"></div>
            <div className="absolute inset-0 border-[1px] border-cyan-500/30 rounded-3xl pointer-events-none z-50 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]"></div>

            {/* HEADER: SENSORS & ID */}
            <div className="h-20 flex items-center justify-between px-6 bg-black/40 border-b border-cyan-500/20 relative z-20">
                <div className="flex items-center gap-4">
                    {/* Holographic Avatar Container */}
                    <div className="relative w-12 h-12">
                         <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse blur-md"></div>
                         <div className="w-full h-full rounded-full overflow-hidden border border-cyan-400/50 relative z-10 bg-black">
                            <video src="https://i.imgur.com/MwJEV84.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover scale-125" />
                         </div>
                         {/* Status Light */}
                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full z-20"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-widest text-xs uppercase">IRYCCENT AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-cyan-400 font-mono">ONLINE</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* MAIN DISPLAY: CHAT */}
            <div className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent relative z-10">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3.5 text-sm shadow-lg backdrop-blur-sm relative ${
                            msg.role === 'user' 
                                ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tr-sm' 
                                : 'bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm'
                        }`}>
                            <div className="font-light tracking-wide leading-relaxed">{formatMessage(msg.content)}</div>
                            {msg.imageUrl && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg">
                                    <img src={msg.imageUrl} alt="AI Generated" className="w-full h-auto" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isThinking && <KaiThinkingIndicator />}
                {isGeneratingImage && <KaiThinkingIndicator text="Synthesizing..." />}
                <div ref={messagesEndRef} />
            </div>

            {/* COMMAND PLATFORM (THE DECK) */}
            <div className="relative z-30 bg-[#080C14] border-t border-cyan-500/30 p-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                
                {/* Row 1: Action Chips (The Holographic Deck) */}
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                    <ActionChip 
                        label="Visualize" 
                        color="purple"
                        icon={<ImageIcon className="w-4 h-4" />} 
                        disabled={isThinking || isGeneratingImage} 
                        onClick={() => handleImageGeneration(lastUserMessage)} 
                    />
                    <ActionChip 
                        label="Summarize" 
                        color="cyan"
                        icon={<Sparkles className="w-4 h-4" />}
                        disabled={isThinking || isGeneratingImage} 
                        onClick={() => processResponse("Summarize the key concepts of this context.")} 
                    />
                    <ActionChip 
                        label="Quiz Me" 
                        color="green"
                        icon={<span className="font-bold text-xs">?</span>}
                        disabled={isThinking || isGeneratingImage} 
                        onClick={() => processResponse("Generate a quick quiz question based on this.")} 
                    />
                </div>

                {/* Row 2: The Cockpit (Input) */}
                <div className="relative flex items-center gap-2">
                    <div className="relative flex-grow bg-black/50 border border-white/10 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 rounded-xl flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter command..."
                            className="w-full bg-transparent text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none font-mono"
                            disabled={isThinking || isGeneratingImage}
                            onKeyDown={(e) => e.key === 'Enter' && !isThinking && processResponse(input)}
                        />
                    </div>

                    <button 
                        onClick={() => processResponse(input)}
                        disabled={!input.trim() || isThinking || isGeneratingImage}
                        className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:bg-gray-800 text-white rounded-xl shadow-lg transition-all transform active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Footer Diagnostic Line */}
                <div className="absolute bottom-1 left-0 w-full flex justify-center gap-1 opacity-20">
                    <div className="h-0.5 w-8 bg-cyan-500"></div>
                    <div className="h-0.5 w-1 bg-cyan-500"></div>
                    <div className="h-0.5 w-1 bg-cyan-500"></div>
                    <div className="h-0.5 w-8 bg-cyan-500"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default KaiChatWindow;