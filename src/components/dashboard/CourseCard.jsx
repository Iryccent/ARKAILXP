import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course, progress, index }) => {
  const progressRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
    }, 500 + index * 100);
    return () => clearTimeout(timer);
  }, [progress, index]);

  const handleContinue = () => {
    navigate(`/course/${course.id}`);
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, delay: 0.1 * index }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="glass-panel p-6 flex flex-col justify-between min-h-[300px]"
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-3 inline-block ${
          course.difficulty_level === 'Intro' ? 'bg-green-500/20 text-green-300' :
          course.difficulty_level === 'Advanced' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-red-500/20 text-red-300'
        }`}>
          {course.difficulty_level || 'Standard'}
        </span>
        <h3 className="text-xl font-bold text-text-primary mb-2">{course.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 flex-grow">{course.description}</p>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-xs font-medium text-text-secondary">Progress</span>
          <span className="text-xs font-semibold text-text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-1000 ease-out"
            style={{ width: '0%' }}
          />
        </div>

        <Button onClick={handleContinue} className="mt-4 w-full">
          Continue Learning
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;