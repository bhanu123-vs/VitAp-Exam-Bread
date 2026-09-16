import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  HelpCircle,
  Layers,
  BarChart3,
  BrainCircuit,
  Award,
  AlertTriangle,
  Crosshair,
  Calendar,
  PenTool,
  GraduationCap,
  TrendingUp,
  Settings,
  Flame,
  Wheat,
  Home,
  Sun,
  Moon,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { User } from '../types.js';
import { useTheme } from '../context/ThemeContext.js';
import { VitApLogo } from './VitApLogo.js';
import { ExamBreadLogo } from './ExamBreadLogo.js';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  onOpenDiagnostic?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenDiagnostic,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'landing', label: 'Home Screen', icon: Home },
    { id: 'dashboard', label: 'Dashboard & Analysis', icon: LayoutDashboard },
    { id: 'study-plan', label: '7-Day Roadmap', icon: Calendar, badge: 'CAT & FAT' },
    { id: 'mock-test', label: 'Mock Test (PYPs)', icon: GraduationCap, badge: 'Evaluate' },
    { id: 'progress', label: 'Progress & History', icon: TrendingUp },
    { id: 'upload', label: 'Upload Paper', icon: UploadCloud, badge: 'Open Access' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 h-screen sticky top-0 shrink-0 select-none z-30 transition-colors duration-200"
      >
        {/* Brand Header - Clicks to Home Screen */}
        <div
          id="brand-header"
          onClick={() => onSelectTab('landing')}
          className="p-5 border-b border-stone-200 dark:border-stone-800/80 flex items-center justify-between cursor-pointer group"
          title="Return to Home Screen"
        >
          <div className="flex items-center gap-3">
            <ExamBreadLogo size="md" />
            <div>
              <span className="font-extrabold tracking-tight text-stone-900 dark:text-white text-lg font-sans block">
                EXAM BREAD
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 tracking-tight font-medium">
                Past. Pattern. Plan. Perform.
              </p>
            </div>
          </div>
        </div>

        {/* VIT-AP University Campus Badge (No floating streak) */}
        <div className="px-4 pt-3 pb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#002147]/10 via-[#0B2545]/5 to-transparent dark:from-[#002147]/40 dark:via-[#0B2545]/20 border border-[#002147]/20 dark:border-blue-500/30 space-y-2">
            <VitApLogo size="sm" showSubtitle={true} />
            <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                University Examination Portal
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                VIT-AP
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          <div className="px-3 py-1 text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Guest Student Mode & Quick Theme Toggle in Footer (Below Upload Option) */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate flex items-center gap-1.5">
                  <span>Guest Student</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  Open Access • VIT-AP Portal
                </div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-700" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Mobile-Optimized Bar with Touch Targets >= 44px */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-t border-stone-200 dark:border-stone-800 z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors duration-200"
      >
        <button
          onClick={() => onSelectTab('landing')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
            currentTab === 'landing' ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
            currentTab === 'dashboard' ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        {/* 7-Day Roadmap replaces Study Mode */}
        <button
          onClick={() => onSelectTab('study-plan')}
          className={`flex flex-col items-center justify-center min-w-[62px] min-h-[44px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
            currentTab === 'study-plan'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
              : 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => onSelectTab('mock-test')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
            currentTab === 'mock-test' ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <GraduationCap className="w-4 h-4 mb-0.5" />
          <span>Mock Test</span>
        </button>

        <button
          onClick={() => onSelectTab('upload')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
            currentTab === 'upload' ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UploadCloud className="w-4 h-4 mb-0.5" />
          <span>Upload</span>
        </button>
      </nav>
    </>
  );
};
