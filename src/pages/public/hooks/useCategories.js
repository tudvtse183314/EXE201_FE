import { useEffect, useState } from 'react';
import { getAllCategories } from '../../../services/categories';

export const useCategories = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const arr = await getAllCategories();
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
