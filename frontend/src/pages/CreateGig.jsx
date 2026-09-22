import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { AlertCircle, CheckCircle2, ArrowLeft, Image as ImageIcon, Plus } from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'UI/UX Design',
  'Graphic Design',
  'Video Editing',
  'Photography',
  'Content Writing',
  'Blog Writing',
  'Social Media',
  'Marketing',
  'Mobile Development',
  'Music',
  'Other',
];

const PRESET_IMAGES = [
  { label: 'Web / Code', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
  { label: 'UI / Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Video Editing', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Branding / Logo', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80' },
];

export const CreateGig = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    price: '',
    deliveryDays: '3',
    shortDescription: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    featuresText: 'High quality deliverables\nRevisions included\nDirect communication',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, price, description } = formData;

    if (!title.trim() || !category || !price || !description.trim()) {
      setError('Please fill in all required fields (Title, Category, Price, and Description).');
      return;
    }

    if (title.trim().length < 3) {
      setError('Gig title must be at least 3 characters.');
      return;
    }

    if (description.trim().length < 5) {
      setError('Description must be at least 5 characters.');
      return;
    }

    if (Number(price) <= 0) {
      setError('Starting price must be greater than 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const features = formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        rate: Number(formData.price),
        deliveryDays: Math.max(1, Number(formData.deliveryDays) || 3),
        shortDescription: formData.shortDescription.trim() || formData.title.trim().slice(0, 100),
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim() || PRESET_IMAGES[0].url,
        features: features.length > 0 ? features : ['Professional deliverables', 'Revisions included'],
      };

      const created = await gigApi.createGig(payload);
      setSuccess(true);
      const targetId = created?.id || created?._id;
      setTimeout(() => {
        if (targetId) {
          navigate(`/gigs/${targetId}`);
        } else {
          navigate('/explore');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create gig. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Create a New Gig Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Publish your service package to connect with clients seeking your skills.
        </p>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Gig created successfully! Redirecting to listing...</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs font-bold">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Gig Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Build a Production-Ready Web App with React & Node.js"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Starting Rate (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="1"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>

        {/* Delivery Days & Short Description */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="deliveryDays" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Delivery (Days)
            </label>
            <input
              id="deliveryDays"
              name="deliveryDays"
              type="number"
              min="1"
              max="90"
              value={formData.deliveryDays}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="shortDescription" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Card Subtitle / Tagline
            </label>
            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="A brief punchline shown on marketplace cards"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Full Service Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what you deliver, your workflow, tools used, requirements, and deliverables..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
        </div>

        {/* Features / Bullet Points */}
        <div>
          <label htmlFor="featuresText" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Features / Deliverables (One per line)
          </label>
          <textarea
            id="featuresText"
            name="featuresText"
            rows="3"
            value={formData.featuresText}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
        </div>

        {/* Cover Image & Presets */}
        <div>
          <label htmlFor="coverImage" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Cover Image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors mb-2"
          />
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400">Presets:</span>
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm hover:shadow-glow-primary transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Publishing Gig...' : 'Publish Gig to Marketplace'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default CreateGig;
