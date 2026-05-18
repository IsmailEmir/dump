import React, { useState, useEffect } from 'react';
import '../styles.css';
import { useTranslation } from '../../../i18n/LanguageContext';

const DateTimePicker = ({ selectedDate, onDateChange, selectedTime, onTimeChange }) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ];

  const daysOfWeek = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    // getDay(): 0 = Вс, 1 = Пн. Нам нужно чтобы Пн был 0-м индексом для массива дней
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    return { days, startOffset };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateChange(newDate);
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const renderCalendarDays = () => {
    const { days, startOffset } = getDaysInMonth(currentMonth);
    const calendarCells = [];

    // Пустые ячейки до начала месяца
    for (let i = 0; i < startOffset; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Дни месяца
    for (let day = 1; day <= days; day++) {
      const isSelected = selectedDate && isSameDay(selectedDate, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      const isCurrentDay = isToday(day);

      let className = "calendar-day";
      if (isSelected) className += " selected";
      if (isCurrentDay) className += " today";

      calendarCells.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <div className="custom-datetime-picker">
      <div className="calendar-container">
        <div className="calendar-header">
          <button type="button" className="nav-btn prev" onClick={handlePrevMonth}></button>
          <span className="current-month-label">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button type="button" className="nav-btn next" onClick={handleNextMonth}></button>
        </div>

        <div className="weekdays">
          {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
        </div>

        <div className="days-grid">
          {renderCalendarDays()}
        </div>
      </div>

      <div className="time-input-container">
        <label>{t('time')}</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="time-input"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;