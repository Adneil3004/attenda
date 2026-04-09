import { Link } from 'react-router-dom';

const RECENT_GUESTS = [
  { name: 'Eleanor Vance', status: 'Confirmed', time: '2 min ago', initials: 'EV' },
  { name: 'Arthur Dudley', status: 'Pending', time: '15 min ago', initials: 'AD' },
  { name: 'Luke Crain', status: 'Confirmed', time: '1 hr ago', initials: 'LC' },
  { name: 'Theodora Crain', status: 'Declined', time: '2 hr ago', initials: 'TC' },
  { name: 'Shirley Crain', status: 'Confirmed', time: '3 hr ago', initials: 'SC' },
];

const TASKS = [
  { title: 'Confirm catering headcount', done: true },
  { title: 'Send reminder to pending guests', done: false },
  { title: 'Arrange table seating plan', done: false },
  { title: 'Test QR check-in scanner', done: false },
  { title: 'Finalize music playlist', done: true },
];

const GROUPS = [
  { name: 'Family', confirmed: 24, total: 30, color: '#5b3cdd' },
  { name: 'Friends', confirmed: 18, total: 28, color: '#19b359' },
  { name: 'Work', confirmed: 10, total: 20, color: '#f5a623' },
];

const STATUS_COLORS = {
  Confirmed: { bg: 'bg-[#19b359]/10', text: 'text-[#19b359]' },
  Pending: { bg: 'bg-[#f5a623]/10', text: 'text-[#f5a623]' },
  Declined: { bg: 'bg-red-100', text: 'text-red-500' },
};

const Overview = () => {
  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline-variant)] mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Welcome back, Jane.</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Here's the latest for your upcoming event.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-container-lowest)] rounded-lg text-sm font-semibold text-[var(--color-on-surface-variant)] ghost-border ambient-shadow">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Event: June 14, 2025
          </div>
          <button className="primary-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity ambient-shadow flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Guests
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Guests', value: '142', delta: '+12 this week', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', deltaColor: 'text-[#19b359]' },
          { label: 'Confirmed', value: '121', delta: '85% of total', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', deltaColor: 'text-[#19b359]' },
          { label: 'Pending', value: '15', delta: 'Reminder due', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', deltaColor: 'text-[#f5a623]' },
          { label: 'Declined', value: '6', delta: '4% of total', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', deltaColor: 'text-red-400' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[var(--color-surface-container-lowest)] p-5 rounded-xl ambient-shadow flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline-variant)]">{kpi.label}</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--color-primary)]">{kpi.value}</p>
            <span className={`text-xs font-semibold ${kpi.deltaColor}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* ─── Middle Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RSVP Progress by Group */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl ambient-shadow col-span-1">
          <h2 className="text-base font-bold text-[var(--color-primary)] mb-5">RSVPs by Group</h2>
          <div className="space-y-5">
            {GROUPS.map((group) => {
              const pct = Math.round((group.confirmed / group.total) * 100);
              return (
                <div key={group.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-[var(--color-on-surface-variant)]">{group.name}</span>
                    <span className="text-xs font-bold text-[var(--color-primary)]">{group.confirmed}/{group.total}</span>
                  </div>
                  <div className="w-full bg-[var(--color-surface-container-low)] rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: group.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t ghost-border flex justify-between items-center text-xs text-[var(--color-on-surface-variant)]">
            <span className="font-semibold">Overall Completion</span>
            <span className="font-bold text-[var(--color-primary)]">85%</span>
          </div>
        </div>

        {/* Recent RSVP Activity */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl ambient-shadow col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[var(--color-primary)]">Recent Activity</h2>
            <Link to="/dashboard/guests" className="text-xs font-semibold text-[var(--color-secondary)] hover:underline">View all</Link>
          </div>
          <div className="space-y-1">
            {RECENT_GUESTS.map((g, i) => (
              <div key={i} className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--color-surface-container-low)]/40'}`}>
                <div className="w-9 h-9 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)] shrink-0">
                  {g.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-primary)] truncate">{g.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">RSVP'd &bull; {g.time}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${STATUS_COLORS[g.status].bg} ${STATUS_COLORS[g.status].text}`}>
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Event Tasks */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl ambient-shadow col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[var(--color-primary)]">Event Checklist</h2>
            <span className="text-xs bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed-variant)] font-semibold px-2.5 py-1 rounded-full">
              {TASKS.filter(t => t.done).length}/{TASKS.length} done
            </span>
          </div>

          {/* Progress Ribbon */}
          <div className="w-full bg-[var(--color-surface-container-low)] rounded-full h-1 mb-5">
            <div
              className="h-1 rounded-full"
              style={{ width: `${(TASKS.filter(t => t.done).length / TASKS.length) * 100}%`, background: 'linear-gradient(to right, var(--color-secondary), var(--color-secondary-container))' }}
            ></div>
          </div>

          <div className="space-y-2">
            {TASKS.map((task, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors cursor-pointer hover:bg-[var(--color-surface-container-low)] ${i % 2 === 0 ? '' : 'bg-[var(--color-surface-container-low)]/40'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-[#19b359] border-[#19b359]' : 'border-[var(--color-outline-variant)]'}`}>
                  {task.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${task.done ? 'line-through text-[var(--color-outline-variant)]' : 'font-semibold text-[var(--color-on-surface)]'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full py-2.5 rounded-md text-sm font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add a task
          </button>
        </div>

        {/* Digital Ticket Preview */}
        <div className="bg-[var(--color-primary)] p-6 rounded-xl ambient-shadow text-white flex flex-col">
          <h2 className="text-base font-bold text-white mb-1">QR Check-In</h2>
          <p className="text-xs text-[#c5c6d0] mb-6">Preview your guest ticket</p>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[160px] aspect-square bg-[var(--color-surface)] rounded-xl p-3 flex items-center justify-center mx-auto">
              {/* Placeholder QR grid */}
              <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                {Array.from({ length: 49 }).map((_, i) => {
                  const isCorner = [0,1,7,8, 5,6,12,13, 35,36,42,43].includes(i);
                  const isDark = isCorner || Math.random() > 0.55;
                  return <div key={i} className={`rounded-sm ${isDark ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`}></div>;
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#c5c6d0] text-xs">Event</span>
              <span className="font-semibold text-xs text-right">Summer Gala 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#c5c6d0] text-xs">Date</span>
              <span className="font-semibold text-xs">June 14, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#c5c6d0] text-xs">Guests scanned</span>
              <span className="font-semibold text-xs">0 / 142</span>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 rounded-md text-sm font-semibold bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed-variant)] hover:opacity-90 transition-opacity">
            Send tickets to guests
          </button>
        </div>

      </div>
    </div>
  );
};

export default Overview;
