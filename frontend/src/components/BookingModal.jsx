import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

export const BookingModal = ({ isOpen, onClose, gig }) => {
  const { user } = useAuth();
  const [requirementsNote, setRequirementsNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !gig) return null;

  const price = Number(gig.price || gig.rate || 0);
  const gigId = gig.id || gig._id;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!requirementsNote.trim()) {
      setError('Please provide a brief description of your project requirements.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bookingApi.createBooking({
        gigId,
        message: requirementsNote.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Unable to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = () => {
    onClose();
    navigate('/bookings');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-full flex items-center justify-center p-4 text-center sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200/80 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {success ? 'Booking Submitted' : 'Request Service Booking'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-xl p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {success ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                Booking Request Sent!
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Your request has been submitted to the creator. Once accepted, you can review details and complete payment under My Bookings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleViewBookings}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  <span>Go to My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              
              {/* Gig Summary Card */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <img
                  src={gig.coverImage || gig.image}
                  alt={gig.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {gig.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {gig.deliveryDays || 3} days delivery
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Requirement Note Input */}
              <div>
                <label
                  htmlFor="requirements"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Project Scope & Requirements <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="requirements"
                  rows="4"
                  required
                  value={requirementsNote}
                  onChange={(e) => setRequirementsNote(e.target.value)}
                  placeholder="Describe your requirements, goals, timelines, references, or specific instructions..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Be as specific as possible so the creator can evaluate your timeline and scope accurately.
                </p>
              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 text-[11px] text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>No upfront charge. Payment is requested only after the creator accepts.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm hover:shadow-glow-primary transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Submitting...' : 'Send Booking Request'}</span>
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>

            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default BookingModal;
