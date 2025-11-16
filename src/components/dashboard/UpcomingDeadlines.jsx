import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UpcomingDeadlines = ({ assignments }) => {
  
  const handleNotImplemented = () => {
    toast({
      title: "🚧 Feature not implemented",
      description: "This feature isn't ready yet, but you can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      onClick={handleNotImplemented}
      className="glass-panel p-6 cursor-pointer"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5" style={{color: 'var(--accent-violet)'}} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-light)' }}>Upcoming Deadlines</h3>
      </div>

      <div className="space-y-3">
        {assignments && assignments.length > 0 ? (
          assignments.slice(0, 2).map((assignment, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/40 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium" style={{color: 'var(--text-light)'}}>{assignment.courseTitle}</p>
                <p className="text-sm" style={{color: 'var(--text-dark)'}}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4" style={{color: 'var(--text-dark)'}}>No pending deadlines</p>
        )}
      </div>
    </motion.div>
  );
};

export default UpcomingDeadlines;