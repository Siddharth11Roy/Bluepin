import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line, Scatter } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart color palette
export const chartColors = {
  primary: ['rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)'],
  gradients: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(20, 184, 166, 0.8)',
    'rgba(249, 115, 22, 0.8)',
  ],
  borders: [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(20, 184, 166, 1)',
    'rgba(249, 115, 22, 1)',
  ],
};

// Common chart options
export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface BarChartProps {
  labels: string[];
  data: number[];
  title?: string;
  color?: string;
}

export function BarChart({ labels, data, title, color }: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Value',
        data,
        backgroundColor: color ? [color] : chartColors.gradients,
        borderColor: color ? [color] : chartColors.borders,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export function DoughnutChart({ labels, data, title }: DoughnutChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Value',
        data,
        backgroundColor: chartColors.gradients,
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    ...commonOptions,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#64748b',
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}

interface HorizontalBarChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export function HorizontalBarChart({ labels, data, title }: HorizontalBarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Count',
        data,
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.borders,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    indexAxis: 'y' as const,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

interface ScatterChartProps {
  xData: number[];
  yData: number[];
  labels: string[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function ScatterChart({ xData, yData, labels, title, xLabel, yLabel }: ScatterChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Scatter Dataset',
        data: xData.map((x, i) => ({ x, y: yData[i] })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = labels[context.dataIndex] || '';
            return `${label}: (${context.raw.x}, ${context.raw.y})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: !!xLabel,
          text: xLabel,
          color: '#64748b',
        },
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { color: '#64748b' },
      },
      y: {
        title: {
          display: !!yLabel,
          text: yLabel,
          color: '#64748b',
        },
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
}

export { Bar, Doughnut, Line, Scatter };
