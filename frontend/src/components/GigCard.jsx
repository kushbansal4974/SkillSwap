import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Clock } from 'lucide-react';

export const GigCard = ({ gig }) => {
  if (!gig) return null;

  const gigId = gig.id || gig._id;
  const seller = gig.seller || {};
  const sellerName = seller.name || gig.creatorName || 'Creator';
  const sellerInitials = (sellerName || 'CR')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const price = Number(gig.price || gig.rate || 0);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle hover:shadow-card dark:hover:border-slate-700 transition-all flex flex-col h-full"
    >
      {/* Gig Image */}
      <Link to={`/gigs/${gigId}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <img
          src={
            gig.coverImage ||
            gig.image ||
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'
          }
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            {gig.category || 'Services'}
          </span>
        </div>

        {/* Delivery Days Badge */}
        {gig.deliveryDays && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm shadow-sm">
              <Clock className="w-3 h-3 text-indigo-400" />
              {gig.deliveryDays}d delivery
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator Profile Line */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
              {sellerInitials}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {sellerName}
            </span>
            <div className="ml-auto flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}
              </span>
            </div>
          </div>

          {/* Gig Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={`/gigs/${gigId}`}>
              {gig.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {gig.shortDescription || gig.description}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
              Starting rate
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to={`/gigs/${gigId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors active:scale-95"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
