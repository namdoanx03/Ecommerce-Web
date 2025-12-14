import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Revenue',
      data: [20, 100, 80, 40, 60, 120],
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
          return `$ ${context.parsed.y.toLocaleString()}`;
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
      max: 120,
      ticks: {
        stepSize: 20,
        callback: function(value) { return '$' + value; },
        font: { size: 12 },
        color: '#6b7280'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      }
    }
  }
};

export default function UserAnalyticsChart() {
  return (
    <div style={{ height: '280px' }}>
      <Line data={data} options={options} />
    </div>
  );
} 