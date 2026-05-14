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
  seats: 'Guests',
  events_per_month: 'Events per month',
  guest_management: 'Guest Management',
  table_layout: 'Table Layout',
  task_management: 'Task Management',
  vendor_management: 'Vendor Management',
  priority_support: 'Priority Support',
  analytics: 'Analytics',
  white_label: 'White Label',
  api_access: 'API Access',
  dedicated_manager: 'Dedicated Manager',
  basic_support: 'Basic Support',
  email_support: 'Email Support'
};
