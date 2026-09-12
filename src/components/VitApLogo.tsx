import React from 'react';

interface VitApLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const VitApLogo: React.FC<VitApLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official Circular VIT Seal as requested */}
      <div
        className={`${sizeMap[size]} rounded-full bg-white p-0.5 border border-stone-200 dark:border-stone-700 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0 group`}
        title="VIT-AP University — Apply Knowledge. Improve Life!"
      >
        <img
          src="/vit_ap_logo.png"
          alt="VIT-AP University Official Seal"
          className="w-full h-full object-contain rounded-full"
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/vit_ap_logo.svg') {
              target.src = '/vit_ap_logo.svg';
            }
          }}
        />
      </div>

      {/* University Name */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-[#002147] dark:text-amber-400 font-sans text-sm sm:text-base leading-none">
            VIT-AP
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-1 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            UNIVERSITY
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9.5px] font-medium text-stone-500 dark:text-stone-400 truncate tracking-tight">
            Apply Knowledge. Improve Life!
          </span>
        )}
      </div>
    </div>
  );
};
