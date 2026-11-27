import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Smartphone } from 'lucide-react';
import { ChapterInfo } from '../types/phone';

interface ChapterSelectScreenProps {
  chapters: ChapterInfo[];
  onSelectChapter: (chapterId: number) => void;
}

export const ChapterSelectScreen: React.FC<ChapterSelectScreenProps> = ({
  chapters,
  onSelectChapter,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-between bg-black px-5 py-7 text-white">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center">
        {/* Case Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-wider text-red-400 uppercase">
            Interactive AU · Gyeong-gwan
          </p>
          <h1 className="mt-1.5 text-[28px] leading-tight font-bold tracking-tight text-white [text-wrap:balance]">
            THE BUNNY CURSED
          </h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-zinc-400">
            Undercover as a university student in Dorm 304, Detective Lee Sanghyeok tracks leads on his phone as the 2008 murders return.
          </p>
        </motion.div>

        {/* Vertically Stacked Chapter List */}
        <div className="mt-7 flex flex-col gap-3.5">
          {chapters.map((chapter, idx) => (
            <motion.button
              key={chapter.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.26,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => {
                if (chapter.unlocked) {
                  setLockedNotice(null);
                  onSelectChapter(chapter.id);
                } else {
                  setLockedNotice(
                    `${chapter.code} (${chapter.title}) unlocks after completing the previous chapter or using Skip Chapter in the top bar.`
                  );
                }
              }}
              className={`group flex w-full flex-col rounded-2xl border p-4.5 text-left transition-all ${
                chapter.unlocked
                  ? 'border-white/15 bg-[#0e0e12] hover:border-white/30 hover:bg-[#14141a] active:scale-[0.99]'
                  : 'border-white/10 bg-[#08080a] opacity-70 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11.5px] font-medium text-zinc-400">
                <span>{chapter.code}</span>
                <span
                  className={
                    chapter.unlocked ? 'text-emerald-400' : 'text-zinc-500'
                  }
                >
                  {chapter.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <h2 className="mt-2 text-[18px] font-bold tracking-tight text-white">
                {chapter.title}
              </h2>
              <p className="mt-0.5 text-[12.5px] font-medium text-zinc-400">
                {chapter.subtitle}
              </p>

              <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-300">
                {chapter.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[12.5px] font-semibold">
                {chapter.unlocked ? (
                  <>
                    <span className="inline-flex items-center gap-2 text-white">
                      <Smartphone className="h-4 w-4 text-zinc-300" />
                      Open Phone
                    </span>
                    <ArrowRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-1" />
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2 text-zinc-500">
                    <Lock className="h-3.5 w-3.5" />
                    Chapter Locked
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {lockedNotice && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-white/15 bg-[#111115] px-4 py-3 text-[12.5px] leading-snug text-zinc-300"
          >
            {lockedNotice}
          </div>
        )}
      </div>

      <footer className="mx-auto mt-7 flex w-full max-w-[430px] items-center justify-between border-t border-white/10 pt-4 text-[12px] text-zinc-500">
        <span>Device: Lee S.</span>
        <span>Select a chapter to start</span>
      </footer>
    </div>
  );
};
