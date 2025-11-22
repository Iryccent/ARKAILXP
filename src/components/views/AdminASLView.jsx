import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X } from 'lucide-react';
import CourseCreatorStudio from '@/components/admin/CourseCreatorStudio';

const ASLBadge = ({ level }) => {
    let color = "bg-gray-500";
    let label = "VIP Guest";
    let badgeType = "InnerCircle";

    if (level === 2) { color = "bg-cyan-500"; label = "Asst. Lead"; badgeType = "Leadership"; }
    if (level === 3) { color = "bg-amber-500"; label = "Lead Advisor"; badgeType = "Leadership"; }
    if (level === 4) { color = "bg-purple-600"; label = "Sys Auditor"; badgeType = "CEO / Full Access"; }

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 ${color}/20`}>
            <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
            <div className="flex flex-col leading-none">
                <span className={`text-[10px] font-bold ${color.replace('bg-', 'text-')} uppercase tracking-wider`}>{badgeType}</span>
                <span className="text-[9px] opacity-60 text-white">{label} (L{level})</span>
            </div>
        </div>
    );
};

const AdminASLView = ({ onBack, onAddCourse, courses, members = [], setMembers }) => {
    const [activeTab, setActiveTab] = useState('users');

    // User Provisioning State
    const [userView, setUserView] = useState('list');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', asl: 1, role: 'User' });

    const handleSaveUser = () => {
        if (!formData.name || !formData.email) return;

        if (editingId) {
            setMembers(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
        } else {
            const newMember = {
                id: crypto.randomUUID(),
                ...formData
            };
            setMembers(prev => [...prev, newMember]);
        }
        setUserView('list');
    };

    const handleDeleteUser = (id) => {
        if (confirm("Are you sure you want to remove this user?")) {
            setMembers(prev => prev.filter(m => m.id !== id));
        }
    };

    const openUserForm = (member) => {
        if (member) {
            setEditingId(member.id);
            setFormData({ name: member.name, email: member.email, asl: member.asl, role: member.role });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', asl: 1, role: 'User' });
        }
        setUserView('form');
    };

    const getASLTitle = (level) => {
        switch (level) {
            case 1: return "VIP Guest";
            case 2: return "Asst. Lead Advisor";
            case 3: return "Lead Advisor";
            case 4: return "System Auditor";
            default: return "Unknown";
        }
    };

    const getASLBadgeName = (level) => {
        switch (level) {
            case 1: return "InnerCircle";
            case 2: return "Leadership";
            case 3: return "Leadership";
            case 4: return "CEO / Full Access";
            default: return "Standard";
        }
    };

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col bg-[#020205]">
            <header className="mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            System Administration
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Configure access protocols and system content.
                        </p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Content
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel p-6 rounded-2xl flex-1"
                    >
                        {userView === 'list' ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">User Provisioning</h2>
                                    <button
                                        onClick={() => openUserForm()}
                                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-900/20"
                                    >
                                        <Plus size={16} /> Add User
                                    </button>
                                </div>

                                {members.length === 0 ? (
                                    <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                                        <p className="text-gray-500">No users found in current session context.</p>
                                        <button onClick={() => openUserForm()} className="mt-4 text-cyan-400 hover:underline">Create first user</button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-gray-500 text-sm">
                                                    <th className="py-3 px-4 font-medium">Identity</th>
                                                    <th className="py-3 px-4 font-medium">Email Protocol</th>
                                                    <th className="py-3 px-4 font-medium">Badge / Role</th>
                                                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.map(member => (
                                                    <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-4 font-medium text-white">{member.name}</td>
                                                        <td className="py-4 px-4 text-gray-400 font-mono text-sm">{member.email}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex gap-2">
                                                                <ASLBadge level={member.asl} />
                                                                {member.role === 'Manager' && (
                                                                    <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center">ADMIN</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button onClick={() => openUserForm(member)} className="text-cyan-400 hover:text-cyan-300 mr-4 text-sm">Edit</button>
                                                            <button onClick={() => handleDeleteUser(member.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        ) : (
                            // User Form
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">
                                        {editingId ? 'Edit Credentials' : 'Provision New User'}
                                    </h2>
                                    <button onClick={() => setUserView('list')} className="text-gray-500 hover:text-white"><X /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Corporate Email</label>
                                            <input
                                                type="email"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-4">Security Clearance (ASL)</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => setFormData({ ...formData, asl: level })}
                                                    className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${formData.asl === level
                                                            ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="text-sm font-bold text-white mb-0.5">{getASLTitle(level)}</div>
                                                        <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono">
                                                            Badge: {getASLBadgeName(level)}
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-black text-white/20">L{level}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500 bg-gray-700"
                                                checked={formData.role === 'Manager'}
                                                onChange={e => setFormData({ ...formData, role: e.target.checked ? 'Manager' : 'User' })}
                                            />
                                            <div>
                                                <div className="font-medium text-white">Grant Admin Privileges</div>
                                                <div className="text-xs text-gray-500">Allows access to System Configuration and ASL Panel.</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-white/10">
                                        <button onClick={() => setUserView('list')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium text-gray-300 transition-colors">Cancel</button>
                                        <button onClick={handleSaveUser} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-colors">Confirm Provisioning</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        {/* Embedded Course Creator Studio */}
                        <div className="glass-panel p-1 rounded-2xl overflow-hidden flex-1 flex flex-col">
                            <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white ml-2">Course Creator Engine</h2>
                                <span className="text-xs text-cyan-400 font-mono">ACTIVE</span>
                            </div>
                            <div className="flex-1 relative min-h-[500px]">
                                <CourseCreatorStudio
                                    isOpen={true}
                                    onClose={() => { }}
                                    onAddCourse={onAddCourse}
                                    embedded={true}
                                    members={members} // Pass members for assignment
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminASLView;
