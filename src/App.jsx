import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import GateView from '@/components/views/GateView';
import DashboardView from '@/components/views/DashboardView';
import CoursesView from '@/components/views/CoursesView';
import CourseView from '@/components/views/CourseView';
import AdminView from '@/components/views/AdminView';
import AdminASLView from '@/components/views/AdminASLView'; // New Import
import SandboxView from '@/components/views/SandboxView';
import ProfileView from '@/components/views/ProfileView';
import QuizBuilder from '@/components/admin/QuizBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import GlobalControls from '@/components/GlobalControls';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import KaiCompanion from '@/components/kai/KaiCompanion';
import IntroVideo from '@/components/IntroVideo';
import { useUsers } from '@/hooks/useUsers';

function App() {
  const { user, loading, signOut } = useAuth();
  const { users, createUser, updateUser, deleteUser, getCurrentUserProfile } = useUsers();
  const [introCompleted, setIntroCompleted] = useState(() => {
    return localStorage.getItem('intro_completed') === 'true';
  });
  const [userProfile, setUserProfile] = useState(null);

  // Helper function to determine if user is admin
  const isAdmin = (user) => {
    if (!user) return false;
    // Check metadata first
    if (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'Manager') return true;
    // Hardcoded admin emails
    const adminEmails = ['jadrielrod@gmail.com', 'jadriel@iryccent.com'];
    return adminEmails.includes(user.email);
  };

  // Get user role with fallback
  const getUserRole = (user) => {
    if (!user) return 'User';
    if (userProfile) return userProfile.role;
    if (isAdmin(user)) return 'Manager';
    return user.user_metadata?.role || 'User';
  };

  // Get ASL level with fallback
  const getASLLevel = (user) => {
    if (!user) return 1;
    if (userProfile) return userProfile.asl_level;
    if (isAdmin(user)) return 4; // Admins get full access
    return user.user_metadata?.asl || 1;
  };

  // Get user name
  const getUserName = (user) => {
    if (!user) return 'User';
    if (userProfile) return userProfile.name;
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  // Load user profile from database
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.id) {
        console.log('🔍 Loading profile for user:', user.email);
        const { data } = await getCurrentUserProfile(user.id);
        console.log('👤 User profile loaded:', data);
        if (data) {
          setUserProfile(data);
        } else {
          console.log('⚠️ No profile found, user might need to be created in DB');
        }
      } else {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleIntroComplete = () => {
    setIntroCompleted(true);
    localStorage.setItem('intro_completed', 'true');
  };

  const handleLogout = async () => {
    setUserProfile(null);
    await signOut();
  };

  const handleAddCourse = (course) => {
    console.log("Course added:", course);
    // In a real app, this would save to Supabase
  };

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020205] text-white">Loading...</div>}>
      <Helmet>
        <title>ARKAI LXP - AI Learning Experience Platform</title>
        <meta name="description" content="AI-powered learning platform for modern teams." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Rajdhani:wght@300;600&display=swap" rel="stylesheet" />
      </Helmet>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#020205]">
          <div className="text-2xl text-white">Loading...</div>
        </div>
      ) : (
        <>
          {!introCompleted && (
            <IntroVideo onComplete={handleIntroComplete} />
          )}

          {introCompleted && (
            <>
              <GlobalControls />

              <Router>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <PageWrapper><GateView /></PageWrapper>} />
                    <Route path="/dashboard" element={user ? <PageWrapper>
                      <DashboardView
                        courses={[]}
                        onSelectCourse={(course) => window.location.href = `/course/${course.id}`}
                        onAddCourse={handleAddCourse}
                        userRole={getUserRole(user)}
                        userName={getUserName(user)}
                        aslLevel={getASLLevel(user)}
                        onNavigateToASL={() => window.location.href = '/admin/asl'}
                        onLogout={handleLogout}
                        totalCoursesCount={0}
                        assignedCoursesCount={0}
                      />
                    </PageWrapper> : <Navigate to="/" />} />

                    <Route path="/courses" element={user ? <PageWrapper><CoursesView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
                    <Route path="/course/:courseId" element={user ? <PageWrapper><CourseView user={user} /></PageWrapper> : <Navigate to="/" />} />

                    {/* Legacy Admin View - Keeping for reference or fallback */}
                    <Route path="/admin" element={user && isAdmin(user) ? <PageWrapper><AdminView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/dashboard" />} />

                    {/* NEW Admin ASL View */}
                    <Route path="/admin/asl" element={user ? <PageWrapper>
                      <AdminASLView
                        onBack={() => window.location.href = '/dashboard'}
                        onAddCourse={handleAddCourse}
                        courses={[]}
                        members={users}
                        onCreateUser={createUser}
                        onUpdateUser={updateUser}
                        onDeleteUser={deleteUser}
                      />
                    </PageWrapper> : <Navigate to="/" />} />

                    <Route path="/admin/quiz-builder" element={user ? <PageWrapper><QuizBuilder user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/dashboard" />} />
                    <Route path="/sandbox" element={user ? <PageWrapper><SandboxView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
                    <Route path="/profile" element={user ? <PageWrapper><ProfileView user={user} onLogout={handleLogout} /></PageWrapper> : <Navigate to="/" />} />
                  </Routes>
                </AnimatePresence>
              </Router>

              {user && <KaiCompanion />}

              <Toaster />
            </>
          )}
        </>
      )}
    </Suspense>
  );
}

export default App;