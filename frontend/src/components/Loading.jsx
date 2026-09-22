import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard Loading Spinner
 */
export const Loading = ({ text = 'Loading...', size = 'md', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-dark-secondary py-8">
      <Loader2 className={`${spinnerSize} animate-spin text-primary-600`} />
      {text && <p className="font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Reusable GigCard Skeleton Loader
 */
export const GigCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-subtle animate-pulse flex flex-col">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-full bg-gray-200 rounded mb-2" />
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Table / List Skeleton Loader
 */
export const TableSkeleton = ({ rows = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-100 border-b border-gray-200" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
