import { useState, useCallback } from 'react';
import { calculateWorkedHours, generateSessionId, getDateString } from '../services/timeCalculations';
import database from '../services/database';

export function usePunchSession() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const [currentBreakStart, setCurrentBreakStart] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const punchIn = useCallback(() => {
    const now = new Date().toISOString();
    setPunchInTime(now);
    setIsPunchedIn(true);
    setIsOnBreak(false);
    setBreaks([]);
    setElapsedTime(0);
  }, []);

  const breakIn = useCallback(() => {
    if (!isPunchedIn) return;
    const now = new Date().toISOString();
    setCurrentBreakStart(now);
    setIsOnBreak(true);
  }, [isPunchedIn]);

  const breakOut = useCallback(() => {
    if (!isOnBreak || !currentBreakStart) return;
    const now = new Date().toISOString();
    setBreaks([...breaks, {
      id: `break-${breaks.length}`,
      startTime: currentBreakStart,
      endTime: now
    }]);
    setCurrentBreakStart(null);
    setIsOnBreak(false);
  }, [isOnBreak, currentBreakStart, breaks]);

  const punchOut = useCallback(async () => {
    if (!isPunchedIn || !punchInTime) return;

    const now = new Date().toISOString();
    const { workedHours } = calculateWorkedHours(punchInTime, now, breaks);

    const session = {
      sessionId: generateSessionId(),
      date: getDateString(),
      punchInTime,
      punchOutTime: now,
      breaks,
      workedHours,
      isModified: false,
      modificationHistory: []
    };

    await database.saveSession(session);

    setIsPunchedIn(false);
    setIsOnBreak(false);
    setPunchInTime(null);
    setBreaks([]);
    setCurrentBreakStart(null);
    setElapsedTime(0);

    return session;
  }, [isPunchedIn, punchInTime, breaks]);

  return {
    isPunchedIn,
    isOnBreak,
    punchInTime,
    breaks,
    currentBreakStart,
    elapsedTime,
    setElapsedTime,
    punchIn,
    breakIn,
    breakOut,
    punchOut
  };
}