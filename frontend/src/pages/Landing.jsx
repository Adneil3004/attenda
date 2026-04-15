import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 relative min-h-screen selection:bg-[#5b3cdd33]">
      {/* Dark Atmospheric Background Layer */}
      <div
        className="fixed inset-0 -z-1"
        style={{
          backgroundImage: "url('/attenda/imgs/adneil3004-carreta-6264647.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0a0a0a'
        }}
      >
        {/* Dark Overlays & Atmosphere */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="bg-noise absolute inset-0 opacity-20"></div>

        {/* Animated ambient light blobs for movement */}
        <div className="floating-light top-[-20%] left-[-10%] opacity-20 scale-150" style={{ background: 'radial-gradient(circle, #5b3cdd 0%, transparent 70%)' }}></div>
        <div className="floating-light bottom-[-20%] right-[-10%] opacity-15 scale-125" style={{ animationDelay: '-8s', background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl text-center relative z-10 py-12">
        <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter mb-8 text-white drop-shadow-2xl">
          The elegant way to <br className="hidden md:block" />
          <span className="text-[#a78bfa] brightness-125 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">manage your guests.</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/80 mb-14 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
          Eliminate the chaos of manual event organization. From intelligent digital RSVPs to seamless QR check-ins, let technology handle the logistics while you enjoy the moment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/register"
            className="bg-gradient-to-r from-[#5b3cdd] to-[#7459f7] text-white px-12 py-5 rounded-xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(91,60,221,0.4)] w-full sm:w-auto text-center"
          >
            Start for free
          </Link>
          <Link
            to="/contact"
            className="px-12 py-5 rounded-xl font-bold text-xl text-white/90 hover:bg-white/10 transition-all glass-heavy w-full sm:w-auto text-center border-white/20"
          >
            Talk to sales
          </Link>
        </div>
      </div>

      {/* Feature Bento Grid with Heavy Glassmorphism */}
      <div className="w-full max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4">
        {/* Left Card */}
        <div className="glass-heavy p-10 rounded-2xl flex flex-col h-full hover:translate-y-[-8px] transition-transform duration-500 group">
          <div className="bg-[#a78bfa22] w-14 h-14 rounded-2xl mb-8 flex items-center justify-center border border-[#a78bfa20] group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Smart RSVPs</h3>
          <p className="text-white/60 text-lg leading-relaxed font-medium">Send personalized, unique links that update your guest list in real-time. No more spreadsheet chaos.</p>
        </div>

        {/* Center Highlighted Card */}
        <div className="bg-gradient-to-br from-[#1a1b2a66] to-[#0a0a0a66] backdrop-blur-3xl border border-[#a78bfa50] p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full transform md:-translate-y-8 hover:scale-[1.03] transition-all duration-500 group">
          <div className="bg-[#5b3cdd22] w-14 h-14 rounded-2xl mb-8 flex items-center justify-center border border-[#5b3cdd30] group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Guest Management</h3>
          <p className="text-white/70 text-lg leading-relaxed font-medium">Organize groups, track dietary restrictions, and manage plus ones from a unified, elegant dashboard.</p>
          {/* Simple subtle glow at the bottom */}
          <div className="mt-8 w-12 h-1 bg-[#5b3cdd] rounded-full blur-[1px]"></div>
        </div>

        {/* Right Card */}
        <div className="glass-heavy p-10 rounded-2xl flex flex-col h-full hover:translate-y-[-8px] transition-transform duration-500 group">
          <div className="bg-[#d8e2ff22] w-14 h-14 rounded-2xl mb-8 flex items-center justify-center border border-[#d8e2ff20] group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[#c5c6d0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Digital Check-in</h3>
          <p className="text-white/60 text-lg leading-relaxed font-medium">Generate beautiful, scannable QR tickets for a frictionless and secure door experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
