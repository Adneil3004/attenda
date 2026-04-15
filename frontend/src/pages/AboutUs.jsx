import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="flex-1 flex flex-col items-center py-20 px-6 relative min-h-screen selection:bg-[#5b3cdd33]">
      {/* Dark Atmospheric Background Layer - Consistent with Landing */}
      <div 
        className="fixed inset-0 -z-1"
        style={{
          backgroundColor: '#0a0a0a'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-[#121212] to-[#0a0a0a]"></div>
        <div className="bg-noise absolute inset-0 opacity-15"></div>
        
        {/* Animated ambient light blobs */}
        <div className="floating-light top-[-10%] right-[-5%] opacity-10 scale-150" style={{ background: 'radial-gradient(circle, #5b3cdd 0%, transparent 70%)' }}></div>
        <div className="floating-light bottom-[-10%] left-[-5%] opacity-10 scale-125" style={{ animationDelay: '-12s', background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }}></div>
      </div>
      
      {/* Content Container */}
      <div className="max-w-4xl w-full relative z-10">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            Orquestación de eventos <br />
            <span className="text-[#a78bfa] brightness-125">elevada al siguiente nivel.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl font-medium leading-relaxed">
            Attenda no es solo una herramienta de gestión; es la evolución digital del servicio de conserjería para los organizadores de eventos más exigentes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 mb-20">
          {/* Section: ¿Qué es? */}
          <div className="glass-heavy p-10 rounded-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-xs font-bold text-[#a78bfa] tracking-[0.2em] uppercase mb-4 block">¿Qué es Attenda?</span>
              <h2 className="text-3xl font-bold text-white mb-4">Un ecosistema de orquestación premium.</h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                Somos una plataforma integral que fusiona tecnología de punta con la delicadeza de la hotelería de lujo. Diseñamos un entorno donde cada interacción, desde la invitación hasta el ingreso, se siente intencional y elegante.
              </p>
            </div>
            {/* Subtle accent light */}
            <div className="absolute right-[-5%] top-[-5%] w-32 h-32 bg-[#5b3cdd22] blur-3xl rounded-full group-hover:bg-[#5b3cdd44] transition-colors duration-700"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section: ¿Para qué sirve? */}
            <div className="glass-heavy p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-500">
              <h3 className="text-xl font-bold text-white mb-3">¿Para qué sirve?</h3>
              <p className="text-white/50 text-base leading-relaxed">
                Centralizamos la gestión de invitados en tiempo real. Olvidate de las planillas. Nuestra app permite gestionar RSVP inteligentes, asignación de grupos y control de acceso mediante escaneo de QR instantáneo.
              </p>
            </div>

            {/* Section: ¿Cómo ayuda? */}
            <div className="glass-heavy p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-500 border-l border-l-[#a78bfa33]">
              <h3 className="text-xl font-bold text-white mb-3">¿Cómo ayuda?</h3>
              <p className="text-white/50 text-base leading-relaxed">
                Le devolvemos el control y la calma al organizador. Eliminamos la fricción logística en la puerta y garantizamos una base de datos impecable, permitiéndote enfocarte en lo que realmente importa: tu evento.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="text-center py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-8">¿Listo para transformar tu próximo evento?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-[#5b3cdd] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#6c4be0] transition-all shadow-[0_0_25px_rgba(91,60,221,0.2)]"
            >
              Comenzar ahora
            </Link>
            <Link 
              to="/" 
              className="text-white/60 hover:text-white px-10 py-4 font-bold text-lg transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
