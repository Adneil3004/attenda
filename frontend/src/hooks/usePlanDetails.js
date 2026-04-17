import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../lib/api';

export const usePlanDetails = (dashboardData) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
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

  const matchedPackage = useMemo(() => {
    const tier = dashboardData?.capacityTier?.toLowerCase() || 'free';
    return packages.find(p => p.type?.toLowerCase() === tier) || null;
  }, [packages, dashboardData]);

  return { packages, loading, error, matchedPackage };
};