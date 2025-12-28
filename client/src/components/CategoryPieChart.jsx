import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data: chartData }) => {
  // Use real data if available, otherwise use default
  const labels = chartData?.labels || ['Chưa có dữ liệu'];
  const values = chartData?.values || [100];

  // Generate colors dynamically
  const generateColors = (count) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sales by Category',
        data: values,
        backgroundColor: generateColors(labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
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
            // Format as VND currency
            const formattedValue = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0
            }).format(value);
            return `${label}: ${formattedValue} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default CategoryPieChart;

