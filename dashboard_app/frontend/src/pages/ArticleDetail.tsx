import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BiArrowBack, BiTime, BiCalendar, BiBook, BiShare, BiBookmark
} from 'react-icons/bi';
import * as api from '../api/services';

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  created_at: string;
  updated_at?: string;
  read_time?: number;
  image_url?: string;
  tags?: string[];
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getArticleById(parseInt(id!));
      setArticle(data);
      
      // Load related articles
      const related = await api.getArticles({ category: data.category });
      setRelatedArticles((related.articles || []).filter((a: Article) => a.id !== parseInt(id!)).slice(0, 3));
    } catch (err: any) {
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="floating-card text-center py-16 max-w-lg mx-auto">
        <BiBook className="text-6xl text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Article Not Found</h2>
        <p className="text-slate-500 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
        <button onClick={() => navigate('/university')} className="btn-primary">
          <BiArrowBack className="text-lg" />
          Back to University
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-6 transition-colors"
      >
        <BiArrowBack className="text-xl" />
        Back
      </button>

      {/* Article Header */}
      <article className="floating-card">
        {/* Featured Image */}
        {article.image_url && (
          <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-8 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BiTime className="text-base" />
            {article.read_time || 5} min read
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
          {article.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
              {article.author?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-white">{article.author}</p>
              <p className="text-sm text-slate-500">Author</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <BiCalendar className="text-lg" />
            {formatDate(article.created_at)}
          </div>
        </div>

        {/* Summary */}
        {article.summary && (
          <div className="py-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed border-b border-slate-200 dark:border-slate-700">
            {article.summary}
          </div>
        )}

        {/* Content */}
        <div 
          className="py-8 prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-semibold prose-headings:text-slate-800 dark:prose-headings:text-white
            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-800 dark:prose-strong:text-white
            prose-ul:text-slate-600 dark:prose-ul:text-slate-400
            prose-ol:text-slate-600 dark:prose-ol:text-slate-400
            prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 
            prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
          <button className="btn-secondary">
            <BiShare className="text-lg" />
            Share
          </button>
          <button className="btn-secondary">
            <BiBookmark className="text-lg" />
            Save
          </button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(relArticle => (
              <Link
                key={relArticle.id}
                to={`/university/${relArticle.id}`}
                className="floating-card group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
                  {relArticle.image_url ? (
                    <img
                      src={relArticle.image_url}
                      alt={relArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BiBook className="text-4xl" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {relArticle.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <BiTime className="text-sm" />
                  {relArticle.read_time || 5} min read
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
