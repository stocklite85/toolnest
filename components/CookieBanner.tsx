'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';

const STORAGE_KEY = 'toolnest-cookie-consent';

export default function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="flex-1 text-sm text-slate-300 leading-relaxed">
          {lang === 'ko'
            ? <>이 사이트는 광고 서비스 제공을 위해 Google AdSense 쿠키를 사용합니다. 자세한 내용은{' '}
                <Link href="/privacy" className="underline text-blue-400 hover:text-blue-300">개인정보 처리방침</Link>을 참고하세요.</>
            : <>This site uses Google AdSense cookies to serve ads. See our{' '}
                <Link href="/privacy" className="underline text-blue-400 hover:text-blue-300">Privacy Policy</Link> for details.</>
          }
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors">
            {lang === 'ko' ? '거부' : 'Decline'}
          </button>
          <button onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
            {lang === 'ko' ? '동의' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
