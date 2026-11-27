import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Mic, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { VoiceRecordingItem, VoiceRecordingLine } from '../../types/phone';

interface VoiceMemosAppProps {
  recordings: VoiceRecordingItem[];
  liveScript: VoiceRecordingItem | null;
  autoStartLive: boolean;
  initialRecordingId?: string | null;
  autoPlayInitial?: boolean;
  savedNoticeRecordingId?: string | null;
  completedRecordingIds?: string[];
  onFinishLiveRecording: (recording: VoiceRecordingItem) => void;
  onAddManualRecording?: (recording: VoiceRecordingItem) => void;
  onConsumeAutoStart?: () => void;
  onConsumeInitialRecording?: () => void;
  onCompletePlayback?: (recordingId: string) => void;
}

function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const WAVE_BAR_SEEDS = [
  0.34, 0.58, 0.72, 0.45, 0.88, 0.62, 0.39, 0.94, 0.68, 0.52,
  0.81, 0.43, 0.76, 0.91, 0.55, 0.41, 0.84, 0.66, 0.48, 0.79,
  0.61, 0.37, 0.86, 0.54, 0.71, 0.42, 0.63, 0.36,
];

function getSpeakerColorClass(speaker: string): string {
  const s = speaker.toLowerCase();
  if (s.includes('unknown')) return 'text-red-400';
  if (s.includes('sanghyeok')) return 'text-emerald-300';
  if (s.includes('wangho') || s.includes('hyunjun') || s.includes('minseok')) {
    return 'text-amber-300';
  }
  return 'text-sky-300';
}

