import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Derive initials and display name from the Supabase user
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Guests', path: '/dashboard/guests', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Tasks', path: '/dashboard/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Settings', path: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 hidden lg:flex flex-col pt-8">
      <div className="px-8 flex-shrink-0">
        {/* We use structural padding to give the impression of a border without a hard line */}
        <Link to="/dashboard" className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">
          Attenda.
        </Link>
        <div className="mt-2 inline-flex items-center gap-2 bg-[var(--color-surface-container-low)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-on-surface-variant)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
          Event Active
        </div>
      </div>

      <nav className="flex-1 mt-12 px-4 space-y-1 overflow-y-auto">
        <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-outline-variant)] mb-4">Event Management</h4>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-white ambient-shadow' 
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)]'
              }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'text-[var(--color-secondary-fixed)]' : 'text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.name === 'Settings' ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                )}
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-3">
        {/* Rapid Actions Section */}
        <div className="space-y-2 mb-6 px-1">
          <button
            onClick={() => navigate('/dashboard/create-event')}
            className="w-full h-11 bg-[#030712] text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Evento
          </button>
          <button
            onClick={() => navigate('/dashboard/my-events')}
            className="w-full h-11 bg-[#030712] text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Mis Eventos
          </button>
        </div>

        <div className="bg-[#f8f9fa] rounded-xl p-4 flex items-center gap-3 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-[var(--color-primary)] truncate">{displayName}</span>
            <span className="text-xs text-gray-500 truncate">{user?.email}</span>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
