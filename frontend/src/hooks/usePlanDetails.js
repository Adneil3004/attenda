/**
 * usePlanDetails Hook
 * 
 * Fetches available payment packages from the backend and matches
 * the user's current tier (from dashboardData) with the corresponding package.
 * 
 * @param {Object} dashboardData - Event dashboard data containing capacityTier
 * @returns {Object} { packages, loading, error, matchedPackage }
 * 
 * @example
 * const { loading, matchedPackage } = usePlanDetails(dashboardData);
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../lib/api';

export const usePlanDetails = (dashboardData) => {
  // Packages list from /api/paymentpackages
  const [packages, setPackages] = useState([]);
  
  // Loading state while fetching
  const [loading, setLoading] = useState(true);
  
  // Error message if fetch fails
  const [error, setError] = useState(null);

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        // GET /api/paymentpackages - returns all active pricing tiers
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

  // Match user's tier to package (case-insensitive)
  // Dashboard returns: "FREE", "STANDARD", "PREMIUM", "PLANNER"
  // DB stores: "free", "standard", "premium", "planner"
  const matchedPackage = useMemo(() => {
    // Normalize tier to lowercase for comparison
    const tier = dashboardData?.capacityTier?.toLowerCase() || 'free';
    
    // Find matching package by type
    return packages.find(p => p.type?.toLowerCase() === tier) || null;
  }, [packages, dashboardData]);

  return { packages, loading, error, matchedPackage };
};
