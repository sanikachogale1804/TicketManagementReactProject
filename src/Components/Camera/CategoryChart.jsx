import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../CSS/CategoryChart.css'

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ reports }) => {
  // Function to categorize the reports and count the categories
  const categorizeReports = () => {
    const categories = {
      category1: 0, // 0-7 days
      category2: 0, // 8-14 days
      category3: 0, // 15-30 days
      category4: 0, // 30+ days
    };

    reports.forEach((report) => {
      if (report.recordingDays >= 0 && report.recordingDays <= 7) {
        categories.category1 += 1;
      } else if (report.recordingDays >= 8 && report.recordingDays <= 14) {
        categories.category2 += 1;
      } else if (report.recordingDays >= 15 && report.recordingDays <= 30) {
        categories.category3 += 1;
      } else {
        categories.category4 += 1;
      }
    });

    return categories;
  };

  const categories = categorizeReports();

  // Pie chart data
  const data = {
    labels: ['Category 1 (0-7 days)', 'Category 2 (8-14 days)', 'Category 3 (15-30 days)', 'Category 4 (30+ days)'],
    datasets: [
      {
        data: [categories.category1, categories.category2, categories.category3, categories.category4],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Pie chart options for size and layout
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          fontSize: 14,
          fontColor: '#333', // Darker color for the legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + ' reports';
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="chart-header">Recording Days Distribution</h2>
      <div className="chart-pie">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;
