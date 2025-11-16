import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuizModule = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const correctAnswers = newAnswers.filter((answer, index) => answer === quiz[index].correctAnswer).length;
      const score = (correctAnswers / quiz.length) * 100;
      setShowResult(true);
      onComplete(score);
    }
  };

  if (showResult) {
    const correctAnswers = answers.filter((answer, index) => answer === quiz[index].correctAnswer).length;
    const score = (correctAnswers / quiz.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-8 text-center"
      >
        <div className="mb-6">
          {score >= 70 ? (
            <CheckCircle className="h-20 w-20 text-green-400 mx-auto" />
          ) : (
            <XCircle className="h-20 w-20 text-red-400 mx-auto" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {score >= 70 ? 'Excellent work!' : 'Keep practicing'}
        </h2>
        <p className="text-2xl text-gray-300 mb-2">Your score: {score.toFixed(1)}%</p>
        <p className="text-gray-400">
          You answered {correctAnswers} out of {quiz.length} questions correctly.
        </p>
      </motion.div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-xl p-8"
    >
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Question {currentQuestion + 1} of {quiz.length}</p>
        <h2 className="text-2xl font-bold text-white">{question.question}</h2>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
              selectedAnswer === option
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <Button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
      >
        {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </motion.div>
  );
};

export default QuizModule;