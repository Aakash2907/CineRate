import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface ThemeToggleProps {
  variant?: 'navbar' | 'mobile';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'navbar', className = '' }) => {
  const { theme, toggleTheme, isLight } = useTheme();

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-pressed={isLight}
        aria-label={isLight ? 'Switch to Cinema Dark Mode' : 'Switch to High-Contrast Light Mode'}
        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
          isLight
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 font-semibold'
            : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform ${
              isLight
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-amber-400'
            }`}
          >
            {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight">
              {isLight ? 'High-Contrast Light' : 'Cinema Dark Mode'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {isLight ? 'Enhanced clarity & readability' : 'Deep theater immersion'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
          Switch
        </span>
      </button>
    );
  }

  // Desktop Navbar variant: sleek icon button with high contrast tooltip & aria attributes
  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-pressed={isLight}
      aria-label={isLight ? 'Switch to Cinema Dark Mode' : 'Switch to High-Contrast Light Mode'}
      title={isLight ? 'Switch to Cinema Dark Mode (Ctrl+D)' : 'Switch to High-Contrast Light Mode'}
      className={`relative group flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer ${
        isLight
          ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
          : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border-slate-800'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-600 animate-in spin-in-180 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-amber-400 group-hover:-rotate-12 transition-transform duration-200" />
        )}
      </div>

      <span className="hidden xl:inline text-xs font-semibold">
        {isLight ? 'Light' : 'Dark'}
      </span>

      {/* Accessible Tooltip */}
      <span className="sr-only">
        {isLight ? 'Active: High-Contrast Light Mode' : 'Active: Cinema Dark Mode'}
      </span>
    </button>
  );
};
