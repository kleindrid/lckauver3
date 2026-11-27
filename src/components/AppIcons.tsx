import React from 'react';
import { AppId } from '../types/phone';

interface AppIconProps {
  id: AppId;
  size?: number;
  weekdayLabel?: string;
  dayNumber?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  size = 58,
  weekdayLabel = 'Thursday',
  dayNumber = 22,
}) => {
  const baseClass =
    'relative flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.28)] select-none';
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.225),
  };

  switch (id) {
    case 'photos':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #b8e3ff 0%, #eef8ff 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[82%] w-[82%]">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={i}
                cx="32"
                cy="14"
                rx="4.8"
                ry="11"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="0.6"
                transform={`rotate(${i * 30} 32 32)`}
              />
            ))}
            <circle cx="32" cy="32" r="8.2" fill="#f59e0b" />
            <circle cx="32" cy="32" r="6" fill="#fbbf24" />
          </svg>
        </div>
      );

    case 'mail':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #1b88ff 0%, #3ab4ff 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[72%] w-[72%]">
            <rect x="10" y="18" width="44" height="28" rx="4" fill="#ffffff" />
            <path
              d="M12 20 L32 35 L52 20"
              fill="none"
              stroke="#1b88ff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'weather':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #2b83e8 0%, #66b8ff 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[82%] w-[82%]">
            <circle cx="24" cy="24" r="10.5" fill="#ffd60a" />
            <path
              d="M22 45 H45 C49.5 45 53 41.5 53 37 C53 32.8 49.8 29.3 45.7 29 C44.2 23.8 39.4 20 33.8 20 C27.2 20 21.8 25.1 21.5 31.6 C17.8 32.3 15 35.5 15 39.3 C15 42.5 18.1 45 22 45 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      );

    case 'calendar':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#ffffff',
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center leading-none">
            <span
              className="font-semibold tracking-tight text-[#ff3b30]"
              style={{ fontSize: size * 0.165 }}
            >
              {weekdayLabel}
            </span>
            <span
              className="mt-0.5 font-normal text-[#111827] tabular-nums"
              style={{ fontSize: size * 0.45 }}
            >
              {dayNumber}
            </span>
          </div>
        </div>
      );

    case 'notes':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#ffffff',
          }}
        >
          <div className="flex h-full w-full flex-col">
            <div
              className="w-full"
              style={{
                height: '28%',
                background: 'linear-gradient(180deg, #ffd60a 0%, #f5b800 100%)',
                borderBottom: '2px dashed #e5e7eb',
              }}
            />
            <div className="flex flex-1 flex-col justify-evenly px-2 py-1">
              <div className="h-[1.5px] w-full bg-slate-200" />
              <div className="h-[1.5px] w-full bg-slate-200" />
              <div className="h-[1.5px] w-full bg-slate-200" />
              <div className="h-[1.5px] w-full bg-slate-200" />
            </div>
          </div>
        </div>
      );

    case 'maps':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#eff3ea',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <rect x="0" y="0" width="64" height="64" fill="#edf2e4" />
            <path d="M0 36 L34 10 L64 26 L64 64 L0 64 Z" fill="#d7ecc8" />
            <path d="M0 50 Q32 42 64 56 L64 64 L0 64 Z" fill="#9dd5f5" />
            <path d="M22 0 L28 64" stroke="#facc15" strokeWidth="7" />
            <path d="M0 24 L64 42" stroke="#ffffff" strokeWidth="5" />
            <path
              d="M44 12 C39 12 35 16 35 21 C35 28 44 37 44 37 C44 37 53 28 53 21 C53 16 49 12 44 12 Z"
              fill="#ef4444"
            />
            <circle cx="44" cy="21" r="3.4" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'x':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#050507',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[62%] w-[62%]">
            <path
              d="M14 14 L27 32 L14 50 H19.5 L30 35.8 L40.5 50 H50 L36.2 31.2 L48.8 14 H43.3 L33.4 27.4 L23.5 14 H14 Z M20.5 17.5 H22.8 L43.5 46.5 H41.2 L20.5 17.5 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      );

    case 'camera':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #e5e7eb 0%, #b8bcc4 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[72%] w-[72%]">
            <path
              d="M12 22 C12 19.5 14 18 16.5 18 H22 L25 14 H39 L42 18 H47.5 C50 18 52 19.5 52 22 V45 C52 47.5 50 49 47.5 49 H16.5 C14 49 12 47.5 12 45 Z"
              fill="#27272a"
            />
            <circle cx="32" cy="34" r="9.5" fill="#9ca3af" />
            <circle cx="32" cy="34" r="6.2" fill="#18181b" />
            <circle cx="44" cy="24" r="2" fill="#facc15" />
          </svg>
        </div>
      );

    case 'clock':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#09090b',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[86%] w-[86%]">
            <circle cx="32" cy="32" r="25" fill="#ffffff" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="32"
                y1="10"
                x2="32"
                y2="13.5"
                stroke="#18181b"
                strokeWidth="1.8"
                strokeLinecap="round"
                transform={`rotate(${i * 30} 32 32)`}
              />
            ))}
            {/* Hour hand (04:00) */}
            <line
              x1="32"
              y1="32"
              x2="42"
              y2="38"
              stroke="#18181b"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Minute hand (00) */}
            <line
              x1="32"
              y1="32"
              x2="32"
              y2="14"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Orange second hand */}
            <line
              x1="32"
              y1="35"
              x2="43"
              y2="16"
              stroke="#f97316"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="2.2" fill="#f97316" />
          </svg>
        </div>
      );

    case 'journal':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #3c5952 0%, #2a423c 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[76%] w-[76%]">
            <rect x="16" y="13" width="32" height="38" rx="4" fill="#f3ebd3" />
            <line x1="22" y1="22" x2="36" y2="22" stroke="#47635c" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="22" y1="31" x2="42" y2="31" stroke="#47635c" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="22" y1="40" x2="34" y2="40" stroke="#47635c" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'instagram':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background:
              'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[72%] w-[72%]">
            <rect
              x="14"
              y="14"
              width="36"
              height="36"
              rx="10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
            />
            <circle cx="32" cy="32" r="8.5" fill="none" stroke="#ffffff" strokeWidth="4" />
            <circle cx="43" cy="21" r="2.6" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'phone':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #57f079 0%, #24c349 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[66%] w-[66%]">
            <path
              d="M21 15 C19 15 16 17 16 21 C16 33 31 48 43 48 C47 48 49 45 49 43 L49 38 C49 36.5 47.5 35.5 46 35.5 L39 35.5 C37.8 35.5 36.8 36.2 36.2 37.2 L34.8 39.5 C31.2 37.8 26.2 32.8 24.5 29.2 L26.8 27.8 C27.8 27.2 28.5 26.2 28.5 25 V18 C28.5 16.5 27.5 15 26 15 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      );

    case 'safari':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: '#ffffff',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[88%] w-[88%]">
            <circle cx="32" cy="32" r="27" fill="url(#safariGrad)" />
            <defs>
              <linearGradient id="safariGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#35b6ff" />
                <stop offset="100%" stopColor="#1667f2" />
              </linearGradient>
            </defs>
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="32"
                y1="7"
                x2="32"
                y2={i % 2 === 0 ? '11' : '9.5'}
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0.8"
                transform={`rotate(${i * 22.5} 32 32)`}
              />
            ))}
            <polygon points="32,32 43,19 29,29" fill="#ff3b30" />
            <polygon points="32,32 21,45 35,35" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'whatsapp':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #58f177 0%, #24c64b 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[76%] w-[76%]">
            <path
              d="M32 14 C21.5 14 13 22 13 32 C13 35.6 14.1 39 16 41.9 L14 49 L21.4 47 C24.2 48.8 28 49.8 32 49.8 C42.5 49.8 51 41.8 51 31.9 C51 22 42.5 14 32 14 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M25.5 24 C24.8 24 23.6 25 23.6 26.6 C23.6 31.2 28.8 36.4 33.4 36.4 C35 36.4 36 35.2 36 34.5 V32.4 C36 31.7 35.4 31.2 34.7 31.2 H32.2 C31.6 31.2 31.1 31.5 30.8 32 L30.1 33 C28.6 32.2 26.8 30.4 26 28.9 L27 28.2 C27.5 27.9 27.8 27.4 27.8 26.8 V24.3 C27.8 23.6 27.3 24 26.6 24 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      );

    case 'dossiers':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[74%] w-[74%]">
            <path
              d="M12 20 C12 17.5 14 16 16.5 16 H26 L30 20 H47.5 C50 20 52 21.5 52 24 V45 C52 47.5 50 49 47.5 49 H16.5 C14 49 12 47.5 12 45 Z"
              fill="#60a5fa"
              opacity="0.28"
            />
            <rect x="14" y="22" width="36" height="25" rx="4" fill="#f8fafc" />
            <rect x="19" y="27" width="10" height="11" rx="2" fill="#1e3a5f" />
            <line x1="33" y1="29" x2="45" y2="29" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="33" y1="35" x2="43" y2="35" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="19" y1="42" x2="45" y2="42" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'recorder':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #18181c 0%, #09090b 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[78%] w-[78%]">
            <line x1="8" y1="32" x2="56" y2="32" stroke="#3f3f46" strokeWidth="1.4" />
            {[
              { x: 12, h: 10 },
              { x: 17, h: 18 },
              { x: 22, h: 12 },
              { x: 27, h: 30 },
              { x: 32, h: 40 },
              { x: 37, h: 24 },
              { x: 42, h: 34 },
              { x: 47, h: 16 },
              { x: 52, h: 10 },
            ].map((bar, idx) => (
              <rect
                key={idx}
                x={bar.x - 1.5}
                y={32 - bar.h / 2}
                width="3"
                height={bar.h}
                rx="1.5"
                fill="#ef4444"
              />
            ))}
          </svg>
        </div>
      );

    case 'narrations':
      return (
        <div
          className={baseClass}
          style={{
            ...style,
            background: 'linear-gradient(180deg, #4338ca 0%, #1e1b4b 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="h-[74%] w-[74%]">
            <rect x="13" y="14" width="38" height="36" rx="5" fill="#eef2ff" />
            <rect x="13" y="14" width="9" height="36" rx="2" fill="#312e81" />
            <circle cx="17.5" cy="22" r="1.5" fill="#a5b4fc" />
            <circle cx="17.5" cy="32" r="1.5" fill="#a5b4fc" />
            <circle cx="17.5" cy="42" r="1.5" fill="#a5b4fc" />
            <line x1="27" y1="23" x2="45" y2="23" stroke="#312e81" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="27" y1="31" x2="43" y2="31" stroke="#4f46e5" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="27" y1="39" x2="39" y2="39" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};
