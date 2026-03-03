import { useState, useEffect } from 'react';
import { 
  BiBrain, BiTrendingUp, BiPackage, BiCategory, BiDollar, BiRefresh,
  BiCheckCircle, BiErrorCircle, BiLoader, BiStar, BiLineChart
} from 'react-icons/bi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import * as api from '../api/services';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalysisData {
  summary?: {
    total_products: number;
    avg_price: number;
    avg_rating: number;
    top_categories: string[];
  };
  trends?: {
    labels: string[];
    values: number[];
  };
  recommendations?: string[];
  insights?: {
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }[];
  category_performance?: {
    labels: string[];
    values: number[];
  };
}

export default function AIAnalysis() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    
    try {
      const data = await api.getAIAnalysis();
      setAnalysisData(data);
    } catch (err: any) {
      setError('Failed to load AI analysis. Please try again.');
      console.error('Error loading analysis:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const chartColors = [
    'rgba(30, 58, 138, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(6, 182, 212, 0.8)'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BiBrain className="text-6xl text-primary mx-auto mb-4 animate-pulse" />
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Analyzing your data with AI...</p>
        </div>
      </div>
    );
  }

  if (error && !analysisData) {
    return (
      <div className="floating-card text-center py-16 max-w-lg mx-auto">
        <BiErrorCircle className="text-6xl text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">Analysis Failed</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => loadAnalysis(true)} className="btn-primary">
          <BiRefresh className="text-lg" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <BiBrain className="text-primary" />
            AI Analysis
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Intelligent insights powered by data analysis
          </p>
        </div>
        <button
          onClick={() => loadAnalysis(true)}
          disabled={refreshing}
          className="btn-primary"
        >
          {refreshing ? (
            <>
              <BiLoader className="text-lg animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BiRefresh className="text-lg" />
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      {/* Summary Stats */}
      {analysisData?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="floating-card metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <BiPackage className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
              {analysisData.summary.total_products?.toLocaleString()}
            </h3>
            <p className="text-slate-500 text-sm">Total Products Analyzed</p>
          </div>

          <div className="floating-card metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <BiDollar className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
              ${analysisData.summary.avg_price?.toFixed(2)}
            </h3>
            <p className="text-slate-500 text-sm">Average Price</p>
          </div>

          <div className="floating-card metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <BiStar className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
              {analysisData.summary.avg_rating?.toFixed(1)}
            </h3>
            <p className="text-slate-500 text-sm">Average Rating</p>
          </div>

          <div className="floating-card metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <BiCategory className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
              {analysisData.summary.top_categories?.length || 0}
            </h3>
            <p className="text-slate-500 text-sm">Categories</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {analysisData?.insights && analysisData.insights.length > 0 && (
        <div className="floating-card mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <BiBrain className="text-primary" />
            AI-Generated Insights
          </h3>
          <div className="space-y-4">
            {analysisData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  insight.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500' 
                    : insight.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500'
                    : 'bg-blue-50 dark:bg-blue-500/10 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <BiCheckCircle className={`text-xl flex-shrink-0 mt-0.5 ${
                    insight.type === 'success' ? 'text-emerald-500' 
                    : insight.type === 'warning' ? 'text-amber-500' 
                    : 'text-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">{insight.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        {analysisData?.trends && (
          <div className="floating-card chart-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BiTrendingUp className="text-emerald-500" />
              Price Trends
            </h3>
            <div className="h-[300px]">
              <Line
                data={{
                  labels: analysisData.trends.labels,
                  datasets: [{
                    label: 'Average Price',
                    data: analysisData.trends.values,
                    borderColor: 'rgba(30, 58, 138, 1)',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(30, 58, 138, 1)'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, cornerRadius: 8 }
                  },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#64748b' } },
                    y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b' } }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Category Performance */}
        {analysisData?.category_performance && (
          <div className="floating-card chart-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BiLineChart className="text-primary" />
              Category Performance
            </h3>
            <div className="h-[300px]">
              <Doughnut
                data={{
                  labels: analysisData.category_performance.labels,
                  datasets: [{
                    data: analysisData.category_performance.values,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 10
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: '#64748b', padding: 15, usePointStyle: true }
                    },
                    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, cornerRadius: 8 }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {analysisData?.recommendations && analysisData.recommendations.length > 0 && (
        <div className="floating-card">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <BiTrendingUp className="text-emerald-500" />
            AI Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!analysisData?.summary && !loading && (
        <div className="floating-card text-center py-16">
          <BiBrain className="text-6xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">
            No Analysis Data Available
          </h3>
          <p className="text-slate-500 mb-4">
            Add more products to generate meaningful insights
          </p>
        </div>
      )}
    </div>
  );
}
