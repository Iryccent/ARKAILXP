import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import QuizBuilder from '@/components/admin/QuizBuilder';

const SandboxView = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <div className="view entering flex min-h-screen bg-transparent">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:pl-20 lg:pl-64 overflow-y-auto">
        <div className="quiz-builder-container">
          <h1 className="builder-title text-4xl font-bold text-text-primary mb-2">Autonomous Quiz Generator</h1>
          <p className="text-lg text-text-secondary mb-8">Let KAI's intelligence build assessments for you. Just provide the content.</p>
          <QuizBuilder />
        </div>
      </main>
    </div>
  );
};

export default SandboxView;