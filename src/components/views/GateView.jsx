import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LogIn, Mail, Key, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const GateView = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    
    const action = isSignUp ? signUp : signIn;
    await action(email, password);

    // The loading state is reset regardless of outcome,
    // as navigation or a toast will indicate the result.
    setIsLoading(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md mx-auto"
      >
        <div className="relative z-10 text-center mb-8">
          <motion.div
            variants={item}
            className="flex justify-center mb-4"
          >
            <img 
              src="https://i.imgur.com/yzthc2y.png" 
              alt="ARKAI Logo" 
              className="h-20 md:h-24 w-auto object-contain"
            />
          </motion.div>
          <motion.p variants={item} className="text-lg text-text-secondary">
            {t('gate.subtitle')}
          </motion.p>
        </div>

        <motion.div variants={item} className="glass-panel p-8">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-text-secondary mb-6">
            {isSignUp ? 'Fill in your details to get started.' : 'Sign in to continue your journey.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-glass-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
              />
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-glass-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
              />
            </div>
             {isSignUp && (
                <motion.div 
                  initial={{opacity: 0, y: -10}}
                  animate={{opacity: 1, y: 0}}
                  className="flex items-start gap-3 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20"
                >
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0"/>
                    <p className="text-xs text-yellow-300">
                        After signing up, please check your email inbox (and spam folder) for a confirmation link to activate your account.
                    </p>
                </motion.div>
            )}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-primary text-white shadow-lg shadow-accent-primary/20 hover:bg-accent-primary/90 rounded-[18px] px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              <LogIn size={18} />
              <span>{isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GateView;