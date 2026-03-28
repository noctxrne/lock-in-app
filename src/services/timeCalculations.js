// Time Calculation Logic

export function timeStringToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToHours(minutes) {
  return (minutes / 60).toFixed(2);
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hrs`;
  return `${hours} hrs ${mins} mins`;
}

export function calculateWorkedHours(punchIn, punchOut, breaks = []) {
  const punchInDate = new Date(punchIn);
  const punchOutDate = new Date(punchOut);
  
  const totalMinutes = (punchOutDate - punchInDate) / (1000 * 60);
  const breakMinutes = breaks.reduce((total, breakPeriod) => {
    const breakStartDate = new Date(breakPeriod.startTime);
    const breakEndDate = new Date(breakPeriod.endTime);
    return total + (breakEndDate - breakStartDate) / (1000 * 60);
  }, 0);

  const workedMinutes = totalMinutes - breakMinutes;
  return {
    totalMinutes,
    breakMinutes,
    workedMinutes,
    workedHours: parseFloat(minutesToHours(workedMinutes))
  };
}

export function isTimeInWindow(time, windowStart, windowEnd) {
  const timeMinutes = timeStringToMinutes(time.split('T')[1].substring(0, 5));
  const startMinutes = timeStringToMinutes(windowStart);
  const endMinutes = timeStringToMinutes(windowEnd);

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

export function calculateDailyProgress(sessions, requiredHours) {
  if (!sessions.length) {
    return {
      completed: 0,
      target: requiredHours,
      remaining: requiredHours,
      extra: 0,
      percentage: 0
    };
  }

  const totalWorked = sessions.reduce((sum, session) => {
    return sum + (session.workedHours || 0);
  }, 0);

  const remaining = Math.max(0, requiredHours - totalWorked);
  const extra = Math.max(0, totalWorked - requiredHours);

  return {
    completed: parseFloat(totalWorked.toFixed(2)),
    target: requiredHours,
    remaining: parseFloat(remaining.toFixed(2)),
    extra: parseFloat(extra.toFixed(2)),
    percentage: Math.min(100, (totalWorked / requiredHours) * 100)
  };
}

export function calculateMonthlyProgress(sessions, requiredHours, workingDays) {
  const target = requiredHours * workingDays;
  const completed = sessions.reduce((sum, session) => {
    return sum + (session.workedHours || 0);
  }, 0);

  return {
    target: parseFloat(target.toFixed(2)),
    completed: parseFloat(completed.toFixed(2)),
    remaining: parseFloat(Math.max(0, target - completed).toFixed(2)),
    extra: parseFloat(Math.max(0, completed - target).toFixed(2)),
    percentage: Math.min(100, (completed / target) * 100),
    daysRemaining: workingDays - sessions.length
  };
}

export function getDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function generateSessionId() {
  return `${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`;
}