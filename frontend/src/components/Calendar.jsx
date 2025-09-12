import React, { useState } from "react";

const Calendar = ({ shows }) => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // Function to get the number of days in a month
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    // Function to get the first day of the month
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);

    // Create an array for days of the month
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Function to go to the previous month
    const goToPreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    // Function to go to the next month
    const goToNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div className="calendar">
            <div className="flex justify-center mb-4 items-center">
                <button onClick={goToPreviousMonth} className="border p-2 mr-2">&lt;</button>
                <div className="flex items-center">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="border p-2 mr-2"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border p-2"
                    >
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={currentDate.getFullYear() + i}>
                                {currentDate.getFullYear() + i}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={goToNextMonth} className="border p-2 ml-2">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="font-semibold text-center">{day}</div>
                ))}
                {/* Empty boxes for days before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={i} className="border p-2"></div>
                ))}
                {calendarDays.map((day) => {
                    const dateString = `${selectedYear}-${selectedMonth + 1}-${day}`;
                    const showsForDate = shows.filter(show => new Date(show.date).toLocaleDateString() === new Date(dateString).toLocaleDateString());

                    return (
                        <div key={day} className="border p-2">
                            <div className="text-center">{day}</div>
                            {showsForDate.length > 0 && (
                                <ul className="mt-1">
                                    {showsForDate.map(show => {
                                        const showDate = new Date(show.date);
                                        const isShowPast = showDate < currentDate;
                                        const textColor = isShowPast ? 'text-red-500' : 'text-green-500';

                                        return (
                                            <li key={show._id} className={`text-sm ${textColor}`}>
                                                <a href={`/shows/${show._id}`} className="hover:underline">{show.name}</a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
