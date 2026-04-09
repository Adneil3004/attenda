import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-secondary-fixed)] opacity-50 blur-[100px]"></div>
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#d8e2ff] opacity-40 blur-[80px]"></div>
      </div>
      
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          The elegant way to <br className="hidden md:block" />
          <span className="text-[var(--color-secondary)]">manage your guests.</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-on-surface-variant)] mb-10 max-w-2xl mx-auto">
          Eliminate the chaos of manual event organization. From intelligent digital RSVPs to seamless QR check-ins, let technology handle the logistics while you enjoy the moment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/pricing" className="primary-gradient text-white px-8 py-4 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity ambient-shadow w-full sm:w-auto text-center">
            Start for free
          </Link>
          <Link to="/contact" className="px-8 py-4 rounded-md font-semibold text-lg text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] transition-colors ghost-border w-full sm:w-auto text-center">
            Talk to sales
          </Link>
        </div>
      </div>

      {/* Feature Bento Box Preview */}
      <div className="w-full max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl ambient-shadow flex flex-col h-full">
          <div className="bg-[var(--color-secondary-fixed)] w-12 h-12 rounded-lg mb-6 flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--color-on-secondary-fixed-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Smart RSVPs</h3>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Send personalized, unique links that update your guest list in real-time. No more spreadsheet chaos.</p>
        </div>
        <div className="bg-[var(--color-primary)] text-white p-8 rounded-xl ambient-shadow flex flex-col h-full transform md:-translate-y-4">
          <div className="bg-[#1a1c2a] w-12 h-12 rounded-lg mb-6 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#c5c5d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Guest Management</h3>
          <p className="text-[#c5c6d0] text-sm">Organize groups, track dietary restrictions, and manage plus ones from a unified, elegant dashboard.</p>
        </div>
        <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl ambient-shadow flex flex-col h-full">
          <div className="bg-[#d8e2ff] w-12 h-12 rounded-lg mb-6 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#314671]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Digital Check-in</h3>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Generate beautiful, scannable QR tickets for a frictionless and secure door experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
