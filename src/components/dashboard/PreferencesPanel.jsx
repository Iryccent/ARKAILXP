import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PreferencesPanel = () => {
  const [isRadiantMode, setIsRadiantMode] = useState(false);

  const toggleTheme = () => {
    setIsRadiantMode(prev => !prev);
    document.body.classList.toggle('radiant-mode');
    
    toast({
      title: `Theme changed to ${!isRadiantMode ? 'Radiant' : 'Dark'}`,
      description: `Enjoy the new look!`,
    })
  };

  return (
    <div className="glass-panel p-2 rounded-full flex items-center justify-between">
      <div className="neumorphic-switch">
        <input 
          type="checkbox" 
          id="theme-switch" 
          className="switch-checkbox hidden"
          checked={isRadiantMode}
          onChange={toggleTheme}
        />
        <label htmlFor="theme-switch" className={`switch-track !w-auto flex items-center p-1 rounded-full ${isRadiantMode ? 'radiant-mode-neumorphic' : 'dark-mode-neumorphic'}`}>
          <div className="flex items-center gap-1">
             <div className={`p-2 rounded-full transition-colors ${!isRadiantMode ? 'bg-slate-600/50' : ''}`}>
                <Moon className="h-5 w-5" style={{ color: !isRadiantMode ? 'var(--accent-cyan)' : 'var(--text-dark)'}}/>
             </div>
             <div className={`p-2 rounded-full transition-colors ${isRadiantMode ? 'bg-slate-200/50' : ''}`}>
                <Sun className="h-5 w-5" style={{ color: isRadiantMode ? 'var(--accent-orange)' : 'var(--text-dark)'}} />
             </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PreferencesPanel;