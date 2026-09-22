import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  Layers,
  Star,
  Clock,
} from 'lucide-react';

export const MyGigs = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [gigToDelete, setGigToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyGigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gigApi.getMyGigs(user?.id);
      setGigs(data);
    } catch (err) {
      console.error('Failed to load user gigs:', err);
      setError(err.message || 'Unable to load your gigs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs();
  }, [user]);

  const confirmDelete = async () => {
    if (!gigToDelete) return;
    setIsDeleting(true);
    try {
      await gigApi.deleteGig(gigToDelete.id);
      setGigs(gigs.filter((g) => g.id !== gigToDelete.id));
      setGigToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete gig.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            My Gigs Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your service packages, update pricing, or publish new offerings.
          </p>
        </div>
        <Link
          to="/create-gig"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm hover:shadow-glow-primary self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Gig</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loading text="Loading your listings..." />
      ) : gigs.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No gigs created yet"
          description="You haven't created any service listings yet. Publish your expertise to connect with clients!"
          actionLabel="Create Your First Gig"
          actionTo="/create-gig"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card dark:hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={gig.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                      {gig.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {gig.deliveryDays || 3}d delivery
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
                    <Link to={`/gigs/${gig.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      {gig.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {gig.shortDescription || gig.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ₹{Number(gig.price || gig.rate).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/gigs/${gig.id}`}
                    title="View gig listing"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/edit-gig/${gig.id}`}
                    title="Edit gig"
                    className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    title="Delete gig"
                    onClick={() => setGigToDelete(gig)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {gigToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Delete Listing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete "{gigToDelete.title}"? Clients will no longer be able to browse or book this service.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setGigToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Gig'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyGigs;
