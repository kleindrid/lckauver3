import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { AppId, JournalEntry, WeatherCity } from '../types/phone';
import { AppIcon } from './AppIcons';

interface HomeScreenProps {
  weekdayLabel?: string;
  dayNumber?: number;
  chapterNumber?: number;
  journalEntries?: JournalEntry[];
  weatherCity?: WeatherCity | null;
  tempUnit?: 'C' | 'F';
  unreadMailCount: number;
  unreadWhatsappCount: number;
  dossiersUnlocked?: boolean;
  onOpenApp: (app: AppId) => void;
  onOpenSearch: () => void;
}

const TOP_BESIDE_WIDGET_APPS: { id: AppId; label: string }[] = [
  { id: 'photos', label: 'Photos' },
  { id: 'mail', label: 'Mail' },
  { id: 'notes', label: 'Notes' },
  { id: 'maps', label: 'Maps' },
];

const BOTTOM_ROW_APPS: { id: AppId; label: string }[] = [
  { id: 'x', label: 'X' },
  { id: 'clock', label: 'Clock' },
  { id: 'journal', label: 'Journal' },
  { id: 'instagram', label: 'Instagram' },
];

const DOCK_APPS: AppId[] = ['phone', 'safari', 'whatsapp'];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weekdayLabel = 'Thursday',
  dayNumber = 22,
  chapterNumber = 1,
  journalEntries = [],
  unreadMailCount,
  unreadWhatsappCount,
  dossiersUnlocked = false,
  onOpenApp,
  onOpenSearch,
}) => {
  const [page, setPage] = useState<0 | 1>(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const blockNextClickRef = useRef(false);

  const latestJournal = journalEntries[0];
  const earlierJournals = journalEntries.slice(1, 2);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    blockNextClickRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;

    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      blockNextClickRef.current = true;
      if (dx < 0 && page === 0) setPage(1);
      if (dx > 0 && page === 1) setPage(0);
    }
  };

  const safeOpenApp = (app: AppId) => {
    if (blockNextClickRef.current) {
      blockNextClickRef.current = false;
      return;
    }
    onOpenApp(app);
  };

  const renderGridIcon = (app: { id: AppId; label: string }) => {
    const badge = app.id === 'mail' ? unreadMailCount : 0;
    return (
      <button
        key={app.id}
        type="button"
        onClick={() => safeOpenApp(app.id)}
        className="group relative flex flex-col items-center transition-transform active:scale-90"
      >
        <div className="relative">
          <AppIcon
            id={app.id}
            size={54}
            weekdayLabel={weekdayLabel}
            dayNumber={dayNumber}
          />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[11px] font-bold text-white shadow">
              {badge}
            </span>
          )}
        </div>
        <span className="mt-1 w-full truncate text-center text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {app.label}
        </span>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex h-full flex-col justify-between pt-2 pb-2 select-none"
    >
      {/* Swipeable 2-Page Home Screen Track */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStartRef.current = null;
        }}
        className="relative flex-1 touch-pan-y overflow-hidden"
      >
        <motion.div
          animate={{ x: page === 0 ? '0%' : '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="flex h-full w-[200%]"
        >
          {/* PAGE 1: Calendar Widget + 4 Apps beside it + 1 Row of 4 Apps below + Breathing Space */}
          <div className="flex h-full w-1/2 shrink-0 flex-col px-5 pt-1">
            <div className="grid grid-cols-2 items-center gap-4">
              {/* Calendar Widget */}
              <button
                type="button"
                onClick={() => safeOpenApp('calendar')}
                className="flex aspect-square w-full flex-col items-start justify-between rounded-[24px] bg-[#1c1c1e]/90 p-4 text-left shadow-lg backdrop-blur-xl transition-transform active:scale-95"
              >
                <div>
                  <span className="mt-0.5 block text-[14px] font-semibold text-[#ff453a]">
                    {weekdayLabel}
                  </span>
                  <span className="mt-0.5 block text-[46px] leading-none font-light tracking-tight text-white tabular-nums">
                    {dayNumber}
                  </span>
                </div>
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                  October 2026
                </span>
              </button>

              {/* 4 App Slots Beside the Widget */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                {TOP_BESIDE_WIDGET_APPS.map((app) => renderGridIcon(app))}
              </div>
            </div>

            {/* Single Row of 4 Apps Underneath */}
            <div className="mt-6 grid grid-cols-4 gap-x-3">
              {BOTTOM_ROW_APPS.map((app) => renderGridIcon(app))}
            </div>

            {/* Breathing room above Search + Dock */}
            <div className="flex-1" />
          </div>

          {/* PAGE 2: Large Journal Widget */}
          <div className="flex h-full w-1/2 shrink-0 flex-col justify-between gap-3 px-5 pt-1 pb-2">
            <button
              type="button"
              onClick={() => safeOpenApp('journal')}
              className="flex min-h-0 w-full flex-1 flex-col justify-between overflow-hidden rounded-[26px] border border-emerald-200/15 bg-[#13211e]/92 p-4 text-left shadow-2xl backdrop-blur-2xl transition-transform active:scale-[0.985]"
            >
              <div className="min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold tracking-wider text-emerald-300 uppercase">
                        Journal
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Lee Sanghyeok · Case Log
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 tabular-nums">
                    Ch. 0{chapterNumber}
                  </span>
                </div>

                {/* Featured Latest Entry */}
                {latestJournal ? (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-emerald-300/90">
                      <span>{latestJournal.date}</span>
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10.5px] text-emerald-200">
                        {latestJournal.mood}
                      </span>
                    </div>
                    <h2 className="mt-1 text-[16px] leading-snug font-bold text-[#f5efe0]">
                      {latestJournal.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-4 text-[13px] leading-relaxed text-[#f5efe0]/85">
                      {latestJournal.body}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-[13px] text-zinc-400">
                    No journal entries yet.
                  </p>
                )}
              </div>

              {/* Previous Entry + Footer */}
              <div className="mt-2.5 shrink-0 space-y-2 border-t border-white/10 pt-2.5">
                {earlierJournals.length > 0 && (
                  <div className="space-y-1">
                    {earlierJournals.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-2 rounded-xl bg-black/25 px-3 py-1.5 text-[11.5px]"
                      >
                        <span className="truncate font-medium text-[#f5efe0]/80">
                          {entry.title}
                        </span>
                        <span className="shrink-0 text-zinc-400">{entry.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11.5px] font-semibold text-emerald-300">
                  <span>Tap to open Journal ({journalEntries.length})</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </button>

            <div className="grid shrink-0 grid-cols-4 gap-x-3 pt-1">
              {renderGridIcon({ id: 'recorder', label: 'Voice Memos' })}
              {dossiersUnlocked &&
                renderGridIcon({ id: 'dossiers', label: 'Case Files' })}
              {renderGridIcon({ id: 'narrations', label: 'Narrations' })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Page Indicator Dots + Search Pill + Dock + Home Bar */}
      <div className="flex flex-col items-center gap-2.5 px-3">
        {/* Page Dots */}
        <div
          className="flex items-center gap-2 rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-md"
          role="tablist"
          aria-label="Home Screen Pages"
        >
          <button
            type="button"
            role="tab"
            aria-selected={page === 0}
            aria-label="Home Page 1"
            onClick={() => setPage(0)}
            className={`h-1.5 rounded-full transition-all ${
              page === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/65'
            }`}
          />
          <button
            type="button"
            role="tab"
            aria-selected={page === 1}
            aria-label="Journal Widget Page 2"
            onClick={() => setPage(1)}
            className={`h-1.5 rounded-full transition-all ${
              page === 1 ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/65'
            }`}
          />
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3.5 py-1 text-[12px] font-medium text-white/95 backdrop-blur-md transition-colors hover:bg-black/50 active:scale-95"
        >
          <Search className="h-3 w-3 text-white/80" />
          <span>Search</span>
        </button>

        {/* Dock */}
        <div className="flex w-full items-center justify-evenly rounded-[30px] border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-2xl">
          {DOCK_APPS.map((id) => {
            const badge = id === 'whatsapp' ? unreadWhatsappCount : 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onOpenApp(id)}
                aria-label={`Open ${id}`}
                className="relative transition-transform active:scale-90"
              >
                <AppIcon id={id} size={56} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[11px] font-bold text-white shadow">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Home Indicator */}
        <div className="h-[5px] w-[134px] rounded-full bg-white/90" />
      </div>
    </motion.div>
  );
};
