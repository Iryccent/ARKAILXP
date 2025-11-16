import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Loader2, BookOpen } from 'lucide-react';
import CourseCard from '@/components/dashboard/CourseCard';

const CoursesView = ({ onLogout }) => {
  const { user } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      
      setAssignedCourses(data);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load courses",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAssignedCourses();
  }, [fetchAssignedCourses]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:pl-20 lg:pl-64">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Your Learning Path</h1>
          <p className="text-lg text-text-secondary mb-8">All your assigned courses, ready for you to dive in.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-accent-primary" />
          </div>
        ) : assignedCourses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {assignedCourses.map(({ course, progress_percentage }, index) => (
              course && (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progress_percentage}
                  index={index}
                />
              )
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-panel"
          >
            <BookOpen className="mx-auto h-16 w-16 text-text-secondary" />
            <h3 className="mt-6 text-2xl font-semibold text-text-primary">Your Path is Clear!</h3>
            <p className="mt-2 text-text-secondary">It looks like you don't have any courses assigned yet.</p>
            <p className="text-sm text-text-secondary/80">An admin will assign your courses soon. Your adventure awaits!</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CoursesView;