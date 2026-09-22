import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  CreditCard,
  ShieldCheck,
  Clock,
  X,
} from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Declined'];

export const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment Modal State
  const [payingBooking, setPayingBooking] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
  }, [activeStatus, user]);

  const handleStartPayment = async (booking) => {
    setPayingBooking(booking);
    setPaymentError('');
    setPaymentSuccess(false);
    setPaymentLoading(true);

    try {
      const orderData = await bookingApi.createPaymentOrder(booking.id);
      setPaymentOrder(orderData);
    } catch (err) {
      setPaymentError(err.message || 'Could not initialize payment order.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCompleteSandboxPayment = async () => {
    if (!payingBooking || !paymentOrder) return;
    setPaymentLoading(true);
    setPaymentError('');

    try {
      const paymentId = `pay_sim_${Date.now()}`;
      await bookingApi.verifyPayment({
        bookingId: payingBooking.id,
        razorpayOrderId: paymentOrder.orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: 'simulated_signature_valid',
      });

      setPaymentSuccess(true);
      // Update booking in local list
      setBookings((prev) =>
        prev.map((b) =>
          b.id === payingBooking.id ? { ...b, paymentStatus: 'paid' } : b
        )
      );
      setTimeout(() => {
        setPayingBooking(null);
        setPaymentOrder(null);
        setPaymentSuccess(false);
      }, 2000);
    } catch (err) {
      setPaymentError(err.message || 'Payment verification failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <span className="badge badge-success">
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="badge badge-danger">
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="badge badge-warning">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-success">
              Client Portal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Account: {user?.name || 'Client'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            My Bookings & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your service requests, acceptances, and payments.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors self-start sm:self-auto"
        >
          <span>Explore More Services</span>
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
        <Loading text="Loading your bookings from server..." />
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
            const isAccepted = booking.status === 'accepted';
            const isPaid = booking.paymentStatus === 'paid';

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
                      
                      {isPaid ? (
                        <span className="badge badge-success">
                          Paid & Secured
                        </span>
                      ) : isAccepted ? (
                        <span className="badge badge-warning">
                          Awaiting Payment
                        </span>
                      ) : null}

                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
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
                        Your Note: "{booking.requirementsNote}"
                      </p>
                    )}

                    {/* Rejection Notice */}
                    {booking.status === 'declined' && (
                      <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs space-y-1.5">
                        <div className="text-rose-800 dark:text-rose-300 font-semibold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          Creator Note: "{booking.declineReason || 'Creator reached maximum project bandwidth.'}"
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Looking for alternatives? Browse similar vetted creators in this category:
                        </p>
                        <Link
                          to={`/explore?category=${encodeURIComponent(gig.category || 'Web Development')}`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Find other creators in {gig.category}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Agreed Rate</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{Number(booking.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/gigs/${gig.id || booking.gigId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </Link>

                    {/* Pay Now Button if Accepted and Pending Payment */}
                    {isAccepted && !isPaid && (
                      <button
                        type="button"
                        onClick={() => handleStartPayment(booking)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-glow-primary transition-all active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Now</span>
                      </button>
                    )}

                    {isPaid && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active Order
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {payingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Checkout & Payment
                </h3>
              </div>
              <button
                onClick={() => setPayingBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Booking is now confirmed and paid. The creator has been notified to start work!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                    Booking Order #{payingBooking.id?.slice(-6)}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {payingBooking.gig?.title}
                  </h4>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Payable:</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{Number(payingBooking.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
                    {paymentError}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 text-[11px] text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span>Razorpay Gateway integration with Sandbox testing mode supported.</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCompleteSandboxPayment}
                    disabled={paymentLoading}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm hover:shadow-glow-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{paymentLoading ? 'Processing...' : `Pay ₹${Number(payingBooking.price).toLocaleString('en-IN')} (Simulate Test Checkout)`}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Bookings;
