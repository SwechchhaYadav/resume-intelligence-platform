import { useEffect, useState } from 'react';

export default function useDelayedLoading(delay = 600) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timeout);
  }, [delay]);

  return loading;
}
