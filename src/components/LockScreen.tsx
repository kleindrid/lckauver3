import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { AlertTriangle, Camera, Flashlight, Globe, Instagram, Mail, Phone } from 'lucide-react';
import { AppId, LanguageMode, PushNotification } from '../types/phone';

interface LockScreenProps {
  timeStr: string;
  dateLabel?: string;
  language: LanguageMode;
  flashlightOn: boolean;
  notifications: PushNotification[];
  onTapNotification: (notif: PushNotification) => void;
  onToggleLanguage: () => void;
  onToggleFlashlight: () => void;
  onUnlock: (targetApp?: AppId) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  timeStr,
  dateLabel = 'Thursday, October 22',
  language,
  flashlightOn,
  notifications,
  onTapNotification,
  onToggleLanguage,
  onToggleFlashlight,
  onUnlock,
}) => {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-260, 0], [0.15, 1]);
  const scale = useTransform(y, [-260, 0], [0.96, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -85 || info.velocity.y < -350) {
      onUnlock();
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: -480, bottom: 0 }}
      dragElastic={{ top: 0.25, bottom: 0.05 }}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      style={{ y, opacity, scale }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ y: -620, opacity: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
      className="absolute inset-0 z-30 flex cursor-grab flex-col justify-between px-5 pt-5 pb-2 active:cursor-grabbing select-none"
    >
      {/* Top Date, Time, Language Pill */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[17px] font-semibold tracking-tight text-white/95 drop-shadow-sm">
          {dateLabel}
        </p>
        <div className="mt-0.5 text-[78px] leading-[0.95] font-bold tracking-[-0.03em] text-white/90 tabular-nums drop-shadow-md">
          {timeStr}
        </div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onToggleLanguage}
          className="mt-3.5 inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1 text-[12px] font-medium text-white/95 backdrop-blur-md transition-colors hover:bg-black/45"
        >
          <Globe className="h-3.5 w-3.5 text-white/80" />
          <span>{language === 'pt' ? 'English (US)' : 'English'}</span>
        </button>
      </div>

      {/* Bottom Notification Stack, Flashlight, Camera & Swipe Up */}
      <div className="flex flex-col gap-4 pb-1">
        {notifications.length > 0 && (
          <div className="no-scrollbar flex max-h-[260px] flex-col gap-2 overflow-y-auto">
            {notifications.map((notif) => {
              const isEmergency = notif.app === 'emergency';
              return (
                <button
                  key={notif.id}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onTapNotification(notif)}
                  className={`flex w-full items-start gap-3 rounded-[22px] border px-3.5 py-3 text-left shadow-lg backdrop-blur-xl transition-transform active:scale-[0.98] ${
                    isEmergency
                      ? 'border-red-500/45 bg-[#2a090d]/85 hover:bg-[#380d12]/90'
                      : 'border-white/15 bg-black/45 hover:bg-black/60'
                  }`}
                >
                  <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-700/80 text-[14px] font-bold text-white">
                    {isEmergency ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-inner">
                        <AlertTriangle className="h-5 w-5" />
                      </span>
                    ) : notif.app === 'google' ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[18px] font-black text-[#4285F4]">
                        G
                      </span>
                    ) : notif.app === 'mail' ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-inner">
                        <Mail className="h-5 w-5" />
                      </span>
                    ) : notif.app === 'phone' ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34c759] text-white shadow-inner">
                        <Phone className="h-5 w-5" />
                      </span>
                    ) : notif.app === 'instagram' ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white shadow-inner">
                        <Instagram className="h-5 w-5" />
                      </span>
                    ) : (
                      <>
                        <span>{notif.title[0]}</span>
                        <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-[5px] bg-[#25d366] text-[9px] font-bold text-white shadow">
                          W
                        </span>
                      </>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate ${
                          isEmergency
                            ? 'text-[12px] font-bold tracking-wider text-red-400 uppercase'
                            : 'text-[13.5px] font-semibold text-white'
                        }`}
                      >
                        {notif.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-white/60 tabular-nums">
                        {notif.time}
                      </span>
                    </div>
                    {notif.subtitle && (
                      <p className="mt-0.5 truncate text-[12px] font-semibold text-white">
                        {notif.subtitle}
                      </p>
                    )}
                    <p
                      className={`mt-0.5 text-[12px] leading-snug ${
                        isEmergency ? 'line-clamp-3 text-red-100/90' : 'line-clamp-2 text-white/85'
                      }`}
                    >
                      {notif.body}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between px-4">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onToggleFlashlight}
            aria-label="Toggle Flashlight"
            className={`flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all active:scale-95 ${
              flashlightOn
                ? 'border-white bg-white text-slate-900 shadow-[0_0_24px_rgba(255,255,255,0.65)]'
                : 'border-white/15 bg-black/35 text-white hover:bg-black/50'
            }`}
          >
            <Flashlight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onUnlock()}
            className="min-h-[44px] px-3 text-[12.5px] font-medium text-white/50 transition-colors hover:text-white/85"
          >
            Swipe up to open
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onUnlock('camera')}
            aria-label="Open Camera"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-xl transition-all hover:bg-black/50 active:scale-95"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Home Indicator Bar */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onUnlock()}
          aria-label="Swipe up to open"
          className="mx-auto flex h-5 w-40 items-end justify-center pb-1"
        >
          <span className="h-[5px] w-[134px] rounded-full bg-white/95" />
        </button>
      </div>
    </motion.div>
  );
};
