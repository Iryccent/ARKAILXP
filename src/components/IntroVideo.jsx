import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroVideo = ({ onComplete }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Verificar si ya se mostró el intro en esta sesión
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro === 'true') {
      setShowVideo(false);
      onComplete();
      return;
    }

    // Cuando el video termine, esperar un momento y luego ocultar
    const handleVideoEnd = () => {
      setVideoEnded(true);
      sessionStorage.setItem('hasSeenIntro', 'true');
      
      // Pequeño delay antes de ocultar para transición suave
      setTimeout(() => {
        setShowVideo(false);
        onComplete();
      }, 500);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      
      // Intentar reproducir automáticamente
      video.play().catch((error) => {
        console.warn('Autoplay prevented:', error);
        // Si autoplay falla, permitir que el usuario lo reproduzca
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [onComplete]);

  // Permitir saltar el intro con clic o tecla
  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoEnded(true);
    sessionStorage.setItem('hasSeenIntro', 'true');
    setTimeout(() => {
      setShowVideo(false);
      onComplete();
    }, 300);
  };

  if (!showVideo) {
    return null;
  }

  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoEnded ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={handleSkip}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              handleSkip();
            }
          }}
          tabIndex={0}
        >
          {/* Video Container - Mantiene aspect ratio, no estira */}
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              playsInline
              muted
              autoPlay
              preload="auto"
            >
              <source src="https://i.imgur.com/Zvw1USv.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
            
            {/* Overlay para permitir skip */}
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip();
                }}
                className="px-6 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-all text-sm font-medium"
              >
                Saltar Intro
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;

