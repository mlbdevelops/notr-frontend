import { useState, useEffect, useRef } from 'react';

export default function DarkTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const checkBox = useRef(null);
  
  useEffect(() => {
    setIsDarkMode(localStorage.getItem('darkTheme') === 'true' || false);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkTheme', isDarkMode);
    if (document.body) {
      document.body.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div>
      <p>Enable dark mode</p>
      <input
        onClick={toggleTheme}
        ref={checkBox}
        type="checkbox"
        checked={isDarkMode}
      />
    </div>
  );
}
