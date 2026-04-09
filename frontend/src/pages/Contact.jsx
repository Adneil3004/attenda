const Contact = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row gap-16">
      <div className="flex-1 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">Contact our concierge.</h1>
        <p className="text-lg text-[var(--color-on-surface-variant)] mb-10">
          Whether you're planning a wedding of 300 or an intimate dinner party, our team is here to ensure your event software is flawlessly orchestrated.
        </p>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[var(--color-surface-container-low)] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-primary)]">Email</h4>
              <p className="text-[var(--color-on-surface-variant)] text-sm">concierge@attenda.co</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[var(--color-surface-container-low)] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-primary)]">Support Chat</h4>
              <p className="text-[var(--color-on-surface-variant)] text-sm">Available Mon-Fri, 9am - 6pm EST</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl">
        <form className="bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl ghost-border ambient-shadow">
          <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Send a message</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col relative">
              <label htmlFor="name" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2 inline-block">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="flex flex-col relative">
              <label htmlFor="email" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2 inline-block">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors"
                placeholder="jane@example.com"
              />
            </div>
            
            <div className="flex flex-col relative">
              <label htmlFor="message" className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2 inline-block">Event Details or Message</label>
              <textarea 
                id="message" 
                rows="4"
                className="bg-[var(--color-surface-container-high)] border-none rounded-md px-4 py-3 focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 transition-colors resize-none"
                placeholder="Tell us about the scale and needs of your event..."
              ></textarea>
            </div>
            
            <button type="button" className="w-full primary-gradient text-white px-8 py-4 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity mt-4">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
