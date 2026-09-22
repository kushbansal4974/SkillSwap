import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { GigCard } from '../components/GigCard';
import { GigCardSkeleton } from '../components/Loading';
import { gigApi } from '../api/gigApi';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Code,
  Palette,
  PenTool,
  Video,
  FileText,
  Smartphone,
  Briefcase,
  CreditCard,
  Lock,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Web Development', icon: Code, count: '140+ Gigs' },
  { name: 'UI/UX Design', icon: Palette, count: '95+ Gigs' },
  { name: 'Graphic Design', icon: PenTool, count: '120+ Gigs' },
  { name: 'Content Writing', icon: FileText, count: '80+ Gigs' },
  { name: 'Video Editing', icon: Video, count: '65+ Gigs' },
  { name: 'Mobile Development', icon: Smartphone, count: '75+ Gigs' },
];

export const Home = () => {
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isCreator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const gigs = await gigApi.getGigs({ sort: 'rating' });
        setFeaturedGigs(gigs.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured gigs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (query) => {
    if (query) {
      navigate(`/explore?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next-Generation Creator Gig Marketplace</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5">
            Hire elite creators for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              your next breakthrough.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect directly with verified software engineers, product designers, video editors, and digital creators. Fixed pricing, milestone reviews, and secure checkout.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-6">
            <SearchBar
              size="lg"
              onSearch={handleSearch}
              placeholder="Search services (e.g. React MVP, Figma Design, Reels Editing)..."
            />
            
            {/* Quick Keyword Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Popular:</span>
              {['Web Development', 'UI/UX Design', 'Video Editing', 'Mobile App', 'Graphic Design'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center">
            <div>
              <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">100%</span>
              <span className="text-[11px] text-slate-400">Verified Talent</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">48h</span>
              <span className="text-[11px] text-slate-400">Avg. Delivery</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">0%</span>
              <span className="text-[11px] text-slate-400">Hidden Fees</span>
            </div>
          </div>

        </div>
      </section>

      {/* Explore By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Explore Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse pre-packaged gigs tailored by industry specialists.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-subtle hover:shadow-card transition-all text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Gigs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Trending Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-rated gig packages curated for speed, quality, and results.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Browse 400+ Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <GigCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantees Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Peace of Mind Guaranteed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Work with confidence. Direct, transparent creator bookings.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect directly with verified talent. Clear deliverables, fixed rates, structured milestones, and instant booking confirmations.
            </p>
            <div className="pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all active:scale-95"
              >
                <span>Find a Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
