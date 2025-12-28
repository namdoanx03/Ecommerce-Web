import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VisitorsDonutChart = ({ data: chartData }) => {
  // Use real data if available, otherwise use default
  const labels = chartData?.labels || ['Chưa có dữ liệu'];
  const values = chartData?.values || [100];

  // Generate colors dynamically
  const generateColors = (count) => {
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Phương thức thanh toán',
        data: values,
        backgroundColor: generateColors(labels.length),
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} đơn hàng (${percentage}%)`;
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

