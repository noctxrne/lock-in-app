import React, { createContext, useState, useEffect } from 'react';
import database from '../services/database';

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await database.init();
        const savedSettings = await database.getSetting();
        setSettings(savedSettings);
        const allSessions = await database.getAllSessions();
        setSessions(allSessions);
      } catch (error) {
        console.error('Error initializing app:', error);
        setSettings(database.getDefaultSettings());
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const updateSettings = async (newSettings) => {
    await database.saveSetting(newSettings);
    setSettings(newSettings);
  };

  const updateSessions = async () => {
    const allSessions = await database.getAllSessions();
    setSessions(allSessions);
  };

  return (
    <SessionContext.Provider value={{ settings, sessions, loading, updateSettings, updateSessions }}>
      {children}
    </SessionContext.Provider>
  );
}