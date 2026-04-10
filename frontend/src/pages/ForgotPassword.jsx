import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error sending password reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 w-full">
        <div className="w-full max-w-md text-center">
          <div className="bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl ghost-border ambient-shadow">
            <div className="w-16 h-16 bg-[#19b359]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#19b359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-3">Email Sent</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-6">
              Check your inbox at <strong className="text-[var(--color-on-surface)]">{email}</strong> for instructions to reset your password.
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
          <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-2">Reset Password</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Enter the email associated with your account and we'll send a link to reset your password.</p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-8 md:p-10 rounded-2xl ghost-border ambient-shadow">

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

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending link…
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Remembered your password? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Back to Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
