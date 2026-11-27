import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bluetooth,
  CheckCircle2,
  Circle,
  FastForward,
  Flashlight,
  HelpCircle,
  Home,
  ListChecks,
  Lock,
  Plane,
  Sun,
  Wifi,
} from 'lucide-react';
import { ChapterTask } from '../types/phone';

interface ControlCenterProps {
  chapterNumber: number;
  hasNextChapter: boolean;
  chapterTasks: ChapterTask[];
  airplaneMode: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  flashlightOn: boolean;
  brightness: number;
  onToggleAirplane: () => void;
  onToggleWifi: () => void;
  onToggleBluetooth: () => void;
  onToggleFlashlight: () => void;
  onChangeBrightness: (val: number) => void;
  onLockPhone: () => void;
  onSkipChapter: () => void;
  onReturnHome: () => void;
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  chapterNumber,
  hasNextChapter,
  chapterTasks,
  airplaneMode,
  wifiEnabled,
  bluetoothEnabled,
  flashlightOn,
  brightness,
  onToggleAirplane,
  onToggleWifi,
  onToggleBluetooth,
  onToggleFlashlight,
  onChangeBrightness,
  onLockPhone,
  onSkipChapter,
  onReturnHome,
  onClose,
}) => {
  const [panel, setPanel] = useState<'main' | 'help' | 'tasks'>('main');
  const completedCount = chapterTasks.filter((t) => t.completed).length;
  const allCompleted =
    chapterTasks.length > 0 && completedCount === chapterTasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="absolute inset-0 z-50 flex flex-col justify-between bg-black/75 px-5 pt-13 pb-7 backdrop-blur-2xl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="no-scrollbar flex-1 space-y-3.5 overflow-y-auto pb-4"
      >
        {panel === 'main' && (
          <>
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] font-semibold text-white/80">
                Control Center · Ch. 0{chapterNumber}
              </span>
              <button
                type="button"
                onClick={onLockPhone}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/20"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock</span>
              </button>
            </div>

            {/* Top Help & Chapter Bar */}
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
              <p className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-white/60 uppercase">
                Investigation Menu
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPanel('help')}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/20 active:scale-[0.98]"
                >
                  <HelpCircle className="h-4 w-4 shrink-0 text-sky-400" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white">Help</p>
                    <p className="truncate text-[10.5px] text-white/60">
                      How to explore
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPanel('tasks')}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/20 active:scale-[0.98]"
                >
                  <ListChecks className="h-4 w-4 shrink-0 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white">
                      Chapter Tasks
                    </p>
                    <p className="truncate text-[10.5px] text-white/60 tabular-nums">
                      {completedCount}/{chapterTasks.length} completed
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onSkipChapter}
                  disabled={!hasNextChapter}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/20 active:scale-[0.98] disabled:opacity-45"
                >
                  <FastForward className="h-4 w-4 shrink-0 text-amber-400" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white">
                      Skip Chapter
                    </p>
                    <p className="truncate text-[10.5px] text-white/60">
                      {hasNextChapter
                        ? `Go to Ch. 0${chapterNumber + 1}`
                        : 'Final chapter'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onReturnHome}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/20 active:scale-[0.98]"
                >
                  <Home className="h-4 w-4 shrink-0 text-indigo-300" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white">Home</p>
                    <p className="truncate text-[10.5px] text-white/60">
                      Chapter select
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connectivity */}
            <div className="grid grid-cols-4 gap-2.5 rounded-[24px] bg-white/10 p-3.5 backdrop-blur-xl">
              <button
                type="button"
                onClick={onToggleAirplane}
                className={`flex h-11 w-full items-center justify-center rounded-full transition-colors ${
                  airplaneMode ? 'bg-amber-500 text-white' : 'bg-white/15 text-white'
                }`}
                aria-label="Airplane Mode"
              >
                <Plane className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onToggleWifi}
                className={`flex h-11 w-full items-center justify-center rounded-full transition-colors ${
                  !airplaneMode && wifiEnabled
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/15 text-white/60'
                }`}
                aria-label="Wi-Fi"
              >
                <Wifi className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onToggleBluetooth}
                className={`flex h-11 w-full items-center justify-center rounded-full transition-colors ${
                  bluetoothEnabled
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/15 text-white/60'
                }`}
                aria-label="Bluetooth"
              >
                <Bluetooth className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onToggleFlashlight}
                className={`flex h-11 w-full items-center justify-center rounded-full transition-colors ${
                  flashlightOn
                    ? 'bg-white text-slate-900'
                    : 'bg-white/15 text-white'
                }`}
                aria-label="Flashlight"
              >
                <Flashlight className="h-5 w-5" />
              </button>
            </div>

            {/* Brightness */}
            <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between text-[12px] font-medium text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="h-4 w-4" /> Brightness
                </span>
                <span className="tabular-nums">{brightness}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={brightness}
                onChange={(e) => onChangeBrightness(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </>
        )}

        {panel === 'help' && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPanel('main')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-[16px] font-bold text-white">
                How to Explore
              </h2>
            </div>

            <div className="space-y-2.5 rounded-[24px] border border-white/10 bg-white/10 p-4 text-[13px] leading-relaxed text-zinc-200">
              <div>
                <p className="font-semibold text-white">1. Unlock & Navigate</p>
                <p className="text-zinc-300">
                  Swipe up on the Lock Screen (or tap a notification) to unlock.
                  Tap any app to investigate, and swipe up or tap the bottom bar
                  to return to the Home Screen.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">2. Gather Clues</p>
                <p className="text-zinc-300">
                  Check <strong>WhatsApp</strong> for precinct orders, read
                  Sanghyeok’s dorm logs in <strong>Notes</strong>, inspect
                  suspect timelines in <strong>X</strong> and{' '}
                  <strong>Instagram</strong>, and read news in{' '}
                  <strong>Safari</strong>.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  3. Watch Live Broadcasts
                </p>
                <p className="text-zinc-300">
                  Exploring key apps triggers new breaking news and urgent
                  Police Emergency Broadcast alerts.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  4. Pull Down Anytime
                </p>
                <p className="text-zinc-300">
                  Swipe down from the top status bar to open Chapter Tasks, skip
                  to the next chapter, or return to the Chapter Select screen.
                </p>
              </div>
            </div>
          </div>
        )}

        {panel === 'tasks' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPanel('main')}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-[16px] font-bold text-white">
                  Chapter 0{chapterNumber} Tasks
                </h2>
              </div>
              <span className="text-[12px] font-semibold text-emerald-400 tabular-nums">
                {completedCount}/{chapterTasks.length}
              </span>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${
                      chapterTasks.length > 0
                        ? (completedCount / chapterTasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="space-y-2.5">
                {chapterTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 ${
                      task.completed ? 'bg-emerald-500/15' : 'bg-black/30'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                    )}
                    <span
                      className={`text-[13px] leading-snug ${
                        task.completed
                          ? 'text-emerald-100 line-through decoration-emerald-400/60'
                          : 'text-zinc-200'
                      }`}
                    >
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>

              {hasNextChapter && (
                <button
                  type="button"
                  onClick={onSkipChapter}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-colors ${
                    allCompleted
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  <FastForward className="h-4 w-4" />
                  <span>
                    {allCompleted
                      ? `Continue to Chapter 0${chapterNumber + 1}`
                      : `Skip to Chapter 0${chapterNumber + 1}`}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto text-[13px] font-medium text-white/60 hover:text-white"
      >
        Tap outside to close
      </button>
    </motion.div>
  );
};
