import React, { useState } from 'react';
import MenuConfig from '@/components/admin/MenuConfig';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Sparkles, Save, Download, Eye, EyeOff, Edit2, Trash2, TestTube } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const QuizBuilder = () => {
  const { user } = useAuth();
  const [infoBlock, setInfoBlock] = useState('');
  const [quizConfig, setQuizConfig] = useState({
    length: 5,
    complexity: 'Intermediate',
    customInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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

  const handleSaveQuiz = async () => {
    if (!generatedQuiz || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No quiz to save or user not authenticated.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('quizzes').insert({
        title: generatedQuiz.title || 'Untitled Quiz',
        questions: generatedQuiz.questions,
        created_by: user.id,
        quiz_data: generatedQuiz,
      });

      if (error) throw error;

      toast({
        title: "Quiz Saved!",
        description: "Your quiz has been saved to the database.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save quiz",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportQuiz = () => {
    if (!generatedQuiz) return;

    const dataStr = JSON.stringify(generatedQuiz, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedQuiz.title || 'quiz'}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Quiz Exported",
      description: "Quiz downloaded as JSON file.",
    });
  };

  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
  };

  const handleSaveEdit = (index, updatedQuestion) => {
    const updatedQuiz = { ...generatedQuiz };
    updatedQuiz.questions[index] = updatedQuestion;
    setGeneratedQuiz(updatedQuiz);
    setEditingQuestion(null);
    toast({
      title: "Question Updated",
      description: "Changes saved successfully.",
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuiz = { ...generatedQuiz };
    updatedQuiz.questions.splice(index, 1);
    setGeneratedQuiz(updatedQuiz);
    toast({
      title: "Question Deleted",
      description: "Question removed from quiz.",
    });
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
    <div className="builder-layout space-y-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Sección 1: Paste Content */}
        <div className="glass-panel p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">1. Paste your content</h2>
          <textarea
            className="info-textarea w-full h-96 p-4 bg-background/50 border border-glass-border rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent-primary/50 focus:outline-none resize-none transition-all"
            value={infoBlock}
            onChange={(e) => setInfoBlock(e.target.value)}
            placeholder="Paste course content, an article, meeting notes... anything!"
            disabled={loading}
          />
        </div>
        
        {/* Sección 2: Configure Parameters */}
        <MenuConfig 
          config={quizConfig} 
          setConfig={setQuizConfig} 
          onGenerate={handleGenerateQuiz} 
          loading={loading}
        />
      </div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 lg:p-12 glass-panel flex flex-col items-center justify-center min-h-[200px]"
        >
          <Loader2 className="h-12 w-12 animate-spin text-accent-primary mb-4" />
          <p className="text-lg font-medium text-text-primary mb-2">KAI is thinking...</p>
          <p className="text-sm text-text-secondary">Analyzing your content and crafting questions.</p>
        </motion.div>
      )}

      {generatedQuiz && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="generated-quiz-container glass-panel p-6 lg:p-8 mt-8"
        >
          <div className="mb-6 pb-4 border-b border-glass-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2 flex items-center">
                  <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-accent-primary mr-3" />
                  {generatedQuiz.title || 'Generated Quiz'}
                </h2>
                <p className="text-sm text-text-secondary">
                  {generatedQuiz.questions?.length || 0} questions generated
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTestMode(!testMode)}
                  className="flex items-center gap-2"
                >
                  {testMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {testMode ? 'Show Answers' : 'Test Mode'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportQuiz}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveQuiz}
                  className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90"
                >
                  <Save className="h-4 w-4" />
                  Save Quiz
                </Button>
              </div>
            </div>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 mt-6"
          >
            {generatedQuiz.questions?.map((q, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="p-5 lg:p-6 bg-background/30 rounded-lg border border-glass-border hover:border-accent-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="font-semibold text-base lg:text-lg text-text-primary flex-1">
                    {index + 1}. {editingQuestion === index ? (
                      <EditQuestionForm
                        question={q}
                        onSave={(updated) => handleSaveEdit(index, updated)}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    ) : (
                      q.question
                    )}
                  </p>
                  {editingQuestion !== index && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {editingQuestion !== index && (
                  <>
                    <div className="mt-4 space-y-2">
                      {q.options?.map((option, i) => {
                        const isCorrect = option === q.correct_answer;
                        const showAnswer = !testMode || isCorrect;
                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-md text-sm transition-all ${
                              showAnswer && isCorrect
                                ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50 font-medium'
                                : testMode && !isCorrect
                                ? 'bg-background/50 text-text-secondary border border-glass-border opacity-50'
                                : 'bg-background/50 text-text-secondary border border-glass-border'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {option}
                            {testMode && isCorrect && (
                              <span className="ml-2 text-xs text-green-400">✓ Correct</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (!testMode || editingQuestion === index) && (
                      <div className="mt-4 pt-4 border-t border-glass-border">
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold text-text-primary">Explanation:</span> {q.explanation}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Edit Question Form Component
const EditQuestionForm = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleSave = () => {
    onSave(editedQuestion);
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">Question</label>
        <textarea
          value={editedQuestion.question}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
          className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
          rows={2}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">Options</label>
        {editedQuestion.options?.map((option, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...editedQuestion.options];
                newOptions[i] = e.target.value;
                setEditedQuestion({ ...editedQuestion, options: newOptions });
              }}
              className="flex-1 bg-background border border-glass-border p-2 rounded-lg text-text-primary"
            />
            <input
              type="radio"
              name="correct"
              checked={option === editedQuestion.correct_answer}
              onChange={() => setEditedQuestion({ ...editedQuestion, correct_answer: option })}
              className="mt-2"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">Explanation</label>
        <textarea
          value={editedQuestion.explanation || ''}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, explanation: e.target.value })}
          className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QuizBuilder;