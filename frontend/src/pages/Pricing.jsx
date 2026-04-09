const Pricing = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">Simple, transparent pricing.</h1>
        <p className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
          Choose the plan that fits the scale of your event. No hidden fees or surprise charges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-10 flex flex-col ghost-border ambient-shadow">
          <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Intimate</h3>
          <p className="text-[var(--color-on-surface-variant)] mb-6 text-sm">For small gatherings and private dinners.</p>
          <div className="mb-8">
            <span className="text-5xl font-bold text-[var(--color-primary)]">Free</span>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-[var(--color-on-surface-variant)] text-sm">Up to 50 guests</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-[var(--color-on-surface-variant)] text-sm">Standard RSVP functionality</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-[var(--color-on-surface-variant)] text-sm">Basic guest list export</span>
            </li>
          </ul>
          
          <button className="w-full py-4 rounded-md font-semibold text-sm text-[var(--color-primary)] bg-[var(--color-surface-container-low)] hover:bg-[#e7e8e9] transition-colors">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-[var(--color-primary)] rounded-2xl p-10 flex flex-col ambient-shadow transform md:-translate-y-4">
          <h3 className="text-2xl font-bold text-white mb-2">Grand</h3>
          <p className="text-[#c5c6d0] mb-6 text-sm">For weddings, galas, and corporate events.</p>
          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">$99</span>
            <span className="text-[#c5c6d0] text-sm font-medium">/ event</span>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#c9bfff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-white text-sm">Unlimited guests</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#c9bfff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-white text-sm">Custom domain & branding</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#c9bfff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-white text-sm">Digital QR check-in & scanning</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#c9bfff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-white text-sm">Advanced dietary & plus-one logic</span>
            </li>
          </ul>
          
          <button className="w-full py-4 rounded-md font-semibold text-sm text-[var(--color-on-secondary-fixed-variant)] bg-[var(--color-secondary-fixed)] hover:opacity-90 transition-opacity">
            Upgrade to Grand
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
