import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Doanh thu',
      data: [4200, 5100, 4000, 5500, 6700, 7300, 7000],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139,92,246,0.1)',
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#8b5cf6',
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        // padding: 20,
        font: { size: 14 }
      }
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context) {
          return `$ ${context.parsed.y.toLocaleString()}`;
        }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) { return '$ ' + value.toLocaleString(); }
      }
    }
  }
};

export default function UserAnalyticsChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-semibold text-lg mb-2">Thanh thu theo tháng</h2>
      <Line data={data} options={options} height={280} width={500}/>
    </div>
  );
} 