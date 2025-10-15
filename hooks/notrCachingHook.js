import { useState, useEffect } from 'react';

const cache = new Map();

export function useCache(key, initialValue) {
  const [data, setData] = useState(() => cache.get(key) || initialValue);
  
  const setCache = (value) => {
    cache.set(key, value);
    setData(value);
  };
  
  const saveProvider = (key, value) => {
    cache.set(key, value);
    setData(value);
  };
  
  const clear = () => cache.clear()
  const remove = (elem) => cache.delete(elem)
  const getCache = () => cache.get(key);
  const getProvider = (keyElem) => cache.get(keyElem);
  
  return { 
    data, 
    setCache,
    getCache,
    clear, 
    remove,
    saveProvider,
    getProvider,
  };
}