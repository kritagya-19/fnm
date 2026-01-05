import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiDollarSign, FiUsers, FiFolder, 
  FiTarget, FiFileText, FiMenu, FiX, FiLogOut, FiUser,
  FiChevronRight, FiBell
} from 'react-icons/fi';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/finance', icon: FiDollarSign, label: 'Finance' },
    { path: '/clients', icon: FiUsers, label: 'Clients' },
    { path: '/projects', icon: FiFolder, label: 'Projects' },
    { path: '/targets', icon: FiTarget, label: 'Targets' },
    { path: '/documents', icon: FiFileText, label: 'Documents' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-slate-200
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                  <FiDollarSign className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Finance<span className="text-primary-600">Hub</span></span>
              </div>
              <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                <FiX className="text-xl text-slate-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  group flex items-center justify-between px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <item.icon className={`text-lg transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-900'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer User Area */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-white border border-slate-200 p-0.5 rounded-full ring-2 ring-primary-50">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary-600 text-lg" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Account'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'Settings'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all active:scale-[0.98]"
            >
              <FiLogOut className="text-lg" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 text-slate-900">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center shrink-0 z-30 sticky top-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <FiMenu className="text-2xl text-slate-600" />
              </button>
              <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-400 font-medium">
                <span>Application</span>
                <FiChevronRight className="text-xs" />
                <span className="text-slate-900 font-bold capitalize">
                  {window.location.pathname.split('/')[1] || 'Dashboard'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Date</p>
                <p className="text-xs font-bold text-slate-900">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button className="relative p-2.5 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all active:scale-95">
                <FiBell className="text-xl" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

