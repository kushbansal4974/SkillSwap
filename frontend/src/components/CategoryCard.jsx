import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Palette,
  PenTool,
  FileText,
  Video,
  TrendingUp,
  Smartphone,
  Camera,
  Layers,
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Web Development': Code2,
  'UI/UX Design': Palette,
  'Graphic Design': PenTool,
  'Content Writing': FileText,
  'Video Editing': Video,
  'Marketing': TrendingUp,
  'Mobile Development': Smartphone,
  'Photography': Camera,
};

export const CategoryCard = ({ category, count, onClick }) => {
  const Icon = CATEGORY_ICONS[category.name] || Layers;

  const content = (
    <div className="group relative flex flex-col items-start p-5 bg-white rounded-xl border border-gray-200/80 hover:border-primary-500/50 hover:shadow-card transition-all duration-200 cursor-pointer">
      <div className="w-11 h-11 rounded-lg bg-gray-50 group-hover:bg-primary-50 text-gray-700 group-hover:text-primary-600 flex items-center justify-center transition-colors mb-3.5 border border-gray-100">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
        {category.name}
      </h3>
      <p className="text-xs text-gray-500 font-normal">
        {count || category.count || 'Explore gigs'}
      </p>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return (
    <Link to={`/explore?category=${encodeURIComponent(category.name)}`}>
      {content}
    </Link>
  );
};

export default CategoryCard;
