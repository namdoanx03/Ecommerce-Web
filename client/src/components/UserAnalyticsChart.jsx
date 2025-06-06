import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue',
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
  responsive: false,
  plugins: {
    legend: {
      display: false,
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
    <div className="bg-white rounded-xl shadow p-4" style={{width:600, height:390}}>
      <h2 className="font-semibold text-lg mb-4">Revenue by Month</h2>
      <Line data={data} options={options} width={600} height={320}/>
    </div>
  );
} 