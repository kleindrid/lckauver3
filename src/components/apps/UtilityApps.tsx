import React, { useEffect, useRef, useState } from 'react';
import {
  Camera as CameraIcon,
  ChevronLeft,
  ChevronRight,
  Clock as ClockIcon,
  Cloud,
  CloudRain,
  Compass,
  FolderOpen,
  Heart,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  MapPin,
  Mic,
  Navigation,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sun,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import {
  AlarmItem,
  CalendarEvent,
  MailItem,
  MailScriptedCompose,
  NoteItem,
  PhotoItem,
  VoiceRecordingItem,
  WeatherCity,
} from '../../types/phone';
import { AVAILABLE_WEATHER_CITIES } from '../../data/initialData';

/* ---------------- 1. PHOTOS / GALLERY & CAMERA ROLL ---------------- */
export const PhotosApp: React.FC<{
  photos: PhotoItem[];
  onToggleFav: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onOpenCamera?: () => void;
  initialTab?: 'all' | 'dormitory' | 'camera' | 'favorites';
}> = ({
  photos,
  onToggleFav,
  onDeletePhoto,
  onOpenCamera,
  initialTab = 'all',
}) => {
  const [bottomTab, setBottomTab] = useState<'library' | 'collections'>(
    initialTab === 'all' ? 'library' : 'collections'
  );
  const [collectionFilter, setCollectionFilter] = useState<
    'all' | 'dormitory' | 'camera' | 'favorites' | null
  >(initialTab === 'all' ? null : initialTab);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hideChrome, setHideChrome] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const dormitoryPhotos = photos.filter(
    (p) => p.folder?.toLowerCase() === 'dormitory'
  );
  const cameraPhotos = photos.filter(
    (p) => p.source === 'camera' || p.id.startsWith('cap-')
  );
  const favoritePhotos = photos.filter((p) => p.favorite);

  const activeFilter = bottomTab === 'library' ? 'all' : collectionFilter ?? 'all';
  const filtered =
    activeFilter === 'dormitory'
      ? dormitoryPhotos
      : activeFilter === 'camera'
      ? cameraPhotos
      : activeFilter === 'favorites'
      ? favoritePhotos
      : photos;

  const selectedIndex = filtered.findIndex((p) => p.id === selectedId);
  const selected =
    selectedIndex >= 0
      ? filtered[selectedIndex]
      : photos.find((p) => p.id === selectedId) ?? null;

  const goPrev = () => {
    if (filtered.length <= 1 || selectedIndex < 0) return;
    const prevIdx = (selectedIndex - 1 + filtered.length) % filtered.length;
    setSelectedId(filtered[prevIdx].id);
  };

  const goNext = () => {
    if (filtered.length <= 1 || selectedIndex < 0) return;
    const nextIdx = (selectedIndex + 1) % filtered.length;
    setSelectedId(filtered[nextIdx].id);
  };

  if (selected) {
    const sourceLabel =
      selected.folder
        ? `${selected.folder} Folder`
        : selected.source === 'camera' || selected.id.startsWith('cap-')
        ? 'Camera Roll'
        : selected.source === 'gallery'
        ? 'Gallery Folder'
        : 'Device Archive';

    return (
      <div className="relative flex h-full flex-col justify-between bg-white pt-[90px] pb-7 text-zinc-950 select-none">
        {/* Top Light HUD */}
        <div
          className={`z-20 flex items-center justify-between px-4 pb-2 transition-opacity duration-200 ${
            hideChrome ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setHideChrome(false);
              setShowInfo(false);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[13px] font-medium text-zinc-900 hover:bg-zinc-200"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>
              {bottomTab === 'collections' && collectionFilter === 'dormitory'
                ? 'Dormitory'
                : bottomTab === 'collections'
                ? 'Collections'
                : 'Library'}
            </span>
          </button>

          <div className="min-w-0 px-2 text-center">
            <p className="truncate text-[13px] font-semibold text-zinc-950">
              {selected.title}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {filtered.length > 1 && selectedIndex >= 0
                ? `${selectedIndex + 1} of ${filtered.length} · `
                : ''}
              {selected.date}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowInfo((v) => !v)}
              aria-label="Photo info"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                showInfo
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const nextPhoto =
                  filtered[selectedIndex + 1] ?? filtered[selectedIndex - 1] ?? null;
                onDeletePhoto(selected.id);
                setSelectedId(nextPhoto ? nextPhoto.id : null);
                setShowInfo(false);
              }}
              aria-label="Delete photo"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media Canvas */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-1">
          <button
            type="button"
            onClick={() => setHideChrome((v) => !v)}
            aria-label="Toggle full screen controls"
            className="flex h-full w-full items-center justify-center focus:outline-none"
          >
            {selected.dataUrl ? (
              <img
                src={selected.dataUrl}
                alt={selected.title}
                referrerPolicy="no-referrer"
                className="max-h-full w-full rounded-lg object-contain"
              />
            ) : (
              <div
                className="mx-3 flex aspect-[3/4] w-full flex-col justify-end rounded-2xl p-5 text-left text-white shadow-lg"
                style={{
                  background: `linear-gradient(155deg, ${selected.palette[0]} 0%, ${selected.palette[1]} 55%, ${selected.palette[2]} 100%)`,
                }}
              >
                <span className="mb-2 inline-block w-fit rounded-md bg-black/35 px-2 py-0.5 text-[10.5px] font-semibold tracking-wider text-white/90 uppercase">
                  {sourceLabel}
                </span>
                <p className="text-[19px] font-bold">{selected.title}</p>
                <p className="mt-1 text-[13px] text-white/85">{selected.caption}</p>
              </div>
            )}
          </button>

          {!hideChrome && filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-900 shadow-md backdrop-blur-md hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-900 shadow-md backdrop-blur-md hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {showInfo && !hideChrome && (
            <div className="absolute right-3 bottom-3 left-3 z-30 rounded-2xl border border-zinc-200 bg-white/95 p-3.5 text-left shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                  {sourceLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-[14.5px] font-bold text-zinc-950">
                {selected.title}
              </p>
              <p className="mt-0.5 text-[12px] text-zinc-600">
                {selected.caption}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
                <span>{selected.location}</span>
                <span>{selected.date}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Filmstrip & Favorite Action */}
        <div
          className={`z-20 space-y-2.5 px-3 pt-2 transition-opacity duration-200 ${
            hideChrome ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          {filtered.length > 1 && (
            <div className="no-scrollbar flex justify-center gap-1.5 overflow-x-auto px-2 py-1">
              {filtered.map((item) => {
                const active = item.id === selected.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 transition-transform ${
                      active
                        ? 'scale-105 border-zinc-950'
                        : 'border-transparent opacity-55 hover:opacity-85'
                    }`}
                  >
                    {item.dataUrl ? (
                      <img
                        src={item.dataUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background: `linear-gradient(145deg, ${item.palette[0]}, ${item.palette[1]}, ${item.palette[2]})`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between px-3">
            <span className="text-[11.5px] text-zinc-500">{selected.location}</span>
            <button
              type="button"
              onClick={() => onToggleFav(selected.id)}
              aria-label="Favorite photo"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200"
            >
              <Heart
                className={`h-5 w-5 ${
                  selected.favorite ? 'fill-red-500 text-red-500' : 'text-zinc-800'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dormCover = dormitoryPhotos[0];
  const allCover = photos[0];
  const camCover = cameraPhotos[0];
  const favCover = favoritePhotos[0];

  const renderGrid = (items: PhotoItem[], emptyKind?: 'camera' | 'dormitory' | 'favorites') => {
    if (items.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            {emptyKind === 'camera' ? (
              <CameraIcon className="h-7 w-7" />
            ) : emptyKind === 'dormitory' ? (
              <FolderOpen className="h-7 w-7" />
            ) : (
              <ImageIcon className="h-7 w-7" />
            )}
          </div>
          <p className="mt-3 text-[15px] font-semibold text-zinc-900">
            {emptyKind === 'camera'
              ? 'No camera snapshots yet'
              : emptyKind === 'dormitory'
              ? 'Dormitory folder is empty'
              : 'No favorite photos'}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500">
            {emptyKind === 'camera'
              ? 'Take a photo in the Camera app to view it here in your Camera Roll.'
              : emptyKind === 'dormitory'
              ? 'Drop dormitory images in src/assets/gallery/dormitory/ to display them here.'
              : 'Tap the heart inside any photo to bookmark it here.'}
          </p>
          {emptyKind === 'camera' && onOpenCamera && (
            <button
              type="button"
              onClick={onOpenCamera}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-[13px] font-semibold text-white hover:bg-zinc-800"
            >
              <CameraIcon className="h-4 w-4" />
              <span>Open Camera</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="no-scrollbar flex-1 overflow-y-auto pb-28">
        {bottomTab === 'library' && (
          <h2 className="px-4 pt-3 pb-2 text-[17px] font-bold tracking-tight text-zinc-950">
            October 2026
          </h2>
        )}
        <div className="grid grid-cols-3 gap-[2px]">
          {items.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setSelectedId(photo.id);
                setHideChrome(false);
                setShowInfo(false);
              }}
              className="relative aspect-square overflow-hidden bg-zinc-100 transition-opacity active:opacity-80"
            >
              {photo.dataUrl ? (
                <img
                  src={photo.dataUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-end p-2 text-left"
                  style={{
                    background: `linear-gradient(145deg, ${photo.palette[0]}, ${photo.palette[1]}, ${photo.palette[2]})`,
                  }}
                >
                  <span className="truncate text-[10px] font-semibold text-white/95">
                    {photo.title}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const collectionTitle =
    collectionFilter === 'dormitory'
      ? 'Dormitory'
      : collectionFilter === 'camera'
      ? 'Camera Roll'
      : collectionFilter === 'favorites'
      ? 'Favorites'
      : collectionFilter === 'all'
      ? 'All Photos'
      : 'Collections';

  return (
    <div className="relative flex h-full flex-col bg-white pt-[90px] text-[#0f1419]">
      {/* Header */}
      <div className="px-4 pb-2">
        {bottomTab === 'collections' && collectionFilter ? (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setCollectionFilter(null)}
              className="inline-flex items-center gap-1 text-[14px] font-semibold text-blue-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Collections</span>
            </button>
            <h1 className="truncate text-[17px] font-bold tracking-tight text-zinc-950">
              {collectionTitle}
            </h1>
            <span className="text-[12px] text-zinc-500 tabular-nums">
              {filtered.length}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-[30px] leading-none font-bold tracking-tight text-black">
              {bottomTab === 'library' ? 'Library' : 'Collections'}
            </h1>
            {bottomTab === 'collections' && onOpenCamera && (
              <button
                type="button"
                onClick={onOpenCamera}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-[12px] font-semibold text-zinc-900 hover:bg-zinc-200"
              >
                <CameraIcon className="h-3.5 w-3.5 text-zinc-700" />
                <span>Camera</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      {bottomTab === 'library' ? (
        renderGrid(photos)
      ) : collectionFilter ? (
        renderGrid(
          filtered,
          collectionFilter === 'camera'
            ? 'camera'
            : collectionFilter === 'dormitory'
            ? 'dormitory'
            : collectionFilter === 'favorites'
            ? 'favorites'
            : undefined
        )
      ) : (
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 pt-2 pb-28">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  id: 'all',
                  title: 'Recents',
                  count: photos.length,
                  cover: allCover,
                  subtitle: 'October 2026',
                },
                {
                  id: 'dormitory',
                  title: 'Dormitory',
                  count: dormitoryPhotos.length,
                  cover: dormCover,
                  subtitle: 'Dorm 304 snapshots',
                },
                {
                  id: 'camera',
                  title: 'Camera Roll',
                  count: cameraPhotos.length,
                  cover: camCover,
                  subtitle: 'Captured on device',
                },
                {
                  id: 'favorites',
                  title: 'Favorites',
                  count: favoritePhotos.length,
                  cover: favCover,
                  subtitle: 'Bookmarked items',
                },
              ] as const
            ).map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setCollectionFilter(album.id)}
                className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 text-left transition-transform active:scale-[0.98]"
              >
                <div className="aspect-square w-full overflow-hidden bg-zinc-200">
                  {album.cover?.dataUrl ? (
                    <img
                      src={album.cover.dataUrl}
                      alt={album.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : album.cover ? (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(145deg, ${album.cover.palette[0]}, ${album.cover.palette[1]}, ${album.cover.palette[2]})`,
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                      {album.id === 'camera' ? (
                        <CameraIcon className="h-7 w-7" />
                      ) : album.id === 'favorites' ? (
                        <Heart className="h-7 w-7" />
                      ) : (
                        <FolderOpen className="h-7 w-7" />
                      )}
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-[13.5px] font-semibold text-zinc-950">
                      {album.title}
                    </span>
                    <span className="text-[12px] font-medium text-zinc-500 tabular-nums">
                      {album.count}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {album.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Frosted Glass Bottom Pill (Library | Collections) */}
      <div className="pointer-events-none absolute right-4 bottom-7 left-4 z-20 flex justify-center">
        <div className="pointer-events-auto grid w-full max-w-[330px] grid-cols-2 rounded-full border border-white/75 bg-white/75 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => {
              setBottomTab('library');
              setCollectionFilter(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-[12.5px] transition-colors ${
              bottomTab === 'library'
                ? 'bg-black/[0.08] font-semibold text-zinc-950'
                : 'font-medium text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Library</span>
          </button>
          <button
            type="button"
            onClick={() => setBottomTab('collections')}
            className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-[12.5px] transition-colors ${
              bottomTab === 'collections'
                ? 'bg-black/[0.08] font-semibold text-zinc-950'
                : 'font-medium text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Collections</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 2. MAIL ---------------- */
function formatMailAudioTime(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const MailApp: React.FC<{
  mails: MailItem[];
  scriptedCompose?: MailScriptedCompose | null;
  autoStartScripted?: boolean;
  repliedMailIds?: string[];
  savedAudioRecordingIds?: string[];
  completedAudioMailIds?: string[];
  onReadMail: (id: string) => void;
  onSendMail: (to: string, subject: string, body: string) => void;
  onCompleteScriptedMail?: (compose: MailScriptedCompose) => void;
  onQuickReplyMail?: (mailId: string) => void;
  onOpenAudioAttachment?: (mailId: string, recording: VoiceRecordingItem) => void;
}> = ({
  mails,
  scriptedCompose = null,
  autoStartScripted = false,
  repliedMailIds = [],
  savedAudioRecordingIds = [],
  completedAudioMailIds = [],
  onReadMail,
  onSendMail,
  onCompleteScriptedMail,
  onQuickReplyMail,
  onOpenAudioAttachment,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState('lieutenant.park@ggpd.gov');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [typedIndex, setTypedIndex] = useState(0);
  const completedComposeRef = useRef<string | null>(null);

  useEffect(() => {
    setTypedIndex(0);
    completedComposeRef.current = null;
  }, [scriptedCompose?.id]);

  useEffect(() => {
    if (!scriptedCompose || !autoStartScripted) return;
    if (typedIndex >= scriptedCompose.body.length) {
      if (completedComposeRef.current === scriptedCompose.id) return;
      const doneTimer = setTimeout(() => {
        if (completedComposeRef.current === scriptedCompose.id) return;
        completedComposeRef.current = scriptedCompose.id;
        onCompleteScriptedMail?.(scriptedCompose);
      }, 1100);
      return () => clearTimeout(doneTimer);
    }

    const stepDelay = typedIndex === 0 ? 450 : 18;
    const typeTimer = setTimeout(() => {
      setTypedIndex((prev) => Math.min(scriptedCompose.body.length, prev + 1));
    }, stepDelay);
    return () => clearTimeout(typeTimer);
  }, [scriptedCompose, autoStartScripted, typedIndex, onCompleteScriptedMail]);

  const selected = mails.find((m) => m.id === selectedId) ?? null;

  if (scriptedCompose) {
    const visibleBody = scriptedCompose.body.slice(0, typedIndex);
    const isTyping = typedIndex < scriptedCompose.body.length;
    const triggerSend = () => {
      if (completedComposeRef.current === scriptedCompose.id) return;
      completedComposeRef.current = scriptedCompose.id;
      onCompleteScriptedMail?.(scriptedCompose);
    };

    return (
      <div className="flex h-full flex-col bg-[#0c0c0e] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-sky-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
            {isTyping ? 'Composing...' : 'Sending...'}
          </span>
          <span className="text-[15px] font-semibold">New Message</span>
          <button
            type="button"
            onClick={triggerSend}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-blue-400 hover:text-blue-300"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isTyping ? 'Skip & Send' : 'Send'}</span>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          <div className="border-b border-white/10 pb-2 text-[13.5px]">
            <span className="text-zinc-500">To: </span>
            <span className="font-medium text-sky-300">{scriptedCompose.to}</span>
          </div>
          <div className="border-b border-white/10 pb-2 text-[13.5px]">
            <span className="text-zinc-500">Subject: </span>
            <span className="font-semibold text-white">{scriptedCompose.subject}</span>
          </div>
          <div className="flex-1 whitespace-pre-line text-[13.5px] leading-relaxed text-zinc-200">
            <span>{visibleBody}</span>
            {isTyping && (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-sky-400 align-middle" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (composing) {
    return (
      <div className="flex h-full flex-col bg-[#0c0c0e] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <button
            type="button"
            onClick={() => setComposing(false)}
            className="text-[14px] text-blue-400"
          >
            Cancel
          </button>
          <span className="text-[15px] font-semibold">New Message</span>
          <button
            type="button"
            onClick={() => {
              if (!subject.trim()) return;
              onSendMail(to, subject.trim(), body.trim());
              setComposing(false);
              setSubject('');
              setBody('');
            }}
            className="text-[14px] font-semibold text-blue-400"
          >
            Send
          </button>
        </div>
        <div className="flex-1 space-y-3 p-4">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="w-full border-b border-white/10 bg-transparent pb-2 text-[14px] outline-none"
          />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border-b border-white/10 bg-transparent pb-2 text-[14px] outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email..."
            rows={10}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>
    );
  }

  if (selected) {
    const attachment = selected.audioAttachment;
    const isAudioCompleted = completedAudioMailIds.includes(selected.id);
    const isAudioSaved = attachment
      ? savedAudioRecordingIds.includes(attachment.id)
      : false;
    const hasReplied = repliedMailIds.includes(selected.id);

    return (
      <div className="flex h-full flex-col bg-[#0c0c0e] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-blue-400"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Inbox</span>
          </button>
          <span className="text-[12px] text-zinc-400">{selected.time}</span>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          <h2 className="text-[19px] font-bold">{selected.subject}</h2>
          <p className="mt-1 text-[13px] text-zinc-400">
            From: <span className="text-white">{selected.from}</span> ({selected.email})
          </p>
          <div className="mt-5 whitespace-pre-line text-[14.5px] leading-relaxed text-zinc-200">
            {selected.body}
          </div>

          {selected.quickReplyLabel && (
            <div className="mt-5 border-t border-white/10 pt-4">
              {hasReplied ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-[12.5px] font-medium text-emerald-300">
                  Reply sent to Inspector Kang
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onQuickReplyMail?.(selected.id)}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-blue-500 active:scale-[0.99]"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>{selected.quickReplyLabel}</span>
                </button>
              )}
            </div>
          )}

          {attachment && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => onOpenAudioAttachment?.(selected.id, attachment)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#13151d] p-4 text-left transition-colors hover:border-red-500/40 hover:bg-[#181b25] active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                    <Mic className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-white">
                      {attachment.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-zinc-400">
                      Voice File · {formatMailAudioTime(attachment.durationSeconds)} ·{' '}
                      {isAudioCompleted
                        ? 'Statement Heard'
                        : isAudioSaved
                        ? 'Saved to Voice Memos'
                        : 'Tap to open in Voice Memos'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-red-400">
                  <span>{isAudioCompleted ? 'Listen' : 'Open'}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
              {(isAudioSaved || isAudioCompleted) && (
                <p className="mt-2 px-1 text-[11.5px] font-medium text-emerald-400">
                  Saved to Sanghyeok&apos;s Voice Memos files ✓
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0c0c0e] pt-[90px] pb-6 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
        <h1 className="text-[28px] font-bold">Inbox</h1>
        <button
          type="button"
          onClick={() => setComposing(true)}
          aria-label="Compose Email"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="no-scrollbar flex-1 divide-y divide-white/10 overflow-y-auto">
        {mails.map((mail) => (
          <button
            key={mail.id}
            type="button"
            onClick={() => {
              onReadMail(mail.id);
              setSelectedId(mail.id);
            }}
            className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-white/5"
          >
            <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-transparent">
              {mail.unread && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[15px] font-semibold">{mail.from}</span>
                <span className="shrink-0 text-[12px] text-zinc-400">{mail.time}</span>
              </div>
              <p className="truncate text-[13.5px] font-medium text-zinc-200">
                {mail.subject}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[12.5px] text-zinc-400">
                {mail.preview}
              </p>
              {mail.audioAttachment && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-300">
                  <Mic className="h-3 w-3 shrink-0" />
                  <span>Voice File Attached</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 3. WEATHER ---------------- */
export const WeatherApp: React.FC<{
  selectedCity: WeatherCity | null;
  tempUnit: 'C' | 'F';
  onSelectCity: (city: WeatherCity | null) => void;
  onToggleUnit: () => void;
}> = ({ selectedCity, tempUnit, onSelectCity, onToggleUnit }) => {
  const formatTemp = (c: number) =>
    tempUnit === 'F' ? Math.round((c * 9) / 5 + 32) : c;

  return (
    <div
      className="no-scrollbar flex h-full flex-col overflow-y-auto px-4 pt-[90px] pb-8 text-white"
      style={{
        background: 'linear-gradient(180deg, #1d4e89 0%, #3d72b4 55%, #162e52 100%)',
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold">Weather</h1>
        <button
          type="button"
          onClick={onToggleUnit}
          className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold"
        >
          °{tempUnit}
        </button>
      </div>

      {selectedCity ? (
        <div className="mt-5 rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[22px] font-semibold">{selectedCity.name}</p>
              <p className="text-[14px] text-white/80">{selectedCity.condition}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectCity(null)}
              className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] text-white/80"
            >
              Clear Widget
            </button>
          </div>
          <div className="mt-3 text-[54px] font-light leading-none tabular-nums">
            {formatTemp(selectedCity.tempC)}°
          </div>
          <p className="mt-2 text-[13px] text-white/80 tabular-nums">
            H:{formatTemp(selectedCity.highC)}° · L:{formatTemp(selectedCity.lowC)}°
          </p>

          <div className="mt-5 grid grid-cols-5 gap-2 border-t border-white/15 pt-4 text-center">
            {selectedCity.hourly.map((h) => (
              <div key={h.time} className="flex flex-col items-center gap-1.5 text-[12px]">
                <span className="text-white/75">{h.time}</span>
                {h.icon === 'sun' ? (
                  <Sun className="h-4 w-4 text-amber-300" />
                ) : h.icon === 'rain' ? (
                  <CloudRain className="h-4 w-4 text-sky-200" />
                ) : (
                  <Cloud className="h-4 w-4 text-white" />
                )}
                <span className="font-semibold tabular-nums">
                  {formatTemp(h.tempC)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] border border-white/15 bg-white/10 p-5 text-center backdrop-blur-xl">
          <Cloud className="mx-auto h-9 w-9 text-white/80" />
          <p className="mt-2 text-[15px] font-semibold">No forecast added</p>
          <p className="mt-1 text-[12.5px] text-white/75">
            Tap a city below to display live weather on the Home Screen widget.
          </p>
        </div>
      )}

      <p className="mt-6 mb-2 text-[12px] font-semibold tracking-wide text-white/70">
        SELECT LOCATION
      </p>
      <div className="space-y-2.5">
        {AVAILABLE_WEATHER_CITIES.map((city) => {
          const active = selectedCity?.id === city.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                active
                  ? 'border-white bg-white/25'
                  : 'border-white/10 bg-black/20 hover:bg-black/30'
              }`}
            >
              <div>
                <p className="text-[16px] font-semibold">{city.name}</p>
                <p className="text-[12.5px] text-white/75">{city.condition}</p>
              </div>
              <span className="text-[28px] font-light tabular-nums">
                {formatTemp(city.tempC)}°
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- 4. CALENDAR ---------------- */
export const CalendarApp: React.FC<{
  events: CalendarEvent[];
  onAddEvent: (day: number, title: string, time: string, location: string) => void;
}> = ({ events, onAddEvent }) => {
  const [selectedDay, setSelectedDay] = useState(22);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('18:00');

  const dayEvents = events.filter((e) => e.day === selectedDay);

  return (
    <div className="flex h-full flex-col bg-[#111114] pt-[90px] pb-6 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
        <div>
          <p className="text-[12px] font-semibold text-[#ff453a]">OCTOBER 2026</p>
          <h1 className="text-[24px] font-bold">Calendar</h1>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff453a]/20 text-[#ff453a]"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Month Grid */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-zinc-500">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-1.5 text-center text-[14px] tabular-nums">
          {/* Oct 1, 2026 is Thursday -> 4 empty slots */}
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const hasEvent = events.some((e) => e.day === day);
            const isSelected = selectedDay === day;
            const isToday = day === 22;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className="relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${
                    isSelected
                      ? 'bg-[#ff453a] text-white'
                      : isToday
                        ? 'text-[#ff453a]'
                        : 'text-white'
                  }`}
                >
                  {day}
                </span>
                {hasEvent && !isSelected && (
                  <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-zinc-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {adding && (
        <div className="mx-4 mt-3 space-y-2 rounded-2xl bg-[#1c1c1e] p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-lg bg-black/40 px-3 py-2 text-[13px] outline-none"
          />
          <div className="flex gap-2">
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time"
              className="w-24 rounded-lg bg-black/40 px-3 py-2 text-[13px] outline-none tabular-nums"
            />
            <button
              type="button"
              onClick={() => {
                if (!title.trim()) return;
                onAddEvent(selectedDay, title.trim(), time, 'Added on device');
                setTitle('');
                setAdding(false);
              }}
              className="flex-1 rounded-lg bg-[#ff453a] py-2 text-[13px] font-semibold"
            >
              Add to Oct {selectedDay}
            </button>
          </div>
        </div>
      )}

      <div className="no-scrollbar mt-4 flex-1 space-y-2.5 overflow-y-auto px-4">
        <p className="text-[12px] font-semibold text-zinc-400">
          October {selectedDay}
        </p>
        {dayEvents.length === 0 ? (
          <p className="text-[13.5px] text-zinc-500">No events scheduled.</p>
        ) : (
          dayEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between rounded-2xl bg-[#1c1c1e] px-4 py-3"
            >
              <div>
                <p className="text-[14.5px] font-semibold">{ev.title}</p>
                <p className="text-[12px] text-zinc-400">{ev.location}</p>
              </div>
              <span
                className="text-[13px] font-semibold tabular-nums"
                style={{ color: ev.color }}
              >
                {ev.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ---------------- 5. NOTES ---------------- */
export const NotesApp: React.FC<{
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onCreateNote: () => NoteItem;
  onDeleteNote: (id: string) => void;
}> = ({ notes, onSaveNote, onCreateNote, onDeleteNote }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const editingNote = notes.find((n) => n.id === editingId) ?? null;

  if (editingNote) {
    return (
      <div className="flex h-full flex-col bg-[#121214] pt-[90px] pb-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-[#ffd60a]"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Notes</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onDeleteNote(editingNote.id);
              setEditingId(null);
            }}
            className="text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <input
            value={editingNote.title}
            onChange={(e) =>
              onSaveNote({ ...editingNote, title: e.target.value, updatedAt: 'Just now' })
            }
            placeholder="Title"
            className="bg-transparent text-[22px] font-bold text-white outline-none"
          />
          <textarea
            value={editingNote.body}
            onChange={(e) =>
              onSaveNote({ ...editingNote, body: e.target.value, updatedAt: 'Just now' })
            }
            placeholder="Start typing..."
            className="mt-3 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-zinc-200 outline-none"
          />
        </div>
      </div>
    );
  }

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.body.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-[#121214] px-4 pt-[90px] pb-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Notes</h1>
        <button
          type="button"
          onClick={() => {
            const created = onCreateNote();
            setEditingId(created.id);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd60a]/20 text-[#ffd60a]"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#1c1c1e] px-3 py-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes"
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-zinc-500"
        />
      </div>
      <div className="no-scrollbar mt-4 flex-1 space-y-2.5 overflow-y-auto">
        {filtered.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => setEditingId(note.id)}
            className="w-full rounded-2xl bg-[#1c1c1e] p-3.5 text-left transition-colors hover:bg-[#262629]"
          >
            <p className="truncate text-[15px] font-semibold text-white">
              {note.title || 'Untitled Note'}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-zinc-400">
              {note.updatedAt} · {note.body.replace(/\n/g, ' ')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 6. MAPS ---------------- */
interface CityMapPin {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  category: 'campus' | 'city';
  x: number;
  y: number;
  etaFromDorm: string;
  etaFromDowntown: string;
}

const MAP_PINS: CityMapPin[] = [
  {
    id: 'dorm',
    name: 'Dorm 304 · University Dormitory',
    shortLabel: 'Dorm 304',
    subtitle: 'Seongnam-ro · Student Residence (Undercover Post)',
    category: 'campus',
    x: 68,
    y: 342,
    etaFromDorm: 'Current location · University Dorm',
    etaFromDowntown: '1.4 km · 6 min walk back',
  },
  {
    id: 'university',
    name: 'Gyeong-gwan University · Main Campus',
    shortLabel: 'GG Univ',
    subtitle: 'Main Quad, Humanities Hall, Arts Studio & Media Lab',
    category: 'campus',
    x: 158,
    y: 332,
    etaFromDorm: '360 m · 4 min walk across South Gate',
    etaFromDowntown: '1.2 km · 5 min drive',
  },
  {
    id: 'flats-north',
    name: 'Campus Flats · North Wing (Bldg A)',
    shortLabel: 'Flats A',
    subtitle: 'Student Housing · Song Mina, Han Seoyun & Choi Eunji',
    category: 'campus',
    x: 238,
    y: 282,
    etaFromDorm: '520 m · 6 min walk via Quad',
    etaFromDowntown: '1.0 km · 4 min drive',
  },
  {
    id: 'flats-east',
    name: 'Campus Flats · East Courtyard (Bldg B)',
    shortLabel: 'Flats B',
    subtitle: 'Student Housing · Kang Soyeon & Park Yuna',
    category: 'campus',
    x: 296,
    y: 336,
    etaFromDorm: '640 m · 8 min walk east of Main Quad',
    etaFromDowntown: '1.3 km · 5 min drive',
  },
  {
    id: 'flats-south',
    name: 'Campus Flats · Riverside Annex (Bldg C)',
    shortLabel: 'Flats C',
    subtitle: 'Student Housing · Baek Chaewon & Riverfront Trail',
    category: 'campus',
    x: 218,
    y: 392,
    etaFromDorm: '590 m · 7 min walk along Riverside',
    etaFromDowntown: '1.5 km · 6 min drive',
  },
  {
    id: 'precinct',
    name: 'Gyeong-gwan Central Precinct',
    shortLabel: 'Police Stn',
    subtitle: 'Police Station & Evidence Vault · Inspector Kang',
    category: 'city',
    x: 122,
    y: 238,
    etaFromDorm: '280 m · 3 min walk from Dorm',
    etaFromDowntown: '420 m · 5 min walk from Market',
  },
  {
    id: 'downtown',
    name: 'Downtown Gyeong-gwan',
    shortLabel: 'City Center',
    subtitle: 'Main St. & Seongnam Market · Commercial Center',
    category: 'city',
    x: 204,
    y: 176,
    etaFromDorm: '1.4 km · 6 min walk',
    etaFromDowntown: 'Current location · City Center',
  },
  {
    id: 'allstar',
    name: 'AllStar Rehearsal Garage',
    shortLabel: 'AllStar Garage',
    subtitle: 'Industrial District · Fire & Homicide Scene',
    category: 'city',
    x: 292,
    y: 108,
    etaFromDorm: '4.8 km · 12 min drive',
    etaFromDowntown: '3.1 km · 8 min drive',
  },
  {
    id: 'park',
    name: 'Gyeong-gwan Park Sector',
    shortLabel: 'Park Sector',
    subtitle: 'North Residential · Burned Vehicle Scene',
    category: 'city',
    x: 92,
    y: 106,
    etaFromDorm: '3.9 km · 10 min drive',
    etaFromDowntown: '2.4 km · 7 min drive',
  },
];

export const MapsApp: React.FC<{ chapter?: number }> = ({ chapter = 1 }) => {
  const userLocationPinId = chapter === 2 ? 'downtown' : 'dorm';
  const [selectedPinId, setSelectedPinId] = useState(userLocationPinId);
  const [pinFilter, setPinFilter] = useState<'all' | 'campus' | 'city'>('all');
  const [zoom, setZoom] = useState(1);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setSelectedPinId(chapter === 2 ? 'downtown' : 'dorm');
    setNavigating(false);
  }, [chapter]);

  const userPin =
    MAP_PINS.find((p) => p.id === userLocationPinId) ?? MAP_PINS[0];
  const selectedPin =
    MAP_PINS.find((p) => p.id === selectedPinId) ?? userPin;
  const isAtSelected = selectedPin.id === userLocationPinId;
  const distanceLabel =
    chapter === 2 ? selectedPin.etaFromDowntown : selectedPin.etaFromDorm;

  const visiblePins = MAP_PINS.filter(
    (p) => pinFilter === 'all' || p.category === pinFilter
  );

  const routeMidX = Math.round((userPin.x + selectedPin.x) / 2) + 12;
  const routeMidY = Math.round((userPin.y + selectedPin.y) / 2) - 18;

  return (
    <div className="relative flex h-full flex-col bg-[#141a24] pt-[90px] pb-6 text-white">
      {/* Interactive SVG City Map */}
      <div className="relative flex-1 overflow-hidden">
        <svg
          viewBox="0 0 360 480"
          className="h-full w-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          <rect width="360" height="480" fill="#1b2432" />
          {/* Parks */}
          <path d="M20 50 L165 40 L160 150 L20 140 Z" fill="#1b3b34" />
          {/* University Campus District Polygon */}
          <rect
            x="114"
            y="258"
            width="216"
            height="148"
            rx="22"
            fill="#19333a"
            stroke="#2dd4bf"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
          <text
            x="126"
            y="276"
            fill="#5eead4"
            opacity="0.55"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.8"
          >
            GYEONG-GWAN UNIVERSITY & FLATS
          </text>
          {/* River */}
          <path
            d="M0 442 Q155 402 360 426 L360 480 L0 480 Z"
            fill="#143c5e"
          />
          {/* Roads */}
          <path d="M0 175 L360 205" stroke="#303d52" strokeWidth="10" />
          <path d="M36 368 L345 155" stroke="#2d3c54" strokeWidth="8" />
          <path d="M84 0 L108 480" stroke="#303d52" strokeWidth="9" />
          <path d="M222 0 L242 480" stroke="#3b4d68" strokeWidth="12" />
          {/* Campus Quad Walkways */}
          <path
            d="M68 342 L158 332 L238 282 M158 332 L296 336 M158 332 L218 392"
            fill="none"
            stroke="#2dd4bf"
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Active Route from Current Chapter Location */}
          {!isAtSelected && (
            <path
              d={`M${userPin.x} ${userPin.y} Q${routeMidX} ${routeMidY} ${selectedPin.x} ${selectedPin.y}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4.5"
              strokeDasharray={navigating ? '0' : '8 6'}
              strokeLinecap="round"
            />
          )}

          {/* Landmarks & Pins */}
          {visiblePins.map((pin) => {
            const active = pin.id === selectedPin.id;
            const isUserHere = pin.id === userLocationPinId;
            const isPolice = pin.id === 'precinct';
            const isCampus = pin.category === 'campus' && !isUserHere;
            return (
              <g
                key={pin.id}
                onClick={() => {
                  setSelectedPinId(pin.id);
                  setNavigating(false);
                }}
                className="cursor-pointer"
              >
                {isUserHere && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="22"
                    fill="#3b82f6"
                    opacity="0.22"
                  />
                )}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={active ? 13.5 : 10}
                  fill={
                    isUserHere
                      ? '#2563eb'
                      : isPolice
                      ? '#1d4ed8'
                      : active
                      ? '#ef4444'
                      : isCampus
                      ? '#0d9488'
                      : '#334155'
                  }
                  stroke="#ffffff"
                  strokeWidth="2.2"
                />
                <circle cx={pin.x} cy={pin.y} r="3.5" fill="#ffffff" />
                <text
                  x={pin.x}
                  y={pin.y + (active ? 24 : 20)}
                  textAnchor="middle"
                  fill={
                    isUserHere
                      ? '#93c5fd'
                      : isCampus
                      ? '#99f6e4'
                      : '#e2e8f0'
                  }
                  fontSize="9.5"
                  fontWeight="700"
                >
                  {isUserHere ? `You · ${pin.shortLabel}` : pin.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Top Location Pill, Category Filter & Zoom */}
        <div className="absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2 rounded-2xl bg-black/80 px-3.5 py-2 backdrop-blur-xl">
              <Compass className="h-4 w-4 shrink-0 text-blue-400" />
              <span className="truncate text-[13px] font-medium">
                {selectedPin.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'All (9)' },
                  { id: 'campus', label: 'Univ & Flats' },
                  { id: 'city', label: 'City & Case' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPinFilter(f.id)}
                  className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold backdrop-blur-md transition-colors ${
                    pinFilter === f.id
                      ? 'border-teal-400/60 bg-teal-950/90 text-teal-200'
                      : 'border-white/15 bg-black/75 text-zinc-300 hover:bg-black/90'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-xl bg-black/75 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
              className="px-3 py-1.5 text-[15px] font-bold hover:bg-white/10"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
              className="border-t border-white/10 px-3 py-1.5 text-[15px] font-bold hover:bg-white/10"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="rounded-t-[24px] border-t border-white/10 bg-[#1c1c1e] px-4 pt-3 pb-4">
        {/* Quick Jump Pin Chips */}
        <div className="no-scrollbar mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
          {visiblePins.map((pin) => {
            const active = pin.id === selectedPin.id;
            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => {
                  setSelectedPinId(pin.id);
                  setNavigating(false);
                }}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'border-blue-400 bg-blue-500/25 text-white'
                    : pin.category === 'campus'
                    ? 'border-teal-400/25 bg-teal-500/10 text-teal-200 hover:bg-teal-500/20'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {pin.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin
                className={`h-4 w-4 shrink-0 ${
                  isAtSelected
                    ? 'text-blue-400'
                    : selectedPin.category === 'campus'
                    ? 'text-teal-400'
                    : 'text-red-500'
                }`}
              />
              <h2 className="truncate text-[15.5px] font-bold">
                {selectedPin.name}
              </h2>
            </div>
            <p className="mt-0.5 text-[12px] text-zinc-400">
              {selectedPin.subtitle}
            </p>
            <p className="mt-1 text-[12.5px] font-semibold text-emerald-400 tabular-nums">
              {navigating
                ? `Route active · ${distanceLabel}`
                : distanceLabel}
            </p>
          </div>
          {!isAtSelected && (
            <button
              type="button"
              onClick={() => setNavigating((v) => !v)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold ${
                navigating ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              <Navigation className="h-4 w-4" />
              <span>{navigating ? 'Stop' : 'Go'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- 7. CAMERA ---------------- */
function renderSimulatedCameraSnapshot(zoom: '1x' | '2x', flash: boolean): string | undefined {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const grad = ctx.createRadialGradient(270, 260, 40, 270, 360, 480);
    grad.addColorStop(0, flash ? '#4f46e5' : '#312e81');
    grad.addColorStop(0.55, '#1e1b4b');
    grad.addColorStop(1, '#09090b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle dormitory window / streetlight geometry
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(70, 140, 140, 210);
    ctx.fillRect(330, 140, 140, 210);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
    ctx.beginPath();
    ctx.arc(270, 220, zoom === '2x' ? 42 : 28, 0, Math.PI * 2);
    ctx.fill();

    // Subtle viewfinder stamp
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`CAM · ${zoom} ${flash ? '· FLASH' : ''}`, 26, 665);
    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('SEONGNAM-RO · DORM 304', 26, 690);

    return canvas.toDataURL('image/jpeg', 0.88);
  } catch {
    return undefined;
  }
}

export const CameraApp: React.FC<{
  latestPhoto?: PhotoItem;
  onCapturePhoto: (photo: PhotoItem) => void;
  onOpenCameraRoll?: () => void;
}> = ({ latestPhoto, onCapturePhoto, onOpenCameraRoll }) => {
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState<'1x' | '2x'>('1x');
  const [mode, setMode] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [shutterFlash, setShutterFlash] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleShutter = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    const dataUrl = renderSimulatedCameraSnapshot(zoom, flash);

    const timeLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    onCapturePhoto({
      id: `cap-${Date.now()}`,
      title: `IMG ${timeLabel}`,
      date: `Today · ${timeLabel}`,
      location: 'Lee S. Camera',
      palette: ['#0f172a', '#4f46e5', '#38bdf8'],
      dataUrl,
      favorite: false,
      caption: `Captured on device (${zoom}${flash ? ', flash on' : ''}).`,
      source: 'camera',
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1600);
  };

  return (
    <div className="relative flex h-full flex-col justify-between bg-black pt-[90px] pb-6 text-white">
      {/* Top Controls */}
      <div className="flex items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setFlash((f) => !f)}
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            flash ? 'bg-amber-400 text-black' : 'bg-white/10 text-white'
          }`}
        >
          <Zap className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-semibold text-amber-400">
          {savedToast ? 'Saved to Camera Roll' : mode}
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => (z === '1x' ? '2x' : '1x'))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[12px] font-bold"
        >
          {zoom}
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative mx-3 my-3 flex-1 overflow-hidden rounded-[22px] bg-[#0d111a]">
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-300 ${
            zoom === '2x' ? 'scale-125' : 'scale-100'
          }`}
          style={{
            background:
              'radial-gradient(circle at 50% 40%, #312e81 0%, #1e1b4b 55%, #09090b 100%)',
          }}
        >
          <CameraIcon className="h-10 w-10 text-white/30" />
          <p className="mt-3 text-[13px] font-medium text-white/70">
            Lens Ready · {zoom}
          </p>
          <p className="mt-1 text-[11px] text-white/45">
            Tap shutter to save into Camera Roll
          </p>
        </div>

        {/* Rule of thirds grid */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>

        {shutterFlash && <div className="absolute inset-0 bg-white/80" />}
      </div>

      {/* Mode & Shutter Bar with Camera Roll Thumbnail */}
      <div className="flex flex-col items-center gap-4 px-6">
        <div className="flex gap-5 text-[12px] font-bold tracking-wider">
          {(['PHOTO', 'VIDEO'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={mode === m ? 'text-amber-400' : 'text-zinc-500'}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={onOpenCameraRoll}
            aria-label="Open Camera Roll"
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/25 bg-zinc-900 transition-transform active:scale-90"
          >
            {latestPhoto?.dataUrl ? (
              <img
                src={latestPhoto.dataUrl}
                alt={latestPhoto.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-white/75" />
            )}
          </button>

          <button
            type="button"
            onClick={handleShutter}
            aria-label="Take photo"
            className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white p-1 transition-transform active:scale-90"
          >
            <span
              className={`h-full w-full rounded-full ${
                mode === 'VIDEO' ? 'bg-red-500' : 'bg-white'
              }`}
            />
          </button>

          <div className="flex h-12 w-12 items-center justify-center">
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-zinc-300">
              {zoom}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 8. CLOCK ---------------- */
export const ClockApp: React.FC<{
  alarms: AlarmItem[];
  onToggleAlarm: (id: string) => void;
}> = ({ alarms, onToggleAlarm }) => {
  const [tab, setTab] = useState<'alarm' | 'stopwatch' | 'timer'>('alarm');
  const [swRunning, setSwRunning] = useState(false);
  const [swMs, setSwMs] = useState(0);
  const [timerSec, setTimerSec] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!swRunning) return;
    const id = setInterval(() => setSwMs((v) => v + 50), 50);
    return () => clearInterval(id);
  }, [swRunning]);

  useEffect(() => {
    if (!timerRunning || timerSec <= 0) {
      if (timerSec <= 0) setTimerRunning(false);
      return;
    }
    const id = setInterval(() => setTimerSec((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSec]);

  const formatSw = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full flex-col justify-between bg-black pt-[90px] pb-6 text-white">
      <div className="px-4">
        <h1 className="text-[28px] font-bold">
          {tab === 'alarm' ? 'Alarms' : tab === 'stopwatch' ? 'Stopwatch' : 'Timer'}
        </h1>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4">
        {tab === 'alarm' && (
          <div className="divide-y divide-white/10">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p
                    className={`text-[36px] font-light leading-none tabular-nums ${
                      alarm.enabled ? 'text-white' : 'text-zinc-600'
                    }`}
                  >
                    {alarm.time}
                  </p>
                  <p className="mt-1 text-[13px] text-zinc-400">{alarm.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAlarm(alarm.id)}
                  className={`relative h-[30px] w-[50px] rounded-full transition-colors ${
                    alarm.enabled ? 'bg-[#34c759]' : 'bg-[#39393d]'
                  }`}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] h-[26px] w-[26px] rounded-full bg-white transition-transform ${
                      alarm.enabled ? 'translate-x-[20px]' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'stopwatch' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-[48px] font-light tabular-nums">
              {formatSw(swMs)}
            </div>
            <div className="mt-8 flex gap-6">
              <button
                type="button"
                onClick={() => {
                  setSwRunning(false);
                  setSwMs(0);
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-200"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setSwRunning((r) => !r)}
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  swRunning
                    ? 'bg-red-500/25 text-red-400'
                    : 'bg-emerald-500/25 text-emerald-400'
                }`}
              >
                {swRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}

        {tab === 'timer' && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-[52px] font-light tabular-nums">
              {String(Math.floor(timerSec / 60)).padStart(2, '0')}:
              {String(timerSec % 60).padStart(2, '0')}
            </div>
            <div className="mt-4 flex gap-2">
              {[60, 180, 300].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSec(s);
                  }}
                  className="rounded-full bg-zinc-800 px-3 py-1.5 text-[12px] font-medium"
                >
                  {s / 60}m
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              className="mt-8 rounded-full bg-amber-500 px-8 py-3 text-[15px] font-semibold text-black"
            >
              {timerRunning ? 'Pause' : 'Start Timer'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="flex justify-around border-t border-white/10 pt-3 text-[12px] font-medium">
        {(['alarm', 'stopwatch', 'timer'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex flex-col items-center gap-1 capitalize ${
              tab === t ? 'text-amber-400' : 'text-zinc-500'
            }`}
          >
            <ClockIcon className="h-4 w-4" />
            <span>{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
