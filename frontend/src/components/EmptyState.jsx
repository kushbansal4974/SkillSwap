import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable EmptyState Component
 * Displays a clean placeholder when collections or searches yield no results.
 */
export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no items to display. Try adjusting your filters or check back later.',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-subtle max-w-lg mx-auto my-8 transition-colors">
      <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-100 dark:border-gray-700">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">{description}</p>
      
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
