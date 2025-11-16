import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { marked } from 'marked';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) {
            throw error;
        }

        if (data) {
          setCourse(data);
        } else {
            toast({
                variant: "destructive",
                title: "Course not found",
                description: "This course doesn't exist or you don't have access.",
            });
            navigate('/courses');
        }

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading course",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!course) {
    return null; // Return null because toast and navigation are handled in the effect
  }


  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
             <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Courses
            </Button>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-3 inline-block ${
                course.difficulty_level === 'Intro' ? 'bg-green-500/20 text-green-300' :
                course.difficulty_level === 'Advanced' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
            }`}>
                {course.difficulty_level}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">{course.title}</h1>
            <p className="text-lg text-text-secondary mb-8">{course.description}</p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="prose prose-lg prose-invert max-w-none mt-8 glass-panel p-8"
            dangerouslySetInnerHTML={{ __html: marked.parse(course.content_data || '') }}
        />
      </main>
    </div>
  );
};

export default CourseView;