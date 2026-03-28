import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/SessionContext';
import './SettingsPage.css';

export function SettingsPage({ darkMode, toggleDarkMode }) {
  const { settings, updateSettings } = useContext(SessionContext);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  if (!localSettings) return <div>Loading...</div>;

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-section">
        <h3>Work Hours</h3>
        <div className="setting-item">
          <label>Work Start Time</label>
          <input
            type="time"
            value={localSettings.workStart}
            onChange={(e) => handleChange('workStart', e.target.value)}
          />
        </div>
        <div className="setting-item">
          <label>Work End Time</label>
          <input
            type="time"
            value={localSettings.workEnd}
            onChange={(e) => handleChange('workEnd', e.target.value)}
          />
        </div>
        <div className="setting-item">
          <label>Required Hours per Day</label>
          <input
            type="number"
            value={localSettings.requiredHours}
            onChange={(e) => handleChange('requiredHours', parseInt(e.target.value))}
            min="1"
            max="12"
          />
        </div>
        <div className="setting-item">
          <label>Break Allowance (hours)</label>
          <input
            type="number"
            value={localSettings.breakAllocation}
            onChange={(e) => handleChange('breakAllocation', parseFloat(e.target.value))}
            min="0.5"
            max="3"
            step="0.5"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Monthly Settings</h3>
        <div className="setting-item">
          <label>Working Days per Month</label>
          <input
            type="number"
            value={localSettings.workingDaysPerMonth}
            onChange={(e) => handleChange('workingDaysPerMonth', parseInt(e.target.value))}
            min="15"
            max="30"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-item">
          <label>Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </div>
      </div>

      <div className="info">
        <p>All your data is stored locally on your device. No data is sent to any server.</p>
      </div>
    </div>
  );
}