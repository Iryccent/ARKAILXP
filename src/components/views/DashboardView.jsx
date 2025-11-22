import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Calendar, FileText, Briefcase, Database, Shield, ExternalLink, Save } from 'lucide-react';

const DashboardView = ({
  courses,
  onSelectCourse,
  onAddCourse,
  userRole,
  userName,
  onNavigateToASL,
  aslLevel,
  onLogout,
  totalCoursesCount,
  assignedCoursesCount
}) => {

  const currentDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen p-4 lg:p-8 flex gap-8 bg-[#020205] text-white overflow-hidden">

      {/* --- SIDEBAR --- */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 hidden lg:flex flex-col border-r border-white/5 pr-6"
      >
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-bold tracking-widest text-cyan-400 arkai-logo">ARKAI</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium shadow-lg shadow-cyan-900/10 flex items-center gap-3">
            <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
            Dashboard
          </button>
          {userRole === 'admin' || userRole === 'Manager' ? (
            <button
              onClick={onNavigateToASL}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
            >
              Admin Panel
            </button>
          ) : null}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors pl-4 mt-auto mb-4"
        >
          <LogOut size={16} /> Logout
        </button>
      </motion.div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-8">
          <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <span>Good Morning, <strong className="text-white">{userName}</strong></span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>{userRole === 'Manager' ? 'System Auditor' : 'Team Member'}</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="text-cyan-500 font-mono">ASL {aslLevel || 1}</span>
          </div>
        </header>

        {/* HERO BANNER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full h-48 rounded-3xl relative overflow-hidden mb-8 border border-white/10 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80 z-10"></div>
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Banner" />

          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-2">RightWay Ecosystem</h1>
            <p className="text-blue-100 max-w-2xl">
              Centralized operations command center. Access your tools, manage compliance, and oversee team performance with AI-driven insights.
            </p>
          </div>
        </motion.div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN (APPS) */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROPRIETARY APPS */}
            <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12]">
              <div className="flex items-center gap-2 mb-6 opacity-70">
                <span className="text-xs font-bold tracking-widest uppercase text-white">IRYCCENT</span>
                <span className="text-xs text-gray-400">Small Business Builders - Proprietary APPS</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 rounded-2xl bg-[#13131F] border border-white/5 hover:border-cyan-500/30 hover:bg-[#1A1A25] transition-all group flex flex-col items-center justify-center gap-3 h-32">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-white">Action Plans</div>
                    <div className="text-[10px] text-gray-500">by Reason Hub</div>
                  </div>
                </button>

                <button className="p-4 rounded-2xl bg-[#13131F] border border-white/5 hover:border-amber-500/30 hover:bg-[#1A1A25] transition-all group flex flex-col items-center justify-center gap-3 h-32">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-white">BoP The Intake!</div>
                  </div>
                </button>

                <button className="p-4 rounded-2xl bg-[#13131F] border border-white/5 hover:border-purple-500/30 hover:bg-[#1A1A25] transition-all group flex flex-col items-center justify-center gap-3 h-32">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Database size={20} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-white">ARKAI LXP</div>
                  </div>
                </button>
              </div>
            </div>

            {/* ZOHO & RESOURCES ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ZOHO */}
              <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-black font-bold text-xs">Z</div>
                    <h3 className="font-bold text-white">Zoho Axis</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    Unified launcher for the entire Zoho ecosystem suite. One-click access to CRM, Books, Mail, and more.
                  </p>
                </div>
                <button className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                  <ExternalLink size={14} /> Launch Suite
                </button>
              </div>

              {/* LLC RESOURCES */}
              <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12]">
                <div className="flex items-center gap-2 mb-4 text-green-400">
                  <Shield size={16} />
                  <h3 className="font-bold text-white text-sm">LLC Resources</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-3 py-2 rounded-lg bg-[#13131F] border border-white/5 hover:border-orange-500/30 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-orange-500">☀</span> Sunbiz
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-[#13131F] border border-white/5 hover:border-blue-500/30 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-blue-500">⚖</span> IRS
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-[#13131F] border border-white/5 hover:border-green-500/30 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-green-500">💵</span> FinCEN
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-[#13131F] border border-white/5 hover:border-indigo-500/30 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-indigo-500">💼</span> SBA
                  </button>
                </div>
              </div>
            </div>

            {/* MANUALS */}
            <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12]">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                <span className="text-xs font-bold tracking-widest uppercase text-white">IRYCCENT</span>
                <span className="text-xs text-gray-400">Procedures and Manuals</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl bg-[#13131F] border border-white/5 hover:bg-[#1A1A25] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400">📖</span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Master Ops Manual</span>
                  </div>
                  <span className="text-gray-600 group-hover:text-white transition-colors">→</span>
                </button>
                <button className="p-4 rounded-xl bg-[#13131F] border border-white/5 hover:bg-[#1A1A25] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400">☰</span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">SOP General Manuals</span>
                  </div>
                  <span className="text-gray-600 group-hover:text-white transition-colors">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (WIDGETS) */}
          <div className="space-y-6">

            {/* CALENDAR */}
            <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-4xl font-bold text-white">22</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">NOVIEMBRE</div>
                </div>
                <div className="px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">TODAY</div>
              </div>

              <div className="space-y-4">
                <div className="pl-3 border-l-2 border-purple-500">
                  <div className="text-sm font-bold text-white">System Audit Review</div>
                  <div className="text-xs text-gray-500">14:00 - 15:30</div>
                </div>
              </div>

              {/* Grid Dots Decoration */}
              <div className="mt-6 grid grid-cols-6 gap-2 opacity-20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-gray-500 mx-auto"></div>
                ))}
              </div>
            </div>

            {/* QUICK NOTES */}
            <div className="glass-panel p-6 rounded-3xl bg-[#0A0A12] flex-1 min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-pink-400">
                  <Settings size={16} />
                  <h3 className="font-bold text-white text-sm">Quick Notes</h3>
                </div>
                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-white transition-colors">Save</button>
              </div>
              <textarea
                className="flex-1 w-full bg-[#13131F] border border-white/5 rounded-xl p-4 text-sm text-gray-300 resize-none focus:outline-none focus:border-pink-500/30 transition-colors"
                placeholder="Jot down ideas..."
              ></textarea>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;