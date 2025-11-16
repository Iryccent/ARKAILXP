import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import GateView from '@/components/views/GateView';
import DashboardView from '@/components/views/DashboardView';
import CoursesView from '@/components/views/CoursesView'; // Import the new view
import CourseView from '@/components/views/CourseView';
import AdminView from '@/components/views/AdminView';
import SandboxView from '@/components/views/SandboxView';
import ProfileView from '@/components/views/ProfileView';
import QuizBuilder from '@/components/admin/QuizBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import GlobalControls from '@/components/GlobalControls';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import KaiCompanion from '@/components/kai/KaiCompanion';

function App() {
  const { user, loading, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-text-primary">Loading...</div>
      </div>
    );
  }

  const PageWrapper = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Helmet>
        <title>ARKAI LXP - AI Learning Experience Platform</title>
        <meta name="description" content="AI-powered learning platform for modern teams." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Rajdhani:wght@300;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <GlobalControls />

      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <PageWrapper><GateView /></PageWrapper>} />
            <Route path="/dashboard" element={user ? <PageWrapper><DashboardView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/courses" element={user ? <PageWrapper><CoursesView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} /> {/* Add the new route */}
            <Route path="/course/:courseId" element={user ? <PageWrapper><CourseView user={user} /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/admin" element={user && user.user_metadata?.role === 'admin' ? <PageWrapper><AdminView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/dashboard" />} />
            <Route path="/admin/quiz-builder" element={user && user.user_metadata?.role === 'admin' ? <PageWrapper><QuizBuilder user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/dashboard" />} />
            <Route path="/sandbox" element={user ? <PageWrapper><SandboxView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <PageWrapper><ProfileView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Router>
      
      {user && <KaiCompanion />}

      <Toaster />
    </Suspense>
  );
}

export default App;