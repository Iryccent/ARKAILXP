import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Languages, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GlobalControls = () => {
  const [isThemeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [isLangSelectorOpen, setLangSelectorOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setLangSelectorOpen(true)}
          className="neu-icon"
          aria-label="Change language"
        >
          <Languages size={20} />
        </button>
        <LanguageSelector
          isOpen={isLangSelectorOpen}
          onClose={() => setLangSelectorOpen(false)}
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setThemeSelectorOpen(true)}
          className="neu-icon"
          aria-label="Change theme"
        >
          <Palette size={20} />
        </button>
        <ThemeSelector
          isOpen={isThemeSelectorOpen}
          onClose={() => setThemeSelectorOpen(false)}
        />
      </div>
    </div>
  );
};

const ThemeSelector = ({ isOpen, onClose }) => {
  const { theme, setTheme, themes } = useTheme();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleThemeChange = (newThemeKey) => {
    setTheme(newThemeKey);
    toast({
      title: t('toasts.themeChanged.title', { theme: themes[newThemeKey].name }),
      description: t('toasts.themeChanged.description'),
    });
    onClose();
  };

  const lightThemes = Object.entries(themes).filter(([, val]) => val.type === 'light');
  const darkThemes = Object.entries(themes).filter(([, val]) => val.type === 'dark');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full right-0 mt-2 w-72 origin-top-right glass-panel p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-text-primary">Select Theme</h3>
            <button onClick={onClose} className="neu-icon !p-1.5">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto pr-2">
            <p className="text-xs font-bold uppercase text-text-secondary mb-2">Radiant Day</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {lightThemes.map(([key, value]) => (
                <ThemeButton key={key} themeKey={key} currentTheme={theme} onSelect={handleThemeChange} themeInfo={value} />
              ))}
            </div>
            <p className="text-xs font-bold uppercase text-text-secondary mb-2">Dark Cosmos</p>
            <div className="grid grid-cols-2 gap-2">
              {darkThemes.map(([key, value]) => (
                <ThemeButton key={key} themeKey={key} currentTheme={theme} onSelect={handleThemeChange} themeInfo={value} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThemeButton = ({ themeKey, currentTheme, onSelect, themeInfo }) => {
  return (
    <button
      onClick={() => onSelect(themeKey)}
      className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
        currentTheme === themeKey ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/10'
      }`}
    >
      {themeInfo.name}
    </button>
  );
};

const LanguageSelector = ({ isOpen, onClose }) => {
    const { i18n, t } = useTranslation();
    const { toast } = useToast();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('arkai-lang', lng);
        const langName = new Intl.DisplayNames([lng], { type: 'language' }).of(lng);
        toast({
            title: t('toasts.langChanged.title', { lang: langName.charAt(0).toUpperCase() + langName.slice(1) }),
            description: t('toasts.langChanged.description'),
        });
        onClose();
    };

    const languages = [{code: 'en', name: 'English'}, {code: 'es', name: 'Español'}];

    return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full right-0 mt-2 w-48 origin-top-right glass-panel p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-text-primary">Language</h3>
            <button onClick={onClose} className="neu-icon !p-1.5">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                  i18n.language === lang.code ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/10'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    );
}

export default GlobalControls;