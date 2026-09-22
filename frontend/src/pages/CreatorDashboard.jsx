import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { gigApi } from '../api/gigApi';
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
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

const DECLINE_TEMPLATES = [
  'Currently at maximum project bandwidth this week.',
  'Scope requires specialized technical capabilities outside current stack.',
  'Requested turnaround time is too tight for quality delivery.',
];

export const CreatorDashboard = () => {
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
        gigApi.getMyGigs(),
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
  }, []);

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
      await bookingApi.declineBooking(declineBookingId, declineReason || DECLINE_TEMPLATES[0]);
      setIncomingBookings((prev) =>
        prev.map((b) =>
          b.id === declineBookingId
            ? { ...b, status: 'declined', declineReason: declineReason || DECLINE_TEMPLATES[0] }
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
  const declinedBookings = incomingBookings.filter((b) => b.status === 'declined');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Feature 4 · Creator Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review incoming project briefs from clients and accept or decline requests in accordance with your delivery schedule.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/create-gig"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm hover:shadow-glow-primary transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Gig</span>
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
          <span className="text-[11px] text-slate-400 block mt-1">Awaiting your accept/decline</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accepted Projects</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {acceptedBookings.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Confirmed client orders</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Declined (DP1)</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {declinedBookings.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">With feedback saved</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Listings</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {myGigs.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Published services</span>
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
          <Loading text="Loading incoming bookings..." />
        ) : incomingBookings.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No incoming requests yet"
            description="When clients submit a booking form for any of your gigs, their requests will appear here for you to accept or decline."
            actionLabel="Post a New Gig"
            actionTo="/create-gig"
          />
        ) : (
          <div className="space-y-4">
            {incomingBookings.map((b) => {
              const isPending = b.status === 'pending';
              const isAccepted = b.status === 'accepted';
              const isDeclined = b.status === 'declined';

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

                      <span className="text-[11px] text-slate-400 font-mono">
                        #{b.id?.slice(-6)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {b.gig?.title || 'Gig Service'}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Client: <strong className="text-slate-700 dark:text-slate-300">{b.buyer?.name || b.client?.name || 'Client Evaluator'}</strong></span>
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

                    {isDeclined && b.declineReason && (
                      <p className="text-xs text-rose-700 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 p-2 rounded-xl border border-rose-200/80 dark:border-rose-900/40">
                        Decline Reason: "{b.declineReason}"
                      </p>
                    )}
                  </div>

                  {/* Right Actions: Accept / Decline */}
                  <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleAccept(b.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => {
                            setDeclineBookingId(b.id);
                            setDeclineReason(DECLINE_TEMPLATES[0]);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
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

      {/* Decline Reason Modal (Decision Point 1 Rejection) */}
      {declineBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Decline Booking Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              <strong>DP1 · Rejection:</strong> Provide a reason so the client understands why and can explore alternative creators.
            </p>

            {/* Quick Templates */}
            <div className="space-y-1.5 mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Preset Reasons:
              </span>
              {DECLINE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => setDeclineReason(tmpl)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-colors border ${
                    declineReason === tmpl
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>

            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason or Custom Note:
                </label>
                <textarea
                  rows="2"
                  required
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Enter decline note..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

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
