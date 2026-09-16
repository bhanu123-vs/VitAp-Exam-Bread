import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Wheat,
  Sun,
  Moon,
  Home,
} from 'lucide-react';
import { NotificationItem, User } from '../types.js';
import { useTheme } from '../context/ThemeContext.js';
import { VitApLogo } from './VitApLogo.js';
import { ExamBreadLogo } from './ExamBreadLogo.js';

interface HeaderProps {
  user: User | null;
  onOpenSearch: () => void;
  onToggleAi?: () => void;
  onLoadDemo: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  activeExamTitle: string;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSearch,
  onToggleAi,
  onLoadDemo,
  notifications,
  onMarkNotificationRead,
  activeExamTitle,
  onNavigateHome,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="top-header"
      className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/90 backdrop-blur sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4 transition-colors duration-200"
    >
      {/* Left: Brand Logo & Context */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Top-Left Brand Logo - Always clicks to Home Screen */}
        <div
          id="header-brand-logo"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title="Return to Home Screen"
        >
          <ExamBreadLogo size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-stone-900 dark:text-white text-base font-sans leading-none">
                EXAM BREAD
              </span>
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:inline leading-tight">
              Past. Pattern. Plan. Perform.
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0 hidden sm:block" />

        {/* VIT-AP University Emblem */}
        <div className="hidden sm:flex items-center">
          <VitApLogo size="sm" showSubtitle={false} />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0 hidden lg:block" />

        {/* Active Subject & Context */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <div className="text-xs md:text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
            {activeExamTitle || 'VIT-AP University Exam Hub (All Branches)'}
          </div>
        </div>
      </div>

      {/* Middle / Right: Maintainer attribution, Theme Switch, Search, Notifications, Demo button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Maintained by Bhanu on Top Right Corner as requested */}
        <a
          href="mailto:bhanu.25bce8476@vitapstudent.ac.in"
          title="Creator & Maintainer: D.Bhanu.V.N (25BCE8476)"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800/80 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 font-medium"
        >
          <span>Maintained by Bhanu</span>
          <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-semibold">(25BCE8476)</span>
        </a>
        {/* Global Search Trigger */}
        <button
          id="btn-global-search"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-750 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search questions, topics...</span>
          <span className="md:hidden hidden sm:inline">Search</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded border border-stone-300 dark:border-stone-600 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          id="btn-theme-toggle-header"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Dark and Light Mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-stone-700" />
          )}
        </button>

        {/* Home Button shortcut */}
        {onNavigateHome && (
          <button
            id="btn-header-home"
            onClick={onNavigateHome}
            title="Go to Home Screen"
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    Exam Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      notif.read
                        ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'
                        : 'bg-stone-100/70 dark:bg-stone-800/80 border-amber-500/30 text-stone-900 dark:text-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        )}
                        {notif.title}
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
