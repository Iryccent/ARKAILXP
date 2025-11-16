import React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';

const MenuConfig = ({ config, setConfig, onGenerate, loading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: name === 'length' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="glass-panel p-6 lg:p-8 h-fit">
      <h2 className="text-xl font-semibold text-text-primary mb-6">2. Configure Quiz Parameters</h2>

      <div className="space-y-6">
        {/* Length */}
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-text-secondary mb-2">
            Length (# of Questions)
          </label>
          <select 
            id="length" 
            name="length" 
            value={config.length} 
            onChange={handleInputChange}
            disabled={loading}
            className="w-full bg-background/50 border border-glass-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-accent-primary/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value={5}>5 Questions (Quick)</option>
            <option value={10}>10 Questions (Standard)</option>
            <option value={20}>20 Questions (Extended)</option>
          </select>
        </div>

        {/* Complexity */}
        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-text-secondary mb-2">
            Complexity
          </label>
          <select 
            id="complexity" 
            name="complexity" 
            value={config.complexity} 
            onChange={handleInputChange}
            disabled={loading}
            className="w-full bg-background/50 border border-glass-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-accent-primary/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Custom Instructions */}
        <div>
          <label htmlFor="customInstructions" className="block text-sm font-medium text-text-secondary mb-2">
            Special Instructions for Gemini
          </label>
          <textarea
            id="customInstructions"
            name="customInstructions"
            className="w-full bg-background/50 border border-glass-border p-3 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            value={config.customInstructions}
            onChange={handleInputChange}
            placeholder="Ex: 'Focus on key dates' or 'Create true/false questions'."
            rows="3"
            disabled={loading}
          />
        </div>

        {/* Generate Button */}
        <Button 
          onClick={onGenerate} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-5 w-5" />
              Generate Quiz
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MenuConfig;