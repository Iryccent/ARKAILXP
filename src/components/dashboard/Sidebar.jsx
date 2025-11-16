import React from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Sparkles, UserCog, LogOut, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ThemeSelector from '@/components/ThemeSelector';

const Sidebar = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleAdminAccess = () => {
    const code = prompt("Enter Admin Access Code:");
    if (code === '405527') {
      toast({ title: "Access Granted", description: "Redirecting to Admin Panel..." });
      navigate('/admin');
    } else if (code !== null) {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect code." });
    }
  };

  const menuItems = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/dashboard', role: ['admin', 'student'] },
    { icon: BookOpen, label: t('sidebar.courses'), path: '/courses', role: ['admin', 'student'] },
    { icon: Sparkles, label: t('sidebar.sandbox'), path: '/sandbox', role: ['admin', 'student'] },
  ];

  const adminItem = { icon: UserCog, label: t('sidebar.admin'), action: handleAdminAccess, role: ['admin'] };

  const bottomMenuItems = [
    { icon: User, label: t('sidebar.profile'), path: '/profile', role: ['admin', 'student'] },
    { icon: LogOut, label: t('sidebar.logout'), action: onLogout, role: ['admin', 'student'] }
  ];
  
  const isActive = (path) => location.pathname === '/' && path === '/dashboard' ? true : location.pathname.startsWith(path) && path !== '/dashboard' || location.pathname === path;

  const NavItem = ({ item }) => (
    <li>
      <button
        onClick={item.action ? item.action : () => navigate(item.path)}
        className={`w-full flex items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-lg text-base transition-all duration-300 ${isActive(item.path) ? 'bg-accent-primary/10 text-accent-primary font-semibold' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'}`}
      >
        <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
          <item.icon className="h-6 w-6 shrink-0" />
        </motion.div>
        <span className="hidden lg:inline">{item.label}</span>
      </button>
    </li>
  );
  
  const userRole = user?.user_metadata?.role || 'student';

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-20 lg:w-64 glass-panel !rounded-none !border-l-0 !border-t-0 !border-b-0 p-4 lg:p-6 md:flex flex-col z-20"
      >
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-12">
          <img src="https://i.imgur.com/c38a5Pf.png" alt="ARKAI LXP Logo" className="h-10 lg:h-12 w-auto" />
        </div>

        <nav className="flex-1">
          <p className="px-4 mb-2 text-xs uppercase font-semibold tracking-wider text-text-secondary hidden lg:block">{t('sidebar.menu')}</p>
          <ul className="space-y-2">
            {menuItems.filter(item => item.role.includes(userRole)).map(item => <NavItem key={item.label} item={item} />)}
            {userRole === 'admin' && <NavItem item={adminItem} />}
          </ul>
        </nav>

        <div className="mt-auto">
          <ul className="space-y-2">
             <Dialog>
                <DialogTrigger asChild>
                   <li className="w-full flex items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-lg text-base transition-all duration-300 text-text-secondary hover:bg-white/5 hover:text-text-primary cursor-pointer">
                      <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                        <Settings className="h-6 w-6 shrink-0" />
                      </motion.div>
                      <span className="hidden lg:inline">Themes</span>
                   </li>
                </DialogTrigger>
                <DialogContent className="glass-panel max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Theme Settings</DialogTitle>
                  </DialogHeader>
                  <ThemeSelector />
                </DialogContent>
              </Dialog>
            {bottomMenuItems.filter(item => item.role.includes(userRole)).map(item => <NavItem key={item.label} item={item} />)}
          </ul>
        </div>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 glass-panel !rounded-t-2xl !rounded-b-none z-30">
        <nav className="h-full">
          <ul className="h-full flex justify-around items-center">
            {menuItems.filter(item => item.role.includes(userRole)).slice(0, 3).map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors duration-300 ${isActive(item.path) ? 'text-accent-primary' : 'text-text-secondary'}`}
                >
                  <item.icon className="h-6 w-6" />
                </button>
              </li>
            ))}
             <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs text-text-secondary">
                      <Settings className="h-6 w-6" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel max-w-md m-4">
                    <DialogHeader>
                      <DialogTitle>Theme Settings</DialogTitle>
                    </DialogHeader>
                    <ThemeSelector />
                  </DialogContent>
                </Dialog>
              </li>
            <li>
              <button
                onClick={onLogout}
                className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs text-text-secondary"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;