import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { LogOut, LayoutDashboard, Building, Flag, CheckSquare } from 'lucide-react';
import { Role } from '../types';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return [
          { name: 'Dashboard', path: '/super-admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Organizations', path: '/super-admin/organizations', icon: <Building size={20} /> },
        ];
      case Role.ORG_ADMIN:
        return [
          { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Feature Flags', path: '/admin/flags', icon: <Flag size={20} /> },
          { name: 'Feature Check', path: '/admin/check', icon: <CheckSquare size={20} /> },
        ];
      case Role.END_USER:
        return [
          { name: 'Feature Check', path: '/user', icon: <CheckSquare size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
          <span className="flex items-center gap-2 font-semibold text-lg text-primary">
            <Flag />
            Byepo SaaS
          </span>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/super-admin' && item.path !== '/admin');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="mb-4 px-2 flex flex-col gap-1">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-primary/10 text-primary w-fit rounded mt-1">{user?.role}</span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Header (Simplified for this assignment) */}
          <div className="sm:hidden flex items-center justify-between w-full">
            <span className="font-semibold flex items-center gap-2"><Flag size={20}/> Byepo</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
