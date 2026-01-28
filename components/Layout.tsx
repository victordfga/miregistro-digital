import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FileText, 
  Stethoscope,
  LogOut,
  Menu,
  Bell,
  User
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: React.ElementType, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
    <p className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</p>
  </Link>
);

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user, familyMembers, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Top Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-slate-900 px-6 py-3 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight hidden sm:block">MiRegistro Medico Digital</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/dashboard" className={`text-sm font-medium leading-normal transition-colors ${path === '/dashboard' ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Panel</Link>
            <Link to="/family" className={`text-sm font-medium leading-normal transition-colors ${path.includes('/family') || path.includes('/profile') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Perfiles</Link>
            <Link to="/appointments" className={`text-sm font-medium leading-normal transition-colors ${path === '/appointments' ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Citas</Link>
          </nav>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                {familyMembers.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>}
             </button>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-full size-9 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer overflow-hidden">
                <User className="w-5 h-5 text-slate-500" />
            </div>
            <button className="lg:hidden p-2 text-slate-500">
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Desktop */}
        <aside className="w-64 bg-surface-light dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between hidden md:flex overflow-y-auto z-10">
          <div className="flex flex-col p-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 font-black text-lg shadow-inner">
                  {user?.lastName?.charAt(0) || 'R'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-slate-900 dark:text-white text-sm font-bold truncate">Familia {user?.lastName || 'Usuario'}</h1>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Administrador</p>
                </div>
              </div>
              
              {/* Iconos dinámicos de familiares */}
              <div className="flex flex-wrap gap-2 px-0.5">
                  {familyMembers.map((member) => (
                    <Link 
                      key={member.id} 
                      to={`/profile/${member.id}`} 
                      title={member.name}
                      className={`size-8 rounded-full bg-cover bg-center border-2 transition-all hover:scale-110 flex items-center justify-center overflow-hidden shadow-sm ${
                        path.includes(member.id) ? 'border-primary ring-2 ring-primary/20' : 'border-white dark:border-slate-700'
                      } ${!member.avatar ? (member.type === 'child' ? 'bg-orange-400' : member.type === 'elder' ? 'bg-purple-500' : 'bg-primary') : ''}`}
                      style={member.avatar ? {backgroundImage: `url('${member.avatar}')`} : {}}
                    >
                      {!member.avatar && <span className="text-[10px] font-black text-white">{member.name.charAt(0)}</span>}
                    </Link>
                  ))}
                  {familyMembers.length < 6 && (
                    <Link to="/family" state={{ autoOpen: true }} className="size-8 rounded-full bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                      <Users className="w-3.5 h-3.5" />
                    </Link>
                  )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Menú Principal</p>
              <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Resumen" active={path === '/dashboard'} />
              <SidebarItem to="/family" icon={Users} label="Familiares" active={path === '/family' || path.includes('/profile')} />
              <SidebarItem to="/appointments" icon={CalendarDays} label="Calendario" active={path === '/appointments'} />
              <SidebarItem to="/documents" icon={FileText} label="Documentos" active={path === '/documents'} />
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <button 
               onClick={handleLogout} 
               className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all font-bold group"
             >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="text-sm">Cerrar Sesión</span>
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;