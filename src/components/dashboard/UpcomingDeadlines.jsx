import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UpcomingDeadlines = ({ assignments = [] }) => {
  return (
    <motion.div
      className="glass-panel p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5" style={{color: 'var(--accent-violet)'}} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-light)' }}>Upcoming Deadlines</h3>
      </div>

      <div className="space-y-3">
        {assignments && assignments.length > 0 ? (
          assignments.slice(0, 3).map((assignment, index) => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < new Date();
            const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  isOverdue 
                    ? 'bg-red-500/20 border border-red-500/30' 
                    : daysUntilDue <= 3 
                    ? 'bg-yellow-500/20 border border-yellow-500/30'
                    : 'bg-background/30 border border-glass-border'
                }`}
              >
                <AlertCircle className={`h-5 w-5 mt-0.5 shrink-0 ${
                  isOverdue ? 'text-red-400' : daysUntilDue <= 3 ? 'text-yellow-400' : 'text-accent-primary'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{assignment.courseTitle}</p>
                  <p className={`text-sm ${
                    isOverdue ? 'text-red-300' : daysUntilDue <= 3 ? 'text-yellow-300' : 'text-text-secondary'
                  }`}>
                    {isOverdue 
                      ? `Overdue: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : daysUntilDue === 0
                      ? 'Due today'
                      : daysUntilDue === 1
                      ? 'Due tomorrow'
                      : `Due: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${daysUntilDue} days)`
                    }
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center py-4 text-text-secondary">No pending deadlines</p>
        )}
      </div>
    </motion.div>
  );
};

export default UpcomingDeadlines;