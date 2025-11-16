import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, Image as ImageIcon, Sparkles, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import KaiChatWindow from '@/components/kai/KaiChatWindow';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const KaiCompanion = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  // Limitar animación inicial a 13 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 13000); // 13 segundos

    return () => clearTimeout(timer);
  }, []);

  // ================= MENU CONFIG =================
  // Botones posicionados en círculo alrededor de KAI
  const menuItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat', angle: 0 },      // Top
    { id: 'image', icon: ImageIcon, label: 'Image', angle: 90 },      // Right
    { id: 'quiz', icon: Brain, label: 'Quiz', angle: 180 },           // Bottom
    { id: 'quick_action', icon: Zap, label: 'Action', angle: 270 },   // Left
  ];

  // ================= HANDLER =================
  const handleMenuClick = async (id) => {
    try {
      if (id === 'chat') {
        setIsChatOpen(true);
        setIsHovered(false);
        toast({
          title: '💬 Chat activo',
          description: 'KAI está listo para conversar o enseñar.',
        });
      }

      if (id === 'image') {
        // Abrir chat para que el usuario pueda pedir una imagen
        setIsChatOpen(true);
        setIsHovered(false);
        toast({
          title: '🖼️ Generar Imagen',
          description: 'Escribe en el chat qué imagen quieres que KAI genere.',
        });
      }

      if (id === 'quiz') {
        if (!session) {
          toast({
            variant: "destructive",
            title: "Autenticación requerida",
            description: "Por favor, inicia sesión para generar quizzes.",
          });
          return;
        }

        // Abrir chat para que el usuario pueda pedir un quiz
        setIsChatOpen(true);
        setIsHovered(false);
        toast({
          title: '🧠 Generar Quiz',
          description: 'Pide a KAI que genere un quiz sobre cualquier tema.',
        });
      }

      if (id === 'quick_action') {
        toast({
          title: '⚙️ Acción rápida',
          description: 'Esta función estará disponible próximamente.',
        });
      }
    } catch (err) {
      console.error('Error al manejar acción de menú:', err);
      toast({
        title: '❌ Error interno',
        description: 'No se pudo completar la acción.',
      });
    }
  };

  // ================= ANIMATIONS =================
  // Animación inicial de 13 segundos, luego se detiene
  const sphereVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      boxShadow: animationComplete 
        ? '0 0 20px rgba(99, 102, 241, 0.3)' 
        : [
            '0 0 15px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.1)',
            '0 0 25px rgba(99, 102, 241, 0.4), 0 0 50px rgba(99, 102, 241, 0.2)',
            '0 0 15px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.1)',
          ],
      transition: animationComplete
        ? { duration: 0.3 }
        : {
            scale: { duration: 0.5 },
            opacity: { duration: 0.5 },
            y: { duration: 0.5 },
            boxShadow: { duration: 2, ease: 'easeInOut', repeat: 6, repeatType: 'mirror' }, // 6 repeticiones = ~13 segundos
          },
    },
    hover: {
      scale: 1.1,
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(99, 102, 241, 0.3)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  // Calcular posición de botones en círculo
  const getButtonPosition = (angle, radius = 80) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  };

  const menuItemVariants = {
    hidden: (angle) => {
      const pos = getButtonPosition(angle);
      return {
        opacity: 0,
        scale: 0,
        x: pos.x * 0.5,
        y: pos.y * 0.5,
      };
    },
    visible: (angle) => {
      const pos = getButtonPosition(angle);
      return {
        opacity: 1,
        scale: 1,
        x: pos.x,
        y: pos.y,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      };
    },
  };

  // ================= RENDER =================
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-8 right-8 z-[1000] w-16 h-16 rounded-full glass-panel flex items-center justify-center hover:bg-accent-primary/20 transition-colors shadow-lg"
        style={{ zIndex: 'var(--z-kai-chat)' }}
      >
        <ChevronUp className="w-6 h-6 text-accent-primary" />
      </motion.button>
    );
  }

  return (
    <>
      <div
        className="fixed bottom-8 right-8 z-[1000]"
        style={{ zIndex: 'var(--z-kai-chat)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Container relativo para posicionar botones */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Botones alrededor en círculo */}
          <AnimatePresence>
            {isHovered && (
              <>
                {menuItems.map((item) => {
                  const pos = getButtonPosition(item.angle);
                  return (
                    <motion.button
                      key={item.id}
                      custom={item.angle}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      onClick={() => handleMenuClick(item.id)}
                      className="absolute group w-14 h-14 rounded-full glass-panel flex items-center justify-center hover:bg-accent-primary/50 hover:scale-110 transition-all duration-300 shadow-lg"
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={item.label}
                    >
                      <item.icon className="h-6 w-6 text-text-primary" />
                    </motion.button>
                  );
                })}
              </>
            )}
          </AnimatePresence>

          {/* Esfera tecnológica con KAI */}
          <motion.div
            variants={sphereVariants}
            initial="initial"
            animate={isHovered ? 'hover' : 'animate'}
            className="relative w-32 h-32 cursor-pointer"
            onClick={() => setIsChatOpen(true)}
          >
            {/* Esfera exterior con efecto tecnológico */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary/20 via-accent-secondary/10 to-transparent backdrop-blur-sm border-2 border-accent-primary/30 shadow-2xl" />
            
            {/* Anillos concéntricos animados */}
            <motion.div
              className="absolute inset-0 rounded-full border border-accent-primary/20"
              animate={animationComplete ? {} : {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: 6,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-accent-secondary/20"
              animate={animationComplete ? {} : {
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: 6,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />

            {/* Video de KAI centrado, sin distorsión */}
            <div className="absolute inset-4 rounded-full overflow-hidden bg-black/20">
              <video
                src="https://i.imgur.com/MwJEV84.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Partículas flotantes */}
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300/80 w-5 h-5 animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 text-accent-primary/60 w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>

          {/* Botón para minimizar */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-background/80 hover:bg-background border border-glass-border flex items-center justify-center transition-colors shadow-lg"
            title="Minimizar KAI"
          >
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      <KaiChatWindow isVisible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default KaiCompanion;