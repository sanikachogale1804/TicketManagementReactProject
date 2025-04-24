import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../CSS/StorageChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const StorageChart = ({ reports }) => {
  // Calculate the total, used, and free space
  const totalSpace = reports.reduce((sum, r) => sum + (r.totalSpaceGB || 0), 0).toFixed(2);
  const usedSpace = reports.reduce((sum, r) => sum + (r.usedSpaceGB || 0), 0).toFixed(2);
  const freeSpace = reports.reduce((sum, r) => sum + (r.freeSpaceGB || 0), 0).toFixed(2);

  // Data for the pie chart
  const data = {
    labels: ['Used Space', 'Free Space', 'Total Space'],  // Updated labels
    datasets: [
      {
        data: [
          parseFloat(usedSpace),  // Used space calculation
          parseFloat(freeSpace),  // Free space calculation
          parseFloat(totalSpace),  // Total space calculation
        ],
        backgroundColor: ['#00C0C3', '#D47C1B', 'rgb(172, 11, 212)'], // Blue for Used, Orange for Free, Pink for Total
        hoverBackgroundColor: ['#00C0C3', '#D47C1B', '#D666BF'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
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
      <div className="chart-header">Storage Usage</div>
      <div className="chart-content">
        <div className="chart-pie">
          <Doughnut data={data} options={options} />
        </div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="dot dot-used" /> <strong>Used:</strong> {usedSpace} GB
          </div>
          <div className="summary-item">
            <span className="dot dot-free" /> <strong>Free:</strong> {freeSpace} GB
          </div>
          <div className="summary-item">
            <span className="dot dot-total" /> <strong>Total:</strong> {totalSpace} GB
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageChart;
