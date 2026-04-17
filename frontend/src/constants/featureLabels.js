/**
 * Feature Labels Mapping
 * 
 * Maps internal feature keys from PaymentPackages to human-readable Spanish labels.
 * Used by both Pricing.jsx and PlanCard.jsx to display plan features.
 * 
 * @example
 * // Package returns: { "guest_management": true }
 * // Display: "Gestión de invitados"
 */
export const FEATURE_LABELS = {
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
