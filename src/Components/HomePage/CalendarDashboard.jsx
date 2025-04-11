import React, { useEffect, useState, useRef } from "react";
import "../CSS/CalendarDashboard.css";
import { getTicketsWithId } from "../Services/TicketService";
import { CheckCircle, AlertCircle } from "lucide-react";

const CalendarDashboard = () => {
  const [weeks, setWeeks] = useState([]);
  const [monthYear, setMonthYear] = useState("April 2025");
  const [totals, setTotals] = useState({ received: 0, closed: 0, pending: 0, outOfTat: 0 });
  const [selectedMonth, setSelectedMonth] = useState("2025-04");

  const monthInputRef = useRef(null);

  const handleTitleClick = () => {
    if (monthInputRef.current?.showPicker) {
      monthInputRef.current.showPicker();
    } else {
      monthInputRef.current?.focus();
    }
  };

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
        const dateKey = createdAt.toLocaleDateString("en-CA"); // yyyy-mm-dd (local timezone safe)
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

  return (
    <div className="calendar-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="calendar-title">
          📅 Ticket Summary - {monthYear}
        </h2>
        <div>
          <button onClick={handleTitleClick} className="calendar-button">📆 Select Month</button>
          <input
            type="month"
            ref={monthInputRef}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              visibility: "hidden",
              position: "absolute",
              width: 0,
              height: 0,
              padding: 0,
              border: 0
            }}
          />
        </div>
      </div>

      <div className="calendar-grid expanded">
        <div className="calendar-header">Wk</div>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Total"].map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}

        {weeks.map((week, i) => {
          const weekTotal = week.reduce(
            (acc, day) => {
              acc.received += day.received;
              acc.closed += day.closed;
              acc.pending += day.pending;
              acc.outOfTat += day.outOfTat;
              return acc;
            },
            { received: 0, closed: 0, pending: 0, outOfTat: 0 }
          );

          return (
            <React.Fragment key={i}>
              <div className="calendar-week-label">{14 + i}</div>
              {week.map((day, j) => (
                <div key={j} className="calendar-day">
                  {renderCell(day)}
                </div>
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
