// src/hooks/useAsync.js
import { useState, useCallback } from 'react';

export function useAsync(asyncFunction) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback((...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    
    return asyncFunction(...args)
      .then((response) => {
        setData(response);
        setStatus('success');
        return response;
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);

  return { execute, status, data, error, isLoading: status === 'pending' };
}