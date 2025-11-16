import React from 'react';
import { Bell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const NotificationBell = () => {
  const handleNotificationsClick = () => {
    toast({
      title: "🚧 Coming Soon!",
      description: "The notifications panel is on its way. Request it in your next prompt! 🚀",
    });
  };

  return (
    <button onClick={handleNotificationsClick} className="relative p-2 rounded-full hover:bg-slate-700/50 transition-colors">
      <Bell style={{ color: 'var(--text-dark)' }} />
      <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-800"></span>
    </button>
  );
};

export default NotificationBell;