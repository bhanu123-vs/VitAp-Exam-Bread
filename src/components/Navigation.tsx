import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  HelpCircle,
  Layers,
  BarChart3,
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
} from 'lucide-react';
import { User } from '../types.js';
import { useTheme } from '../context/ThemeContext.js';
import { VitApLogo } from './VitApLogo.js';
import { ExamBreadLogo } from './ExamBreadLogo.js';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  onOpenDiagnostic: () => void;
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload PYQs', icon: UploadCloud, badge: '5 Years' },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'topics', label: 'Topics', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'examiner-insights', label: 'Examiner Insights', icon: Award },
    { id: 'weakness', label: 'Weakness', icon: AlertTriangle },
    { id: 'priority-matrix', label: 'Priority Matrix', icon: Crosshair },
    { id: 'study-plan', label: '7-Day Plan', icon: Calendar },
    { id: 'practice', label: 'Practice Mode', icon: PenTool },
    { id: 'mock-test', label: 'Mock Test', icon: GraduationCap },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
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

        {/* VIT-AP University Campus Badge */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#002147]/10 via-[#0B2545]/5 to-transparent dark:from-[#002147]/40 dark:via-[#0B2545]/20 border border-[#002147]/20 dark:border-blue-500/30 space-y-2">
            <VitApLogo size="sm" showSubtitle={true} />
            <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                School of Computer Science & Eng.
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                SCOPE
              </span>
            </div>
          </div>
        </div>

        {/* Streak & Exam Target Pill */}
        <div className="px-4 pt-4 pb-2">
          <div
            id="streak-status-card"
            className="rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {user?.streakDays || 7} Day Streak
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {user?.examName || 'Operating Systems'}
                </div>
              </div>
            </div>
            <button
              id="btn-quick-diagnostic"
              onClick={onOpenDiagnostic}
              title="Test diagnostic weakness"
              className="text-[10px] font-semibold px-2 py-1 rounded-md bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors shadow-sm active:scale-95"
            >
              Test
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Exam Intelligence
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
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Quick Theme Toggle in Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-700 dark:text-amber-300 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-200 truncate">
                  {user?.name || 'Student User'}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  {user?.email || 'student@university.edu'}
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

      {/* Mobile Bottom Navigation */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-t border-stone-200 dark:border-stone-800 z-40 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors duration-200"
      >
        <button
          onClick={() => onSelectTab('landing')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'landing' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          Home
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'dashboard' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('upload')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'upload' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UploadCloud className="w-4 h-4 mb-0.5" />
          PYPs
        </button>
        <button
          onClick={() => onSelectTab('questions')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'questions' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          Questions
        </button>
        <button
          onClick={() => onSelectTab('study-plan')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'study-plan' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          7-Day Plan
        </button>
        <button
          onClick={() => onSelectTab('practice')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            currentTab === 'practice' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <PenTool className="w-4 h-4 mb-0.5" />
          Practice
        </button>
      </nav>
    </>
  );
};
