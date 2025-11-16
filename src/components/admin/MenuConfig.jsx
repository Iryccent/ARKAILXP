import React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';

const MenuConfig = ({ config, setConfig, onGenerate, isGenerating }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: name === 'length' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">2. Configure Quiz Parameters</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-text-secondary mb-1">Length (# of Questions)</label>
          <select id="length" name="length" value={config.length} onChange={handleInputChange} className="w-full bg-background/50 border border-glass-border p-2 rounded-lg text-text-primary focus:ring-2 focus:ring-accent-primary/50 focus:outline-none">
            <option value={5}>5 Questions (Quick)</option>
            <option value={10}>10 Questions (Standard)</option>
            <option value={20}>20 Questions (Extended)</option>
          </select>
        </div>

        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-text-secondary mb-1">Complexity</label>
          <select id="complexity" name="complexity" value={config.complexity} onChange={handleInputChange} className="w-full bg-background/50 border border-glass-border p-2 rounded-lg text-text-primary focus:ring-2 focus:ring-accent-primary/50 focus:outline-none">
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="customInstructions" className="block text-sm font-medium text-text-secondary mb-1">Special Instructions for Gemini</label>
        <textarea
          id="customInstructions"
          name="customInstructions"
          className="w-full bg-background/50 border border-glass-border p-2 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 min-h-[100px]"
          value={config.customInstructions}
          onChange={handleInputChange}
          placeholder="Ex: 'Focus on key dates' or 'Create true/false questions'."
          rows="3"
        />
      </div>

      <Button onClick={onGenerate} disabled={isGenerating} className="w-full" size="lg">
        {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
        Generate Quiz
      </Button>
    </div>
  );
};

export default MenuConfig;