import React from 'react';
import { AlertTriangle, Mail } from 'lucide-react';

interface FooterCautionProps {
  className?: string;
}

export const FooterCaution: React.FC<FooterCautionProps> = ({ className = '' }) => {
  const mailAddress = 'bhanu.25bce8476@vitapstudent.ac.in';
  const mailSubject = encodeURIComponent('EXAM BREAD Query / Issue');
  const mailBody = encodeURIComponent('Hi Bhanu,\n\nI have a question / issue regarding EXAM BREAD:\n');
  const mailtoHref = `mailto:${mailAddress}?cc=bhanuvenkatanagesh@gmail.com&subject=${mailSubject}&body=${mailBody}`;

  return (
    <footer
      id="footer-caution"
      className={`mt-10 mb-4 p-5 sm:p-6 rounded-2xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/20 text-center max-w-3xl mx-auto shadow-xs ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Important Caution & Disclaimer</span>
      </div>

      <div className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed space-y-1 font-normal">
        <p>This analysis is made by ai based on quiz</p>
        <p>Ai can make mistakes</p>
        <p>neither owner nor vit ap is responsible for it,Take at your own risk</p>
        <p>we tried our best to provide you high quality sources feel free to mail me for details or issues</p>
      </div>

      <div className="mt-3 pt-3 border-t border-amber-500/20 dark:border-amber-500/15 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs">
        <a
          href={mailtoHref}
          title="Click to send email directly to Bhanu"
          className="inline-flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 underline underline-offset-2 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{mailAddress}</span>
        </a>
        <span className="hidden sm:inline text-stone-400 dark:text-stone-600">•</span>
        <span className="font-semibold text-stone-900 dark:text-stone-100">
          Built By Bhanu(25BCE8476)
        </span>
      </div>
    </footer>
  );
};
