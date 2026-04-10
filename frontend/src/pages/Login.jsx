import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect back to the page they tried to visit, or fall back to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-2">Welcome back</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Enter your details to access your dashboard.</p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-8 md:p-10 rounded-2xl ghost-border ambient-shadow">

          {/* Google Sign In — placeholder for next step */}
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
            Sign in with Google
            <span className="text-xs opacity-60">(próximamente)</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-30"></div>
            <span className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium">Or continue with</span>
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
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
