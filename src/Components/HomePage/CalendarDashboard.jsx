import React, { useEffect, useState, useRef } from "react";
import "../CSS/CalendarDashboard.css";
import { getTicketsWithId } from "../Services/TicketService";
import { CheckCircle, AlertCircle } from "lucide-react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";

const CalendarDashboard = () => {
  const [weeks, setWeeks] = useState([]);
  const [monthYear, setMonthYear] = useState("April 2025");
  const [totals, setTotals] = useState({ received: 0, closed: 0, pending: 0, outOfTat: 0 });
  const [selectedMonth, setSelectedMonth] = useState("2025-04");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const tickets = await getTicketsWithId();
      const now = new Date();
      const dailyMap = {};
      let totalReceived = 0;
      let totalClosed = 0;
      let totalPending = 0;
      let totalOutOfTat = 0;

      tickets.forEach(ticket => {
        const createdAt = new Date(ticket.createdAt);
        const dateKey = createdAt.toLocaleDateString("en-CA");
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;

        if (monthKey !== selectedMonth) return;

        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { received: 0, closed: 0, pending: 0, outOfTat: 0 };
        }

        dailyMap[dateKey].received += 1;
        totalReceived += 1;

        if (ticket.status === "CLOSED") {
          dailyMap[dateKey].closed += 1;
          totalClosed += 1;
        } else {
          dailyMap[dateKey].pending += 1;
          totalPending += 1;

          const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
          if (ticket.status === "IN_PROGRESS" && hoursDiff > 48) {
            dailyMap[dateKey].outOfTat += 1;
            totalOutOfTat += 1;
          }
        }
      });

      const [year, month] = selectedMonth.split("-").map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      const startDate = new Date(start);
      startDate.setDate(start.getDate() - start.getDay());
      const endDate = new Date(end);
      endDate.setDate(end.getDate() + (6 - end.getDay()));

      const weeksArray = [];
      let current = new Date(startDate);

      while (current <= endDate) {
        const week = [];

        for (let i = 0; i < 7; i++) {
          const key = current.toLocaleDateString("en-CA");
          const data = dailyMap[key] || { received: 0, closed: 0, pending: 0, outOfTat: 0 };

          week.push({ date: new Date(current), ...data });
          current.setDate(current.getDate() + 1);
        }

        weeksArray.push(week);
      }

      const displayDate = new Date(selectedMonth + "-01");
      const formattedMonth = displayDate.toLocaleString("default", { month: "long" });

      setMonthYear(`${formattedMonth} ${displayDate.getFullYear()}`);
      setWeeks(weeksArray);
      setTotals({ received: totalReceived, closed: totalClosed, pending: totalPending, outOfTat: totalOutOfTat });
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${year}-${month}`);
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const renderCell = (day) => {
    const { received, closed, pending, outOfTat, date } = day;
    const isEmpty = received === 0 && closed === 0 && pending === 0 && outOfTat === 0;

    return (
      <div className={`cell ${isEmpty ? "empty" : ""}`}>
        <div className="cell-date">{formatDate(date)}</div>
        {!isEmpty && (
          <>
            <div className="Ticket">
              <strong className="ticket-count">{received}</strong> Ticket
            </div>
            <div className="status-right">
              <div className="closed">
                <CheckCircle size={16} color="#22c55e" /> {closed}
              </div>
              <div className="pending">⏳ {pending}</div>
              {outOfTat > 0 && (
                <div className="out-of-tat">
                  <AlertCircle size={16} color="#f97316" /> Out OF TAT {outOfTat}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // 👇 Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="calendar-container" style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="calendar-title">📅 Ticket Summary - {monthYear}</h2>
        <div style={{ position: "relative" }} ref={calendarRef}>
          <button onClick={() => setShowCalendar(prev => !prev)} className="calendar-button">📆 Select Month</button>
          <AnimatePresence>
            {showCalendar && (
              <motion.div
                className="calendar-popup"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Calendar
                  onChange={handleMonthChange}
                  value={new Date(selectedMonth + "-01")}
                  view="month"
                  maxDetail="year"
                  showNeighboringMonth={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Existing Calendar Table (unchanged) */}
      <div className="calendar-grid expanded">
        <div className="calendar-header">Wk</div>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Total"].map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        {weeks.map((week, i) => {
          const weekTotal = week.reduce((acc, day) => {
            acc.received += day.received;
            acc.closed += day.closed;
            acc.pending += day.pending;
            acc.outOfTat += day.outOfTat;
            return acc;
          }, { received: 0, closed: 0, pending: 0, outOfTat: 0 });

          return (
            <React.Fragment key={i}>
              <div className="calendar-week-label">{14 + i}</div>
              {week.map((day, j) => (
                <div key={j} className="calendar-day">{renderCell(day)}</div>
              ))}
              <div className="calendar-day week-summary-cell">
                <div className="weekly-totals">
                  <div><strong>{weekTotal.received}</strong> 📨</div>
                  <div>{weekTotal.closed} ✅</div>
                  <div>{weekTotal.pending} ⏳</div>
                  {weekTotal.outOfTat > 0 && <div>{weekTotal.outOfTat} ⚠️</div>}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDashboard;
