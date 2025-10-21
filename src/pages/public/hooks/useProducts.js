import { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/products';

export const useProducts = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const arr = await getAllProducts();
        if (!ignore) setData(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (!ignore) setErr(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return { data, isLoading, error };
};
