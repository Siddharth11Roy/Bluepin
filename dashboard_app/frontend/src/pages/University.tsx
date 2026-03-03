import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiBook, BiSearch, BiTime, BiUser,
  BiBookOpen, BiPlay, BiFile
} from 'react-icons/bi';
import * as api from '../api/services';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  author: string;
  created_at: string;
  read_time?: number;
  image_url?: string;
  content_type?: 'article' | 'video' | 'guide';
}

export default function University() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const data = await api.getArticles(params);
      setArticles(data.articles || []);
      
      // Extract unique categories
      const allCategories = (data.articles || [])
        .map((a: Article) => a.category)
        .filter((c: string, i: number, arr: string[]) => c && arr.indexOf(c) === i);
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type?: string) => {
    switch (type) {
      case 'video': return BiPlay;
      case 'guide': return BiFile;
      default: return BiBookOpen;
    }
  };

  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <BiBook className="text-primary" />
            Bluepin University
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Learn best practices, guides, and tips for product sourcing
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="floating-card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guides, and tutorials..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading articles...</p>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="floating-card text-center py-16">
          <BiBook className="text-6xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-slate-500">
            {searchQuery || selectedCategory 
              ? 'Try adjusting your search or filters' 
              : 'Check back later for new content'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <Link
              to={`/university/${featuredArticle.id}`}
              className="floating-card mb-8 group overflow-hidden block"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-video lg:aspect-auto bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                  {featuredArticle.image_url ? (
                    <img
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[200px] flex items-center justify-center text-slate-400">
                      <BiBookOpen className="text-6xl" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mb-4">
                    Featured • {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-primary transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <BiUser className="text-base" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <BiTime className="text-base" />
                      {featuredArticle.read_time || 5} min read
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Article Grid */}
          {recentArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map(article => {
                const ContentIcon = getContentIcon(article.content_type);
                
                return (
                  <Link
                    key={article.id}
                    to={`/university/${article.id}`}
                    className="floating-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <BiBookOpen className="text-4xl" />
                        </div>
                      )}
                      
                      {/* Content Type Badge */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 dark:bg-slate-800/90 
                        flex items-center justify-center shadow-md">
                        <ContentIcon className="text-primary" />
                      </div>
                    </div>
                    
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    
                    <h3 className="mt-3 font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {article.summary}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <BiUser className="text-sm" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <BiTime className="text-sm" />
                        {article.read_time || 5} min
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
