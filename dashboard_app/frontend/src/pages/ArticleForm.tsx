import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BiArrowBack, BiSave, BiTrash } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/services';

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  read_time: number;
  published: boolean;
  tags: string;
}

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    category: 'Getting Started',
    image_url: '',
    read_time: 5,
    published: false,
    tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Getting Started',
    'Sourcing Tips',
    'Product Research',
    'Supplier Management',
    'Best Practices',
    'Case Studies',
    'Industry News'
  ];

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
    if (isEditing) {
      loadArticle();
    }
  }, [id, user]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await api.getArticleById(parseInt(id!));
      setFormData({
        title: data.title || '',
        summary: data.summary || '',
        content: data.content || '',
        category: data.category || 'Getting Started',
        image_url: data.image_url || '',
        read_time: data.read_time || 5,
        published: data.published || false,
        tags: data.tags?.join(', ') || ''
      });
    } catch (err) {
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const articleData = {
        ...formData,
        author: user?.full_name || user?.username || 'Admin',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (isEditing) {
        await api.updateArticle(parseInt(id!), articleData);
      } else {
        await api.createArticle(articleData);
      }
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await api.deleteArticle(parseInt(id!));
      navigate('/admin');
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  if (!user?.is_admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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

      <div className="floating-card">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter article title"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Category & Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Featured Image URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {formData.image_url && (
                <div className="w-20 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary of the article..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content * (HTML supported)
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              placeholder="Write your article content here... (HTML tags supported)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-mono text-sm
                focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="sourcing, tips, suppliers"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 
                bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 
                rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formData.published ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-secondary text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <BiTrash className="text-lg" />
                Delete
              </button>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <BiSave className="text-lg" />
                    {isEditing ? 'Update Article' : 'Create Article'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
