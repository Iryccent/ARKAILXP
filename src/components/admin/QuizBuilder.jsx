import React, { useState } from 'react';
import MenuConfig from '@/components/admin/MenuConfig';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizBuilder = () => {
  const [infoBlock, setInfoBlock] = useState('');
  const [quizConfig, setQuizConfig] = useState({
    length: 5,
    complexity: 'Intermedio',
    customInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleGenerateQuiz = async () => {
    if (!infoBlock.trim()) {
      toast({
        variant: "destructive",
        title: "¡Falta contenido!",
        description: "Por favor, pega información para generar el quiz.",
      });
      return;
    }
    setLoading(true);
    setGeneratedQuiz(null);

    try {
      // Usar la nueva API route de Vercel en lugar de Supabase Edge Function
      // Esto protege las claves API y evita problemas de CORS
      const { generateQuiz } = await import('@/lib/aiClient');
      
      const response = await generateQuiz({
        content: infoBlock,
        config: quizConfig,
        provider: 'gemini', // Puedes cambiar a 'openai' o 'claude'
      });

      // La nueva API puede devolver el quiz directamente o en 'content'
      let quizData;
      if (response.quiz) {
        quizData = response.quiz;
      } else if (response.content) {
        quizData = typeof response.content === 'string' 
          ? JSON.parse(response.content) 
          : response.content;
      } else {
        throw new Error('Formato de respuesta inesperado');
      }

      setGeneratedQuiz(quizData);
      toast({
        title: "¡Quiz Generado Exitosamente!",
        description: "Tu quiz está listo para revisar abajo.",
      });

    } catch (error) {
      console.error('Error generando quiz:', error);
      toast({
        variant: "destructive",
        title: "Ocurrió un Error",
        description: `No se pudo generar el quiz. ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="builder-layout space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel">
          <h2 className="panel-title text-xl font-semibold text-text-primary mb-4">1. Paste your content</h2>
          <textarea
            className="info-textarea w-full h-96 p-4 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-accent-primary"
            value={infoBlock}
            onChange={(e) => setInfoBlock(e.target.value)}
            placeholder="Paste course content, an article, meeting notes... anything!"
            disabled={loading}
          />
        </div>
        <MenuConfig 
          config={quizConfig} 
          setConfig={setQuizConfig} 
          onGenerate={handleGenerateQuiz} 
          loading={loading}
        />
      </div>

      {loading && (
        <div className="text-center p-8 glass-panel flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent-primary mb-4" />
            <p className="text-lg text-text-primary">KAI is thinking...</p>
            <p className="text-sm text-text-secondary">Analyzing your content and crafting questions.</p>
        </div>
      )}

      {generatedQuiz && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="generated-quiz-container glass-panel p-8"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-2 flex items-center">
            <Sparkles className="h-8 w-8 text-accent-primary mr-3" />
            {generatedQuiz.title}
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 mt-6"
          >
            {generatedQuiz.questions.map((q, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="p-6 bg-black/20 rounded-lg border border-border"
              >
                <p className="font-semibold text-lg text-text-primary">{index + 1}. {q.question}</p>
                <div className="mt-4 space-y-2">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-md text-sm ${
                        option === q.correct_answer
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-background/30'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                 <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border">
                    <span className="font-bold">Explanation:</span> {q.explanation}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizBuilder;