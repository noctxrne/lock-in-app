import React, { useState, useEffect, useContext } from 'react';
import { usePunchSession } from '../hooks/usePunchSession';
import { SessionContext } from '../context/SessionContext';
import { formatTime, formatDuration } from '../services/timeCalculations';
import './PunchPage.css';
import { LogsModal } from './LogsModal';

export function PunchPage() {
  const { isPunchedIn, isOnBreak, punchInTime, breaks, punchIn, breakIn, breakOut, punchOut } = usePunchSession();
  const { settings } = useContext(SessionContext);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showLogsModal, setShowLogsModal] = useState(false); // ✅ ADDED

  useEffect(() => {
    if (!isPunchedIn) return;

    const interval = setInterval(() => {
      if (punchInTime) {
        const now = new Date();
        const diff = Math.floor((now - new Date(punchInTime)) / 1000);
        setElapsedTime(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPunchedIn, punchInTime]);

  const formatElapsed = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalBreakTime = () => {
    let total = 0;
    breaks.forEach(b => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      total += Math.floor((end - start) / 1000);
    });
    return total;
  };

  return (
    <div className="punch-page">
      <div className="header">
        <h1>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</h1>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="status-container">
        {!isPunchedIn ? (
          <div className="status-idle">
            <h2>Ready to work?</h2>
            <p>Tap Punch In to start</p>
          </div>
        ) : isOnBreak ? (
          <div className="status-break">
            <h2>⏸ ON BREAK</h2>
            <p>Break started at {punchInTime && formatTime(punchInTime)}</p>
          </div>
        ) : (
          <div className="status-working">
            <h2>✓ PUNCHED IN</h2>
            <p>Since {punchInTime && formatTime(punchInTime)}</p>
          </div>
        )}
      </div>

      <div className="elapsed-time">
        <h1>{formatElapsed(elapsedTime)}</h1>
      </div>

      <div className="buttons-container">
        {!isPunchedIn ? (
          <button className="btn btn-primary btn-large" onClick={punchIn}>
            PUNCH IN
          </button>
        ) : (
          <>
            <button className={`btn btn-secondary ${isOnBreak ? 'btn-active' : ''}`} onClick={isOnBreak ? breakOut : breakIn}>
              {isOnBreak ? 'BREAK OUT' : 'BREAK IN'}
            </button>
            <button className="btn btn-danger btn-large" onClick={punchOut}>
              PUNCH OUT
            </button>
          </>
        )}
      </div>

      {isPunchedIn && (
        <div className="stats-container">
          <div className="stat-item">
            <span>Break Time Used:</span>
            <strong>{formatDuration(Math.floor(getTotalBreakTime() / 60))}</strong>
          </div>
          <div className="stat-item">
            <span>Breaks Taken:</span>
            <strong>{breaks.length}</strong>
          </div>
        </div>
      )}

      {/* ✅ ADDED BUTTON */}
      <button 
        className="quick-access-button"
        onClick={() => setShowLogsModal(true)}
      >
        📋 View & Edit Logs for Today
      </button>

      {/* ✅ ADDED MODAL */}
      <LogsModal 
        isOpen={showLogsModal} 
        onClose={() => setShowLogsModal(false)} 
      />
    </div>
  );
}