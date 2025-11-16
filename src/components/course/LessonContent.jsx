import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LessonContent = ({ lesson, onStartQuiz }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-xl p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="h-8 w-8 text-blue-400" />
        <h2 className="text-3xl font-bold text-white">{lesson.title}</h2>
      </div>

      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
          {lesson.content}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onStartQuiz}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Start Quiz
        </Button>
      </div>
    </motion.div>
  );
};

export default LessonContent;