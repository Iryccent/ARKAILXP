import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Sparkles, Shield, Gem, Crown } from 'lucide-react';

// --- BACKGROUND SYSTEM COMPONENTS ---
const BackgroundSystem = ({ activeId }) => {
    return (
        <>
            {/* BG 1: Teal Horizon */}
            <div 
                className={`fixed inset-0 z-0 transition-opacity duration-1000 ${activeId === 1 ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'radial-gradient(circle at 50% 100%, #0f766e 0%, #022c22 25%, #000000 60%)' }}
            >
                <div className="absolute bottom-0 left-0 right-0 h-px shadow-[0_0_80px_30px_rgba(45,212,191,0.4)]"></div>
                <div className="stars"></div>
            </div>

            {/* BG 2: Deep Space */}
            <div 
                className={`fixed inset-0 z-0 transition-opacity duration-1000 ${activeId === 2 ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    background: 'radial-gradient(circle at 20% 50%, #312e81 0%, #000000 70%), radial-gradient(circle at 80% 20%, #4c1d95 0%, transparent 50%)'
                }}
            >
                <div className="stars"></div>
            </div>

            {/* BG 3: Midnight Aurora */}
            <div 
                className={`fixed inset-0 z-0 transition-opacity duration-1000 ${activeId === 3 ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'linear-gradient(to bottom, #020617, #0f172a)' }}
            >
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(56,189,248,0.05)_0%,transparent_60%)] animate-pulse"></div>
                <div className="stars"></div>
            </div>
        </>
    );
};

const LeadershipBadge = ({ level }) => {
    if (level < 1) return null;
    
    const config = {
        1: { text: "InnerCircle", color: "text-pink-400", icon: <Gem className="w-3 h-3" /> },
        2: { text: "Leadership", color: "text-amber-400", icon: <Shield className="w-3 h-3" /> },
        3: { text: "Leadership", color: "text-amber-400", icon: <Shield className="w-3 h-3" /> },
        4: { text: "CEO / Full Access", color: "text-purple-400", icon: <Crown className="w-3 h-3" /> }
    }[level] || { text: "Member", color: "text-gray-400", icon: null };

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${config.color}`}>
            {config.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{config.text}</span>
        </div>
    );
};

const DashboardView = ({
  courses = [],
  onSelectCourse,
  onAddCourse,
  userRole,
  userName,
  onNavigateToASL,
  aslLevel = 1,
  onLogout,
  totalCoursesCount = 0,
  assignedCoursesCount = 0
}) => {

  const [bgId, setBgId] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
        
        {/* Background System */}
        <BackgroundSystem activeId={bgId} />

        {/* Background Switcher (Top Right) */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button onClick={() => setBgId(1)} className={`w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform ${bgId === 1 ? 'bg-teal-500 ring-2 ring-teal-500/50' : 'bg-teal-900'}`} title="Teal Horizon"></button>
            <button onClick={() => setBgId(2)} className={`w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform ${bgId === 2 ? 'bg-indigo-500 ring-2 ring-indigo-500/50' : 'bg-indigo-900'}`} title="Deep Space"></button>
            <button onClick={() => setBgId(3)} className={`w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform ${bgId === 3 ? 'bg-slate-500 ring-2 ring-slate-500/50' : 'bg-slate-900'}`} title="Aurora"></button>
        </div>

        <div className="relative z-10 h-screen flex flex-col md:flex-row">
            
            {/* SIDEBAR (Glass style) */}
            <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-md">
                <div className="h-20 flex items-center justify-center border-b border-white/10 px-4">
                   <img 
                      src="https://i.imgur.com/yzthc2y.png" 
                      alt="ARKAI Logo" 
                      className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                   />
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg border-l-2 transition-all ${activeTab === 'dashboard' ? 'text-white bg-white/10 border-indigo-500' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                    >
                        <div className="w-5 text-center">📊</div> Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('courses')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg border-l-2 transition-all ${activeTab === 'courses' ? 'text-white bg-white/10 border-indigo-500' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                    >
                        <div className="w-5 text-center">📚</div> Courses
                    </button>

                    {(userRole?.toLowerCase() === 'manager' || userRole?.toLowerCase() === 'admin') && (
                         <button 
                            onClick={onNavigateToASL}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border-l-2 border-transparent transition-all"
                        >
                            <div className="w-5 text-center">🛡️</div> Admin Panel
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* HEADER */}
                <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-between px-8">
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">ARKAI Learning Command Center</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span>Good Morning, <strong className="text-white">{userName}</strong></span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <LeadershipBadge level={aslLevel} />
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                         <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        
                        {/* HERO BANNER (Cinematic) */}
                        <div className="lg:col-span-3 xl:col-span-4 relative w-full h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                             {/* Abstract Background Image */}
                             <img 
                                src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2560&auto=format&fit=crop" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" 
                                alt="Ecosystem" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                             
                             <div className="absolute inset-0 flex flex-col justify-center px-8">
                                 <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ARKAI Ecosystem</h1>
                                 <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
                                     Centralized learning command center. Access your modules, manage assessments, and track team performance with AI-driven insights.
                                 </p>
                             </div>
                        </div>

                        {/* LEFT COLUMN (Main Content) */}
                        <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                             
                             {/* COURSES (Glass Cards) */}
                             <div className="glass-card-premium p-6 md:col-span-2 rounded-3xl">
                                 <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-3">
                                     <Sparkles className="w-5 h-5 text-indigo-400" />
                                     <h3 className="font-semibold text-white text-sm">Active Modules</h3>
                                 </div>
                                 
                                 {assignedCoursesCount === 0 ? (
                                     <div className="p-8 text-center text-gray-500 italic bg-white/5 rounded-xl border border-dashed border-white/10">
                                         No active modules assigned. Visit the library to enroll.
                                     </div>
                                 ) : (
                                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                         {courses.map(course => (
                                             <motion.div 
                                                key={course.id}
                                                whileHover={{ y: -4 }}
                                                onClick={() => onSelectCourse(course)}
                                                className="group flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-900/20 hover:border-indigo-500/30 transition-all cursor-pointer h-full"
                                             >
                                                 <div className="h-32 w-full rounded-lg overflow-hidden mb-3 relative">
                                                     {course.imageUrl ? (
                                                        <img src={course.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={course.title} />
                                                     ) : (
                                                        <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-2xl">
                                                            {course.title.charAt(0)}
                                                        </div>
                                                     )}
                                                 </div>
                                                 <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{course.title}</h4>
                                                 <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{course.description}</p>
                                                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                     <div className="h-full bg-indigo-500 w-1/3"></div>
                                                 </div>
                                             </motion.div>
                                         ))}
                                     </div>
                                 )}
                             </div>

                             {/* SYSTEM STATUS */}
                             <div className="glass-card-premium p-6 flex flex-col justify-between rounded-3xl">
                                 <div>
                                     <div className="flex items-center gap-3 mb-3">
                                         <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                                             <span className="text-xs">⚡</span>
                                         </div>
                                         <h3 className="font-semibold text-white text-sm">System Status</h3>
                                     </div>
                                     <div className="space-y-3">
                                         <div className="flex justify-between text-xs">
                                             <span className="text-gray-400">Neural Engine</span>
                                             <span className="text-green-400 font-mono">ONLINE</span>
                                         </div>
                                         <div className="flex justify-between text-xs">
                                             <span className="text-gray-400">Latency</span>
                                             <span className="text-white font-mono">24ms</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="mt-4 h-16 w-full bg-black/20 rounded-lg relative overflow-hidden flex items-end justify-between px-1 pb-1">
                                     {[40, 70, 50, 90, 60, 80, 50, 75, 45, 60].map((h, i) => (
                                         <div key={i} style={{ height: `${h}%` }} className="w-1.5 bg-yellow-500/50 rounded-t-sm"></div>
                                     ))}
                                 </div>
                             </div>

                        </div>

                        {/* RIGHT COLUMN (Tools) */}
                        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                             
                             {/* CALENDAR */}
                             <div className="glass-card-premium p-5 rounded-3xl">
                                 <div className="flex justify-between items-end mb-4">
                                     <div>
                                         <span className="text-4xl font-bold text-white tracking-tight">{new Date().getDate()}</span>
                                         <span className="text-sm text-gray-400 ml-1 uppercase tracking-wide">{new Date().toLocaleString('default', { month: 'long' })}</span>
                                     </div>
                                     <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest border border-indigo-500/30 px-2 py-0.5 rounded">Today</span>
                                 </div>
                                 <div className="space-y-3 pt-3 border-t border-white/10">
                                     <div className="flex gap-3 items-start group cursor-pointer">
                                         <div className="w-1 h-8 bg-indigo-500 rounded-full mt-1 group-hover:h-10 transition-all"></div>
                                         <div>
                                             <p className="text-xs text-white font-medium group-hover:text-indigo-300 transition-colors">Daily Knowledge Sync</p>
                                             <p className="text-[10px] text-gray-500">10:00 AM</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* LIBRARY STATS */}
                             <div className="glass-card-premium p-5 rounded-3xl">
                                 <h3 className="font-semibold text-white text-sm mb-4">Library Pulse</h3>
                                 <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                        <span className="text-xs text-gray-400">Assigned</span>
                                        <span className="text-lg font-bold text-white">{assignedCoursesCount}</span>
                                    </div>
                                    {(userRole?.toLowerCase() === 'manager' || userRole?.toLowerCase() === 'admin') && (
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <span className="text-xs text-gray-400">Total DB</span>
                                            <span className="text-lg font-bold text-indigo-400">{totalCoursesCount}</span>
                                        </div>
                                    )}
                                 </div>
                             </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};

export default DashboardView;