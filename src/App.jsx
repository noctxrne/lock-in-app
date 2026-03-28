import React, { useState, useEffect } from 'react';
import { SessionProvider } from './context/SessionContext';
import { PunchPage } from './components/PunchPage';
import { LogsPage } from './components/LogsPage';
import { SettingsPage } from './components/SettingsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('punch');
  const [darkMode, setDarkMode] = useState(() => {
    // Get dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <SessionProvider>
      <div className="app">
        <div className="page-container">
          {currentPage === 'punch' && <PunchPage />}
          {currentPage === 'logs' && <LogsPage />}
          {currentPage === 'settings' && (
            <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          )}
        </div>

        <nav className="bottom-nav">
          <button
            className={`nav-btn ${currentPage === 'punch' ? 'active' : ''}`}
            onClick={() => setCurrentPage('punch')}
            title="Punch In/Out"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Clock/Timer Icon */}
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>
          <button
            className={`nav-btn ${currentPage === 'logs' ? 'active' : ''}`}
            onClick={() => setCurrentPage('logs')}
            title="View Logs"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Calendar/Grid Icon */}
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
          <button
            className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
            title="Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Gear/Settings Icon */}
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24"></path>
            </svg>
          </button>
        </nav>
      </div>
    </SessionProvider>
  );
}

export default App;