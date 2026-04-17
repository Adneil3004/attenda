/**
 * PlanCard Component
 * 
 * Displays the user's current subscription plan with dynamic data
 * from the PaymentPackages API. Shows plan details, features,
 * and subscription management buttons.
 * 
 * @prop {Object} matchedPackage - The matched package from usePlanDetails
 * @prop {boolean} isBusiness - Whether account is Business or Personal
 * @prop {boolean} loading - Loading state
 * 
 * @example
 * <PlanCard
 *   matchedPackage={matchedPackage}
 *   isBusiness={dashboardData?.isBusiness}
 *   loading={planLoading}
 * />
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURE_LABELS } from '../../constants/featureLabels';

const PlanCard = ({ matchedPackage, isBusiness, loading }) => {
  const navigate = useNavigate();
  
  // Modal visibility for cancel confirmation
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Navigate to pricing page to manage/upgrade subscription
  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  // Handle cancel confirmation - TODO: connect to backend API when available
  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    alert('Para cancelar tu suscripción, contacta a soporte.');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Loading State
  // ═══════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#0c142c] via-[#16214d] to-[#0c142c] rounded-xl p-7 text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-1/3 bg-white/20 rounded" />
          <div className="h-10 w-2/3 bg-white/20 rounded" />
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
          <div className="h-12 w-full bg-white/10 rounded" />
          <div className="h-10 w-full bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS: Extract and format data from matchedPackage
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get active features from package.features
   * Filters for true values and maps to human-readable labels
   */
  const getActiveFeatures = () => {
    if (!matchedPackage?.features) return [];
    return Object.entries(matchedPackage.features)
      .filter(([, enabled]) => enabled === true)
      .map(([key]) => FEATURE_LABELS[key] || key);
  };

  /**
   * Format guest count display
   * 9999 = unlimited invitations
   */
  const guestCountDisplay = matchedPackage?.guestCount === 9999
    ? 'Invitaciones Ilimitadas'
    : `${matchedPackage?.guestCount || 20} Invitaciones`;

  /**
   * Format price display
   * 0 = free plan, otherwise monthly price
   */
  const priceDisplay = matchedPackage?.price === 0
    ? 'Gratis'
    : matchedPackage?.price
      ? `$${matchedPackage.price}/mes`
      : null;

  /**
   * Get tier-specific description
   */
  const getDescription = () => {
    const tier = matchedPackage?.type?.toLowerCase();
    if (tier === 'elite' || tier === 'planner') {
      return 'Full access to concierge services, priority guest seating, and digital calligraphy.';
    }
    return 'Gestiona tus eventos con facilidad y estilo. Actualiza para más funciones.';
  };

  // Extract display values
  const planName = matchedPackage?.name || matchedPackage?.type || 'Free';
  const badgeType = isBusiness ? 'Business' : 'Personal';
  const activeFeatures = getActiveFeatures();

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Main Plan Card
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Card Container - Dark gradient with sheen effect */}
      <div className="group bg-gradient-to-br from-[#0c142c] via-[#16214d] to-[#0c142c] rounded-xl p-7 text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
        {/* Animated sheen effect on hover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-[1500ms] ease-in-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Plan Header: Name + Badge */}
        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#86a3d9] font-bold mb-2">Current Plan</p>
          <h3 className="text-4xl font-display font-light text-white tracking-tight capitalize">
            {planName} <span className="text-sm text-[#86a3d9] font-normal italic ml-1 opacity-80">/ {badgeType}</span>
          </h3>
        </div>

        {/* Price Display */}
        {priceDisplay && (
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white">{priceDisplay}</p>
          </div>
        )}

        {/* Plan Description */}
        <p className="relative z-10 text-xs text-white/70 leading-relaxed font-light">
          {getDescription()}
        </p>

        {/* Features List */}
        <ul className="relative z-10 space-y-3.5">
          {/* Guest count - always shown first */}
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/20">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs text-white/90 font-medium">{guestCountDisplay}</span>
          </li>

          {/* Dynamic features from package (max 5) */}
          {activeFeatures.slice(0, 5).map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/20">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-white/90 font-medium">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="relative z-10 pt-4">
          <button
            onClick={handleManageSubscription}
            className="w-full py-3 bg-white text-[#0f1b3d] font-bold text-sm rounded-lg shadow-[0_4px_12px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Manage Subscription
          </button>
        </div>

        <div className="relative z-10 text-center">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-[11px] text-white/40 hover:text-white transition-colors tracking-widest uppercase font-bold"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CANCEL SUBSCRIPTION MODAL
          TODO: Connect to backend API when cancel subscription endpoint exists
          ═══════════════════════════════════════════════════════════════════════ */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop - closes modal on click */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowCancelModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="p-8">
              {/* Warning Icon + Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 leading-tight">Cancelar Suscripción</h3>
              </div>

              {/* Warning Message */}
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                ¿Estás seguro de que quieres cancelar tu suscripción? Perderás acceso a todas las funciones premium de tu plan actual.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanCard;
