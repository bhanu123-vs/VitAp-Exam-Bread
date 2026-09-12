import React from 'react';

interface ExamBreadLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ExamBreadLogo: React.FC<ExamBreadLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full overflow-hidden shrink-0 border border-amber-500/50 shadow-md bg-stone-950 flex items-center justify-center relative group`}
      >
        <img
          src="/exam_bread_logo.jpg"
          alt="EXAM BREAD Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to internal path if public path fails
            const target = e.currentTarget;
            if (!target.src.includes('exam_bread_logo_1789192635866.jpg')) {
              target.src = '/src/assets/images/exam_bread_logo_1789192635866.jpg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white font-sans">
            EXAM BREAD
          </span>
          <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-tight">
            PAST. PATTERN. PLAN. PERFORM.
          </span>
        </div>
      )}
    </div>
  );
};
