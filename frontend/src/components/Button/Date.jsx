import React, { useState, useMemo, useEffect } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

const kegiatanMap = {
  "2025-07-18": "keagamaan",
  "2025-07-21": "kesenian",
  "2025-07-29": "lainnya",
};

const kegiatanOptions = [
  { value: "keagamaan", label: "Keagamaan" },
  { value: "kesenian", label: "Kesenian" },
  { value: "lainnya", label: "Lainnya" },
];

const formatDateKey = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Calendar = ({ value, onChange, onActivityChange }) => {
  const initialDate = value ? new Date(value) : new Date(2025, 6, 1);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(value ? formatDateKey(initialDate) : null);
  const [selectedActivity, setSelectedActivity] = useState("");

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setCurrentDate(date);
      setSelectedDate(formatDateKey(date));
    }
  }, [value]);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNames = ["Mn.", "Sn.", "Sl.", "Rb.", "Km.", "Jm.", "Sb."];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const setMonthYear = (month, year) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (dateKey, dateObj) => {
    setSelectedDate(dateKey);
    if (onChange) {
      onChange(dateObj);
    }
    const activity = kegiatanMap[dateKey] || "";
    setSelectedActivity(activity);
    if (onActivityChange) {
      onActivityChange(activity);
    }
  };

  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);
    if (onActivityChange) {
      onActivityChange(activity);
    }
    if (selectedDate) {
      kegiatanMap[selectedDate] = activity;
    }
  };

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);

    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();

    const weeks = [];
    let currentWeek = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateObj: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        isCurrentMonth: true,
        dateObj: new Date(year, month, day),
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        currentWeek.push({
          day: nextMonthDay,
          isCurrentMonth: false,
          dateObj: new Date(year, month + 1, nextMonthDay),
        });
        nextMonthDay++;
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [currentDate]);

  const getBgColor = (dateObj) => {
    const key = formatDateKey(dateObj);
    const type = kegiatanMap[key];
    if (!type) return "";
    switch (type) {
      case "keagamaan":
        return "bg-[#D6D6F3]";
      case "kesenian":
        return "bg-blue-300";
      case "lainnya":
        return "bg-green-300";
      default:
        return "";
    }
  };

  return (
    <div className="inline-flex flex-col gap-4 font-roboto"> {/* Tambahkan font-roboto di sini */}
      <div className="w-[498px] p-3 bg-white rounded-sm shadow-[0px_5px_5px_0px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="h-10 w-10 flex justify-center items-center hover:bg-netural-snow-grey rounded"
          >
            <RiArrowLeftSLine className="text-xl" /> {/* Remix Icon */}
          </button>

          <div className="flex gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => setMonthYear(Number(e.target.value), currentDate.getFullYear())}
              className="border border-gray-300 rounded px-2 py-1 font-roboto"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => setMonthYear(currentDate.getMonth(), Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 font-roboto"
            >
              {Array.from({ length: 21 }, (_, i) => 2020 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            className="h-10 w-10 flex justify-center items-center hover:bg-netural-snow-grey rounded"
          >
            <RiArrowRightSLine className="text-xl" /> {/* Remix Icon */}
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, idx) => (
            <div key={idx} className="text-center font-semibold text-gray-700 font-roboto">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex flex-col gap-1">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((dateObj, dayIndex) => {
                const key = formatDateKey(dateObj.dateObj);
                const isSelected = selectedDate === key;
                const isToday = dateObj.dateObj.toDateString() === new Date().toDateString();
                const bgColor = getBgColor(dateObj.dateObj);

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleDateSelect(key, dateObj.dateObj)}
                    className={`text-center text-sm font-bold cursor-pointer transition-all duration-200 p-2 rounded font-roboto
                      ${dateObj.isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                      ${bgColor}
                      ${isSelected ? "ring-2 ring-black" : ""}
                      ${isToday ? "bg-primary-tint3" : ""}
                      hover:scale-105 active:scale-95`}
                  >
                    {dateObj.day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Tanggal:</label>
          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                handleDateSelect(e.target.value, date);
                setCurrentDate(date);
              }
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full font-roboto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Jenis Kegiatan:</label>
          <select
            value={selectedActivity}
            onChange={handleActivityChange}
            className="border border-gray-300 rounded px-3 py-2 w-full font-roboto"
          >
            <option value="">Pilih Jenis Kegiatan</option>
            {kegiatanOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Calendar;