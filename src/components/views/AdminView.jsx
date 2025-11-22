import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookCopy, PlusCircle, BrainCircuit, X, Loader2, Save, Mail, Key, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { marked } from 'marked';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Main Component
const AdminView = ({ onLogout }) => {
  const { user } = useAuth();
  const [view, setView] = useState('dashboard');
  
  const renderView = () => {
    switch (view) {
      case 'users':
        return <UserManagement setView={setView} />;
      case 'courses':
        return <CourseMatrix setView={setView} />;
      default:
        return <AdminDashboard setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 md:pl-20 lg:pl-64 p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};


// 1. Admin Dashboard (Main View)
const AdminDashboard = ({ setView }) => {
  // In a real app, these would be fetched data
  const stats = {
    activeUsers: 78,
    coursesInProgress: 12,
    avgCompletion: 82,
  };

  const activityData = [4, 8, 6, 10, 7, 12, 9]; // Mock data for chart

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-text-primary">Admin Cockpit</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Courses In Progress" value={stats.coursesInProgress} />
        <StatCard title="Avg. Completion" value={`${stats.avgCompletion}%`} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="glass-panel p-6"
        >
            <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setView('courses')} className="flex-1" size="lg"><BookCopy className="mr-2 h-5 w-5" /> Course Matrix</Button>
                <Button onClick={() => setView('users')} className="flex-1" variant="outline" size="lg"><Users className="mr-2 h-5 w-5" /> User Management</Button>
            </div>
        </motion.div>
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
             className="glass-panel p-6"
        >
            <h2 className="text-xl font-semibold text-text-primary mb-4">Weekly Activity</h2>
            <div className="h-40 flex items-end justify-between px-2">
                {activityData.map((val, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / 12) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1, type: 'spring' }}
                        className="w-8 bg-accent-primary rounded-t-md"
                    />
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
    >
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-4xl font-bold text-text-primary mt-2">{value}</p>
    </motion.div>
);


// 2. Course Matrix
const CourseMatrix = ({ setView }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (error) {
            toast({ variant: "destructive", title: "Error fetching courses", description: error.message });
        } else {
            setCourses(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSuccess = () => {
        fetchCourses();
        setIsCreatorOpen(false);
    }

    return (
        <div>
            <button onClick={() => setView('dashboard')} className="inline-flex items-center gap-2 mb-6 text-accent-primary hover:underline">
                &larr; Back to Cockpit
            </button>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-text-primary">Course Matrix</h1>
                <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-5 w-5" /> Create Course</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Autonomous Course Generator</DialogTitle>
                        </DialogHeader>
                        <CourseCreator onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent-primary" /></div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <motion.div key={course.id} whileHover={{ y: -5 }} className="glass-panel p-5 flex flex-col justify-between">
                            <div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-3 inline-block ${
                                    course.difficulty_level === 'Intro' ? 'bg-green-500/20 text-green-300' :
                                    course.difficulty_level === 'Advanced' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-red-500/20 text-red-300'
                                }`}>
                                    {course.difficulty_level}
                                </span>
                                <h3 className="text-xl font-bold text-text-primary mb-2">{course.title}</h3>
                                <p className="text-sm text-text-secondary line-clamp-3">{course.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="mt-4 self-start">View Details</Button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 glass-panel">
                    <h3 className="text-xl font-semibold text-text-primary">The Matrix is empty.</h3>
                    <p className="text-text-secondary mt-2">Create your first course to begin shaping the future of learning.</p>
                </div>
            )}
        </div>
    );
};


// 3. User Management
const UserManagement = ({ setView }) => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
        if (usersError) toast({ variant: "destructive", title: "Error fetching users", description: usersError.message });
        else setUsers(usersData);

        const { data: coursesData, error: coursesError } = await supabase.from('courses').select('*');
        if (coursesError) toast({ variant: "destructive", title: "Error fetching courses", description: coursesError.message });
        else setCourses(coursesData);
        
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignCourse = async (userId, courseId, dueDate = null) => {
        if (!userId || !courseId) {
            toast({ variant: "destructive", title: "Selection missing" });
            return;
        }
        const assignmentData = { 
            user_id: userId, 
            course_id: courseId, 
            progress_percentage: 0 
        };
        if (dueDate) {
            assignmentData.due_date = dueDate;
        }
        const { error } = await supabase.from('assigned_courses').insert(assignmentData);
        if (error) {
            toast({ variant: "destructive", title: "Assignment Failed", description: error.message });
        } else {
            toast({ title: "Success!", description: "Course assigned." });
            fetchData();
        }
    };
    
    return (
        <div>
            <button onClick={() => setView('dashboard')} className="inline-flex items-center gap-2 mb-6 text-accent-primary hover:underline">
                &larr; Back to Cockpit
            </button>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-text-primary">User Management</h1>
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-5 w-5" /> Create User</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Create New User</DialogTitle>
                        </DialogHeader>
                        <CreateUserForm onSuccess={() => { setIsCreateUserOpen(false); fetchData(); }} />
                    </DialogContent>
                </Dialog>
            </div>
             {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent-primary" /></div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-glass-border">
                            <tr>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Email</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Role</th>
                                <th className="p-4 font-semibold">Assign Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-glass-border/50">
                                    <td className="p-4 font-medium">{u.full_name || 'N/A'}</td>
                                    <td className="p-4 text-sm text-text-secondary hidden md:table-cell">{u.email || 'N/A'}</td>
                                    <td className="p-4 capitalize hidden md:table-cell">{u.role || 'student'}</td>
                                    <td className="p-4">
                                        <select
                                            onChange={(e) => {
                                                const courseId = e.target.value;
                                                if (courseId) {
                                                    const dueDate = prompt("Enter due date (YYYY-MM-DD) or leave empty:");
                                                    assignCourse(u.id, courseId, dueDate || null);
                                                }
                                            }}
                                            className="bg-background border border-glass-border p-2 rounded-lg text-sm focus:ring-accent-primary focus:border-accent-primary"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a course...</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Create User Form Component
const CreateUserForm = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !fullName) {
            toast({ variant: "destructive", title: "Missing fields", description: "Please fill all required fields." });
            return;
        }

        setLoading(true);
        try {
            // Nota: Para crear usuarios sin confirmación de email desde el frontend,
            // idealmente se debería usar una Edge Function con service_role key.
            // Por ahora, usamos signUp que requiere confirmación de email.
            // En producción, crear una Edge Function 'create-user-admin' que use service_role.
            
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Failed to create user');

            // Crear perfil en la tabla profiles
            const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                full_name: fullName,
                email: email,
                role: role
            });

            if (profileError) {
                // Si el perfil ya existe, actualizar
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ full_name: fullName, role: role })
                    .eq('id', authData.user.id);
                if (updateError) throw updateError;
            }

            toast({ title: "User Created!", description: `${fullName} has been added to the system.` });
            setEmail('');
            setPassword('');
            setFullName('');
            setRole('student');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to create user", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Full Name *</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Email *</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Password *</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
                    required
                    minLength={6}
                />
            </div>
            <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Role *</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-background border border-glass-border p-2 rounded-lg text-text-primary"
                    required
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Create User
            </Button>
        </form>
    );
};

// 4. Course Creator Component (inside Dialog)
const CourseCreator = ({ onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Input, 2: Confirm
    const [isGenerating, setIsGenerating] = useState(false);
    const [rawContent, setRawContent] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [generatedCourse, setGeneratedCourse] = useState(null);

    const handleGenerate = async () => {
        if (!rawContent.trim()) {
            toast({ variant: "destructive", title: "Content is empty!" });
            return;
        }
        setIsGenerating(true);
        try {
            // ✅ CORRECCIÓN APLICADA: Llamada a la Edge Function 'create-course-ai'
            const { data, error } = await supabase.functions.invoke('create-course-ai', {
                body: { content: rawContent, title: courseTitle },
            });

            if (error) throw new Error(error.message);
            if (data.error) throw new Error(data.error);
            
            setGeneratedCourse(data);
            setStep(2);

        } catch (error) {
            toast({ variant: "destructive", title: "AI Generation Failed", description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedCourse) return;
        setIsGenerating(true);
        try {
            const { error } = await supabase.from('courses').insert([
                { 
                    title: generatedCourse.title,
                    description: generatedCourse.description,
                    difficulty_level: generatedCourse.difficulty_level,
                    content_data: generatedCourse.course_content
                }
            ]);
            if (error) throw error;

            toast({ title: "Course Saved!", description: `${generatedCourse.title} has been added to the matrix.` });
            if (onSuccess) onSuccess();
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to save course", description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };

    const resetAndGoBack = () => {
      setStep(1);
      setGeneratedCourse(null);
    }

    return (
        <div className="p-1">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-4"
                    >
                         <p className="text-sm text-text-secondary">Paste any text content (article, document, notes) and let AI structure it into a course.</p>
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Course Title (Optional)</label>
                            <input
                                type="text"
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                placeholder="Let AI decide or enter a title..."
                                className="w-full bg-background border border-glass-border p-2 rounded-lg mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Content</label>
                            <textarea
                                value={rawContent}
                                onChange={(e) => setRawContent(e.target.value)}
                                placeholder="Paste your content here..."
                                className="w-full h-48 bg-background border border-glass-border p-2 rounded-lg mt-1"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                            {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
                            Generate with AI
                        </Button>
                    </motion.div>
                )}

                {step === 2 && generatedCourse && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="text-xl font-bold mb-4">AI Generated Preview</h3>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 glass-panel-inset rounded-lg">
                            <h4 className="font-semibold">Title: <span className="font-normal">{generatedCourse.title}</span></h4>
                            <p className="font-semibold">Description: <span className="font-normal">{generatedCourse.description}</span></p>
                            <p className="font-semibold">Difficulty: <span className="font-normal">{generatedCourse.difficulty_level}</span></p>
                            <div className="prose prose-invert prose-sm">
                                <h4 className="font-semibold">Content Preview:</h4>
                                <div dangerouslySetInnerHTML={{ __html: marked.parse(generatedCourse.course_content.substring(0, 500) + '...') }} />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={resetAndGoBack} variant="outline" className="w-full">
                                <X className="mr-2 h-4 w-4" /> Discard & Edit
                            </Button>
                            <Button onClick={handleSave} disabled={isGenerating} className="w-full">
                                {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Save to Matrix
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminView;