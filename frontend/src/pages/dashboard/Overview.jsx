import { Link } from 'react-router-dom';

const Overview = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Welcome back, Jane.</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Here is the overview for your upcoming event.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl ambient-shadow ghost-border">
          <h3 className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Total RSVPs</h3>
          <p className="text-4xl font-bold text-[var(--color-primary)]">142</p>
          <div className="mt-4 text-xs font-semibold text-[#19b359]">+12 since yesterday</div>
        </div>
        
        <div className="bg-[var(--color-primary)] p-6 rounded-xl ambient-shadow text-white transform md:-translate-y-2">
          <h3 className="text-sm font-semibold text-[#c5c6d0] uppercase tracking-wider mb-2">Completion Rate</h3>
          <p className="text-4xl font-bold">85%</p>
          <div className="w-full bg-[#1a1c2a] rounded-full h-1.5 mt-4">
            <div className="bg-[#b1c6f9] h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl ambient-shadow ghost-border">
          <h3 className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Missing Diets</h3>
          <p className="text-4xl font-bold text-[var(--color-error)]">4</p>
          <Link to="/dashboard/guests" className="inline-block mt-4 text-xs font-semibold text-[var(--color-primary)] hover:underline">Review guests &rarr;</Link>
        </div>
      </div>

      <div className="bg-[var(--color-surface-container-lowest)] rounded-xl ambient-shadow ghost-border p-8 flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 bg-[var(--color-surface-container-low)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">Event Checklist</h3>
        <p className="text-[var(--color-on-surface-variant)] text-sm max-w-sm mb-6">Stay on top of your tasks. Manage vendors, payments, and deadlines all in one place.</p>
        <button className="primary-gradient text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity ambient-shadow">
          Create first task
        </button>
      </div>

    </div>
  );
};

export default Overview;
