import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FastForward,
  FileText,
  MapPin,
  Phone,
  Plus,
  Send,
} from 'lucide-react';
import { WhatsAppChat } from '../../types/phone';

interface WhatsAppAppProps {
  chats: WhatsAppChat[];
  activeChatId: string | null;
  onSelectChat: (id: string | null) => void;
  onSendMessage: (chatId: string, text: string, timeOverride?: string) => void;
  onSkipMessages?: (chatId: string) => void;
  onAdvanceTime?: (time: string) => void;
  onStartCall: (name: string, number: string) => void;
  onOpenMaps: () => void;
  onOpenDossiers?: () => void;
}

const GROUP_SENDER_COLORS: Record<string, string> = {
  hyunjun: '#38bdf8',
  moon: '#fbbf24',
  hyungseok: '#fbbf24',
  'lee minhyung': '#f472b6',
  minhyung: '#f472b6',
  dohyeon: '#c084fc',
  siwoo: '#fb7185',
  jaehyuck: '#34d399',
  jaehyuk: '#34d399',
  wangho: '#818cf8',
  kyu: '#2dd4bf',
  jihoon: '#a78bfa',
  minseok: '#facc15',
  mingyu: '#60a5fa',
  wooje: '#e879f9',
  suhwan: '#4ade80',
  kwanghee: '#fb923c',
};

const GROUP_COLOR_FALLBACKS = [
  '#38bdf8',
  '#fbbf24',
  '#f472b6',
  '#c084fc',
  '#34d399',
  '#fb923c',
  '#818cf8',
  '#2dd4bf',
  '#fb7185',
  '#a3e635',
];

function getGroupSenderColor(senderName: string): string {
  const key = senderName.trim().toLowerCase();
  if (GROUP_SENDER_COLORS[key]) return GROUP_SENDER_COLORS[key];
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return GROUP_COLOR_FALLBACKS[hash % GROUP_COLOR_FALLBACKS.length];
}

