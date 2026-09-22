import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:shadow-glow-primary transition-all">
                S
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-indigo-600 dark:text-indigo-400">Swap</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
              A premium creator gig marketplace connecting businesses and individuals with vetted freelance talent across web development, design, content, and media.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Vetted Creators
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Secure Payments
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/explore?category=Web%20Development" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/explore?category=UI%2FUX%20Design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Graphic%20Design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Graphic Design
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Mobile%20Development" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Content%20Writing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Content Writing
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Browse All Gigs
                </Link>
              </li>
              <li>
                <Link to="/creator-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Quality */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span>Buyer Protection</span>
              </li>
              <li>
                <span>Escrow Sandbox Checkout</span>
              </li>
              <li>
                <span>Verified Milestones</span>
              </li>
              <li>
                <span>Production Ready</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillSwap Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for Creators & Clients</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
