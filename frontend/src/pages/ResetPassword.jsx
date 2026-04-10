import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * ResetPassword page
 *
 * Supabase sends the user here via an email link.
 * The URL contains a hash fragment like:
 *   #access_token=...&refresh_token=...&type=recovery
 *
 * Supabase JS SDK automatically detects this fragment on load,
 * creates a session with type "recovery", and fires onAuthStateChange
 * with event = "PASSWORD_RECOVERY".
 *
 * We listen for that event, then let the user set a new password.
 */
const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // True only when Supabase has confirmed the recovery session via the fragment
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user arrives from the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    // Also check if there's already an active recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      // Sign out so the user has to log in fresh with the new password
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      setError(err.message || 'Could not update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Invalid / expired link ──────────────────────────────────────────────────
  if (!sessionReady) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
        <div className="w-full max-w-md text-center">
          <div className="bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl ghost-border ambient-shadow">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-3">Invalid or expired link</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-6">
              This password reset link is invalid or has already been used. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block primary-gradient text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
        <div className="w-full max-w-md text-center">
          <div className="bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl ghost-border ambient-shadow">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-3">Password updated!</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-2">
              Your password has been changed successfully.
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] opacity-60">
              Redirecting you to login in a moment…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-2">New password</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">
            Choose a strong password for your account.
          </p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-8 md:p-10 rounded-2xl ghost-border ambient-shadow">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
              />
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 opacity-60">Minimum 6 characters</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirm-password" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors text-sm"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </>
              ) : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
