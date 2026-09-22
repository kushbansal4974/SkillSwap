import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { gigApi } from '../api/gigApi';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  PlusCircle,
  Check,
  X,
  ExternalLink,
  Layers,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const CreatorDashboard = () => {
  const { user } = useAuth();
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Decline Modal State
  const [declineBookingId, setDeclineBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookings, gigs] = await Promise.all([
        bookingApi.getCreatorBookings(),
        gigApi.getMyGigs(user?.id),
      ]);
      setIncomingBookings(bookings);
      setMyGigs(gigs);
    } catch (err) {
      console.error('Failed to load creator dashboard data:', err);
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleAccept = async (bookingId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await bookingApi.acceptBooking(bookingId);
      setIncomingBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'accepted' } : b))
      );
    } catch (err) {
      setActionError(err.message || 'Failed to accept booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (!declineBookingId) return;

    setActionLoading(true);
    setActionError(null);
    try {
      await bookingApi.declineBooking(declineBookingId, declineReason);
      setIncomingBookings((prev) =>
        prev.map((b) =>
          b.id === declineBookingId
            ? { ...b, status: 'declined', declineReason }
            : b
        )
      );
      setDeclineBookingId(null);
      setDeclineReason('');
    } catch (err) {
      setActionError(err.message || 'Failed to decline booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingBookings = incomingBookings.filter((b) => b.status === 'pending');
  const acceptedBookings = incomingBookings.filter((b) => b.status === 'accepted');
  const paidBookings = incomingBookings.filter((b) => b.paymentStatus === 'paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-primary">
              Creator Studio
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {user?.name || 'Creator'} ({myGigs.length} active gigs)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming client orders, accept requests, and oversee your marketplace packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/create-gig"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm hover:shadow-glow-primary transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Gig</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {pendingBookings.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Awaiting your review</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {acceptedBookings.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Accepted or in progress</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Listings</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {myGigs.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Published gigs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Secured Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">From completed payments</span>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Incoming Bookings Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          Incoming Client Bookings
        </h2>

        {loading ? (
          <Loading text="Loading your incoming bookings..." />
        ) : incomingBookings.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No client requests yet"
            description="When clients book your gig services, their requests will appear here for you to accept or decline."
            actionLabel="View Your Live Gigs"
            actionTo="/my-gigs"
          />
        ) : (
          <div className="space-y-4">
            {incomingBookings.map((b) => {
              const isPending = b.status === 'pending';
              const isAccepted = b.status === 'accepted';
              const isDeclined = b.status === 'declined';
              const isPaid = b.paymentStatus === 'paid';

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`badge ${
                          isAccepted
                            ? 'badge-success'
                            : isDeclined
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>

                      {isPaid && (
                        <span className="badge badge-success">
                          Paid by Client
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        #{b.id?.slice(-6)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {b.gig?.title || 'Gig Service'}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Client: <strong className="text-slate-700 dark:text-slate-300">{b.buyer?.name || b.client?.name || 'Client'}</strong></span>
                      <span>•</span>
                      <span>Rate: <strong className="text-indigo-600 dark:text-indigo-400">₹{Number(b.price).toLocaleString('en-IN')}</strong></span>
                      <span>•</span>
                      <span>Received: {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>

                    {b.requirementsNote && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic max-w-xl">
                        Client Scope: "{b.requirementsNote}"
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleAccept(b.id)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => {
                            setDeclineBookingId(b.id);
                            setDeclineReason('');
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : isAccepted ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decline Reason Modal */}
      {declineBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Decline Booking Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Please share a brief note for the client explaining why you cannot take on this project right now.
            </p>
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <textarea
                rows="3"
                required
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Currently at maximum capacity, or timeline does not fit schedule..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeclineBookingId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
                >
                  {actionLoading ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatorDashboard;
