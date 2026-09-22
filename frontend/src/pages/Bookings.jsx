import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Declined'];

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getMyBookings({
        status: activeStatus !== 'All' ? activeStatus : undefined,
      });
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError(err.message || 'Unable to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeStatus]);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            Feature 5 · Client Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your service requests in real-time across all three brief statuses: Pending, Accepted, and Declined.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors self-start sm:self-auto"
        >
          <span>Explore Marketplace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeStatus === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <Loading text="Loading bookings from marketplace..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description={
            activeStatus === 'All'
              ? 'You have not submitted any gig booking requests yet.'
              : `No bookings found with status "${activeStatus}".`
          }
          actionLabel="Explore Marketplace"
          actionTo="/explore"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const gig = booking.gig || {};
            const seller = booking.seller || {};

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-5 sm:p-6 hover:shadow-card dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Gig Info & Parties */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={gig.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'}
                    alt={gig.title}
                    className="w-20 h-16 sm:w-24 sm:h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(booking.status)}

                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        #{booking.id?.slice(-6)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      <Link
                        to={`/gigs/${gig.id || booking.gigId}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {gig.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>
                        Creator: <strong className="text-slate-700 dark:text-slate-300">{seller.name}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Date: <strong className="text-slate-700 dark:text-slate-300">{new Date(booking.createdAt).toLocaleDateString()}</strong>
                      </span>
                    </div>

                    {booking.requirementsNote && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic line-clamp-1 max-w-xl">
                        Your Brief: "{booking.requirementsNote}"
                      </p>
                    )}

                    {/* Decision Point 1 (DP1): Rejection behavior */}
                    {booking.status === 'declined' && (
                      <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs space-y-1.5">
                        <div className="text-rose-800 dark:text-rose-300 font-semibold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>Creator's Reason: "{booking.declineReason || 'Creator reached maximum project bandwidth.'}"</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          <strong>Decision Point 1 Action:</strong> Browse alternative vetted creators in this category:
                        </p>
                        <Link
                          to={`/explore?category=${encodeURIComponent(gig.category || 'Web Development')}`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <span>Explore similar creators in {gig.category}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {/* Status helper text for Accepted / Pending */}
                    {booking.status === 'accepted' && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Project accepted! The creator has queued this in their delivery workflow.</span>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting review by creator in their dashboard.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Rate & Link */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Agreed Rate</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{Number(booking.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    to={`/gigs/${gig.id || booking.gigId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>View Gig</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
