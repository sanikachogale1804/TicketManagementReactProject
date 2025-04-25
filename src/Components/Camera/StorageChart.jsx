import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../CSS/StorageChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const StorageChart = ({ reports }) => {
  const totalSpace = reports.reduce((sum, r) => sum + (r.totalSpaceGB || 0), 0).toFixed(2);
  const usedSpace = reports.reduce((sum, r) => sum + (r.usedSpaceGB || 0), 0).toFixed(2);
  const freeSpace = reports.reduce((sum, r) => sum + (r.freeSpaceGB || 0), 0).toFixed(2);

  const data = {
    labels: ['Used Space', 'Free Space', 'Total Space'],
    datasets: [
      {
        data: [parseFloat(usedSpace), parseFloat(freeSpace), parseFloat(totalSpace)],
        backgroundColor: ['#00C0C3', '#D47C1B', 'rgb(172, 11, 212)'],
        hoverBackgroundColor: ['#00C0C3', '#D47C1B', '#D666BF'],
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

  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setLastUpdateTime(new Date().toLocaleString());

    return () => clearInterval(interval);
  }, [reports]);

  const formattedDate = currentTime.toLocaleString();

  return (
    <div className="chart-card">
      <div className="chart-header-with-info">
        <div className="chart-header-title">Storage Usage</div>
        <div className="chart-header-info">
          <div className="netapp-green">NetApp</div>
          <div className="hostname-text">HostName: CogentSecurity.ai</div>
        </div>
      </div>

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

      <div className="chart-footer">
        <div className="live-date-time">
          <strong>Live Date & Time: </strong> {formattedDate}
        </div>
        <div className="last-update-time">
          <strong>Last Data Update: </strong> {lastUpdateTime}
        </div>
      </div>
    </div>
  );
};

export default StorageChart;
