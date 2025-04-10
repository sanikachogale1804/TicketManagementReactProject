import React from "react";
import "../CSS/CalendarDashboard.css";

const data = [
  ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "WkTotal (Avg)"],
  [
    "14",
    "",
    "",
    `661\n↑ 83.1% (361)`,
    `454\n↑ 17.62% (386)`,
    `415\n↑ 48.21% (280)`,
    `418\n↑ 43.15% (292)`,
    `667\n↑ 50.23% (444)`,
    "2615 (523)",
  ],
  [
    "15",
    `1278\n↑ 114.79% (595)`,
    `459\n↑ 58.28% (290)`,
    `545\n↑ 91.9% (284)`,
    `236\n↓ 29.13% (333)`,
    "",
    "",
    "",
    "2518 (629.5)",
  ],
  ["16", "", "", "", "", "", "", "", ""],
  ["17", "", "", "", "", "", "", "", ""],
  ["18", "1278", "459", "1206", "690", "415", "418", "667", "5133"],
];

const formatCell = (cell) => {
  const parts = cell.split("\n");
  if (parts.length === 1) return <>{cell}</>;

  const value = parts[0];
  const trendText = parts[1];
  const isUp = trendText.includes("↑");
  const trendClass = isUp ? "up" : "down";

  return (
    <div>
      <div className="main-value">{value}</div>
      <div className={`trend-text ${trendClass}`}>{trendText}</div>
    </div>
  );
};

const CalendarDashboard = () => {
  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>
      <div className="table-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              {data[0].map((header, i) => (
                <th key={i} className="calendar-header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`calendar-cell ${
                      cell.includes("↓")
                        ? "down"
                        : cell.includes("↑")
                        ? "up"
                        : ""
                    }`}
                  >
                    {formatCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarDashboard;
