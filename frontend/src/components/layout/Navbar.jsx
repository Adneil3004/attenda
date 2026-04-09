import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 glass-panel border-b ghost-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">
          Attenda.
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Home</Link>
          <Link to="/about" className={`text-sm font-semibold transition-colors ${location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>About Us</Link>
          <Link to="/pricing" className={`text-sm font-semibold transition-colors ${location.pathname === '/pricing' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Pricing</Link>
          <Link to="/contact" className={`text-sm font-semibold transition-colors ${location.pathname === '/contact' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block text-sm font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] uppercase tracking-wider">Log In</Link>
          <Link to="/contact" className="primary-gradient text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity ambient-shadow">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
