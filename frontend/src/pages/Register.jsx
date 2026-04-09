import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-2">Create an account</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Start organizing your event with elegance.</p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-8 md:p-10 rounded-2xl ghost-border ambient-shadow">
          <button type="button" className="w-full flex items-center justify-center gap-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors text-[var(--color-on-surface)] py-3 rounded-md font-semibold text-sm mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-30"></div>
            <span className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium">Or create with email</span>
            <div className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-30"></div>
          </div>

          <form className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="Jane Doe"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
              By signing up, you agree to our <Link to="#" className="text-[var(--color-primary)] font-medium underline">Terms of Service</Link> and <Link to="#" className="text-[var(--color-primary)] font-medium underline">Privacy Policy</Link>.
            </p>

            <button type="button" className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity mt-2">
              Create Account
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Register;
