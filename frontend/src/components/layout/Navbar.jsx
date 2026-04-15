import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight text-[var(--color-primary)] relative z-50">
          Attenda.
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-7 items-center">
          <Link to="/" className={`text-[13px] font-medium transition-colors ${location.pathname === '/' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-gray-500'}`}>Home</Link>
          <Link to="/about" className={`text-[13px] font-medium transition-colors ${location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-gray-500'}`}>About Us</Link>
          <Link to="/pricing" className={`text-[13px] font-medium transition-colors ${location.pathname === '/pricing' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-gray-500'}`}>Pricing</Link>
          <Link to="/contact" className={`text-[13px] font-medium transition-colors ${location.pathname === '/contact' ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)] text-gray-500'}`}>Contact</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-[13px] font-medium text-gray-500 hover:text-[var(--color-primary)] uppercase tracking-wider transition-colors">Log In</Link>
          <Link to="/register" className="primary-gradient text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm">
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
        className={`md:hidden absolute top-0 left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } -z-10 pt-20 pb-8 px-6`}
      >
        <nav className="flex flex-col gap-5">
          <Link to="/" className={`text-lg font-semibold ${location.pathname === '/' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>Home</Link>
          <Link to="/about" className={`text-lg font-semibold ${location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>About Us</Link>
          <Link to="/pricing" className={`text-lg font-semibold ${location.pathname === '/pricing' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>Pricing</Link>
          <Link to="/contact" className={`text-lg font-semibold ${location.pathname === '/contact' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>Contact</Link>
          
          <div className="w-full h-px bg-gray-100 my-2"></div>
          
          <div className="flex flex-col gap-3">
            <Link to="/login" className="text-base font-semibold text-gray-600 w-full py-2 text-left">Log In</Link>
            <Link to="/register" className="primary-gradient text-white px-5 py-3 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity shadow-sm text-center">
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
