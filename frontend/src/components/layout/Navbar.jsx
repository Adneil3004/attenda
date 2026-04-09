import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b ghost-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[var(--color-primary)] relative z-50">
          Attenda.
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Home</Link>
          <Link to="/about" className={`text-sm font-semibold transition-colors ${location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>About Us</Link>
          <Link to="/pricing" className={`text-sm font-semibold transition-colors ${location.pathname === '/pricing' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Pricing</Link>
          <Link to="/contact" className={`text-sm font-semibold transition-colors ${location.pathname === '/contact' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-[var(--color-on-surface-variant)]'}`}>Contact</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] uppercase tracking-wider transition-colors">Log In</Link>
          <Link to="/register" className="primary-gradient text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity ambient-shadow">
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 -mr-2 relative z-50 text-[var(--color-primary)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full bg-[var(--color-surface-container-lowest)] border-b ghost-border ambient-shadow transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } -z-10 pt-24 pb-8 px-6`}
      >
        <nav className="flex flex-col gap-6">
          <Link to="/" className={`text-xl font-bold ${location.pathname === '/' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>Home</Link>
          <Link to="/about" className={`text-xl font-bold ${location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>About Us</Link>
          <Link to="/pricing" className={`text-xl font-bold ${location.pathname === '/pricing' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>Pricing</Link>
          <Link to="/contact" className={`text-xl font-bold ${location.pathname === '/contact' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>Contact</Link>
          
          <div className="w-full h-px bg-[var(--color-outline-variant)] opacity-20 my-2"></div>
          
          <div className="flex flex-col gap-4">
            <Link to="/login" className="text-lg font-bold text-[var(--color-primary)] w-full py-3 text-left">Log In</Link>
            <Link to="/register" className="primary-gradient text-white px-5 py-4 rounded-md text-base font-semibold hover:opacity-90 transition-opacity ambient-shadow text-center">
              Get Started
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Overlay to catch clicks outside */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm -z-20 h-screen"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
