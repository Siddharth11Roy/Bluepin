import { BarChart3 } from 'lucide-react';

export default function ComparisonsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-500" />
          Comparisons
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Compare products and suppliers side-by-side
        </p>
      </div>

      {/* Empty State */}
      <div className="card p-12 text-center">
        <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No items to compare
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Add products or suppliers to your comparison cart to see detailed side-by-side analysis with charts and metrics.
        </p>
      </div>
    </div>
  );
}
