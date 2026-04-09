const AboutUs = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">The story behind <br/><span className="text-[var(--color-secondary)]">Attenda.</span></h1>
      
      <div className="space-y-8 text-lg text-[var(--color-on-surface-variant)]">
        <p className="leading-relaxed">
          We built Attenda because we were tired of the "boxed-in" aesthetic of traditional event management platforms. Managing an event—whether it's a corporate gala or a wedding—should feel as premium and effortless as the event itself.
        </p>
        <p className="leading-relaxed">
          Too often, hosts are forced into sprawling spreadsheets, fragmented email threads, and stressful door management. We saw a need for a unified system that didn't just work well, but felt like a tailored, white-glove service.
        </p>
        
        <div className="bg-[var(--color-surface-container-low)] p-10 rounded-2xl my-12 ghost-border">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Philosophy: The Digital Concierge</h2>
          <p className="text-base">
            We reject standard SaaS templates. Our interface is designed to emulate fine stationery and elegant lobbies. We use generous white space, subtle tonal shifts, and intentional asymmetry to guide your eye without the visual noise of harsh grid lines.
          </p>
        </div>
        
        <p className="leading-relaxed">
          Today, Attenda helps thousands of hosts orchestrate their events with calm precision. From the first RSVP link sent to the final QR code scanned at the door, we are your invisible partner in creating memorable experiences.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
