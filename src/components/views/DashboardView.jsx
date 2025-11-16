import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DashboardView = ({ onLogout }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // ✅ CORRECCIÓN APLICADA: Llamada RPC explícita para evitar ambigüedad
      const { data: profileData, error: profileError } = await supabase
        .rpc('ensure_profile_and_get')
        .select('id, full_name, role') // Petición explícita para eliminar ambigüedad
        .single();

      if (profileError) {
        // Si el error es que no encuentra el perfil, la función debería crearlo, pero si falla por otra razón lo notificamos
        if (profileError.code !== 'PGRST116') throw profileError;
      }
      setProfile(profileData);

      // Obtener cursos asignados
      const { data: coursesData, error: coursesError } = await supabase
        .from('assigned_courses')
        .select(`
          progress_percentage,
          course:courses (
            id,
            title,
            description,
            difficulty_level
          )
        `)
        .eq('user_id', user.id);

      if (coursesError) throw coursesError;
      setAssignedCourses(coursesData);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load dashboard",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:pl-20 lg:pl-64">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1 variants={itemVariants} className="text-4xl font-bold text-text-primary mb-2">
            Welcome back, {loading ? '...' : profile?.full_name || 'Learner'}!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-text-secondary mb-8">
            Let's continue your learning journey.
          </motion.p>

          <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-text-primary mb-6">
            Your Courses
          </motion.h2>

          {loading ? (
            <p className="text-text-secondary">Loading your learning path...</p>
          ) : assignedCourses.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {assignedCourses.map(({ course, progress_percentage }) => (
                course && (
                    <motion.div
                    key={course.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="glass-panel p-6 flex flex-col justify-between"
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
                      <p className="text-sm text-text-secondary line-clamp-2">{course.description}</p>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-text-secondary">Progress</span>
                        <span className="text-sm font-semibold text-accent-primary">{progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2.5">
                        <motion.div 
                          className="bg-accent-primary h-2.5 rounded-full" 
                          initial={{ width: '0%' }}
                          animate={{ width: `${progress_percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12 glass-panel">
              <BookOpen className="mx-auto h-12 w-12 text-text-secondary" />
              <h3 className="mt-4 text-xl font-semibold text-text-primary">No Courses Assigned Yet</h3>
              <p className="mt-1 text-text-secondary">Your learning adventure awaits! An admin will assign your courses soon.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardView;