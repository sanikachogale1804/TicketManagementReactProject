// src/components/CategoryStorageChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../CSS/CategoryChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryStorageChart = ({ reports }) => {
  const categoryCounts = {
    "Category 1 (0-7 days)": 0,
    "Category 2 (8-14 days)": 0,
    "Category 3 (15-30 days)": 0,
    "Category 4 (30+ days)": 0,
  };

  reports.forEach((report) => {
    const days = report.recordingDays;
    if (days >= 0 && days <= 7) categoryCounts["Category 1 (0-7 days)"]++;
    else if (days >= 8 && days <= 14) categoryCounts["Category 2 (8-14 days)"]++;
    else if (days >= 15 && days <= 30) categoryCounts["Category 3 (15-30 days)"]++;
    else categoryCounts["Category 4 (30+ days)"]++;
  });

  const labels = Object.keys(categoryCounts);
  const values = Object.values(categoryCounts);

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#00C0C3', '#D47C1B', 'green', 'rgb(172, 11, 212)'],
        hoverBackgroundColor: ['#00C0C3', '#D47C1B', 'green', 'rgb(175, 66, 202)'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-card">
      <div className="chart-header">Cameras per Category</div>
      <div className="chart-content">
        <div className="chart-pie">
          <Doughnut data={data} options={options} />
        </div>
        <div className="chart-summary">
          {labels.map((label, index) => (
            <div className="summary-item" key={label}>
              <span
                className="dot"
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
              />{' '}
              <strong>{label}</strong> 
              {/* {values[index]} Cameras */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStorageChart;
