import React from 'react';
import { motion } from 'framer-motion';

const AdminPanelWidget = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-light)' }}>Admin Panel</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
          <span style={{ color: 'var(--text-dark)' }}>Active Users</span>
          <span className="font-bold text-2xl" style={{ color: 'var(--accent-cyan)' }}>3</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
          <span style={{ color: 'var(--text-dark)' }}>Team Progress</span>
          <span className="font-bold text-2xl" style={{ color: 'var(--accent-cyan)' }}>68%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanelWidget;