import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Film,
  MapPin,
  Play,
  X,
} from 'lucide-react';
import { NarrationMemoItem } from '../../types/phone';

interface NarrationsAppProps {
  memos: NarrationMemoItem[];
}

export const NarrationsApp: React.FC<NarrationsAppProps> = ({ memos }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replayIndex, setReplayIndex] = useState<number | null>(null);

  const selected = memos.find((m) => m.id === selectedId) ?? null;

  useEffect(() => {
    if (replayIndex === null || !selected) return;
    if (replayIndex >= selected.beats.length - 1) return;

    const timer = setTimeout(() => {
      setReplayIndex((prev) =>
        prev === null ? null : Math.min(prev + 1, selected.beats.length - 1)
      );
    }, 6200);

    return () => clearTimeout(timer);
  }, [replayIndex, selected]);

  if (selected && replayIndex !== null) {
    const beat = selected.beats[replayIndex];
    return (
      <div
        onClick={() => {
          if (replayIndex < selected.beats.length - 1) {
            setReplayIndex((prev) => (prev === null ? 0 : prev + 1));
          } else {
            setReplayIndex(null);
          }
        }}
        className="flex h-full cursor-pointer flex-col justify-between bg-black px-7 pt-[90px] pb-11 text-center text-white select-none"
      >
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="font-mono tracking-[0.16em] uppercase tabular-nums">
            Ch. 0{selected.chapter} · {replayIndex + 1} / {selected.beats.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReplayIndex(null);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3 w-3" />
            <span>Close</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {beat && (
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="my-auto flex flex-col items-center px-1"
            >
              {beat.kind === 'dialogue' && beat.speaker && (
                <span
                  className={`mb-3 text-[11px] font-semibold tracking-[0.2em] uppercase ${
                    beat.speaker.startsWith('Lee Sanghyeok')
                      ? 'text-sky-400'
                      : 'text-amber-300'
                  }`}
                >
                  {beat.speaker}
                </span>
              )}
              <p
                className={`max-w-[300px] text-[14.5px] leading-[1.7] ${
                  beat.kind === 'narration'
                    ? 'font-normal text-zinc-300 italic'
                    : 'font-medium text-white'
                }`}
              >
                {beat.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            {selected.beats.map((item, idx) => (
              <span
                key={item.id}
                className={`h-1 rounded-full transition-all ${
                  idx === replayIndex
                    ? 'w-5 bg-white/80'
                    : idx < replayIndex
                    ? 'w-1.5 bg-white/35'
                    : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
            {replayIndex < selected.beats.length - 1
              ? 'Tap anywhere to continue'
              : 'Tap anywhere to exit'}
          </span>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="flex h-full flex-col bg-[#0b0d14] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#111420] px-3 py-2.5">
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setReplayIndex(null);
            }}
            className="flex min-h-[40px] items-center gap-1 rounded-lg px-2 text-[14px] font-medium text-indigo-400 hover:bg-white/5"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Narrations</span>
          </button>
          <button
            type="button"
            onClick={() => setReplayIndex(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1.5 text-[12px] font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/25 hover:text-white"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Replay Scene</span>
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-8">
          <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-[#161a2b] to-[#10131e] p-4">
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase">
              <span className="tracking-[0.14em] text-indigo-300">
                Chapter 0{selected.chapter}
              </span>
              <span className="text-zinc-400 tabular-nums">{selected.dateTime}</span>
            </div>
            <h1 className="mt-1.5 text-[18px] leading-snug font-bold text-white">
              {selected.title}
            </h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-zinc-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
              <span>{selected.location}</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {selected.beats.map((beat, idx) => (
              <div
                key={beat.id}
                className={`rounded-xl border p-3.5 ${
                  beat.kind === 'dialogue'
                    ? 'border-sky-400/20 bg-[#121826]'
                    : 'border-white/8 bg-[#12141e]'
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className={`text-[10.5px] font-semibold tracking-[0.14em] uppercase ${
                      beat.kind === 'dialogue'
                        ? beat.speaker?.startsWith('Lee Sanghyeok')
                          ? 'text-sky-400'
                          : 'text-amber-300'
                        : 'text-indigo-300/80'
                    }`}
                  >
                    {beat.kind === 'dialogue' && beat.speaker
                      ? beat.speaker
                      : 'Narration'}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <p
                  className={`text-[13.5px] leading-relaxed ${
                    beat.kind === 'narration'
                      ? 'text-zinc-200 italic'
                      : 'font-medium text-white'
                  }`}
                >
                  {beat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0b0d14] pt-[90px] pb-6 text-white">
      <div className="border-b border-white/10 px-4 pb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight">Narrations</h1>
            <p className="text-[12px] text-zinc-400">
              Scene Memos · Sanghyeok&apos;s Observations
            </p>
          </div>
          <span className="rounded-full border border-indigo-400/25 bg-indigo-500/15 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 tabular-nums">
            {memos.length} {memos.length === 1 ? 'Memo' : 'Memos'}
          </span>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-3.5 pb-6">
        {memos.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-white/10 bg-[#12141e] px-5 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <Film className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-semibold text-white">
              No narration memos archived yet
            </p>
            <p className="mt-1.5 max-w-[240px] text-[12.5px] leading-relaxed text-zinc-400">
              Black-screen narration scenes experienced during the investigation
              are saved here automatically so you can review or replay them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {memos.map((memo) => (
              <button
                key={memo.id}
                type="button"
                onClick={() => setSelectedId(memo.id)}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-[#131622] p-3.5 text-left transition-colors hover:border-indigo-400/35 hover:bg-[#181c2c] active:scale-[0.99]"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <BookOpenText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold tracking-[0.12em] text-indigo-300 uppercase">
                      Ch. 0{memo.chapter}
                    </span>
                    <span className="text-zinc-400 tabular-nums">{memo.dateTime}</span>
                  </div>
                  <h2 className="mt-0.5 truncate text-[15px] font-semibold text-white">
                    {memo.title}
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-zinc-400">
                    {memo.location} · {memo.beats.length} scenes
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-300">
                    {memo.summary}
                  </p>
                </div>
                <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-zinc-500" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
