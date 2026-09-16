import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  Wheat,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { User } from '../types.js';
import { useTheme } from '../context/ThemeContext.js';

interface SettingsViewProps {
  user: User | null;
  onUpdateSettings: (payload: any) => Promise<void>;
  onLoadDemo: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateSettings,
  onLoadDemo,
}) => {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name || 'Student');
  const [examName, setExamName] = useState(user?.examName || 'VIT-AP Semester Examination');
  const [targetDate, setTargetDate] = useState(user?.targetDate || '2026-04-15');
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyHours || 2);
  const [saved, setSaved] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      name,
      examName,
      targetDate,
      dailyStudyHours: dailyHours,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReloadDemo = async () => {
    setLoadingDemo(true);
    await onLoadDemo();
    setLoadingDemo(false);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
          <span>Target Exam & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
          Customize your study schedule parameters, theme mode, and target examination.
        </p>
      </div>

      {/* Theme Selection Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
          Appearance Theme
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Select your visual experience. Switch seamlessly between dark and light themes.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-stone-900 border-amber-500 text-white shadow-md'
                : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
              <Moon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Dark Theme</div>
              <div className="text-[10px] text-stone-400">Warm stone & amber</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-white border-amber-500 text-stone-900 shadow-md ring-1 ring-amber-500'
                : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Light Theme</div>
              <div className="text-[10px] text-stone-500">High-contrast crisp canvas</div>
            </div>
          </button>
        </div>
      </div>

      {/* Preferences Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Target Exam Name
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Target Exam Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Daily Study Capacity
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  type="button"
                  key={hrs}
                  onClick={() => setDailyHours(hrs)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    dailyHours === hrs
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  {hrs === 4 ? '4+ Hours' : `${hrs} Hours`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings successfully saved!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Wheat className="w-4 h-4 text-amber-500" />
              <span>Reset to Official 5-Year Dataset</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Reloads the official 5-year university question papers dataset across all courses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReloadDemo}
            disabled={loadingDemo}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-stone-300 dark:border-amber-500/30 flex items-center gap-2 shrink-0 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDemo ? 'animate-spin' : ''}`} />
            <span>Reload 5-Year Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