export const VoiceMemosApp: React.FC<VoiceMemosAppProps> = ({
  recordings,
  liveScript,
  autoStartLive,
  initialRecordingId = null,
  autoPlayInitial = false,
  savedNoticeRecordingId = null,
  completedRecordingIds = [],
  onFinishLiveRecording,
  onAddManualRecording,
  onConsumeAutoStart,
  onConsumeInitialRecording,
  onCompletePlayback,
}) => {
  const [mode, setMode] = useState<'list' | 'recording-live' | 'recording-manual' | 'detail'>(
    autoStartLive && liveScript
      ? 'recording-live'
      : initialRecordingId
      ? 'detail'
      : 'list'
  );
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(
    initialRecordingId
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waveTick, setWaveTick] = useState(0);
  const [isPlayingBack, setIsPlayingBack] = useState(
    Boolean(initialRecordingId && autoPlayInitial)
  );
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [liveSpeed, setLiveSpeed] = useState<1 | 2>(1);
  const [replaySpeed, setReplaySpeed] = useState<1 | 2>(1);
  const [showFullReplay, setShowFullReplay] = useState(false);
  const [justStoppedNotice, setJustStoppedNotice] = useState(false);
  const [mailSavedNotice, setMailSavedNotice] = useState(
    Boolean(initialRecordingId && savedNoticeRecordingId === initialRecordingId)
  );

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const replayTranscriptEndRef = useRef<HTMLDivElement>(null);
  const finishedLiveRef = useRef(false);
  const completedPlaybackRef = useRef<Set<string>>(new Set());
  const onFinishLiveRef = useRef(onFinishLiveRecording);
  onFinishLiveRef.current = onFinishLiveRecording;
  const onConsumeAutoStartRef = useRef(onConsumeAutoStart);
  onConsumeAutoStartRef.current = onConsumeAutoStart;
  const onConsumeInitialRef = useRef(onConsumeInitialRecording);
  onConsumeInitialRef.current = onConsumeInitialRecording;
  const onCompletePlaybackRef = useRef(onCompletePlayback);
  onCompletePlaybackRef.current = onCompletePlayback;

  // Trigger auto-start live recording if requested when already mounted or newly mounted
  useEffect(() => {
    if (autoStartLive && liveScript) {
      finishedLiveRef.current = false;
      setElapsedSeconds(0);
      setLiveSpeed(1);
      setJustStoppedNotice(false);
      setMailSavedNotice(false);
      setMode('recording-live');
      onConsumeAutoStartRef.current?.();
    }
  }, [autoStartLive, liveScript]);

  // Trigger opening a specific saved recording directly in full-screen detail view
  useEffect(() => {
    if (!initialRecordingId) return;
    const match = recordings.find((r) => r.id === initialRecordingId);
    if (!match) return;
    setSelectedRecordingId(match.id);
    setJustStoppedNotice(false);
    setMailSavedNotice(savedNoticeRecordingId === match.id);
    setShowFullReplay(false);
    setReplaySpeed(1);
    setPlaybackSeconds(autoPlayInitial ? 0 : match.durationSeconds);
    setIsPlayingBack(Boolean(autoPlayInitial));
    setMode('detail');
    onConsumeInitialRef.current?.();
  }, [initialRecordingId, autoPlayInitial, savedNoticeRecordingId, recordings]);

  // Waveform animation tick while recording or playing back
  useEffect(() => {
    const active = mode === 'recording-live' || mode === 'recording-manual' || isPlayingBack;
    if (!active) return;
    const id = setInterval(() => {
      setWaveTick((t) => t + 1);
    }, 140);
    return () => clearInterval(id);
  }, [mode, isPlayingBack]);

  // Live scripted recording clock + auto-completion
  useEffect(() => {
    if (mode !== 'recording-live' || !liveScript) return;

    const intervalMs = liveSpeed === 2 ? 500 : 1000;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= liveScript.durationSeconds && !finishedLiveRef.current) {
          finishedLiveRef.current = true;
          setTimeout(() => {
            onFinishLiveRef.current(liveScript);
            setSelectedRecordingId(liveScript.id);
            setIsPlayingBack(false);
            setPlaybackSeconds(liveScript.durationSeconds);
            setJustStoppedNotice(true);
            setMode('detail');
          }, 0);
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [mode, liveScript, liveSpeed]);

  // Manual personal voice memo timer
  useEffect(() => {
    if (mode !== 'recording-manual') return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  // Playback timer for saved recordings
  const selectedRecording =
    recordings.find((r) => r.id === selectedRecordingId) ??
    (selectedRecordingId === liveScript?.id ? liveScript : null);

  useEffect(() => {
    if (mode !== 'detail' || !isPlayingBack || !selectedRecording) return;
    const intervalMs = replaySpeed === 2 ? 500 : 1000;
    const timer = setInterval(() => {
      setPlaybackSeconds((prev) => {
        const next = prev + 1;
        if (next >= selectedRecording.durationSeconds) {
          setIsPlayingBack(false);
          if (!completedPlaybackRef.current.has(selectedRecording.id)) {
            completedPlaybackRef.current.add(selectedRecording.id);
            setTimeout(() => {
              onCompletePlaybackRef.current?.(selectedRecording.id);
            }, 0);
          }
          return selectedRecording.durationSeconds;
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [mode, isPlayingBack, selectedRecording, replaySpeed]);

  const liveVisibleLines: VoiceRecordingLine[] =
    mode === 'recording-live' && liveScript
      ? liveScript.lines.filter((l) => l.atSeconds <= elapsedSeconds)
      : [];

  const detailVisibleLines: VoiceRecordingLine[] =
    mode === 'detail' && selectedRecording
      ? isPlayingBack && !showFullReplay
        ? selectedRecording.lines.filter((l) => l.atSeconds <= playbackSeconds)
        : selectedRecording.lines
      : [];

  useEffect(() => {
    if (mode === 'recording-live') {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveVisibleLines.length, mode]);

  useEffect(() => {
    if (
      mode === 'detail' &&
      (isPlayingBack || showFullReplay || (selectedRecording && playbackSeconds >= selectedRecording.durationSeconds))
    ) {
      replayTranscriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [detailVisibleLines.length, mode, isPlayingBack, showFullReplay, playbackSeconds, selectedRecording]);

  const handleStopLiveEarly = () => {
    if (!liveScript || finishedLiveRef.current) return;
    finishedLiveRef.current = true;
    const capturedLines = liveScript.lines.filter((l) => l.atSeconds <= elapsedSeconds);
    const saved: VoiceRecordingItem = {
      ...liveScript,
      durationSeconds: Math.max(elapsedSeconds, 1),
      lines: capturedLines.length > 0 ? capturedLines : liveScript.lines.slice(0, 1),
    };
    onFinishLiveRecording(saved);
    setSelectedRecordingId(saved.id);
    setPlaybackSeconds(saved.durationSeconds);
    setIsPlayingBack(false);
    setJustStoppedNotice(true);
    setMode('detail');
  };

  const handleStopManual = () => {
    const duration = Math.max(elapsedSeconds, 1);
    const manualRec: VoiceRecordingItem = {
      id: `manual-memo-${Date.now()}`,
      title: 'Dorm 304 Ambient Check',
      date: 'Just now',
      durationSeconds: duration,
      lines: [
        {
          id: `manual-line-${Date.now()}`,
          speaker: 'Audio Note',
          atSeconds: 0,
          text: 'Ambient hallway and room check recorded on device.',
        },
      ],
    };
    onAddManualRecording?.(manualRec);
    setSelectedRecordingId(manualRec.id);
    setPlaybackSeconds(duration);
    setIsPlayingBack(false);
    setJustStoppedNotice(false);
    setMode('detail');
  };

  const isRecentlySpeaking =
    mode === 'recording-live' &&
    liveVisibleLines.some((l) => Math.abs(elapsedSeconds - l.atSeconds) <= 2);

  // 1. LIVE RECORDING VIEW (Living Room eavesdropping, Bistro meeting, or Manual)
  if (mode === 'recording-live' || mode === 'recording-manual') {
    const isLiveScene = mode === 'recording-live';
    const isBistroScene = isLiveScene && liveScript?.id === 'chapter5_bistro';
    return (
      <div className="flex h-full flex-col justify-between bg-[#0a0a0d] pt-[90px] pb-6 text-white">
        {/* Top Bar */}
        <div className="border-b border-white/10 px-4 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-[18px] font-bold tracking-tight text-white">
                {isLiveScene ? liveScript?.title ?? 'Living Room' : 'New Recording'}
              </h1>
              <p className="mt-0.5 text-[12px] font-medium text-red-400">
                {isBistroScene
                  ? 'Recording Riverside Bistro Audio'
                  : isLiveScene
                  ? 'Recording Dorm 304 Living Room Audio'
                  : 'Recording Microphone Input'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {isLiveScene && (
                <button
                  type="button"
                  onClick={() => setLiveSpeed((s) => (s === 1 ? 2 : 1))}
                  className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-zinc-200 transition-colors hover:bg-white/20"
                  title="Toggle transcript pace"
                >
                  {liveSpeed}x
                </button>
              )}
              <span className="font-mono text-[18px] font-semibold text-white tabular-nums">
                {formatDuration(elapsedSeconds)}
              </span>
            </div>
          </div>

          {/* Live Audio Waveform Visualizer */}
          <div className="mt-3.5 flex h-12 items-center justify-between gap-[3px] rounded-xl border border-white/10 bg-[#13141a] px-3">
            {WAVE_BAR_SEEDS.map((seed, idx) => {
              const modulation =
                Math.sin(waveTick * 0.65 + idx * 0.7) * 0.28 +
                Math.cos(waveTick * 0.4 + idx * 1.1) * 0.16;
              const boost = isRecentlySpeaking ? 0.25 : mode === 'recording-manual' ? 0.1 : -0.05;
              const scale = Math.min(1, Math.max(0.16, seed + modulation + boost));
              return (
                <span
                  key={idx}
                  className="h-8 w-[3px] origin-center rounded-full bg-red-500 transition-transform duration-150"
                  style={{ transform: `scaleY(${scale.toFixed(2)})` }}
                />
              );
            })}
          </div>
        </div>

        {/* Live Transcript Feed */}
        <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-3.5">
          {isLiveScene ? (
            <>
              {liveVisibleLines.length === 0 ? (
                <div className="py-10 text-center text-[13px] text-zinc-400">
                  {isBistroScene
                    ? 'Concealing microphone at the corner booth...'
                    : 'Listening through the bedroom door...'}
                </div>
              ) : (
                liveVisibleLines.map((line) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-xl border p-3.5 ${
                      line.speaker.toLowerCase().includes('unknown')
                        ? 'border-red-500/40 bg-red-950/35'
                        : 'border-white/10 bg-[#14161e]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[12px] font-bold tracking-wide ${getSpeakerColorClass(
                          line.speaker
                        )}`}
                      >
                        {line.speaker}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                        {formatDuration(line.atSeconds)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-100">
                      {line.text}
                    </p>
                  </motion.div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Mic className="h-8 w-8 text-red-400" />
              <p className="mt-3 text-[14px] font-semibold text-zinc-200">
                Capturing room audio
              </p>
              <p className="mt-1 max-w-[230px] text-[12.5px] text-zinc-400">
                Tap Stop below when finished to save this recording.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Thumb-Zone Control */}
        <div className="border-t border-white/10 bg-[#101116] px-4 pt-3 pb-1">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={isLiveScene ? handleStopLiveEarly : handleStopManual}
              aria-label="Stop and save recording"
              className="flex min-h-[48px] min-w-[164px] items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-[14px] font-semibold text-white shadow-lg transition-transform active:scale-95"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>Stop & Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SAVED RECORDING DETAIL & REPLAY VIEW
  if (mode === 'detail' && selectedRecording) {
    const isCompletedRecording =
      completedRecordingIds.includes(selectedRecording.id) ||
      playbackSeconds >= selectedRecording.durationSeconds;
    const visibleReplayLines = detailVisibleLines;

    return (
      <div className="flex h-full flex-col justify-between bg-[#0a0a0d] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-3 pb-2.5">
          <button
            type="button"
            onClick={() => {
              setIsPlayingBack(false);
              setJustStoppedNotice(false);
              setMailSavedNotice(false);
              setShowFullReplay(false);
              setMode('list');
            }}
            className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[14px] font-medium text-red-400 hover:bg-white/5"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>All Recordings</span>
          </button>
          <div className="flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={() => setReplaySpeed((s) => (s === 1 ? 2 : 1))}
              className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-zinc-200 transition-colors hover:bg-white/20"
              title="Toggle playback speed"
            >
              {replaySpeed}x
            </button>
            <span className="font-mono text-[12px] text-zinc-400 tabular-nums">
              {formatDuration(selectedRecording.durationSeconds)}
            </span>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-6">
          {justStoppedNotice && (
            <div className="mb-3 rounded-lg border border-red-500/35 bg-red-500/12 px-3 py-2 text-[12px] font-medium text-red-200">
              Recording stopped · Saved to Voice Memos
            </div>
          )}
          {!justStoppedNotice && mailSavedNotice && (
            <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-[12px] font-medium text-emerald-200">
              Audio file saved to Sanghyeok&apos;s Voice Memos
            </div>
          )}
          <h1 className="text-[20px] font-bold tracking-tight text-white">
            {selectedRecording.title}
          </h1>
          <p className="mt-1 text-[12px] text-zinc-400">
            {selectedRecording.date} · {selectedRecording.lines.length} transcript lines
          </p>

          {/* Waveform Replay Player */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#13141a] p-3.5">
            <div className="flex h-10 items-center justify-between gap-[3px]">
              {WAVE_BAR_SEEDS.map((seed, idx) => {
                const barPos = (idx / WAVE_BAR_SEEDS.length) * selectedRecording.durationSeconds;
                const passed = playbackSeconds >= barPos;
                const modulation = isPlayingBack
                  ? Math.sin(waveTick * 0.65 + idx * 0.7) * 0.26
                  : 0;
                const scale = Math.min(1, Math.max(0.2, seed + modulation));
                return (
                  <span
                    key={idx}
                    className={`h-7 w-[3px] origin-center rounded-full transition-transform duration-150 ${
                      passed ? 'bg-red-500' : 'bg-zinc-700'
                    }`}
                    style={{ transform: `scaleY(${scale.toFixed(2)})` }}
                  />
                );
              })}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-zinc-400 tabular-nums">
              <span>{formatDuration(playbackSeconds)}</span>
              <span>{formatDuration(selectedRecording.durationSeconds)}</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowFullReplay(false);
                  setPlaybackSeconds(0);
                  setIsPlayingBack(true);
                }}
                aria-label="Replay from start"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFullReplay(false);
                  if (playbackSeconds >= selectedRecording.durationSeconds) {
                    setPlaybackSeconds(0);
                  }
                  setIsPlayingBack((p) => !p);
                }}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-[13.5px] font-semibold text-black transition-transform active:scale-95"
              >
                {isPlayingBack ? (
                  <>
                    <Pause className="h-4 w-4 fill-black" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-black" />
                    <span>
                      {playbackSeconds > 0 &&
                      playbackSeconds < selectedRecording.durationSeconds
                        ? 'Resume'
                        : 'Play Audio'}
                    </span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFullReplay(true);
                  setIsPlayingBack(false);
                  setPlaybackSeconds(selectedRecording.durationSeconds);
                  if (!completedPlaybackRef.current.has(selectedRecording.id)) {
                    completedPlaybackRef.current.add(selectedRecording.id);
                  }
                  onCompletePlaybackRef.current?.(selectedRecording.id);
                }}
                className="min-h-[44px] rounded-full border border-white/15 bg-white/5 px-3.5 text-[12px] font-medium text-zinc-200 transition-colors hover:bg-white/10"
              >
                {isCompletedRecording || showFullReplay ? 'Full Text' : 'Read All'}
              </button>
            </div>
          </div>

          {/* Saved Transcript Lines */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11.5px] font-semibold tracking-wider text-zinc-400 uppercase">
                Captured Transcript
              </h2>
              {isCompletedRecording && (
                <span className="text-[11px] font-medium text-emerald-400">
                  Saved ✓
                </span>
              )}
            </div>
            {visibleReplayLines.map((line) => (
              <div
                key={line.id}
                className={`rounded-xl border p-3.5 ${
                  line.speaker.toLowerCase().includes('unknown')
                    ? 'border-red-500/40 bg-red-950/35'
                    : 'border-white/10 bg-[#14161e]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[12px] font-bold ${getSpeakerColorClass(
                      line.speaker
                    )}`}
                  >
                    {line.speaker}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                    {formatDuration(line.atSeconds)}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-100">
                  {line.text}
                </p>
              </div>
            ))}
            {(playbackSeconds >= selectedRecording.durationSeconds ||
              showFullReplay ||
              (!isPlayingBack && isCompletedRecording)) && (
              <div className="flex items-center gap-2.5 pt-2 pb-1">
                <span className="h-px flex-1 bg-white/15" />
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-red-300 uppercase">
                  <Square className="h-2.5 w-2.5 fill-red-400 text-red-400" />
                  <span>End of Recording</span>
                  <span className="font-mono text-[10.5px] text-red-200/80 tabular-nums">
                    {formatDuration(selectedRecording.durationSeconds)}
                  </span>
                </div>
                <span className="h-px flex-1 bg-white/15" />
              </div>
            )}
            <div ref={replayTranscriptEndRef} />
          </div>
        </div>
      </div>
    );
  }

  // 3. RECORDINGS LIST VIEW
  return (
    <div className="flex h-full flex-col justify-between bg-[#0a0a0d] pt-[90px] pb-6 text-white">
      <div className="border-b border-white/10 px-4 pb-3">
        <h1 className="text-[26px] font-bold tracking-tight text-white">
          Voice Memos
        </h1>
        <p className="mt-0.5 text-[12px] text-zinc-400">
          {recordings.length}{' '}
          {recordings.length === 1 ? 'saved recording' : 'saved recordings'}
        </p>
      </div>

      <div className="no-scrollbar flex-1 divide-y divide-white/10 overflow-y-auto">
        {recordings.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Mic className="h-9 w-9 text-zinc-600" />
            <p className="mt-3 text-[15px] font-semibold text-zinc-200">
              No Recordings Yet
            </p>
            <p className="mt-1 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
              Tap the red button below to start a new voice recording.
            </p>
          </div>
        ) : (
          recordings.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => {
                setSelectedRecordingId(rec.id);
                setPlaybackSeconds(rec.durationSeconds);
                setIsPlayingBack(false);
                setMode('detail');
              }}
              className="flex min-h-[68px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-white">
                  {rec.title}
                </p>
                <p className="mt-0.5 truncate text-[12.5px] text-zinc-400">
                  {rec.date} · {rec.lines.length} lines captured
                </p>
              </div>
              <span className="shrink-0 font-mono text-[13px] text-zinc-400 tabular-nums">
                {formatDuration(rec.durationSeconds)}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Bottom Thumb-Zone Record Button */}
      <div className="flex items-center justify-center border-t border-white/10 bg-[#101116] pt-3 pb-1">
        <button
          type="button"
          onClick={() => {
            setElapsedSeconds(0);
            setMode('recording-manual');
          }}
          aria-label="Start new voice recording"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 p-1 transition-transform active:scale-90"
        >
          <span className="h-full w-full rounded-full bg-red-600" />
        </button>
      </div>
    </div>
  );
};
