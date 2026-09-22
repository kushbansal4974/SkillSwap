import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { BookingModal } from '../components/BookingModal';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  Edit3,
  Trash2,
  ChevronRight,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const GigDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { currentUser } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gigApi.getGigById(id);
        setGig(data);
        setSelectedImage(data.coverImage || (data.images && data.images[0]));
      } catch (err) {
        console.error('Failed to load gig details:', err);
        setError(err.message || 'Unable to find or load this gig.');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const currentUserId = user?.id || user?._id || currentUser?.id || currentUser?._id;
  const gigCreatorId = gig?.creator?._id || gig?.creator?.id || gig?.creator || gig?.seller?.id || gig?.seller?._id;
  
  const isOwner = Boolean(
    currentUserId &&
    gigCreatorId &&
    currentUserId.toString() === gigCreatorId.toString()
  );

  const handleDeleteGig = async () => {
    setIsDeleting(true);
    try {
      await gigApi.deleteGig(gig.id);
      setIsDeleteModalOpen(false);
      navigate('/my-gigs');
    } catch (err) {
      alert(err.message || 'Failed to delete gig.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookClick = () => {
    setIsBookingOpen(true);
  };

  if (loading) {
    return <Loading fullPage text="Loading gig details from marketplace..." />;
  }

  if (error || !gig) {
    return (
      <EmptyState
        title="Gig Not Found"
        description={error || "The gig you're looking for doesn't exist or has been removed."}
        actionLabel="Browse Other Gigs"
        actionTo="/explore"
      />
    );
  }

  const seller = gig.seller || {};
  const sellerName = seller.name || 'Creator';
  const sellerAvatar =
    seller.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sellerName)}`;

  const images = gig.images?.length
    ? gig.images
    : [gig.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <Link to="/explore" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Explore
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <Link
          to={`/explore?category=${encodeURIComponent(gig.category)}`}
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {gig.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
          {gig.title}
        </span>
      </nav>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left 2 Columns: Gig Info & Media */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Title & Seller Line */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-primary">
                {gig.category}
              </span>
              {isOwner && (
                <span className="badge bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  Your Gig Listing
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-snug mb-4">
              {gig.title}
            </h1>

            {/* Seller Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={sellerAvatar}
                  alt={sellerName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{sellerName}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Verified Creator</span>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  {gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">({gig.reviewsCount || 24} reviews)</span>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <div className="text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Delivery: <strong className="text-slate-800 dark:text-slate-200">{gig.deliveryDays || 3} days</strong></span>
              </div>
            </div>
          </div>

          {/* Media / Image Showcase */}
          <div className="space-y-3">
            <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card">
              <img
                src={selectedImage || images[0]}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-14 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About This Gig Description */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-all">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              About This Gig
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              <p>{gig.description}</p>
            </div>

            {/* Features / Deliverables */}
            {gig.features && gig.features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Service Deliverables & Included Features:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gig.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-all">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              About the Creator
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sellerName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Verified SkillSwap Freelancer</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  {seller.bio ||
                    'Experienced creator dedicated to delivering top-quality results, clear communication, and professional deliverables.'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Pricing & Booking Sidebar */}
        <div className="sticky top-24 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card dark:shadow-card-dark p-6 transition-all">
            
            {/* Price Header */}
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Service Package
              </span>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{Number(gig.price || gig.rate).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Delivery & Highlights info */}
            <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-4 mb-6 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>
                  <strong>{gig.deliveryDays || 3}</strong> Days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>
                  <strong>3</strong> Revisions
                </span>
              </div>
            </div>

            {/* Key Deliverable Highlights */}
            <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Full commercial rights included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Fast communication & milestone tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Source files delivered upon approval</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwner ? (
              <div className="space-y-2">
                <Link
                  to={`/edit-gig/${gig.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit This Gig
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Gig
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBookClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow-glow-primary active:scale-[0.99]"
              >
                Book Now (₹{Number(gig.price || gig.rate).toLocaleString('en-IN')})
              </button>
            )}

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Creator & Instant Booking Confirmation</span>
            </div>

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        gig={gig}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Are you sure you want to delete this gig?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              This will permanently remove "{gig.title}" from the marketplace.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteGig}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Gig'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GigDetails;