export const WhatsAppApp: React.FC<WhatsAppAppProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onSendMessage,
  onSkipMessages,
  onAdvanceTime,
  onStartCall,
  onOpenMaps,
  onOpenDossiers,
}) => {
  const [draft, setDraft] = useState('');
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [isPressingSend, setIsPressingSend] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onSendMessageRef = useRef(onSendMessage);
  onSendMessageRef.current = onSendMessage;
  const onAdvanceTimeRef = useRef(onAdvanceTime);
  onAdvanceTimeRef.current = onAdvanceTime;

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const scriptIndex = activeChat?.scriptIndex ?? 0;
  const nextStep =
    activeChat?.script && scriptIndex < activeChat.script.length
      ? activeChat.script[scriptIndex]
      : null;
  const shouldAutoTypeMe = Boolean(
    activeChat && nextStep && nextStep.sender === 'me' && !activeChat.isTyping
  );

  const isPeerTypingReply = Boolean(activeChat?.isTyping);
  const hasRemainingScript = Boolean(
    activeChat &&
      (isPeerTypingReply ||
        (activeChat.script && scriptIndex < activeChat.script.length))
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length, isPeerTypingReply, draft]);

  // Keep textarea height responsive to the amount of text being typed
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft, activeChat?.id]);

  // Animate Lee Sanghyeok (phone owner) typing and sending his scripted replies step-by-step
  useEffect(() => {
    if (!shouldAutoTypeMe || !activeChat || !nextStep) {
      setIsAutoTyping(false);
      setIsPressingSend(false);
      return;
    }

    const chatId = activeChat.id;
    const replyText = nextStep.text;
    const replyTime = nextStep.time;
    const initialPauseMs = scriptIndex === 0 ? 450 : 1100;

    setIsAutoTyping(true);
    setIsPressingSend(false);
    setDraft('');

    let charIndex = 0;
    let typeInterval: ReturnType<typeof setInterval> | null = null;
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let sendTimer: ReturnType<typeof setTimeout> | null = null;

    const startDelay = setTimeout(() => {
      if (replyTime) {
        onAdvanceTimeRef.current?.(replyTime);
      }
      typeInterval = setInterval(() => {
        charIndex += 1;
        setDraft(replyText.slice(0, charIndex));

        if (charIndex >= replyText.length) {
          if (typeInterval) clearInterval(typeInterval);
          pressTimer = setTimeout(() => {
            setIsPressingSend(true);
            sendTimer = setTimeout(() => {
              setDraft('');
              setIsPressingSend(false);
              setIsAutoTyping(false);
              onSendMessageRef.current(chatId, replyText, replyTime);
            }, 180);
          }, 260);
        }
      }, 26);
    }, initialPauseMs);

    return () => {
      clearTimeout(startDelay);
      if (typeInterval) clearInterval(typeInterval);
      if (pressTimer) clearTimeout(pressTimer);
      if (sendTimer) clearTimeout(sendTimer);
    };
  }, [
    shouldAutoTypeMe,
    activeChat?.id,
    scriptIndex,
    nextStep?.id,
    nextStep?.text,
    nextStep?.time,
  ]);

  const handleSend = () => {
    if (!activeChat || !draft.trim() || isAutoTyping) return;
    onSendMessage(activeChat.id, draft.trim());
    setDraft('');
  };

  if (!activeChat) {
    return (
      <div className="flex h-full flex-col bg-[#0b141a] pt-[90px] pb-6 text-white">
        <div className="border-b border-white/10 px-4 pb-3">
          <h1 className="text-[26px] font-bold tracking-tight">Chats</h1>
        </div>
        <div className="no-scrollbar flex-1 divide-y divide-white/5 overflow-y-auto">
          {chats.map((chat) => {
            const last = chat.messages[chat.messages.length - 1];
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2a3942] text-[16px] font-semibold uppercase text-white/80">
                  {chat.avatarUrl ? (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    chat.name[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-white">
                      {chat.name}
                    </span>
                    {chat.lastTime && (
                      <span className="text-[11.5px] text-zinc-400">
                        {chat.lastTime}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-[13px] ${
                        chat.isTyping ? 'font-medium text-emerald-400' : 'text-zinc-400'
                      }`}
                    >
                      {chat.isTyping
                        ? 'typing...'
                        : last
                        ? last.senderName
                          ? (
                            <>
                              <span
                                className="font-semibold"
                                style={{ color: getGroupSenderColor(last.senderName) }}
                              >
                                {last.senderName}:
                              </span>{' '}
                              {last.text}
                            </>
                          )
                          : last.text
                        : chat.subtitle}
                    </p>
                    {chat.unread > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#25d366] px-1.5 text-[11px] font-bold text-[#0b141a]">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0b141a] pt-[90px] pb-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#111b21] px-2.5 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft('');
              onSelectChat(null);
            }}
            aria-label="Back to chats"
            className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-white/85 hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2a3942] text-[13px] font-semibold">
            {activeChat.avatarUrl ? (
              <img
                src={activeChat.avatarUrl}
                alt={activeChat.name}
                className="h-full w-full object-cover"
              />
            ) : (
              activeChat.name[0]
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-white">
              {activeChat.name}
            </p>
            <p
              className={`truncate text-[11px] ${
                isPeerTypingReply ? 'font-medium text-emerald-400' : 'text-zinc-400'
              }`}
            >
              {isPeerTypingReply ? 'typing...' : activeChat.subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {hasRemainingScript && onSkipMessages && (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                setIsAutoTyping(false);
                setIsPressingSend(false);
                onSkipMessages(activeChat.id);
              }}
              aria-label="Skip remaining messages"
              title="Show all messages without waiting"
              className="flex h-9 items-center gap-1 rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-2.5 text-[11.5px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-95"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>Skip</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onStartCall(activeChat.name, activeChat.number)}
            aria-label={`Call ${activeChat.name}`}
            className="flex h-9 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1d272d] text-white/90 transition-colors hover:bg-[#27343c]"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-3"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      >
        {activeChat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="rounded-2xl border border-white/10 bg-[#111b21]/90 px-4 py-3 text-[12.5px] leading-relaxed text-zinc-400">
              No messages in this chat yet. Messages are end-to-end encrypted.
            </div>
          </div>
        ) : (
          activeChat.messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[82%] rounded-[14px] px-3 py-1.5 text-[14px] leading-[1.35] shadow-sm ${
                    isMe
                      ? 'rounded-tr-[4px] bg-[#005c4b] text-[#e9edef]'
                      : 'rounded-tl-[4px] bg-[#202c33] text-[#e9edef]'
                  }`}
                >
                  {!isMe && msg.senderName && (
                    <p
                      className="mb-0.5 text-[11.5px] font-bold"
                      style={{ color: getGroupSenderColor(msg.senderName) }}
                    >
                      {msg.senderName}
                    </p>
                  )}
                  {msg.attachment && (
                    <button
                      type="button"
                      onClick={() => onOpenDossiers?.()}
                      className="mb-1.5 flex w-full items-center gap-2.5 rounded-xl border border-white/15 bg-black/35 p-2.5 text-left transition-colors hover:bg-black/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold text-white">
                          {msg.attachment.title}
                        </p>
                        <p className="truncate text-[11px] text-zinc-400">
                          {msg.attachment.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-blue-300" />
                    </button>
                  )}
                  <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                  <span className="ml-2 inline-flex translate-y-[2px] items-center gap-1 text-[10px] text-white/60 tabular-nums">
                    {msg.time}
                    {isMe && (
                      <CheckCheck
                        className={`h-3.5 w-3.5 ${
                          msg.read ? 'text-[#53bdeb]' : 'text-white/50'
                        }`}
                      />
                    )}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}

        {isPeerTypingReply && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1.5 rounded-[14px] rounded-tl-[4px] bg-[#202c33] px-3.5 py-2.5 text-zinc-300">
              {[0, 0.18, 0.36].map((delay, idx) => (
                <motion.span
                  key={idx}
                  animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-zinc-300"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {showAttachMenu && (
        <div className="flex items-center gap-2 border-t border-white/10 bg-[#111b21] px-4 py-2.5">
          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              onOpenMaps();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 px-3 py-1.5 text-[12px] font-medium text-emerald-300"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Open Maps</span>
          </button>
        </div>
      )}

      {/* Bottom Responsive Input Bar */}
      <div className="flex items-end gap-2 bg-[#111b21] px-2.5 pt-2 pb-1">
        <button
          type="button"
          onClick={() => setShowAttachMenu((v) => !v)}
          aria-label="Attach"
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d272d] text-zinc-300 hover:text-white"
        >
          <Plus className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center rounded-[20px] bg-[#202c33] px-3.5 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            readOnly={isAutoTyping}
            onChange={(e) => {
              if (!isAutoTyping) setDraft(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message"
            className="no-scrollbar max-h-[128px] w-full resize-none overflow-y-auto bg-transparent text-[14px] leading-[1.35] text-white outline-none placeholder:text-zinc-400"
          />
        </div>

        {draft.trim() ? (
          <motion.button
            type="button"
            onClick={handleSend}
            animate={{ scale: isPressingSend ? 0.84 : 1 }}
            transition={{ duration: 0.12 }}
            aria-label="Send message"
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-[#0b141a]"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAttachMenu((v) => !v)}
            aria-label="Camera"
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d272d] text-zinc-300 hover:text-white"
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
