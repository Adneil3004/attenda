import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one number and one special character (!@#$%^&*).');
      return;
    }

    try {
      setLoading(true);
      const { session } = await signUp(email, password, fullName);

      if (session) {
        // User is auto-confirmed (email confirmation disabled in Supabase)
        navigate('/dashboard', { replace: true });
      } else {
        // Email confirmation required
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
        <div className="w-full max-w-md text-center">
          <div className="bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl ghost-border ambient-shadow">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-3">Check your email</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-6">
              We sent a confirmation link to <strong className="text-[var(--color-on-surface)]">{email}</strong>. Click it to activate your account.
            </p>
            <Link to="/login" className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
              Back to Sign In →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-2">Create an account</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Start organizing your event with elegance.</p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-8 md:p-10 rounded-2xl ghost-border ambient-shadow">

          {/* Google Sign Up — placeholder */}
          <button
            type="button"
            disabled
            title="Google auth coming soon"
            className="w-full flex items-center justify-center gap-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] py-3 rounded-md font-semibold text-sm mb-6 opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
            <span className="text-xs opacity-60">(próximamente)</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-30"></div>
            <span className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium">Or create with email</span>
            <div className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-30"></div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 pr-11 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 opacity-60">Min. 6 chars, 1 number, 1 special char</p>
            </div>

            <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
              By signing up, you agree to our{' '}
              <Link to="#" className="text-[var(--color-primary)] font-medium underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-[var(--color-primary)] font-medium underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Create Account'}
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
