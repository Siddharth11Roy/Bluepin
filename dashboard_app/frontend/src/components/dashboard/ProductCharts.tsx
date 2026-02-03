import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ProductChartsData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProductChartsProps {
  data?: ProductChartsData;
  isLoading: boolean;
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="card p-4 h-full">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        {title}
      </h3>
      <div className="h-64 relative">
        {children}
      </div>
    </div>
  );
};

export default function ProductCharts({ data, isLoading }: ProductChartsProps) {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const reviewChartRef = useRef<HTMLCanvasElement>(null);
  const ratingChartRef = useRef<HTMLCanvasElement>(null);
  const chartsRef = useRef<{ [key: string]: ChartJS | null }>({
    category: null,
    review: null,
    rating: null
  });

  useEffect(() => {
    if (isLoading || !data) return;

    // Common options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          cornerRadius: 8,
        }
      },
      scales: {
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    };

    // Category Chart (Horizontal Bar)
    if (categoryChartRef.current && data.category) {
      if (chartsRef.current.category) chartsRef.current.category.destroy();
      
      chartsRef.current.category = new ChartJS(categoryChartRef.current, {
        type: 'bar',
        data: {
          labels: data.category.labels,
          datasets: [{
            data: data.category.values,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            barThickness: 20
          }]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
        }
      });
    }

    // Review Chart (Vertical Bar)
    if (reviewChartRef.current && data.reviews) {
      if (chartsRef.current.review) chartsRef.current.review.destroy();

      chartsRef.current.review = new ChartJS(reviewChartRef.current, {
        type: 'bar',
        data: {
          labels: data.reviews.labels,
          datasets: [{
            data: data.reviews.values,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            barThickness: 30
          }]
        },
        options: commonOptions
      });
    }

    // Rating Chart (Vertical Bar)
    if (ratingChartRef.current && data.ratings) {
      if (chartsRef.current.rating) chartsRef.current.rating.destroy();

      chartsRef.current.rating = new ChartJS(ratingChartRef.current, {
        type: 'bar',
        data: {
          labels: data.ratings.labels,
          datasets: [{
            data: data.ratings.values,
            backgroundColor: '#f59e0b',
            borderRadius: 4,
            barThickness: 30
          }]
        },
        options: commonOptions
      });
    }

    return () => {
      Object.values(chartsRef.current).forEach(chart => chart?.destroy());
    };
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4 h-80 animate-pulse bg-slate-100 dark:bg-slate-800"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <ChartCard title="📊 Category Mix">
        <canvas ref={categoryChartRef}></canvas>
      </ChartCard>
      
      <ChartCard title="📊 Reviews">
        <canvas ref={reviewChartRef}></canvas>
      </ChartCard>
      
      <ChartCard title="★ Ratings Distribution">
        <canvas ref={ratingChartRef}></canvas>
      </ChartCard>
    </div>
  );
}
