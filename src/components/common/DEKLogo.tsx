import React, { useState } from 'react';
import officialEmblemSrc from '../../assets/images/dek_logo_emblem_1791426322376.jpg';

interface DEKLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'horizontal';
  className?: string;
  showSubtitle?: boolean;
  animated?: boolean;
}

export const DEKLogo: React.FC<DEKLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  showSubtitle = true,
  animated = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  // Dimension maps
  const emblemSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Official logo image imported directly so Vite bundles it into /dist/assets in production
  // with public fallback if deployed on static CDN / Vercel
  const publicEmblemFallback = '/images/dek_logo_emblem.jpg';

  const emblemElement = (
    <div
      className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-[#05070B] border border-cyan-500/30 shadow-lg shadow-cyan-500/10 ${emblemSizes[size]} ${
        animated ? 'hover:scale-105 transition-transform duration-300' : ''
      }`}
    >
      {/* Specular ambient rim lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-400/20 pointer-events-none" />
      
      {!imgError ? (
        <img
          src={triedFallback ? publicEmblemFallback : officialEmblemSrc}
          alt="D.E.K NovaCore Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-xl"
          onError={() => {
            if (!triedFallback) {
              setTriedFallback(true);
            } else {
              setImgError(true);
            }
          }}
        />
      ) : (
        /* Pristine SVG Cyber Emblem Fallback */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#080D18] via-[#0B1220] to-[#05070B]">
          <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]">
            <polygon points="50,10 90,32 90,68 50,90 10,68 10,32" fill="none" stroke="#00D9FF" strokeWidth="4" />
            <polygon points="50,22 80,38 80,62 50,78 20,62 20,38" fill="rgba(37,99,255,0.25)" stroke="#2563FF" strokeWidth="3" />
            <path d="M50 24 L50 76 M22 39 L78 61 M22 61 L78 39" stroke="#00BFFF" strokeWidth="2" opacity="0.7" />
            <circle cx="50" cy="50" r="7" fill="#00D9FF" />
          </svg>
        </div>
      )}
      {/* Subtle orbital cyber ring highlight */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20 pointer-events-none" />
    </div>
  );

  if (variant === 'symbol') {
    return <div className={`inline-flex items-center ${className}`}>{emblemElement}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {emblemElement}
        <div className="mt-3">
          <div className={`font-black tracking-wider text-white flex items-center justify-center gap-1.5 ${titleSizes[size]}`}>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm font-['Outfit']">
              D.E.K
            </span>
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-['Outfit']">
              NovaCore
            </span>
          </div>
          {showSubtitle && (
            <p className={`font-semibold tracking-widest uppercase text-cyan-300/80 mt-0.5 ${subSizes[size]}`}>
              Sitios Web · Catálogos Digitales · Soluciones Web
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default 'horizontal' variant
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {emblemElement}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none text-white flex items-center gap-1.5 ${titleSizes[size]}`}>
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-['Outfit'] font-extrabold">
            D.E.K
          </span>
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-['Outfit'] font-black">
            NovaCore
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-medium tracking-wider uppercase text-cyan-400/90 mt-1 ${subSizes[size]}`}>
            Digital Solutions
          </span>
        )}
      </div>
    </div>
  );
};
