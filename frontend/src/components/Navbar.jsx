import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Layers,
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  Menu,
  X,
  Code,
  Palette,
  PenTool,
  Video,
  FileText,
  Smartphone,
  Camera,
  Compass,
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { ThemeToggle } from './theme/ThemeToggle';

const CATEGORIES = [
  { name: 'Web Development', icon: Code, path: '/explore?category=Web%20Development' },
  { name: 'UI/UX Design', icon: Palette, path: '/explore?category=UI%2FUX%20Design' },
  { name: 'Graphic Design', icon: PenTool, path: '/explore?category=Graphic%20Design' },
  { name: 'Content Writing', icon: FileText, path: '/explore?category=Content%20Writing' },
  { name: 'Video Editing', icon: Video, path: '/explore?category=Video%20Editing' },
  { name: 'Mobile Development', icon: Smartphone, path: '/explore?category=Mobile%20Development' },
  { name: 'Photography', icon: Camera, path: '/explore?category=Photography' },
];

export const Navbar = () => {
  const { isCreator, isClient, setRole } = useDemo();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-wide transition-colors py-1.5 px-3 rounded-xl ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="SkillSwap Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:shadow-glow-primary transition-all">
                S
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-indigo-600 dark:text-indigo-400">Swap</span>
              </span>
            </Link>

            {/* Desktop Center Links: All 5 Required Features */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/explore" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Explore
                </span>
              </NavLink>

              <NavLink to="/create-gig" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post a Gig
                </span>
              </NavLink>

              <NavLink to="/creator-dashboard" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Creator Dashboard
                </span>
              </NavLink>

              <NavLink to="/bookings" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  My Bookings
                </span>
              </NavLink>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCatOpen(true)}
                onMouseLeave={() => setIsCatOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsCatOpen(!isCatOpen)}
                  className="flex items-center gap-1 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 py-1.5 px-3 rounded-xl transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      isCatOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isCatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50"
                    >
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.name}
                            to={cat.path}
                            onClick={() => setIsCatOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{cat.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Right: Evaluator Perspective Switcher & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* 1-Click Perspective Switcher for Evaluators (No account required) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">Perspective:</span>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isClient
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isCreator
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Creator
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3"
          >
            {/* Perspective Switcher */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Perspective:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isClient ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isCreator ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Creator
                </button>
              </div>
            </div>

            {/* 5 Core Feature Links */}
            <div className="flex flex-col space-y-1">
              <Link
                to="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/create-gig"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Post a Gig
              </Link>
              <Link
                to="/creator-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Creator Dashboard
              </Link>
              <Link
                to="/bookings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                My Bookings
              </Link>
            </div>

            {/* Mobile Categories list */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-3 mb-1">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
