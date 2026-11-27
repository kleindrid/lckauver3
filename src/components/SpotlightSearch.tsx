import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { AppId, NoteItem, WhatsAppChat } from '../types/phone';
import { AppIcon } from './AppIcons';

interface SpotlightSearchProps {
  notes: NoteItem[];
  chats: WhatsAppChat[];
  dossiersUnlocked?: boolean;
  onClose: () => void;
  onOpenApp: (app: AppId) => void;
}

const ALL_APPS: { id: AppId; label: string }[] = [
  { id: 'photos', label: 'Photos' },
  { id: 'mail', label: 'Mail' },
  { id: 'notes', label: 'Notes' },
  { id: 'maps', label: 'Maps' },
  { id: 'x', label: 'X' },
  { id: 'clock', label: 'Clock' },
  { id: 'journal', label: 'Journal' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'phone', label: 'Phone' },
  { id: 'safari', label: 'Safari' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'dossiers', label: 'Case Files' },
  { id: 'recorder', label: 'Voice Memos' },
  { id: 'narrations', label: 'Narrations' },
];

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  notes,
  chats,
  dossiersUnlocked = false,
  onClose,
  onOpenApp,
}) => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const visibleApps = ALL_APPS.filter(
    (a) => a.id !== 'dossiers' || dossiersUnlocked
  );
  const matchedApps = visibleApps.filter((a) => !q || a.label.toLowerCase().includes(q));
  const matchedNotes = q
    ? notes.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      )
    : [];
  const matchedChats = q
    ? chats.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q)
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col bg-black/70 px-4 pt-14 pb-6 backdrop-blur-2xl"
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-[#1c1c1e] px-3.5 py-2.5 text-white">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, notes, Lieutenant..."
            className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-zinc-500"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-zinc-400">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-2 text-[14px] font-medium text-blue-400"
        >
          Cancel
        </button>
      </div>

      <div className="no-scrollbar mt-5 flex-1 space-y-5 overflow-y-auto">
        <div>
          <p className="mb-2.5 px-1 text-[12px] font-semibold text-zinc-400">
            {q ? 'Applications' : 'Suggestions'}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {matchedApps.slice(0, q ? 16 : 8).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  onClose();
                  onOpenApp(app.id);
                }}
                className="flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors hover:bg-white/10"
              >
                <AppIcon id={app.id} size={48} />
                <span className="w-full truncate text-center text-[11px] text-white/90">
                  {app.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {matchedChats.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-[12px] font-semibold text-zinc-400">Contacts</p>
            <div className="space-y-1.5">
              {matchedChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenApp('whatsapp');
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#1c1c1e] px-3.5 py-2.5 text-left"
                >
                  <div>
                    <p className="text-[14px] font-medium text-white">{chat.name}</p>
                    <p className="truncate text-[12px] text-zinc-400">
                      {chat.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-400">Open</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {matchedNotes.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-[12px] font-semibold text-zinc-400">Notes</p>
            <div className="space-y-1.5">
              {matchedNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenApp('notes');
                  }}
                  className="w-full rounded-2xl bg-[#1c1c1e] px-3.5 py-2.5 text-left"
                >
                  <p className="text-[14px] font-medium text-white">{note.title}</p>
                  <p className="truncate text-[12px] text-zinc-400">{note.body}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
