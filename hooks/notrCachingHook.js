import { useState, useEffect, useRef, useCallback } from 'react';

const cache = new Map();

const isExpired = (timestamp, ttl) => {
  if (ttl === null || ttl === undefined || ttl < 0) return false;
  return Date.now() - timestamp > ttl;
};

export function useCache(cacheKey, fetcher, options = {}) {
  const { ttl = 300000, enabled = true, refetchInterval = null } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const fetcherRef = useRef(fetcher);
  
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);
  
  const intervalId = useRef(null);
  const fetchData = useCallback(async (isRefetch = false) => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      return;
    }
    
    const cacheEntryKey = `data-${cacheKey}`;
    const cacheTimestampKey = `timestamp-${cacheKey}`;
    const cachedData = cache.get(cacheEntryKey);
    const cachedTimestamp = cache.get(cacheTimestampKey);
    
    if (cachedData && cachedTimestamp && !isExpired(cachedTimestamp, ttl) && !isRefetch) {
      
      if (isMounted.current) {
        setData(cachedData);
        setError(null);
        setIsLoading(false);
      }
      return;
    }
    
    if (isMounted.current) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      const result = await fetcherRef.current();
      if (isMounted.current) {
        const now = Date.now();
        cache.set(cacheEntryKey, result);
        cache.set(cacheTimestampKey, now);
        setData(result);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(`Error fetching data for cache key "${cacheKey}":`, err);
      if (isMounted.current) {
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    }
  }, [cacheKey, ttl, enabled, fetcherRef]);
  
  useEffect(() => {
    fetchData(); if (refetchInterval !== null && refetchInterval > 0) {
      intervalId.current = setInterval(() => {
        fetchData(true);
      }, refetchInterval);
    }
    
    return () => {
      isMounted.current = false;
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [fetchData, refetchInterval]);
  
  const clearCache = useCallback(() => {
    cache.delete(`data-${cacheKey}`);
    cache.delete(`timestamp-${cacheKey}`);
    setData(null);
    setError(null);
    setIsLoading(true);
    fetchData();
  }, [cacheKey, fetchData]);
  
  return { data, error, isLoading, clearCache, refetch: () => fetchData(true) };
}

export const clearAllCache = () => {
  cache.clear();
  console.log('All cache cleared.');
}