import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VisitorsDonutChart = ({ data: chartData }) => {
  const data = {
    labels: chartData?.labels || ['The Passersby', 'The Occasionals', 'The Regulars', 'The Superfans'],
    datasets: [
      {
        label: 'Visitors',
        data: chartData?.values || [35, 25, 25, 15],
        backgroundColor: [
          '#10b981', // green
          '#f59e0b', // orange
          '#8b5cf6', // purple
          '#3b82f6', // blue
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12 },
          color: '#6b7280'
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default VisitorsDonutChart;

