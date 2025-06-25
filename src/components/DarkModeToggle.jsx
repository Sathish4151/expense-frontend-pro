import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);
  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 right-4 p-2 bg-white/20 dark:bg-gray-700/20 rounded-full hover:shadow-lg transition-shadow"
    >
      {dark ? '🌞' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;