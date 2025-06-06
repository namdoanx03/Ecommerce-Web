import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Shirts', 'Shoes', 'Bags'],
  datasets: [
    {
      label: 'Top Products',
      data: [120, 150, 100],
      backgroundColor: [
        '#3b82f6', // blue
        '#0e7490', // teal
        '#8b5cf6', // purple
      ],
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: { size: 16 },
        padding: 24,
      },
    },
    tooltip: {
      enabled: true,
    },
  },
};

export default function TopProductsDoughnutChart() {
  return (
    <div className="bg-white rounded-xl shadow p-4" style={{width:550, height:410}}>
      <h2 className="font-semibold text-lg mb-4">Sản phẩm bán chạy nhất</h2>
      <Doughnut data={data} options={options} width={500} height={320} />
    </div>
  );
} 