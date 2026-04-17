import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { FEATURE_LABELS } from '../constants/featureLabels';

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log('Fetching packages...');
        const data = await apiClient.get('/paymentpackages');
        console.log('Packages data:', data);
        setPackages(data || []);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-on-surface-variant)]">Cargando planes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Separate free and paid plans
  const freePlan = packages.find(p => p.type === 'free');
  const paidPlans = packages.filter(p => p.type !== 'free').sort((a, b) => a.price - b.price);

  const renderFeatures = (features) => {
    if (!features) return [];
    return Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => FEATURE_LABELS[key] || key);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">Simple, transparent pricing.</h1>
        <p className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
          Choose the plan that fits the scale of your event. No hidden fees or surprise charges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Free Plan */}
        {freePlan && (
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 flex flex-col border border-[var(--color-outline-variant)]">
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{freePlan.name}</h3>
            <p className="text-[var(--color-on-surface-variant)] mb-4 text-sm">{freePlan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--color-primary)]">
                {freePlan.price === 0 ? 'Free' : `$${freePlan.price}`}
              </span>
            </div>
            
            <ul className="space-y-3 mb-6 flex-1">
              {renderFeatures(freePlan.features).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--color-on-surface-variant)]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Paid Plans - show all */}
        {paidPlans.map((plan, idx) => (
          <div key={idx} className={`rounded-2xl p-6 flex flex-col ${idx === 0 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]'}`}>
            <h3 className={`text-xl font-bold mb-2 ${idx === 0 ? 'text-white' : 'text-[var(--color-primary)]'}`}>{plan.name}</h3>
            <p className={`mb-4 text-sm ${idx === 0 ? 'text-[#c5c6d0]' : 'text-[var(--color-on-surface-variant)]'}`}>{plan.description}</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${idx === 0 ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                ${plan.price}
              </span>
              <span className={`text-sm ${idx === 0 ? 'text-[#c5c6d0]' : 'text-[var(--color-on-surface-variant)]'}`}>
                / event
              </span>
            </div>
            
            <ul className="space-y-3 mb-6 flex-1">
              {renderFeatures(plan.features).map((feature, fidx) => (
                <li key={fidx} className="flex items-start gap-2 text-sm">
                  <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${idx === 0 ? 'text-[#c9bfff]' : 'text-[var(--color-secondary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={idx === 0 ? 'text-white' : 'text-[var(--color-on-surface-variant)]'}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-20 pt-12 border-t border-[var(--color-outline-variant)]">
        <p className="text-[var(--color-on-surface-variant)] mb-4">
          ¿Listo para dar el siguiente paso?
        </p>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Regístrate y prueba nuestro servicio gratis. No requerimos tarjeta de crédito.
        </p>
        <a 
          href="/signup" 
          className="inline-block px-8 py-3 rounded-md font-semibold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition-opacity"
        >
          Crear cuenta gratis
        </a>
      </div>
    </div>
  );
};

export default Pricing;