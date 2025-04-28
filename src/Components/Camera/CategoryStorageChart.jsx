import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import '../CSS/CategoryStorageChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CategoryStorageChart = ({ reports }) => {
  const storageCounts = {
    "Storage 1 (0-7 days)": 0,
    "Storage 2 (8-14 days)": 0,
    "Storage 3 (15-30 days)": 0,
    "Storage 4 (30+ days)": 0,
  };

  reports.forEach((report) => {
    const days = report.recordingDays;
    if (days >= 0 && days <= 7) storageCounts["Storage 1 (0-7 days)"]++;
    else if (days >= 8 && days <= 14) storageCounts["Storage 2 (8-14 days)"]++;
    else if (days >= 15 && days <= 30) storageCounts["Storage 3 (15-30 days)"]++;
    else storageCounts["Storage 4 (30+ days)"]++;
  });

  const labels = Object.keys(storageCounts);
  const values = Object.values(storageCounts);
  const colors = ['#00C0C3', '#D47C1B', 'green', 'rgb(172, 11, 212)'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Cameras',
        data: values,
        backgroundColor: colors,
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">Cameras per Storage</div>
      <div className="chart-content">
        <div className="chart-bar-cameras-storage">
          <Bar data={data} options={options} />
        </div>
        <div className="chart-summary">
          {labels.map((label, index) => (
            <div className="summary-item" key={label}>
              <span
                className="dot"
                style={{ backgroundColor: colors[index] }}
              />{' '}
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStorageChart;
