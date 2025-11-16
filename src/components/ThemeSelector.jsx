import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/styles/themes';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeSelector = () => {
  const { setTheme, theme: currentTheme } = useTheme();

  const lightThemes = Object.entries(themes).filter(([, details]) => details.type === 'light');
  const darkThemes = Object.entries(themes).filter(([, details]) => details.type === 'dark');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const ThemeGroup = ({ title, themes, icon: Icon }) => (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-text-secondary">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {themes.map(([key, details]) => (
          <motion.div key={key} variants={itemVariants}>
            <button
              onClick={() => setTheme(key)}
              className={`w-full h-24 rounded-lg flex flex-col justify-end p-2 text-left transition-all duration-300 border-2 ${
                currentTheme === key ? 'border-accent-primary scale-105' : 'border-transparent hover:border-accent-primary/50'
              }`}
              style={{ background: details.preview }}
            >
              <span className="text-sm font-medium text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {details.name}
              </span>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 p-2">
      <ThemeGroup title="Day Themes" themes={lightThemes} icon={Sun} />
      <ThemeGroup title="Night Themes" themes={darkThemes} icon={Moon} />
    </div>
  );
};

export default ThemeSelector;