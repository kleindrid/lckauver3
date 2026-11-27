import React from 'react';
import { WallpaperId } from '../types/phone';
import { resolveAssetUrl } from '../utils/assets';

interface WallpaperProps {
  wallpaper: WallpaperId;
  blurred?: boolean;
}

export const Wallpaper: React.FC<WallpaperProps> = ({ wallpaper, blurred = false }) => {
  if (wallpaper === 'seongnam-night') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden bg-black transition-all duration-300 ${
          blurred ? 'scale-105 blur-xl' : ''
        }`}
      >
        <img
          src={resolveAssetUrl('/assets/aistudio/d72e116be9b7c2808b6d0d6d91abae69_63db10f0.jpg')}
          alt="Gyeong-gwan Night Street Wallpaper"
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.48) 100%)',
          }}
        />
      </div>
    );
  }

  if (wallpaper === 'midnight-indigo') {
    return (
      <div
        className={`absolute inset-0 transition-all duration-300 ${blurred ? 'scale-105 blur-xl' : ''}`}
        style={{
          background:
            'radial-gradient(circle at 20% 20%, #312e81 0%, #0f172a 55%, #020617 100%)',
        }}
      >
        <svg viewBox="0 0 390 844" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mid1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M-40,120 C160,60 280,280 420,220 L420,620 C240,560 120,760 -40,680 Z" fill="url(#mid1)" />
        </svg>
      </div>
    );
  }

  if (wallpaper === 'emerald-dusk') {
    return (
      <div
        className={`absolute inset-0 transition-all duration-300 ${blurred ? 'scale-105 blur-xl' : ''}`}
        style={{
          background:
            'linear-gradient(155deg, #064e3b 0%, #0f172a 55%, #022c22 100%)',
        }}
      >
        <svg viewBox="0 0 390 844" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="eme1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path d="M-20,300 C120,180 280,380 410,200 L410,844 L-20,844 Z" fill="url(#eme1)" />
        </svg>
      </div>
    );
  }

  // Default: exact match to Screenshots 1 & 2 (deep navy-indigo base, big lavender-purple S-curve, sky-blue lower-right wave)
  return (
    <div
      className={`absolute inset-0 transition-all duration-300 ${blurred ? 'scale-105 blur-xl' : ''}`}
      style={{
        background: 'linear-gradient(170deg, #101b4b 0%, #1c2e6f 48%, #1d357b 100%)',
      }}
    >
      <svg viewBox="0 0 390 844" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="iosWaveMain" x1="0.15" y1="0.05" x2="0.85" y2="0.85">
            <stop offset="0%" stopColor="#262c72" />
            <stop offset="28%" stopColor="#5b54c2" />
            <stop offset="56%" stopColor="#8c83df" />
            <stop offset="82%" stopColor="#6559cc" />
            <stop offset="100%" stopColor="#37338c" />
          </linearGradient>
          <linearGradient id="iosWaveBlue" x1="0.2" y1="0.1" x2="0.8" y2="0.95">
            <stop offset="0%" stopColor="#75b3ec" />
            <stop offset="45%" stopColor="#467bcb" />
            <stop offset="100%" stopColor="#1b2d6f" />
          </linearGradient>
          <radialGradient id="iosWaveGlow" cx="0.25" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#a79ef0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#5d54c4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main violet-indigo curved ribbon from top-right sweeping left and down */}
        <path
          d="M210,-20 C85,95 28,260 36,415 C42,530 115,615 215,695 C305,768 395,785 430,740 L430,-20 Z"
          fill="url(#iosWaveMain)"
        />
        <ellipse cx="145" cy="360" rx="140" ry="220" fill="url(#iosWaveGlow)" />

        {/* Lower-right cerulean/sky-blue wave sweeping up from bottom-left */}
        <path
          d="M-30,860 C25,735 120,645 190,520 C245,420 295,305 420,255 L420,860 Z"
          fill="url(#iosWaveBlue)"
        />

        {/* Subtle bottom-left deep blue vignette */}
        <path
          d="M-30,520 C60,640 160,720 390,820 L390,860 L-30,860 Z"
          fill="#111d4f"
          opacity="0.55"
        />
      </svg>
    </div>
  );
};
