
import { BiSearch, BiX } from 'react-icons/bi';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'range';
  placeholder?: string;
  options?: FilterOption[];
}

interface FilterPanelProps {
  filters: Record<string, string>;
  fields: FilterField[];
  onChange: (name: string, value: string) => void;
  onClear: () => void;
}

export default function FilterPanel({ filters, fields, onChange, onClear }: FilterPanelProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="floating-card sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <BiX className="text-lg" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            
            {field.type === 'text' && (
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filters[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
            
            {field.type === 'select' && field.options && (
              <select
                value={filters[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">{field.placeholder || `All ${field.label}`}</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            
            {field.type === 'number' && (
              <input
                type="number"
                value={filters[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            )}
            
            {field.type === 'range' && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters[`${field.name}_min`] || ''}
                  onChange={(e) => onChange(`${field.name}_min`, e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <input
                  type="number"
                  value={filters[`${field.name}_max`] || ''}
                  onChange={(e) => onChange(`${field.name}_max`, e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
