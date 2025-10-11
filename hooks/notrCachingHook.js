import { useState, useEffect } from 'react';

const cache = new Map();

export function useCache(key, initialValue) {
  const [data, setData] = useState(() => cache.get(key) || initialValue);
  
  const setCache = (value) => {
    cache.set(key, value);
    setData(value);
    console.log(value);
  };
  
  const getCache = () => cache.get(key);
  return { data, setCache, getCache };
}