import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, Image as ImageIcon, Sparkles, Brain } from 'lucide-react';
import KaiChatWindow from '@/components/kai/KaiChatWindow';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const KaiCompanion = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  // ================= MENU CONFIG =================
  const menuItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat with KAI' },
    { id: 'image', icon: ImageIcon, label: 'Generate Image' },
    { id: 'quiz', icon: Brain, label: 'Generate Quiz' },
    { id: 'quick_action', icon: Zap, label: 'Quick Action' },
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
  const pedestalVariants = {
    rest: {
      scale: 1,
      boxShadow: '0 0 15px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.1)',
      transition: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 25px rgba(99, 102, 241, 0.4), 0 0 50px rgba(99, 102, 241, 0.2)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  const menuContainerVariants = {
    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
  };

  // ================= RENDER =================
  return (
    <>
      <div
        className="fixed bottom-8 right-8 z-50 flex items-center justify-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1000px' }}
      >
        {/* Floating Menu */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center gap-3 mr-4"
            >
              {menuItems.map((item) => (
                <motion.div key={item.id} variants={menuItemVariants}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className="group relative flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-accent-primary/50 group-hover:-translate-y-1">
                      <item.icon className="h-7 w-7 text-text-primary" />
                    </div>
                    <span className="absolute -bottom-5 text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* KAI Pedestal */}
        <motion.div
          variants={pedestalVariants}
          animate={isHovered ? 'hover' : 'rest'}
          className="w-28 h-28 rounded-full cursor-pointer relative glass-panel p-2"
          onClick={() => setIsChatOpen(true)}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <video
              src="https://i.imgur.com/MwJEV84.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <Sparkles className="absolute -top-1 -right-1 text-yellow-300/80 w-6 h-6 animate-pulse" />
        </motion.div>
      </div>

      <KaiChatWindow isVisible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default KaiCompanion;