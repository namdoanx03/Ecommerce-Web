import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler } from 'chart.js';
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler);

export default function UserAnalyticsChart({ data: chartData }) {
  // Use real data if available, otherwise use default
  const labels = chartData?.labels || ['Jan', 'Feb', 'Mar', 'April', 'May', 'June'];
  const values = chartData?.values || [20, 100, 80, 40, 60, 120];
  
  // Calculate max value for y-axis with some padding
  const maxValue = Math.max(...values) * 1.2 || 120;
  const stepSize = maxValue > 1000000 ? Math.ceil(maxValue / 500000) * 100000 : Math.ceil(maxValue / 5);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            return DisplayPriceInVND(context.parsed.y);
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        max: maxValue,
        ticks: {
          stepSize: stepSize,
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value.toString();
          },
          font: { size: 12 },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    }
  };

  return (
    <div style={{ height: '280px' }}>
      <Line data={data} options={options} />
    </div>
  );
} 