import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/SessionContext';
import { formatTime, getDateString } from '../services/timeCalculations';
import './LogsPage.css';

export function LogsPage() {
  const { sessions } = useContext(SessionContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const sessionsByDate = {};
  sessions.forEach(session => {
    if (!sessionsByDate[session.date]) {
      sessionsByDate[session.date] = [];
    }
    sessionsByDate[session.date].push(session);
  });

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysNum = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysNum; i++) {
    days.push(i);
  }

  return (
    <div className="logs-page">
      <div className="calendar-header">
        <h2>{monthYear}</h2>
        <div className="month-nav">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>◀</button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>▶</button>
        </div>
      </div>

      <div className="calendar">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((day, index) => {
            const dateStr = day ? getDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
            const hasSessions = dateStr && sessionsByDate[dateStr] && sessionsByDate[dateStr].length > 0;

            return (
              <div key={index} className={`day ${day ? 'active' : 'empty'} ${hasSessions ? 'has-data' : ''}`}>
                {day && (
                  <>
                    <span className="day-num">{day}</span>
                    {hasSessions && <span className="indicator">✓</span>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary">
        <h3>Summary</h3>
        <p>Days with records: {Object.keys(sessionsByDate).length}</p>
        <p>Total sessions: {sessions.length}</p>
      </div>
    </div>
  );
}