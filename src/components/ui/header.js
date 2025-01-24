import React, { useState, useEffect } from 'react';
import { Zap,Moon, Sun } from 'lucide-react';





const NavigationBar = () =>{
      const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first, default to true if not set
        const savedMode = localStorage.getItem('darkMode');
        return savedMode !== null ? JSON.parse(savedMode) : true;
      });
    
      useEffect(() => {
        // Update localStorage when darkMode changes
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        // Update body class for global dark mode
        document.body.classList.toggle('dark', darkMode);
      }, [darkMode]);

    return (
        <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
          <div className="flex justify-center items-center gap-4">
            <span className="text-purple-500 font-bold">
              <Zap size={30} />
            </span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              InstaCode
            </span>
          </div>

          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    )
}

export default NavigationBar;