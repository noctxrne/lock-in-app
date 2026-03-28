import React, { useState, useEffect, useContext } from 'react';
import { SessionContext } from '../context/SessionContext';
import { formatTime, getDateString } from '../services/timeCalculations';
import './LogsModal.css';

export function LogsModal({ isOpen, onClose }) {
  const { sessions } = useContext(SessionContext);
  const [selectedDate, setSelectedDate] = useState(getDateString());
  const [editingSession, setEditingSession] = useState(null);
  const [editData, setEditData] = useState({});

  const todaySessions = sessions.filter(s => s.date === selectedDate);

  if (!isOpen) return null;

  const handleEditStart = (session) => {
    setEditingSession(session.sessionId);
    setEditData({
      punchInTime: session.punchInTime,
      punchOutTime: session.punchOutTime,
      breaks: session.breaks
    });
  };

  const handleEditSave = async () => {
    // Update session with edited data
    const updatedSession = {
      ...sessions.find(s => s.sessionId === editingSession),
      ...editData
    };
    // Save to database (would call database service here)
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Delete this session?')) {
      // Delete from database (would call database service here)
    }
  };

  return (
    <div className="logs-modal-overlay" onClick={onClose}>
      <div className="logs-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="logs-modal-header">
          <h2>View & Edit Logs</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="logs-modal-body">
          <div className="date-picker">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {todaySessions.length === 0 ? (
            <div className="no-logs">
              <p>No entries for this date</p>
            </div>
          ) : (
            <div className="sessions-list">
              {todaySessions.map((session) => (
                <div key={session.sessionId} className="session-card">
                  {editingSession === session.sessionId ? (
                    // Edit Mode
                    <div className="edit-mode">
                      <div className="edit-field">
                        <label>Punch In:</label>
                        <input
                          type="time"
                          value={editData.punchInTime.substring(11, 16)}
                          onChange={(e) => {
                            const date = editData.punchInTime.substring(0, 10);
                            setEditData({
                              ...editData,
                              punchInTime: `${date}T${e.target.value}:00`
                            });
                          }}
                        />
                      </div>
                      <div className="edit-field">
                        <label>Punch Out:</label>
                        <input
                          type="time"
                          value={editData.punchOutTime.substring(11, 16)}
                          onChange={(e) => {
                            const date = editData.punchOutTime.substring(0, 10);
                            setEditData({
                              ...editData,
                              punchOutTime: `${date}T${e.target.value}:00`
                            });
                          }}
                        />
                      </div>
                      <div className="edit-buttons">
                        <button className="btn btn-primary btn-small" onClick={handleEditSave}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={() => setEditingSession(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="view-mode">
                      <div className="session-times">
                        <div className="time-row">
                          <span className="label">Punch In:</span>
                          <span className="time">{formatTime(session.punchInTime)}</span>
                        </div>
                        <div className="time-row">
                          <span className="label">Punch Out:</span>
                          <span className="time">{formatTime(session.punchOutTime)}</span>
                        </div>
                      </div>

                      {session.breaks && session.breaks.length > 0 && (
                        <div className="breaks-section">
                          <div className="breaks-header">Breaks ({session.breaks.length})</div>
                          {session.breaks.map((breakItem, idx) => (
                            <div key={idx} className="break-row">
                              <span className="break-time">
                                {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="session-stats">
                        <div className="stat">
                          <span>Worked:</span>
                          <strong>{session.workedHours}h</strong>
                        </div>
                      </div>

                      <div className="session-actions">
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleEditStart(session)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => handleDeleteSession(session.sessionId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}