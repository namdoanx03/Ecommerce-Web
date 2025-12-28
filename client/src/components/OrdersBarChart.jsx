import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const OrdersBarChart = ({ data: chartData }) => {
  // Use real data if available, otherwise use default
  const labels = chartData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = chartData?.values || [45, 52, 38, 67, 54, 72, 60];
  
  const maxValue = Math.max(...values, 1) * 1.2; // Add 20% padding

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Orders',
        data: values,
        backgroundColor: '#0da487',
        borderRadius: 8,
        borderSkipped: false,
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
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} orders`;
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
          stepSize: Math.ceil(maxValue / 5),
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default OrdersBarChart;

