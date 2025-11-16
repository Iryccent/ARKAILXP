import React from 'react';

const CalendarPanel = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const currentMonthName = today.toLocaleString('en-US', { month: 'long' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - (firstDay === 0 ? 6 : firstDay - 1);
    if (day > 0 && day <= daysInMonth) {
      return day;
    }
    return null;
  });

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold capitalize" style={{ color: 'var(--text-light)' }}>{currentMonthName} {year}</h3>
        <div className="flex gap-2">
          <button className="p-1 rounded-md hover:bg-slate-700/50">&lt;</button>
          <button className="p-1 rounded-md hover:bg-slate-700/50">&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
          <div key={day} className="text-xs font-bold" style={{ color: 'var(--text-dark)' }}>{day}</div>
        ))}
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`calendar-day ${day === null ? 'other-month' : ''} ${day === today.getDate() ? 'today' : ''} ${day === 27 ? 'event' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPanel;