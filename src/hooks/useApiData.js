// src/hooks/useApiData.js
import { useState, useEffect, useRef } from 'react';

export function useApiData(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 useApiData: Fetching...');
        
        const result = await apiCall();
        
        console.log('🔄 useApiData: Fetched successfully', result);
        setData(result);
      } catch (err) {
        console.error('🔄 useApiData: Error', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
