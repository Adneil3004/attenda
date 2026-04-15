import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

const FEATURE_LABELS = {
  seats: 'Invitados',
  events_per_month: 'Eventos por mes',
  guest_management: 'Gestión de invitados',
  table_layout: 'Distribución de mesas',
  task_management: 'Gestión de tareas',
  vendor_management: 'Gestión de proveedores',
  priority_support: 'Soporte prioritario',
  analytics: 'Analíticas',
  white_label: 'Marca blanca',
  api_access: 'Acceso API',
  dedicated_manager: 'Gerente dedicado',
  basic_support: 'Soporte básico',
  email_support: 'Soporte por email'
};

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await apiClient.get('/paymentpackages');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        {freePlan && (
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-10 flex flex-col ghost-border ambient-shadow">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">{freePlan.name}</h3>
            <p className="text-[var(--color-on-surface-variant)] mb-6 text-sm">{freePlan.description}</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-[var(--color-primary)]">
                {freePlan.price === 0 ? 'Free' : `$${freePlan.price}`}
              </span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {renderFeatures(freePlan.features).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--color-on-surface-variant)] text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-md font-semibold text-sm text-[var(--color-primary)] bg-[var(--color-surface-container-low)] hover:bg-[#e7e8e9] transition-colors">
              Get Started
            </button>
          </div>
        )}

        {/* Paid Plans - show first one as the "featured" one */}
        {paidPlans.length > 0 && (
          <div className="bg-[var(--color-primary)] rounded-2xl p-10 flex flex-col ambient-shadow transform md:-translate-y-4">
            <h3 className="text-2xl font-bold text-white mb-2">{paidPlans[0].name}</h3>
            <p className="text-[#c5c6d0] mb-6 text-sm">{paidPlans[0].description}</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">
                {paidPlans[0].hasDiscount 
                  ? `$${Math.round(paidPlans[0].price * (1 - paidPlans[0].discountPercentage / 100))}`
                  : `$${paidPlans[0].price}`
                }
              </span>
              <span className="text-[#c5c6d0] text-sm font-medium">
                {paidPlans[0].hasDiscount && paidPlans[0].discountPercentage > 0 
                  ? <span className="line-through text-sm opacity-60">${paidPlans[0].price}</span>
                  : null}
                {' '} / event
              </span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {renderFeatures(paidPlans[0].features).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#c9bfff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-md font-semibold text-sm text-[var(--color-on-secondary-fixed-variant)] bg-[var(--color-secondary-fixed)] hover:opacity-90 transition-opacity">
              Upgrade to {paidPlans[0].name}
            </button>
          </div>
        )}
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