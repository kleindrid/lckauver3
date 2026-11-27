import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  ChevronLeft,
  Copy,
  Delete,
  FastForward,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Plus,
  Repeat2,
  RotateCw,
  Search,
  Send,
  Share,
  User,
  X,
} from 'lucide-react';
import {
  ActiveCall,
  CallLogItem,
  DirectMessageThread,
  IgActivityAlert,
  IgPost,
  IgStoryItem,
  JournalEntry,
  JournalScriptedIntro,
  SafariTab,
  SocialPost,
} from '../../types/phone';
import { CHARACTER_ACCOUNTS, NEWS_ARTICLES } from '../../data/initialData';

const SANGHYEOK_ACCOUNT = CHARACTER_ACCOUNTS.find((a) => a.id === 'sanghyeok');
const SORTED_CHARACTER_ACCOUNTS = [...CHARACTER_ACCOUNTS].sort((a, b) => {
  if (a.id === 'sanghyeok') return -1;
  if (b.id === 'sanghyeok') return 1;
  return 0;
});

const isVerifiedAccount = (accountId: string): boolean =>
  CHARACTER_ACCOUNTS.some((a) => a.id === accountId && Boolean(a.verified));

const formatSocialCount = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  if (value >= 1000) {
    return value.toLocaleString('en-US');
  }
  return String(value);
};

const VerifiedBadge: React.FC<{ className?: string }> = ({ className = 'h-[14px] w-[14px]' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-label="Verified account"
    className={`inline-block shrink-0 ${className}`}
  >
    <path
      fill="#1d9bf0"
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
    />
    <path
      fill="#ffffff"
      d="M10.54 16.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
    />
  </svg>
);

/* ---------------- 9. X (TWITTER) ---------------- */
const X_FOLLOWING_IDS = new Set([
  'sanghyeok',
  'hyunjun',
  'hyungseok',
  'minhyung',
  'wangho',
  'kyu',
  'kwanghee',
  'minseok',
  'jihoon',
  'wooje',
  'soyeon',
  'mina',
  'chaewon',
]);

export const XApp: React.FC<{
  posts: SocialPost[];
  dmThreads?: DirectMessageThread[];
  onToggleLike: (id: string) => void;
  onToggleRepost: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onCreatePost: (text: string, community?: 'university') => void;
  onAddComment?: (postId: string, text: string) => void;
  onSelectProfile?: (accountId: string) => void;
  onSendDm?: (accountId: string, text: string) => void;
  onReadDm?: (accountId: string) => void;
}> = ({
  posts,
  dmThreads = [],
  onToggleLike,
  onToggleRepost,
  onToggleBookmark,
  onCreatePost,
  onAddComment,
  onSelectProfile,
  onSendDm,
  onReadDm,
}) => {
  const [navTab, setNavTab] = useState<
    'home' | 'search' | 'community' | 'notifications' | 'messages'
  >('home');
  const [feedMode, setFeedMode] = useState<'foryou' | 'following'>('foryou');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [composeCommunity, setComposeCommunity] = useState<'feed' | 'university'>('feed');
  const [activeDmAccountId, setActiveDmAccountId] = useState<string | null>(null);
  const [dmDraft, setDmDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dmScrollRef = useRef<HTMLDivElement>(null);

  const selectedAccount =
    CHARACTER_ACCOUNTS.find((a) => a.id === selectedAccountId) ?? null;
  const selectedPost = posts.find((p) => p.id === selectedPostId) ?? null;
  const unreadDmCount = dmThreads.reduce((sum, t) => sum + t.unread, 0);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const openDmWithAccount = (accountId: string) => {
    setSelectedAccountId(null);
    setSelectedPostId(null);
    setNavTab('messages');
    setActiveDmAccountId(accountId);
    onReadDm?.(accountId);
  };

  useEffect(() => {
    if (navTab === 'messages' && activeDmAccountId && dmScrollRef.current) {
      dmScrollRef.current.scrollTop = dmScrollRef.current.scrollHeight;
    }
  }, [navTab, activeDmAccountId, dmThreads]);

  const renderAvatar = (accountId: string, authorName: string, sizeClass = 'h-10 w-10') => {
    const acc = CHARACTER_ACCOUNTS.find((a) => a.id === accountId);
    if (!acc) {
      return (
        <span
          className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-400`}
        >
          <User className="h-[52%] w-[52%]" />
        </span>
      );
    }
    return (
      <span
        className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-bold text-white`}
        style={{
          background: `linear-gradient(135deg, ${acc.avatarPalette[0]}, ${acc.avatarPalette[1]})`,
        }}
      >
        {acc.avatarUrl ? (
          <img src={acc.avatarUrl} alt={authorName} className="h-full w-full object-cover" />
        ) : (
          authorName[0]
        )}
      </span>
    );
  };

  const renderPostCard = (post: SocialPost) => {
    const commentCount = post.comments?.length ?? 0;
    const isVerified = isVerifiedAccount(post.accountId);
    return (
      <div
        key={post.id}
        onClick={() => setSelectedPostId(post.id)}
        className={`cursor-pointer px-4 py-3 transition-colors ${
          isVerified
            ? 'border-l-2 border-l-[#1d9bf0] bg-sky-50/35 hover:bg-sky-50/55'
            : 'hover:bg-zinc-50/80'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAccountId(post.accountId);
              onSelectProfile?.(post.accountId);
            }}
            className="shrink-0 transition-transform active:scale-95"
          >
            {renderAvatar(post.accountId, post.author, 'h-10 w-10')}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAccountId(post.accountId);
                  onSelectProfile?.(post.accountId);
                }}
                className="flex min-w-0 items-center gap-1 text-left text-[13.5px]"
              >
                <span className="truncate font-bold text-[#0f1419]">
                  {post.author}
                </span>
                {isVerified && <VerifiedBadge />}
                <span className="truncate text-[12.5px] text-[#536471]">
                  {post.handle}
                </span>
                <span className="shrink-0 text-[12.5px] text-[#536471]">
                  · {post.time}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPostId(post.id);
                }}
                aria-label="Inspect post"
                className="shrink-0 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>

            {post.community === 'university' && navTab !== 'community' && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#1d9bf0]">
                <GraduationCap className="h-3 w-3" />
                Gyeong-gwan University Community
              </p>
            )}

            <p className="mt-0.5 text-[14px] leading-snug text-[#0f1419]">
              {post.text}
            </p>

            {post.imageUrl && (
              <div className="mt-2.5 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                <img
                  src={post.imageUrl}
                  alt={post.author}
                  className="max-h-52 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-2.5 flex items-center justify-between pr-2 text-[12px] text-[#536471]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPostId(post.id);
                }}
                className="inline-flex items-center gap-1 rounded-full py-0.5 transition-colors hover:text-[#1d9bf0]"
              >
                <MessageCircle className="h-[15px] w-[15px]" />
                <span className="tabular-nums">{formatSocialCount(commentCount)}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRepost(post.id);
                }}
                className={`inline-flex items-center gap-1 rounded-full py-0.5 transition-colors ${
                  post.reposted ? 'text-emerald-600' : 'hover:text-emerald-600'
                }`}
              >
                <Repeat2 className="h-[15px] w-[15px]" />
                {post.reposts > 0 && (
                  <span className="tabular-nums">{formatSocialCount(post.reposts)}</span>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(post.id);
                }}
                className={`inline-flex items-center gap-1 rounded-full py-0.5 transition-colors ${
                  post.liked ? 'text-pink-600' : 'hover:text-pink-600'
                }`}
              >
                <Heart className={`h-[15px] w-[15px] ${post.liked ? 'fill-pink-600' : ''}`} />
                {post.likes > 0 && (
                  <span className="tabular-nums">{formatSocialCount(post.likes)}</span>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark?.(post.id);
                }}
                aria-label="Bookmark post"
                className={`inline-flex items-center py-0.5 transition-colors ${
                  post.bookmarked ? 'text-[#1d9bf0]' : 'hover:text-[#1d9bf0]'
                }`}
              >
                <Bookmark className={`h-[15px] w-[15px] ${post.bookmarked ? 'fill-[#1d9bf0]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPostId(post.id);
                }}
                aria-label="Open post replies"
                className="inline-flex items-center py-0.5 hover:text-[#1d9bf0]"
              >
                <Share className="h-[14px] w-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ---- POST DETAIL & COMMENTS SCREEN ---- */
  if (selectedPost) {
    const comments = selectedPost.comments ?? [];
    const sendReply = () => {
      const trimmed = commentDraft.trim();
      if (!trimmed) return;
      onAddComment?.(selectedPost.id, trimmed);
      setCommentDraft('');
    };

    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedPostId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-[16px] font-bold">Post</h2>
          </div>
          {selectedPost.community === 'university' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-[#1d9bf0]">
              <GraduationCap className="h-3 w-3" />
              GGU Community
            </span>
          )}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <div className="border-b border-zinc-100 px-4 py-3.5">
            <button
              type="button"
              onClick={() => {
                setSelectedPostId(null);
                setSelectedAccountId(selectedPost.accountId);
                onSelectProfile?.(selectedPost.accountId);
              }}
              className="flex items-center gap-2.5 text-left"
            >
              {renderAvatar(selectedPost.accountId, selectedPost.author, 'h-10 w-10')}
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[14.5px] font-bold text-[#0f1419]">
                    {selectedPost.author}
                  </span>
                  {isVerifiedAccount(selectedPost.accountId) && <VerifiedBadge />}
                </div>
                <p className="text-[12.5px] text-[#536471]">{selectedPost.handle}</p>
              </div>
            </button>

            <p className="mt-3 text-[15.5px] leading-relaxed text-[#0f1419]">
              {selectedPost.text}
            </p>

            {selectedPost.imageUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.author}
                  className="max-h-60 w-full object-cover"
                />
              </div>
            )}

            <p className="mt-3 border-b border-zinc-100 pb-3 text-[12px] text-[#536471]">
              {selectedPost.time} · Gyeong-gwan
              {selectedPost.reposts > 0 && (
                <>
                  {' '}
                  ·{' '}
                  <strong className="text-[#0f1419]">
                    {formatSocialCount(selectedPost.reposts)}
                  </strong>{' '}
                  Reposts
                </>
              )}
              {selectedPost.likes > 0 && (
                <>
                  {' '}
                  ·{' '}
                  <strong className="text-[#0f1419]">
                    {formatSocialCount(selectedPost.likes)}
                  </strong>{' '}
                  Likes
                </>
              )}
            </p>

            <div className="flex items-center justify-around pt-2.5 text-[#536471]">
              <span className="inline-flex items-center gap-1.5 text-[12.5px]">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="tabular-nums">{formatSocialCount(comments.length)}</span>
              </span>
              <button
                type="button"
                onClick={() => onToggleRepost(selectedPost.id)}
                className={`inline-flex items-center gap-1.5 text-[12.5px] ${
                  selectedPost.reposted ? 'text-emerald-600' : ''
                }`}
              >
                <Repeat2 className="h-4.5 w-4.5" />
                {selectedPost.reposts > 0 && (
                  <span className="tabular-nums">
                    {formatSocialCount(selectedPost.reposts)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onToggleLike(selectedPost.id)}
                className={`inline-flex items-center gap-1.5 text-[12.5px] ${
                  selectedPost.liked ? 'text-pink-600' : ''
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${selectedPost.liked ? 'fill-pink-600' : ''}`} />
                {selectedPost.likes > 0 && (
                  <span className="tabular-nums">
                    {formatSocialCount(selectedPost.likes)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onToggleBookmark?.(selectedPost.id)}
                className={selectedPost.bookmarked ? 'text-[#1d9bf0]' : ''}
              >
                <Bookmark
                  className={`h-4.5 w-4.5 ${selectedPost.bookmarked ? 'fill-[#1d9bf0]' : ''}`}
                />
              </button>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {comments.length > 0 ? (
              comments.map((c) => {
                const hasProfile = CHARACTER_ACCOUNTS.some((a) => a.id === c.accountId);
                return (
                  <div key={c.id} className="flex items-start gap-2.5 px-4 py-3">
                    {hasProfile ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPostId(null);
                          setSelectedAccountId(c.accountId);
                          onSelectProfile?.(c.accountId);
                        }}
                      >
                        {renderAvatar(c.accountId, c.author, 'h-8 w-8')}
                      </button>
                    ) : (
                      <div className="shrink-0">
                        {renderAvatar(c.accountId, c.author, 'h-8 w-8')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[12.5px]">
                        <span className="font-bold text-[#0f1419]">{c.author}</span>
                        {isVerifiedAccount(c.accountId) && (
                          <VerifiedBadge className="h-[13px] w-[13px]" />
                        )}
                        <span className="truncate text-[#536471]">{c.handle}</span>
                        <span className="shrink-0 text-[#536471]">· {c.time}</span>
                      </div>
                      <p className="mt-0.5 text-[13.5px] leading-snug text-[#0f1419]">
                        {c.text}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-[13.5px] font-semibold text-zinc-700">
                  No comments yet.
                </p>
                <p className="mt-1 text-[12px] text-zinc-400">
                  Replies to this post will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-100 bg-white px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5">
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendReply();
              }}
              placeholder="Post your reply"
              className="flex-1 bg-transparent text-[13.5px] text-[#0f1419] outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={sendReply}
              disabled={!commentDraft.trim()}
              className="rounded-full bg-[#1d9bf0] px-3 py-1 text-[12px] font-bold text-white disabled:opacity-40"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- PROFILE VIEW ---- */
  if (selectedAccount) {
    const accountPosts = posts.filter((p) => p.accountId === selectedAccount.id);
    const isSelf = selectedAccount.id === 'sanghyeok';
    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedAccountId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[15px] font-bold leading-tight">
                  {selectedAccount.name}
                </p>
                {selectedAccount.verified && <VerifiedBadge />}
                {isSelf && (
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-700">
                    You
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-[#536471]">
                {accountPosts.length} {accountPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
          {!isSelf && (
            <button
              type="button"
              onClick={() => openDmWithAccount(selectedAccount.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[12px] font-semibold text-[#0f1419] transition-colors hover:bg-zinc-100"
            >
              <Mail className="h-3.5 w-3.5 text-[#1d9bf0]" />
              Message
            </button>
          )}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-8">
          <div
            className="h-20 w-full"
            style={{
              background: `linear-gradient(135deg, ${selectedAccount.avatarPalette[0]}, ${selectedAccount.avatarPalette[1]})`,
            }}
          />
          <div className="px-4 pb-4">
            <div className="flex items-end justify-between">
              <div
                className="-mt-7 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-white text-[18px] font-bold text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${selectedAccount.avatarPalette[0]}, ${selectedAccount.avatarPalette[1]})`,
                }}
              >
                {selectedAccount.avatarUrl ? (
                  <img
                    src={selectedAccount.avatarUrl}
                    alt={selectedAccount.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  selectedAccount.name[0]
                )}
              </div>
              {!isSelf && (
                <button
                  type="button"
                  onClick={() => openDmWithAccount(selectedAccount.id)}
                  aria-label={`Direct message ${selectedAccount.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-[#0f1419] transition-colors hover:bg-zinc-100"
                >
                  <Mail className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <h2 className="text-[18px] font-bold">{selectedAccount.name}</h2>
              {selectedAccount.verified && (
                <VerifiedBadge className="h-[17px] w-[17px]" />
              )}
              {isSelf && (
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10.5px] font-semibold text-[#1d9bf0]">
                  Signed in
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#536471]">{selectedAccount.xHandle}</p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#0f1419]">
              {selectedAccount.bio}
            </p>
            <div className="mt-3 flex gap-4 text-[12.5px] text-[#536471]">
              <span>
                <strong className="text-[#0f1419] tabular-nums">
                  {selectedAccount.following}
                </strong>{' '}
                Following
              </span>
              <span>
                <strong className="text-[#0f1419] tabular-nums">
                  {selectedAccount.followers}
                </strong>{' '}
                Followers
              </span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 border-t border-zinc-100">
            {accountPosts.length > 0 ? (
              accountPosts.map((post) => renderPostCard(post))
            ) : (
              <p className="px-4 py-10 text-center text-[13px] text-zinc-400">
                No posts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---- DM THREAD VIEW ---- */
  const activeDmAccount = activeDmAccountId
    ? CHARACTER_ACCOUNTS.find((a) => a.id === activeDmAccountId) ?? null
    : null;
  const activeDmThread = activeDmAccountId
    ? dmThreads.find((t) => t.accountId === activeDmAccountId) ?? null
    : null;

  if (navTab === 'messages' && activeDmAccount) {
    const messages = activeDmThread?.messages ?? [];
    const sendCurrentDm = () => {
      const trimmed = dmDraft.trim();
      if (!trimmed) return;
      onSendDm?.(activeDmAccount.id, trimmed);
      setDmDraft('');
    };

    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveDmAccountId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAccountId(activeDmAccount.id);
                onSelectProfile?.(activeDmAccount.id);
              }}
              className="flex items-center gap-2.5 text-left"
            >
              {renderAvatar(activeDmAccount.id, activeDmAccount.name, 'h-8 w-8')}
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-[14px] font-bold leading-tight">
                    {activeDmAccount.name}
                  </p>
                  {activeDmAccount.verified && (
                    <VerifiedBadge className="h-[13px] w-[13px]" />
                  )}
                </div>
                <p className="text-[11px] text-[#536471]">
                  {activeDmAccount.xHandle}
                </p>
              </div>
            </button>
          </div>
          <span className="text-[11px] font-medium text-zinc-400">DM</span>
        </div>

        <div
          ref={dmScrollRef}
          className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-3"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-[14px] font-semibold text-[#0f1419]">
                Say hello to {activeDmAccount.name}
              </p>
              <p className="mt-1 text-[12px] text-[#536471]">
                Direct messages on X are private between {activeDmAccount.xHandle} and @sanghyeok_lee.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug ${
                    m.sender === 'me'
                      ? 'rounded-br-sm bg-[#1d9bf0] text-white'
                      : 'rounded-bl-sm bg-zinc-100 text-[#0f1419]'
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-0.5 px-1 text-[10px] text-zinc-400 tabular-nums">
                  {m.time}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-zinc-100 px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5">
            <input
              value={dmDraft}
              onChange={(e) => setDmDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendCurrentDm();
              }}
              placeholder={`Message ${activeDmAccount.name}...`}
              className="flex-1 bg-transparent text-[13.5px] text-[#0f1419] outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={sendCurrentDm}
              disabled={!dmDraft.trim()}
              aria-label="Send direct message"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d9bf0] text-white disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayedFeedPosts =
    feedMode === 'following'
      ? posts.filter((p) => X_FOLLOWING_IDS.has(p.accountId))
      : posts;

  const communityPosts = posts.filter((p) => p.community === 'university');

  const qLower = searchQuery.trim().toLowerCase();
  const filteredAccounts = SORTED_CHARACTER_ACCOUNTS.filter(
    (a) =>
      !qLower ||
      a.name.toLowerCase().includes(qLower) ||
      a.xHandle.toLowerCase().includes(qLower) ||
      a.bio.toLowerCase().includes(qLower)
  );
  const filteredSearchPosts = qLower
    ? posts.filter(
        (p) =>
          p.text.toLowerCase().includes(qLower) ||
          p.author.toLowerCase().includes(qLower) ||
          p.handle.toLowerCase().includes(qLower)
      )
    : [];

  const dmContacts = CHARACTER_ACCOUNTS.filter((a) => a.id !== 'sanghyeok');
  const recentNotifications = posts
    .filter((p) => p.comments?.length || p.community === 'university')
    .slice(0, 6);

  return (
    <div className="relative flex h-full flex-col bg-white pt-[90px] text-[#0f1419]">
      {/* Top Bar matching Reference */}
      <div className="flex items-center justify-between px-4 pb-2">
        <button
          type="button"
          onClick={() => {
            setSelectedAccountId('sanghyeok');
            onSelectProfile?.('sanghyeok');
          }}
          title="Lee Sanghyeok (@sanghyeok_lee)"
          aria-label="Open Lee Sanghyeok profile"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-bold text-[#0f1419] shadow-xs transition-transform active:scale-95"
        >
          {SANGHYEOK_ACCOUNT?.avatarUrl ? (
            <img
              src={SANGHYEOK_ACCOUNT.avatarUrl}
              alt="Lee Sanghyeok"
              className="h-full w-full object-cover"
            />
          ) : (
            'LS'
          )}
        </button>

        <span className="text-[22px] leading-none font-black tracking-tight text-[#0f1419]">
          𝕏
        </span>

        <button
          type="button"
          onClick={triggerRefresh}
          aria-label="Refresh timeline"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#0f1419] shadow-xs transition-colors hover:bg-zinc-50 active:scale-95"
        >
          <RotateCw
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isRefreshing ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* For you / Following Bar on Home */}
      {navTab === 'home' && (
        <div className="grid grid-cols-2 border-b border-zinc-100 text-[13.5px]">
          <button
            type="button"
            onClick={() => setFeedMode('foryou')}
            className="flex flex-col items-center pt-2 pb-0 transition-colors"
          >
            <span
              className={`pb-2 ${
                feedMode === 'foryou'
                  ? 'font-bold text-[#0f1419]'
                  : 'font-medium text-[#536471]'
              }`}
            >
              For you
            </span>
            <span
              className={`h-[3px] w-14 rounded-full transition-colors ${
                feedMode === 'foryou' ? 'bg-[#1d9bf0]' : 'bg-transparent'
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setFeedMode('following')}
            className="flex flex-col items-center pt-2 pb-0 transition-colors"
          >
            <span
              className={`pb-2 ${
                feedMode === 'following'
                  ? 'font-bold text-[#0f1419]'
                  : 'font-medium text-[#536471]'
              }`}
            >
              Following
            </span>
            <span
              className={`h-[3px] w-16 rounded-full transition-colors ${
                feedMode === 'following' ? 'bg-[#1d9bf0]' : 'bg-transparent'
              }`}
            />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {navTab === 'home' && (
        <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
          {displayedFeedPosts.map((post) => renderPostCard(post))}
        </div>
      )}

      {navTab === 'search' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2">
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts or posts..."
                className="w-full bg-transparent text-[13px] text-[#0f1419] outline-none placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
            {filteredSearchPosts.length > 0 && (
              <div>
                <p className="bg-zinc-50 px-4 py-1.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  Matching Posts ({filteredSearchPosts.length})
                </p>
                <div className="divide-y divide-zinc-100">
                  {filteredSearchPosts.map((p) => renderPostCard(p))}
                </div>
              </div>
            )}
            <p className="bg-zinc-50 px-4 py-1.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Accounts ({filteredAccounts.length})
            </p>
            {filteredAccounts.map((acc) => {
              const isSelf = acc.id === 'sanghyeok';
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    onSelectProfile?.(acc.id);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50"
                >
                  {renderAvatar(acc.id, acc.name, 'h-10 w-10')}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[14px] font-bold text-[#0f1419]">
                        {acc.name}
                      </span>
                      {acc.verified && <VerifiedBadge />}
                      {isSelf && (
                        <span className="shrink-0 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#1d9bf0]">
                          You
                        </span>
                      )}
                      <span className="truncate text-[12px] text-[#536471]">
                        {acc.xHandle}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[12.5px] text-zinc-600">
                      {acc.bio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {navTab === 'community' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50/40 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1419] text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[14.5px] font-extrabold text-[#0f1419]">
                    Gyeong-gwan University
                  </h2>
                  <p className="text-[11.5px] text-[#536471]">
                    Campus Flats A–C & Dorm 304 · 418 Students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setComposeCommunity('university');
                  setComposeOpen(true);
                }}
                className="rounded-full bg-[#1d9bf0] px-3 py-1 text-[11.5px] font-bold text-white"
              >
                Post
              </button>
            </div>
          </div>

          <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
            {communityPosts.length > 0 ? (
              communityPosts.map((post) => renderPostCard(post))
            ) : (
              <p className="px-4 py-10 text-center text-[13px] text-zinc-400">
                No university community posts yet.
              </p>
            )}
          </div>
        </div>
      )}

      {navTab === 'notifications' && (
        <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
          <div className="px-4 py-2.5">
            <p className="text-[13px] font-bold text-[#0f1419]">Notifications</p>
          </div>
          {recentNotifications.map((p) => (
            <button
              key={`notif-${p.id}`}
              type="button"
              onClick={() => setSelectedPostId(p.id)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-zinc-50"
            >
              {renderAvatar(p.accountId, p.author, 'h-9 w-9')}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-[#0f1419]">
                  <span className="font-bold">{p.author}</span>{' '}
                  {p.community === 'university'
                    ? 'posted in Gyeong-gwan University'
                    : 'received new activity'}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] text-[#536471]">
                  {p.text}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-zinc-400">{p.time}</span>
            </button>
          ))}
        </div>
      )}

      {navTab === 'messages' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <p className="mb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Start Direct Message
            </p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {dmContacts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => openDmWithAccount(acc.id)}
                  className="flex shrink-0 flex-col items-center gap-1"
                >
                  {renderAvatar(acc.id, acc.name, 'h-10 w-10 ring-1 ring-zinc-200')}
                  <span className="max-w-[52px] truncate text-[10.5px] text-zinc-600">
                    {acc.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
            {dmThreads.length > 0 ? (
              dmThreads.map((thread) => {
                const acc = CHARACTER_ACCOUNTS.find((a) => a.id === thread.accountId);
                if (!acc) return null;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => openDmWithAccount(acc.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50"
                  >
                    {renderAvatar(acc.id, acc.name, 'h-11 w-11')}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-[14px] font-bold text-[#0f1419]">
                            {acc.name}
                          </span>
                          {acc.verified && <VerifiedBadge className="h-[13px] w-[13px]" />}
                          <span className="truncate text-[12px] text-[#536471]">
                            {acc.xHandle}
                          </span>
                        </div>
                        <span className="shrink-0 text-[11px] text-zinc-400 tabular-nums">
                          {lastMsg?.time ?? ''}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-[12.5px] text-[#536471]">
                          {lastMsg
                            ? `${lastMsg.sender === 'me' ? 'You: ' : ''}${lastMsg.text}`
                            : 'Tap to start messaging'}
                        </p>
                        {thread.unread > 0 && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#1d9bf0]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-10 text-center text-[13px] text-zinc-400">
                No direct messages yet. Pick a contact above to message.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Blue Compose Button */}
      {(navTab === 'home' || navTab === 'community') && (
        <button
          type="button"
          onClick={() => {
            setComposeCommunity(navTab === 'community' ? 'university' : 'feed');
            setComposeOpen(true);
          }}
          aria-label="Compose new X post"
          className="absolute right-4 bottom-[86px] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#1d9bf0] text-white shadow-[0_6px_20px_rgba(29,155,240,0.45)] transition-transform hover:bg-[#1a8cd8] active:scale-95"
        >
          <Pencil className="h-5 w-5" />
        </button>
      )}

      {/* Floating Frosted-Glass Bottom 5-Icon Pill */}
      <div className="pointer-events-none absolute right-4 bottom-7 left-4 z-20 flex justify-center">
        <div className="pointer-events-auto grid w-full grid-cols-5 items-center rounded-full border border-zinc-200/90 bg-white/85 px-1.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setNavTab('home')}
            aria-label="Home feed"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'home'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Home className="h-5 w-5" strokeWidth={navTab === 'home' ? 2.4 : 1.9} />
          </button>

          <button
            type="button"
            onClick={() => setNavTab('search')}
            aria-label="Search X"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'search'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Search className="h-5 w-5" strokeWidth={navTab === 'search' ? 2.4 : 1.9} />
          </button>

          <button
            type="button"
            onClick={() => setNavTab('community')}
            aria-label="University Community"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'community'
                ? 'bg-zinc-900/10 text-[#1d9bf0]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <GraduationCap
              className="h-5 w-5"
              strokeWidth={navTab === 'community' ? 2.4 : 1.9}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setNavTab('notifications');
              setNotificationsRead(true);
            }}
            aria-label="Notifications"
            className={`relative mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'notifications'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Bell
              className="h-5 w-5"
              strokeWidth={navTab === 'notifications' ? 2.4 : 1.9}
            />
            {!notificationsRead && (
              <span className="absolute top-2 right-3.5 h-2 w-2 rounded-full bg-[#1d9bf0]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setNavTab('messages');
              setActiveDmAccountId(null);
            }}
            aria-label="Direct Messages"
            className={`relative mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'messages'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Mail className="h-5 w-5" strokeWidth={navTab === 'messages' ? 2.4 : 1.9} />
            {unreadDmCount > 0 && (
              <span className="absolute top-1.5 right-3 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#1d9bf0] px-1 text-[9.5px] font-bold text-white tabular-nums">
                {unreadDmCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Compose Sheet Modal */}
      {composeOpen && (
        <div className="absolute inset-0 z-30 flex flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 pb-3">
            <button
              type="button"
              onClick={() => setComposeOpen(false)}
              className="text-[14px] font-medium text-zinc-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!draft.trim()) return;
                onCreatePost(
                  draft.trim(),
                  composeCommunity === 'university' ? 'university' : undefined
                );
                setDraft('');
                setComposeOpen(false);
              }}
              disabled={!draft.trim()}
              className="rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[13px] font-bold text-white disabled:opacity-40"
            >
              Post
            </button>
          </div>
          <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5">
            <span className="text-[12px] text-zinc-500">Audience:</span>
            <button
              type="button"
              onClick={() => setComposeCommunity('feed')}
              className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                composeCommunity === 'feed'
                  ? 'bg-[#0f1419] text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              Public Timeline
            </button>
            <button
              type="button"
              onClick={() => setComposeCommunity('university')}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                composeCommunity === 'university'
                  ? 'bg-[#1d9bf0] text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              <GraduationCap className="h-3 w-3" />
              GGU Community
            </button>
          </div>
          <div className="flex flex-1 gap-3 p-4">
            {renderAvatar('sanghyeok', 'Lee Sanghyeok', 'h-10 w-10')}
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                composeCommunity === 'university'
                  ? 'Share an update with Gyeong-gwan University...'
                  : 'What is happening?!'
              }
              className="flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-[#0f1419] outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- 10. JOURNAL ---------------- */
export const JournalApp: React.FC<{
  entries: JournalEntry[];
  readOnly?: boolean;
  scriptedIntro?: JournalScriptedIntro | null;
  autoStartScripted?: boolean;
  onAddEntry: (title: string, body: string, mood: string) => void;
  onCompleteScriptedIntro?: (entry: JournalEntry) => void;
}> = ({
  entries,
  readOnly = false,
  scriptedIntro = null,
  autoStartScripted = false,
  onAddEntry,
  onCompleteScriptedIntro,
}) => {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('Calm');
  const [typedIndex, setTypedIndex] = useState(0);
  const completedIntroRef = useRef<string | null>(null);

  useEffect(() => {
    setTypedIndex(0);
    completedIntroRef.current = null;
  }, [scriptedIntro?.id]);

  useEffect(() => {
    if (!scriptedIntro || !autoStartScripted) return;
    if (typedIndex >= scriptedIntro.typedText.length) {
      if (completedIntroRef.current === scriptedIntro.id) return;
      const doneTimer = setTimeout(() => {
        if (completedIntroRef.current === scriptedIntro.id) return;
        completedIntroRef.current = scriptedIntro.id;
        onCompleteScriptedIntro?.({
          id: scriptedIntro.id,
          title: scriptedIntro.title,
          mood: scriptedIntro.mood,
          date: scriptedIntro.date,
          body: scriptedIntro.prefilledText + scriptedIntro.typedText,
        });
      }, 900);
      return () => clearTimeout(doneTimer);
    }

    const stepDelay = typedIndex === 0 ? 450 : 22;
    const typeTimer = setTimeout(() => {
      setTypedIndex((prev) => Math.min(scriptedIntro.typedText.length, prev + 1));
    }, stepDelay);
    return () => clearTimeout(typeTimer);
  }, [scriptedIntro, autoStartScripted, typedIndex, onCompleteScriptedIntro]);

  if (scriptedIntro) {
    const visibleBody =
      scriptedIntro.prefilledText + scriptedIntro.typedText.slice(0, typedIndex);
    const isTyping = typedIndex < scriptedIntro.typedText.length;

    return (
      <div className="flex h-full flex-col bg-[#162320] pt-[90px] pb-6 text-[#f5efe0]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-300/80">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {isTyping ? 'Writing entry...' : 'Saving entry...'}
          </span>
          <span className="text-[14px] font-semibold">Journal</span>
          <button
            type="button"
            onClick={() => {
              if (completedIntroRef.current === scriptedIntro.id) return;
              completedIntroRef.current = scriptedIntro.id;
              onCompleteScriptedIntro?.({
                id: scriptedIntro.id,
                title: scriptedIntro.title,
                mood: scriptedIntro.mood,
                date: scriptedIntro.date,
                body: scriptedIntro.prefilledText + scriptedIntro.typedText,
              });
            }}
            className="text-[13px] font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11.5px] font-semibold text-emerald-200">
              {scriptedIntro.date} · {scriptedIntro.mood}
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-[#f5efe0]">
            {scriptedIntro.title}
          </h2>
          <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#1e2f2b] p-4 text-[14.5px] leading-relaxed text-[#f5efe0]/95">
            <span>{visibleBody}</span>
            {isTyping && (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-emerald-300 align-middle" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (composing && !readOnly) {
    return (
      <div className="flex h-full flex-col bg-[#162320] pt-[90px] pb-6 text-[#f5efe0]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <button
            type="button"
            onClick={() => setComposing(false)}
            className="text-[14px] text-emerald-300"
          >
            Cancel
          </button>
          <span className="text-[15px] font-semibold">New Entry</span>
          <button
            type="button"
            onClick={() => {
              if (!body.trim()) return;
              onAddEntry(title.trim() || 'Untitled Reflection', body.trim(), mood);
              setTitle('');
              setBody('');
              setComposing(false);
            }}
            className="text-[14px] font-semibold text-emerald-300"
          >
            Save
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex gap-2">
            {['Calm', 'Focused', 'Tense'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`rounded-full px-3 py-1 text-[12px] ${
                  mood === m ? 'bg-emerald-400 font-semibold text-[#10201c]' : 'bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
            className="bg-transparent text-[20px] font-bold outline-none placeholder:text-white/40"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write what happened today..."
            className="flex-1 resize-none bg-transparent text-[14.5px] leading-relaxed outline-none placeholder:text-white/40"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#162320] px-4 pt-[90px] pb-6 text-[#f5efe0]">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-[28px] font-bold">Journal</h1>
        {readOnly ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-emerald-200/80">
            <Lock className="h-3 w-3" />
            Read-only
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto pb-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-white/10 bg-[#21332f] p-4"
          >
            <p className="text-[11.5px] font-medium text-emerald-300">
              {entry.date} · {entry.mood}
            </p>
            <h2 className="mt-1 text-[16px] font-bold">{entry.title}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#f5efe0]/80">
              {entry.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 11. INSTAGRAM ---------------- */
const IG_UNACCESSIBLE_IDS = new Set([
  'mina',
  'yuna',
  'soyeon',
  'seoyun',
  'eunji',
  'chaewon',
  'twinskulls',
]);

export const InstagramApp: React.FC<{
  posts: IgPost[];
  stories?: IgStoryItem[];
  dmThreads?: DirectMessageThread[];
  activityAlerts?: IgActivityAlert[];
  initialDmAccountId?: string | null;
  onConsumeInitialDm?: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onSelectProfile?: (accountId: string) => void;
  onViewStory?: (storyId: string, accountId: string) => void;
  onSendDm?: (accountId: string, text: string, timeOverride?: string) => void;
  onSkipDm?: (accountId: string) => void;
  onAdvanceTime?: (time: string) => void;
  onReadDm?: (accountId: string) => void;
  onActiveDmChange?: (accountId: string | null) => void;
  onStoryOpenChange?: (open: boolean) => void;
}> = ({
  posts,
  stories = [],
  dmThreads = [],
  activityAlerts = [],
  initialDmAccountId = null,
  onConsumeInitialDm,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onSelectProfile,
  onViewStory,
  onSendDm,
  onSkipDm,
  onAdvanceTime,
  onReadDm,
  onActiveDmChange,
  onStoryOpenChange,
}) => {
  const [navTab, setNavTab] = useState<
    'home' | 'search' | 'explore' | 'notifications' | 'messages'
  >('home');
  const [activeDmAccountId, setActiveDmAccountId] = useState<string | null>(null);
  const [dmDraft, setDmDraft] = useState('');
  const [isDmAutoTyping, setIsDmAutoTyping] = useState(false);
  const [isPressingDmSend, setIsPressingDmSend] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [activeStoryAccountId, setActiveStoryAccountId] = useState<string | null>(null);
  const [storyReplyDraft, setStoryReplyDraft] = useState('');
  const [likedStoryIds, setLikedStoryIds] = useState<Record<string, boolean>>({});
  const [storySentNotice, setStorySentNotice] = useState(false);
  const [query, setQuery] = useState('');
  const [activityRead, setActivityRead] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dmScrollRef = useRef<HTMLDivElement>(null);
  const dmTextareaRef = useRef<HTMLTextAreaElement>(null);
  const prevAlertCountRef = useRef(activityAlerts.length);
  const onSendDmRef = useRef(onSendDm);
  onSendDmRef.current = onSendDm;
  const onAdvanceTimeRef = useRef(onAdvanceTime);
  onAdvanceTimeRef.current = onAdvanceTime;

  const visiblePosts = posts.filter((p) => !IG_UNACCESSIBLE_IDS.has(p.accountId));
  const selectedAccount =
    selectedAccountId && !IG_UNACCESSIBLE_IDS.has(selectedAccountId)
      ? CHARACTER_ACCOUNTS.find((a) => a.id === selectedAccountId) ?? null
      : null;
  const selectedPost = visiblePosts.find((p) => p.id === selectedPostId) ?? null;
  const activeStoryAccount =
    CHARACTER_ACCOUNTS.find((a) => a.id === activeStoryAccountId) ?? null;
  const activeStoryItem =
    stories.find((s) => s.accountId === activeStoryAccountId) ?? null;
  const unreadDmCount = dmThreads.reduce((sum, t) => sum + t.unread, 0);

  const storyOrderAccounts = SORTED_CHARACTER_ACCOUNTS.filter(
    (a) =>
      !IG_UNACCESSIBLE_IDS.has(a.id) ||
      stories.some((s) => s.accountId === a.id)
  ).sort((a, b) => {
    if (a.id === 'sanghyeok') return -1;
    if (b.id === 'sanghyeok') return 1;
    const aHas = stories.some((s) => s.accountId === a.id);
    const bHas = stories.some((s) => s.accountId === b.id);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });

  const openDmWithAccount = (accountId: string) => {
    setSelectedAccountId(null);
    setSelectedPostId(null);
    setNavTab('messages');
    setActiveDmAccountId(accountId);
    onReadDm?.(accountId);
  };

  useEffect(() => {
    if (initialDmAccountId) {
      openDmWithAccount(initialDmAccountId);
      onConsumeInitialDm?.();
    }
  }, [initialDmAccountId]);

  useEffect(() => {
    if (activityAlerts.length > prevAlertCountRef.current) {
      setActivityRead(false);
    }
    prevAlertCountRef.current = activityAlerts.length;
  }, [activityAlerts.length]);

  useEffect(() => {
    onActiveDmChange?.(navTab === 'messages' ? activeDmAccountId : null);
    return () => onActiveDmChange?.(null);
  }, [navTab, activeDmAccountId, onActiveDmChange]);

  const activeDmThreadForEffect = activeDmAccountId
    ? dmThreads.find((t) => t.accountId === activeDmAccountId) ?? null
    : null;
  const dmScriptIndex = activeDmThreadForEffect?.scriptIndex ?? 0;
  const nextDmStep =
    activeDmThreadForEffect?.script &&
    dmScriptIndex < activeDmThreadForEffect.script.length
      ? activeDmThreadForEffect.script[dmScriptIndex]
      : null;
  const shouldAutoTypeDmMe = Boolean(
    navTab === 'messages' &&
      activeDmAccountId &&
      activeDmThreadForEffect &&
      nextDmStep &&
      nextDmStep.sender === 'me' &&
      !activeDmThreadForEffect.isTyping
  );

  useEffect(() => {
    if (navTab === 'messages' && activeDmAccountId && dmScrollRef.current) {
      dmScrollRef.current.scrollTop = dmScrollRef.current.scrollHeight;
    }
  }, [
    navTab,
    activeDmAccountId,
    dmThreads,
    activeDmThreadForEffect?.messages.length,
    activeDmThreadForEffect?.isTyping,
  ]);

  useEffect(() => {
    const el = dmTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 108)}px`;
  }, [dmDraft, activeDmAccountId]);

  useEffect(() => {
    if (!shouldAutoTypeDmMe || !activeDmAccountId || !nextDmStep) {
      setIsDmAutoTyping(false);
      setIsPressingDmSend(false);
      return;
    }

    const peerId = activeDmAccountId;
    const replyText = nextDmStep.text;
    const replyTime = nextDmStep.time;
    const isMinseokThread = peerId === 'minseok';
    const initialPauseMs = isMinseokThread
      ? dmScriptIndex === 0
        ? 900
        : 1600
      : dmScriptIndex === 0
      ? 550
      : 1050;
    const charDelayMs = isMinseokThread ? 36 : 22;
    const preSendPauseMs = isMinseokThread ? 360 : 240;

    setIsDmAutoTyping(true);
    setIsPressingDmSend(false);
    setDmDraft('');

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
        setDmDraft(replyText.slice(0, charIndex));

        if (charIndex >= replyText.length) {
          if (typeInterval) clearInterval(typeInterval);
          pressTimer = setTimeout(() => {
            setIsPressingDmSend(true);
            sendTimer = setTimeout(() => {
              setDmDraft('');
              setIsPressingDmSend(false);
              setIsDmAutoTyping(false);
              onSendDmRef.current?.(peerId, replyText, replyTime);
            }, 180);
          }, preSendPauseMs);
        }
      }, charDelayMs);
    }, initialPauseMs);

    return () => {
      clearTimeout(startDelay);
      if (typeInterval) clearInterval(typeInterval);
      if (pressTimer) clearTimeout(pressTimer);
      if (sendTimer) clearTimeout(sendTimer);
    };
  }, [
    shouldAutoTypeDmMe,
    activeDmAccountId,
    dmScriptIndex,
    nextDmStep?.id,
    nextDmStep?.text,
    nextDmStep?.time,
  ]);

  useEffect(() => {
    onStoryOpenChange?.(Boolean(activeStoryAccountId));
    return () => {
      onStoryOpenChange?.(false);
    };
  }, [activeStoryAccountId, onStoryOpenChange]);

  const renderIgAvatar = (
    accountId: string,
    labelName: string,
    sizeClass = 'h-9 w-9'
  ) => {
    const acc = CHARACTER_ACCOUNTS.find((a) => a.id === accountId);
    if (!acc) {
      return (
        <div
          className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-400`}
        >
          <User className="h-[52%] w-[52%]" />
        </div>
      );
    }
    return (
      <div
        className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-bold text-white uppercase`}
        style={{
          background: `linear-gradient(135deg, ${acc.avatarPalette[0]}, ${acc.avatarPalette[1]})`,
        }}
      >
        {acc.avatarUrl ? (
          <img src={acc.avatarUrl} alt={labelName} className="h-full w-full object-cover" />
        ) : (
          labelName[0]
        )}
      </div>
    );
  };

  /* ---- INSTAGRAM POST DETAIL & COMMENTS ---- */
  if (selectedPost) {
    const comments = selectedPost.comments ?? [];
    const submitIgComment = () => {
      const trimmed = commentDraft.trim();
      if (!trimmed) return;
      onAddComment?.(selectedPost.id, trimmed);
      setCommentDraft('');
    };

    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedPostId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-[15.5px] font-bold">Post & Comments</h2>
          </div>
          <span className="text-[11.5px] text-zinc-400">{selectedPost.time}</span>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <div className="border-b border-zinc-100 pb-3">
            <button
              type="button"
              onClick={() => {
                setSelectedPostId(null);
                setSelectedAccountId(selectedPost.accountId);
                onSelectProfile?.(selectedPost.accountId);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-left"
            >
              {renderIgAvatar(selectedPost.accountId, selectedPost.user, 'h-8 w-8')}
              <div>
                <p className="flex items-center gap-1 text-[13.5px] font-semibold text-[#0f1419]">
                  <span>{selectedPost.user}</span>
                  {isVerifiedAccount(selectedPost.accountId) && (
                    <VerifiedBadge className="h-[13px] w-[13px]" />
                  )}
                </p>
                <p className="text-[11px] text-[#536471]">{selectedPost.location}</p>
              </div>
            </button>

            {selectedPost.imageUrl ? (
              <div className="aspect-square max-h-64 w-full overflow-hidden bg-zinc-100">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.caption}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex aspect-[16/10] w-full items-end p-5"
                style={{
                  background: `linear-gradient(155deg, ${selectedPost.palette[0]}, ${selectedPost.palette[1]}, ${selectedPost.palette[2]})`,
                }}
              >
                <p className="text-[13px] font-medium text-white/90">
                  {selectedPost.location}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between px-4 pt-2.5">
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => onToggleLike(selectedPost.id)}>
                  <Heart
                    className={`h-5.5 w-5.5 ${
                      selectedPost.liked ? 'fill-red-500 text-red-500' : 'text-[#0f1419]'
                    }`}
                  />
                </button>
                <span className="inline-flex items-center gap-1 text-[12.5px] text-zinc-600">
                  <MessageCircle className="h-5.5 w-5.5 text-[#0f1419]" />
                  <span className="tabular-nums">{comments.length}</span>
                </span>
              </div>
              <button type="button" onClick={() => onToggleSave(selectedPost.id)}>
                <Bookmark
                  className={`h-5.5 w-5.5 ${
                    selectedPost.saved ? 'fill-[#0f1419] text-[#0f1419]' : 'text-[#0f1419]'
                  }`}
                />
              </button>
            </div>

            <div className="px-4 pt-2 text-[13px]">
              {selectedPost.likes > 0 && (
                <p className="font-semibold tabular-nums">
                  {formatSocialCount(selectedPost.likes)}{' '}
                  {selectedPost.likes === 1 ? 'like' : 'likes'}
                </p>
              )}
              <p className="mt-0.5">
                <span className="font-semibold">{selectedPost.user}</span>{' '}
                {selectedPost.caption}
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {comments.length > 0 ? (
              comments.map((c) => {
                const hasProfile =
                  CHARACTER_ACCOUNTS.some((a) => a.id === c.accountId) &&
                  !IG_UNACCESSIBLE_IDS.has(c.accountId);
                return (
                  <div key={c.id} className="flex items-start gap-2.5 px-4 py-3">
                    {hasProfile ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPostId(null);
                          setSelectedAccountId(c.accountId);
                          onSelectProfile?.(c.accountId);
                        }}
                      >
                        {renderIgAvatar(c.accountId, c.author, 'h-8 w-8')}
                      </button>
                    ) : (
                      <div className="shrink-0">
                        {renderIgAvatar(c.accountId, c.author, 'h-8 w-8')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug">
                        <span className="font-bold text-[#0f1419]">{c.handle}</span>{' '}
                        <span className="text-[#0f1419]">{c.text}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">{c.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-[13.5px] font-semibold text-zinc-700">
                  No comments yet.
                </p>
                <p className="mt-1 text-[12px] text-zinc-400">
                  Be the first to comment on this post.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-100 bg-white px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5">
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitIgComment();
              }}
              placeholder="Add a comment as lee.sanghyeok..."
              className="flex-1 bg-transparent text-[13.5px] text-[#0f1419] outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={submitIgComment}
              disabled={!commentDraft.trim()}
              className="px-2 text-[13px] font-bold text-[#0095f6] disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- INSTAGRAM PROFILE VIEW ---- */
  if (selectedAccount) {
    const accountPosts = visiblePosts.filter((p) => p.accountId === selectedAccount.id);
    const isSelf = selectedAccount.id === 'sanghyeok';
    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedAccountId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-[15px] font-bold">{selectedAccount.igHandle}</span>
            {selectedAccount.verified && <VerifiedBadge />}
            {isSelf && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-700">
                You
              </span>
            )}
          </div>
          {!isSelf && (
            <button
              type="button"
              onClick={() => openDmWithAccount(selectedAccount.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#0095f6] px-3 py-1 text-[12px] font-semibold text-white"
            >
              <Send className="h-3 w-3" />
              Message
            </button>
          )}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-8">
          <div className="flex items-center gap-5">
            {renderIgAvatar(selectedAccount.id, selectedAccount.name, 'h-16 w-16 text-[20px]')}
            <div className="flex flex-1 justify-around text-center">
              <div>
                <p className="text-[15px] font-bold tabular-nums">
                  {accountPosts.length}
                </p>
                <p className="text-[11px] text-[#536471]">Posts</p>
              </div>
              <div>
                <p className="text-[15px] font-bold tabular-nums">
                  {selectedAccount.followers}
                </p>
                <p className="text-[11px] text-[#536471]">Followers</p>
              </div>
              <div>
                <p className="text-[15px] font-bold tabular-nums">
                  {selectedAccount.following}
                </p>
                <p className="text-[11px] text-[#536471]">Following</p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[14px] font-semibold">{selectedAccount.name}</p>
            <p className="mt-1 text-[13px] leading-snug text-zinc-600">
              {selectedAccount.bio}
            </p>
            {!isSelf && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openDmWithAccount(selectedAccount.id)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-[12.5px] font-semibold text-[#0f1419] transition-colors hover:bg-zinc-100"
                >
                  Message
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1 border-t border-zinc-100 pt-3">
            {accountPosts.length > 0 ? (
              accountPosts.map((p) =>
                p.imageUrl ? (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPostId(p.id)}
                    className="relative aspect-square overflow-hidden bg-zinc-100"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.caption}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ) : (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPostId(p.id)}
                    className="flex aspect-square items-end p-2 text-left"
                    style={{
                      background: `linear-gradient(155deg, ${p.palette[0]}, ${p.palette[1]}, ${p.palette[2]})`,
                    }}
                  >
                    <span className="line-clamp-2 text-[9.5px] font-medium text-white/95">
                      {p.location}
                    </span>
                  </button>
                )
              )
            ) : (
              <p className="col-span-3 py-8 text-center text-[12.5px] text-zinc-400">
                No photos posted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---- INSTAGRAM DM THREAD VIEW ---- */
  const activeDmAccount = activeDmAccountId
    ? CHARACTER_ACCOUNTS.find((a) => a.id === activeDmAccountId) ?? null
    : null;
  const activeDmThread = activeDmAccountId
    ? dmThreads.find((t) => t.accountId === activeDmAccountId) ?? null
    : null;

  if (navTab === 'messages' && activeDmAccount) {
    const messages = activeDmThread?.messages ?? [];
    const isPeerTyping = Boolean(activeDmThread?.isTyping);
    const hasRemainingDmScript = Boolean(
      activeDmThread &&
        (isPeerTyping ||
          (activeDmThread.script &&
            (activeDmThread.scriptIndex ?? 0) < activeDmThread.script.length))
    );
    const sendCurrentIgDm = () => {
      const trimmed = dmDraft.trim();
      if (!trimmed || isDmAutoTyping) return;
      onSendDm?.(activeDmAccount.id, trimmed);
      setDmDraft('');
    };

    return (
      <div className="flex h-full flex-col bg-white pt-[90px] pb-6 text-[#0f1419]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 pb-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setDmDraft('');
                setActiveDmAccountId(null);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAccountId(activeDmAccount.id);
                onSelectProfile?.(activeDmAccount.id);
              }}
              className="flex items-center gap-2.5 text-left"
            >
              {renderIgAvatar(activeDmAccount.id, activeDmAccount.name, 'h-8 w-8')}
              <div>
                <p className="text-[14px] font-semibold leading-tight">
                  {activeDmAccount.name}
                </p>
                <p
                  className={`text-[11px] ${
                    isPeerTyping ? 'font-medium text-[#0095f6]' : 'text-[#536471]'
                  }`}
                >
                  {isPeerTyping ? 'Typing...' : `@${activeDmAccount.igHandle}`}
                </p>
              </div>
            </button>
          </div>
          {hasRemainingDmScript && onSkipDm && (
            <button
              type="button"
              onClick={() => {
                setDmDraft('');
                setIsDmAutoTyping(false);
                setIsPressingDmSend(false);
                onSkipDm(activeDmAccount.id);
              }}
              className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11.5px] font-semibold text-[#0095f6] hover:bg-zinc-100"
            >
              <FastForward className="h-3 w-3" />
              <span>Skip</span>
            </button>
          )}
        </div>

        <div
          ref={dmScrollRef}
          className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-3"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-[14px] font-semibold text-[#0f1419]">
                Instagram Direct · @{activeDmAccount.igHandle}
              </p>
              <p className="mt-1 text-[12px] text-[#536471]">
                Send a private message from @lee.sanghyeok.
              </p>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug ${
                      m.sender === 'me'
                        ? 'rounded-br-sm bg-gradient-to-tr from-[#6366f1] via-[#a855f7] to-[#ec4899] text-white'
                        : 'rounded-bl-sm bg-zinc-100 text-[#0f1419]'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="mt-0.5 px-1 text-[10px] text-zinc-400 tabular-nums">
                    {m.time}
                  </span>
                </motion.div>
              ))}
              {isPeerTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5">
                    {[0, 0.18, 0.36].map((delay, idx) => (
                      <motion.span
                        key={idx}
                        animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                        transition={{
                          duration: 0.85,
                          repeat: Infinity,
                          delay,
                          ease: 'easeInOut',
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-zinc-100 px-3 pt-2.5 pb-1">
          <div className="flex items-end gap-2 rounded-[22px] border border-zinc-200 bg-zinc-50 px-3.5 py-2">
            <textarea
              ref={dmTextareaRef}
              rows={1}
              value={dmDraft}
              readOnly={isDmAutoTyping}
              onChange={(e) => {
                if (!isDmAutoTyping) setDmDraft(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendCurrentIgDm();
                }
              }}
              placeholder="Message..."
              className="no-scrollbar max-h-[108px] flex-1 resize-none overflow-y-auto bg-transparent text-[13.5px] leading-snug text-[#0f1419] outline-none placeholder:text-zinc-400"
            />
            <motion.button
              type="button"
              onClick={sendCurrentIgDm}
              disabled={!dmDraft.trim() || isDmAutoTyping}
              animate={{ scale: isPressingDmSend ? 0.86 : 1 }}
              transition={{ duration: 0.12 }}
              aria-label="Send Instagram Direct message"
              className="pb-0.5 px-2 text-[13px] font-semibold text-[#0095f6] disabled:opacity-40"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const qLower = query.trim().toLowerCase();
  const filteredAccounts = SORTED_CHARACTER_ACCOUNTS.filter(
    (a) =>
      !IG_UNACCESSIBLE_IDS.has(a.id) &&
      (!qLower ||
        a.name.toLowerCase().includes(qLower) ||
        a.igHandle.toLowerCase().includes(qLower) ||
        a.bio.toLowerCase().includes(qLower))
  );
  const igContacts = CHARACTER_ACCOUNTS.filter(
    (a) => a.id !== 'sanghyeok' && !IG_UNACCESSIBLE_IDS.has(a.id)
  );
  const hasUnseenStories = stories.some((s) => !s.seen);

  return (
    <div className="relative flex h-full flex-col bg-white pt-[90px] text-[#0f1419]">
      {/* Light Top Header matching Reference */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 pb-2.5">
        <button
          type="button"
          onClick={() => {
            setSelectedAccountId('sanghyeok');
            onSelectProfile?.('sanghyeok');
          }}
          aria-label="Open Lee Sanghyeok Instagram profile"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-bold shadow-xs transition-transform active:scale-95"
        >
          {SANGHYEOK_ACCOUNT?.avatarUrl ? (
            <img
              src={SANGHYEOK_ACCOUNT.avatarUrl}
              alt="Lee Sanghyeok"
              className="h-full w-full object-cover"
            />
          ) : (
            'LS'
          )}
        </button>

        <h1 className="text-[19px] font-extrabold tracking-tight text-[#0f1419]">
          Instagram
        </h1>

        <button
          type="button"
          onClick={() => {
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 450);
          }}
          aria-label="Refresh Instagram feed"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#0f1419] shadow-xs hover:bg-zinc-50 active:scale-95"
        >
          <RotateCw
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isRefreshing ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {navTab === 'home' && (
        <div className="no-scrollbar flex-1 overflow-y-auto pb-28">
          {/* Stories Strip */}
          <div className="no-scrollbar flex gap-3.5 overflow-x-auto border-b border-zinc-100 px-4 py-3">
            {storyOrderAccounts.map((acc) => {
              const isSelf = acc.id === 'sanghyeok';
              const activeStory = stories.find((s) => s.accountId === acc.id);
              const isUnseen = Boolean(activeStory && !activeStory.seen);
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setActiveStoryAccountId(acc.id);
                    if (activeStory) {
                      onViewStory?.(activeStory.id, acc.id);
                    }
                  }}
                  className="flex shrink-0 flex-col items-center gap-1"
                >
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full p-[2px] ${
                      isSelf
                        ? 'bg-zinc-200'
                        : activeStory && !isUnseen
                        ? 'bg-zinc-300'
                        : 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600'
                    }`}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white text-[13px] font-bold text-white uppercase"
                      style={{
                        background: `linear-gradient(135deg, ${acc.avatarPalette[0]}, ${acc.avatarPalette[1]})`,
                      }}
                    >
                      {acc.avatarUrl ? (
                        <img
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        acc.name[0]
                      )}
                    </div>
                    {isUnseen && (
                      <span className="absolute -bottom-0.5 rounded-full border border-white bg-[#ff3040] px-1.5 py-[1px] text-[8px] font-bold tracking-wider text-white uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <span
                    className={`max-w-[60px] truncate text-[11px] ${
                      isUnseen ? 'font-semibold text-[#0f1419]' : 'text-[#536471]'
                    }`}
                  >
                    {isSelf ? 'Your Story' : acc.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Light-mode Feed */}
          <div className="divide-y divide-zinc-100">
            {visiblePosts.map((post) => {
              const commentCount = post.comments?.length ?? 0;
              return (
                <div key={post.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountId(post.accountId);
                      onSelectProfile?.(post.accountId);
                    }}
                    className="flex items-center gap-2.5 px-3.5 pb-2 text-left"
                  >
                    {renderIgAvatar(post.accountId, post.user, 'h-8 w-8')}
                    <div>
                      <p className="flex items-center gap-1 text-[13px] font-bold text-[#0f1419]">
                        <span>{post.user}</span>
                        {isVerifiedAccount(post.accountId) && (
                          <VerifiedBadge className="h-[13px] w-[13px]" />
                        )}
                      </p>
                      <p className="text-[11px] text-[#536471]">{post.location}</p>
                    </div>
                  </button>

                  {post.imageUrl ? (
                    <div
                      onDoubleClick={() => onToggleLike(post.id)}
                      onClick={() => setSelectedPostId(post.id)}
                      className="relative aspect-square w-full cursor-pointer overflow-hidden bg-zinc-100"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => onToggleLike(post.id)}
                      onClick={() => setSelectedPostId(post.id)}
                      className="flex aspect-square w-full cursor-pointer items-end p-5"
                      style={{
                        background: `linear-gradient(155deg, ${post.palette[0]}, ${post.palette[1]}, ${post.palette[2]})`,
                      }}
                    >
                      <p className="text-[13px] font-medium text-white/90">
                        {post.location}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between px-3.5 pt-2.5">
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => onToggleLike(post.id)}>
                        <Heart
                          className={`h-6 w-6 ${
                            post.liked ? 'fill-red-500 text-red-500' : 'text-[#0f1419]'
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPostId(post.id)}
                        className="inline-flex items-center gap-1 text-[#0f1419]"
                        aria-label="Open comments"
                      >
                        <MessageCircle className="h-6 w-6" />
                        {commentCount > 0 && (
                          <span className="text-[12.5px] font-semibold tabular-nums">
                            {commentCount}
                          </span>
                        )}
                      </button>
                    </div>
                    <button type="button" onClick={() => onToggleSave(post.id)}>
                      <Bookmark
                        className={`h-6 w-6 ${
                          post.saved ? 'fill-[#0f1419] text-[#0f1419]' : 'text-[#0f1419]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="px-3.5 pt-1.5 text-[13px]">
                    {post.likes > 0 && (
                      <p className="font-bold tabular-nums">
                        {formatSocialCount(post.likes)}{' '}
                        {post.likes === 1 ? 'like' : 'likes'}
                      </p>
                    )}
                    <p className="mt-0.5 text-[#0f1419]">
                      <span className="font-bold">{post.user}</span> {post.caption}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedPostId(post.id)}
                      className="mt-1 block text-left text-[12px] font-medium text-[#536471] hover:text-[#0f1419]"
                    >
                      {commentCount > 0
                        ? `View ${commentCount === 1 ? '1 comment' : `all ${commentCount} comments`}`
                        : 'No comments yet · Tap to view'}
                    </button>
                    <p className="mt-0.5 text-[10.5px] text-zinc-400">{post.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {navTab === 'search' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2">
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Instagram accounts..."
                className="w-full bg-transparent text-[13px] text-[#0f1419] outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
            {filteredAccounts.map((acc) => {
              const isSelf = acc.id === 'sanghyeok';
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    onSelectProfile?.(acc.id);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
                >
                  {renderIgAvatar(acc.id, acc.name, 'h-11 w-11 text-[15px]')}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[14px] font-bold text-[#0f1419]">
                        {acc.igHandle}
                      </p>
                      {acc.verified && <VerifiedBadge />}
                      {isSelf && (
                        <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-700">
                          You
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[12px] text-[#536471]">
                      {acc.name} · {acc.bio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {navTab === 'explore' && (
        <div className="no-scrollbar flex-1 overflow-y-auto pb-28">
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <p className="text-[13px] font-bold text-[#0f1419]">
              Gyeong-gwan & Campus Grid
            </p>
            <p className="text-[11px] text-[#536471]">
              Tap any post to inspect photos and comments
            </p>
          </div>
          <div className="grid grid-cols-3 gap-0.5 pt-0.5">
            {visiblePosts.map((p) =>
              p.imageUrl ? (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPostId(p.id)}
                  className="relative aspect-square overflow-hidden bg-zinc-100"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.caption}
                    className="h-full w-full object-cover"
                  />
                </button>
              ) : (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPostId(p.id)}
                  className="flex aspect-square flex-col justify-between p-2 text-left"
                  style={{
                    background: `linear-gradient(155deg, ${p.palette[0]}, ${p.palette[1]}, ${p.palette[2]})`,
                  }}
                >
                  <span className="text-[9.5px] font-bold text-white/95">
                    @{p.user}
                  </span>
                  <span className="line-clamp-2 text-[9px] text-white/85">
                    {p.location}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {navTab === 'notifications' && (
        <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
          <div className="px-4 py-2.5">
            <p className="text-[13px] font-bold text-[#0f1419]">Activity</p>
          </div>
          {activityAlerts.map((alert) => {
            const acc = CHARACTER_ACCOUNTS.find((a) => a.id === alert.accountId);
            if (!acc) return null;
            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => {
                  if (alert.postId) {
                    setSelectedPostId(alert.postId);
                  } else {
                    setSelectedAccountId(acc.id);
                    onSelectProfile?.(acc.id);
                  }
                }}
                className="flex w-full items-center gap-3 bg-rose-50/70 px-4 py-3 text-left hover:bg-rose-50"
              >
                {renderIgAvatar(acc.id, acc.name, 'h-9 w-9')}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-[#0f1419]">
                    <span className="font-bold">{acc.igHandle}</span> {alert.text}
                  </p>
                  <p className="text-[11px] text-[#536471]">{alert.time}</p>
                </div>
                <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
              </button>
            );
          })}
          {stories.map((story) => {
            const acc = CHARACTER_ACCOUNTS.find((a) => a.id === story.accountId);
            if (!acc) return null;
            return (
              <button
                key={`st-notif-${story.id}`}
                type="button"
                onClick={() => {
                  setActiveStoryAccountId(acc.id);
                  onViewStory?.(story.id, acc.id);
                }}
                className="flex w-full items-center gap-3 bg-sky-50/50 px-4 py-3 text-left hover:bg-sky-50"
              >
                {renderIgAvatar(acc.id, acc.name, 'h-9 w-9')}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-[#0f1419]">
                    <span className="font-bold">{acc.igHandle}</span> shared a new story
                    {story.taggedHandle ? ` tagging ${story.taggedHandle}` : ''}.
                  </p>
                  <p className="text-[11px] text-[#536471]">{story.time}</p>
                </div>
              </button>
            );
          })}
          {visiblePosts.slice(0, 6).map((p) => (
            <button
              key={`ig-notif-${p.id}`}
              type="button"
              onClick={() => setSelectedPostId(p.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
            >
              {renderIgAvatar(p.accountId, p.user, 'h-9 w-9')}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-[#0f1419]">
                  <span className="font-bold">{p.user}</span> shared a photo from{' '}
                  <span className="font-medium">{p.location}</span>
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#536471]">
                  {p.caption}
                </p>
              </div>
              <span className="shrink-0 text-[10.5px] text-zinc-400">{p.time}</span>
            </button>
          ))}
        </div>
      )}

      {navTab === 'messages' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <p className="mb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Direct · Message Someone
            </p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {igContacts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => openDmWithAccount(acc.id)}
                  className="flex shrink-0 flex-col items-center gap-1"
                >
                  {renderIgAvatar(acc.id, acc.name, 'h-11 w-11 ring-1 ring-zinc-200')}
                  <span className="max-w-[54px] truncate text-[10.5px] text-zinc-600">
                    {acc.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar flex-1 divide-y divide-zinc-100 overflow-y-auto pb-28">
            {dmThreads.length > 0 ? (
              dmThreads.map((thread) => {
                const acc = CHARACTER_ACCOUNTS.find((a) => a.id === thread.accountId);
                if (!acc) return null;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => openDmWithAccount(acc.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
                  >
                    {renderIgAvatar(acc.id, acc.name, 'h-11 w-11')}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[14px] font-bold text-[#0f1419]">
                          {acc.name}
                        </span>
                        <span className="shrink-0 text-[11px] text-zinc-400 tabular-nums">
                          {lastMsg?.time ?? ''}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-[12.5px] ${
                            thread.isTyping
                              ? 'font-medium text-[#0095f6]'
                              : 'text-[#536471]'
                          }`}
                        >
                          {thread.isTyping
                            ? 'Typing...'
                            : lastMsg
                            ? `${lastMsg.sender === 'me' ? 'You: ' : ''}${lastMsg.text}`
                            : `@${acc.igHandle}`}
                        </p>
                        {thread.unread > 0 && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#0095f6]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-10 text-center text-[13px] text-zinc-400">
                No direct messages yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Frosted-Glass Bottom 5-Icon Pill */}
      <div className="pointer-events-none absolute right-4 bottom-7 left-4 z-20 flex justify-center">
        <div className="pointer-events-auto grid w-full grid-cols-5 items-center rounded-full border border-zinc-200/90 bg-white/85 px-1.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setNavTab('home')}
            aria-label="Instagram feed"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'home'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Home className="h-5 w-5" strokeWidth={navTab === 'home' ? 2.4 : 1.9} />
          </button>

          <button
            type="button"
            onClick={() => setNavTab('search')}
            aria-label="Search accounts"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'search'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Search className="h-5 w-5" strokeWidth={navTab === 'search' ? 2.4 : 1.9} />
          </button>

          <button
            type="button"
            onClick={() => setNavTab('explore')}
            aria-label="Explore photo grid"
            className={`mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'explore'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <LayoutGrid
              className="h-5 w-5"
              strokeWidth={navTab === 'explore' ? 2.4 : 1.9}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setNavTab('notifications');
              setActivityRead(true);
            }}
            aria-label="Activity notifications"
            className={`relative mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'notifications'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Bell
              className="h-5 w-5"
              strokeWidth={navTab === 'notifications' ? 2.4 : 1.9}
            />
            {(hasUnseenStories || (!activityRead && activityAlerts.length > 0) || !activityRead) && (
              <span className="absolute top-2 right-3.5 h-2 w-2 rounded-full bg-[#1d9bf0]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setNavTab('messages');
              setActiveDmAccountId(null);
            }}
            aria-label="Instagram Direct Messages"
            className={`relative mx-auto flex h-10 w-14 items-center justify-center rounded-full transition-colors ${
              navTab === 'messages'
                ? 'bg-zinc-900/10 text-[#0f1419]'
                : 'text-zinc-600 hover:text-[#0f1419]'
            }`}
          >
            <Send className="h-5 w-5" strokeWidth={navTab === 'messages' ? 2.4 : 1.9} />
            {unreadDmCount > 0 && (
              <span className="absolute top-1.5 right-3 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff3040] px-1 text-[9.5px] font-bold text-white tabular-nums">
                {unreadDmCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Story Overlay */}
      {activeStoryAccount && (
        <div
          onClick={() => {
            setActiveStoryAccountId(null);
            setStoryReplyDraft('');
            setStorySentNotice(false);
          }}
          className="absolute inset-0 z-30 flex flex-col justify-between overflow-hidden bg-black pt-[52px] pb-6"
        >
          {/* Media Layer */}
          <div className="relative flex-1 overflow-hidden bg-black">
            {activeStoryItem?.imageUrl ? (
              <>
                <img
                  src={activeStoryItem.imageUrl}
                  alt={activeStoryItem.caption}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/75" />
              </>
            ) : (
              <div className="pointer-events-none absolute inset-0 bg-black" />
            )}

            {/* Top Progress & Author Bar */}
            <div className="relative z-10 px-3 pt-1">
              <div className="mb-2.5 h-[2px] w-full overflow-hidden rounded-full bg-white/30">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${activeStoryAccount.avatarPalette[0]}, ${activeStoryAccount.avatarPalette[1]})`,
                    }}
                  >
                    {activeStoryAccount.avatarUrl ? (
                      <img
                        src={activeStoryAccount.avatarUrl}
                        alt={activeStoryAccount.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      activeStoryAccount.name[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-semibold text-white">
                        {activeStoryAccount.igHandle}
                      </span>
                      {activeStoryItem && (
                        <span className="shrink-0 text-[12.5px] font-normal text-white/70">
                          {activeStoryItem.time}
                        </span>
                      )}
                    </div>
                    {activeStoryItem?.location && (
                      <p className="truncate text-[10.5px] text-white/75">
                        {activeStoryItem.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label="Story options"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
                  >
                    <MoreVertical className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStoryAccountId(null);
                      setStoryReplyDraft('');
                      setStorySentNotice(false);
                    }}
                    aria-label="Close story"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Sticker / Caption Content */}
            {activeStoryItem ? (
              <div className="relative z-10 flex h-[calc(100%-64px)] flex-col items-center justify-end px-5 pb-5">
                {activeStoryItem.taggedHandle && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStoryAccountId(null);
                      setStoryReplyDraft('');
                      setStorySentNotice(false);
                      if (activeStoryItem.taggedAccountId) {
                        setSelectedAccountId(activeStoryItem.taggedAccountId);
                        onSelectProfile?.(activeStoryItem.taggedAccountId);
                      }
                    }}
                    className="mb-2.5 rounded-lg bg-white/95 px-3 py-1 text-[12.5px] font-bold tracking-tight text-black shadow-md transition-transform hover:scale-105"
                  >
                    {activeStoryItem.taggedHandle}
                  </button>
                )}
                {activeStoryItem.caption && (
                  <p className="max-w-full text-center text-[15px] font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    {activeStoryItem.caption}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative z-10 flex h-[calc(100%-64px)] items-center justify-center px-6">
                <p className="text-center text-[15.5px] font-medium text-white/90">
                  {activeStoryAccount.bio}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Instagram Story Bar: "Send message" pill + Heart + Send */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex items-center gap-3 bg-black px-3.5 pt-3 pb-1"
          >
            <div className="flex min-h-[42px] flex-1 items-center rounded-full border border-white/35 px-4">
              <input
                type="text"
                value={storyReplyDraft}
                onChange={(e) => setStoryReplyDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmed = storyReplyDraft.trim();
                    if (!trimmed) return;
                    onSendDm?.(
                      activeStoryAccount.id,
                      `Replied to story: ${trimmed}`
                    );
                    setStoryReplyDraft('');
                    setStorySentNotice(true);
                    setTimeout(() => setStorySentNotice(false), 1800);
                  }
                }}
                placeholder={storySentNotice ? 'Sent' : 'Send message'}
                className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/85"
              />
            </div>

            {(() => {
              const storyKey = activeStoryItem?.id ?? activeStoryAccount.id;
              const isStoryLiked = Boolean(likedStoryIds[storyKey]);
              return (
                <button
                  type="button"
                  onClick={() =>
                    setLikedStoryIds((prev) => ({
                      ...prev,
                      [storyKey]: !prev[storyKey],
                    }))
                  }
                  aria-label="Like story"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-white transition-transform active:scale-90"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isStoryLiked ? 'fill-[#ff3040] text-[#ff3040]' : 'text-white'
                    }`}
                  />
                </button>
              );
            })()}

            <button
              type="button"
              onClick={() => {
                const trimmed = storyReplyDraft.trim();
                if (trimmed) {
                  onSendDm?.(
                    activeStoryAccount.id,
                    `Replied to story: ${trimmed}`
                  );
                  setStoryReplyDraft('');
                  setStorySentNotice(true);
                  setTimeout(() => setStorySentNotice(false), 1800);
                } else {
                  const targetAcc = activeStoryAccount.id;
                  setActiveStoryAccountId(null);
                  setStoryReplyDraft('');
                  setStorySentNotice(false);
                  openDmWithAccount(targetAcc);
                }
              }}
              aria-label="Send story reply"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-white transition-transform active:scale-90"
            >
              <Send className="h-5.5 w-5.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- 12. PHONE ---------------- */
function playDtmfTone(digit: string) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const map: Record<string, number> = {
      '1': 697, '2': 740, '3': 784,
      '4': 830, '5': 880, '6': 932,
      '7': 987, '8': 1046, '9': 1108,
      '*': 620, '0': 659, '#': 1174,
    };
    osc.frequency.value = map[digit] ?? 740;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 90);
  } catch {
    // AudioContext blocked or unavailable
  }
}

export const PhoneApp: React.FC<{
  activeCall: ActiveCall | null;
  callLogs?: CallLogItem[];
  onStartCall: (name: string, number: string) => void;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onCompleteScriptedCall?: () => void;
}> = ({
  activeCall,
  callLogs = [],
  onStartCall,
  onEndCall,
  onAcceptCall,
  onCompleteScriptedCall,
}) => {
  const [tab, setTab] = useState<'keypad' | 'recents' | 'contacts'>('keypad');
  const [recentsFilter, setRecentsFilter] = useState<'all' | 'missed'>('all');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [digits, setDigits] = useState('');
  const [callElapsed, setCallElapsed] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const completedCallIdRef = useRef<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const selectedLog = selectedLogId
    ? callLogs.find((log) => log.id === selectedLogId) ?? null
    : null;
  const filteredCallLogs =
    recentsFilter === 'missed'
      ? callLogs.filter(
          (log) => log.status === 'Missed' || log.status === 'Call Dropped'
        )
      : callLogs;

  useEffect(() => {
    if (!activeCall) {
      setCallElapsed(0);
      setPlaybackSpeed(1);
      completedCallIdRef.current = null;
      return;
    }
    if (activeCall.status === 'Incoming...' || activeCall.status === 'Calling...') {
      setCallElapsed(0);
      completedCallIdRef.current = null;
    }
  }, [activeCall?.id, activeCall?.startedAt, activeCall?.status]);

  useEffect(() => {
    if (
      !activeCall ||
      activeCall.status !== 'Connected' ||
      !activeCall.lines?.length
    ) {
      return;
    }
    const duration = activeCall.durationSeconds ?? 60;
    const interval = setInterval(
      () => {
        setCallElapsed((prev) => {
          const next = prev + 1;
          if (next >= duration) {
            return duration;
          }
          return next;
        });
      },
      playbackSpeed === 2 ? 480 : 1000
    );
    return () => clearInterval(interval);
  }, [activeCall?.id, activeCall?.status, activeCall?.durationSeconds, activeCall?.lines?.length, playbackSpeed]);

  useEffect(() => {
    if (!activeCall || !activeCall.lines?.length) return;
    const duration = activeCall.durationSeconds ?? 60;
    if (
      activeCall.status === 'Connected' &&
      callElapsed >= duration &&
      completedCallIdRef.current !== (activeCall.id ?? 'scripted')
    ) {
      completedCallIdRef.current = activeCall.id ?? 'scripted';
      onCompleteScriptedCall?.();
    }
  }, [activeCall, callElapsed, onCompleteScriptedCall]);

  const revealedLines =
    activeCall?.lines?.filter(
      (line) =>
        activeCall.status === 'Call Dropped' || line.atSeconds <= callElapsed
    ) ?? [];

  useEffect(() => {
    if (revealedLines.length > 0) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [revealedLines.length]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (activeCall) {
    if (activeCall.status === 'Incoming...') {
      return (
        <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-[#162133] via-[#0e1524] to-[#07090e] px-6 pt-[90px] pb-14 text-white">
          <div className="text-center">
            <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
              Incoming Audio Call
            </span>
            <div className="relative mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-[32px] font-semibold ring-2 ring-emerald-400/40">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/15" />
              <span className="relative">{activeCall.name[0]?.toUpperCase()}</span>
            </div>
            <h2 className="mt-5 text-[24px] font-bold tracking-tight">
              {activeCall.name}
            </h2>
            {activeCall.subtitle && (
              <p className="mt-1 text-[13px] font-medium text-sky-300">
                {activeCall.subtitle}
              </p>
            )}
            <p className="mt-1 text-[13px] text-zinc-400 tabular-nums">
              {activeCall.number}
            </p>
          </div>

          <div className="flex w-full max-w-[240px] items-center justify-between px-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onEndCall}
                aria-label="Decline Call"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition-transform active:scale-90"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
              <span className="text-[12px] text-zinc-400">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onAcceptCall?.()}
                aria-label="Answer Call"
                className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#34c759] text-white shadow-lg transition-transform active:scale-90"
              >
                <Phone className="h-7 w-7" />
              </button>
              <span className="text-[12px] font-medium text-emerald-300">Answer</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeCall.lines && activeCall.lines.length > 0) {
      const duration = activeCall.durationSeconds ?? 60;
      const isDropped =
        activeCall.status === 'Call Dropped' || callElapsed >= duration;

      return (
        <div className="flex h-full flex-col bg-gradient-to-b from-[#131b2b] via-[#0b1019] to-[#06080c] pt-[90px] pb-6 text-white">
          <div className="border-b border-white/10 px-4 pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-[17px] font-bold">{activeCall.name}</h2>
                <p className="truncate text-[11px] text-zinc-400">
                  {activeCall.subtitle || activeCall.number}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!isDropped && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
                      className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-semibold text-zinc-200 hover:bg-white/15"
                    >
                      {playbackSpeed}x
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCallElapsed(duration);
                        if (
                          completedCallIdRef.current !==
                          (activeCall.id ?? 'scripted')
                        ) {
                          completedCallIdRef.current = activeCall.id ?? 'scripted';
                          onCompleteScriptedCall?.();
                        }
                      }}
                      className="rounded-lg border border-sky-400/30 bg-sky-500/20 px-2.5 py-1 text-[11px] font-semibold text-sky-200 hover:bg-sky-500/30"
                    >
                      Skip
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span
                className={`flex items-center gap-1.5 font-medium ${
                  isDropped ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isDropped ? 'bg-red-500' : 'animate-pulse bg-emerald-400'
                  }`}
                />
                {isDropped ? 'Call Cut Out · Signal Lost' : 'Live Precinct Audio'}
              </span>
              <span className="font-mono text-[12px] text-zinc-400 tabular-nums">
                {formatTimer(isDropped ? duration : callElapsed)}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
            {revealedLines.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-zinc-500">
                Connecting precinct audio...
              </div>
            ) : (
              revealedLines.map((line) => {
                if (line.kind === 'thought') {
                  return (
                    <div
                      key={line.id}
                      className="rounded-2xl border border-dashed border-emerald-400/35 bg-emerald-950/35 px-3.5 py-2.5"
                    >
                      <p className="text-[11px] font-semibold text-emerald-300">
                        {line.speaker}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed italic text-emerald-100">
                        {line.text}
                      </p>
                    </div>
                  );
                }
                if (line.kind === 'system') {
                  return (
                    <div
                      key={line.id}
                      className="rounded-xl border border-red-500/35 bg-red-950/40 px-3.5 py-2 text-center"
                    >
                      <p className="text-[11px] font-bold tracking-wider text-red-300 uppercase">
                        {line.speaker}
                      </p>
                      <p className="mt-0.5 text-[12px] text-red-200">
                        {line.text}
                      </p>
                    </div>
                  );
                }
                const isDohyeon = line.speaker.toLowerCase().includes('dohyeon');
                const isWoman = line.speaker.toLowerCase().includes('woman');
                return (
                  <div
                    key={line.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5"
                  >
                    <p
                      className={`text-[11px] font-semibold ${
                        isDohyeon
                          ? 'text-amber-300'
                          : isWoman
                          ? 'text-rose-300'
                          : 'text-sky-300'
                      }`}
                    >
                      {line.speaker}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-zinc-100">
                      {line.text}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={transcriptEndRef} />
          </div>

          <div className="border-t border-white/10 px-4 pt-3 pb-2">
            {isDropped ? (
              <button
                type="button"
                onClick={onEndCall}
                className="w-full rounded-2xl bg-red-500/90 py-3 text-[14px] font-semibold text-white transition-transform active:scale-95"
              >
                Close Call Log
              </button>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={onEndCall}
                  aria-label="End Call"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition-transform active:scale-90"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-[#1a2233] to-[#080a0f] px-6 pt-[90px] pb-14 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-[28px] font-semibold">
            {activeCall.name[0]?.toUpperCase()}
          </div>
          <h2 className="mt-4 text-[26px] font-bold">{activeCall.name}</h2>
          <p className="mt-1 text-[14px] text-zinc-400 tabular-nums">
            {activeCall.number}
          </p>
          <p className="mt-3 text-[14px] font-medium text-emerald-400">
            {activeCall.status}
          </p>
        </div>

        <button
          type="button"
          onClick={onEndCall}
          aria-label="End Call"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition-transform active:scale-90"
        >
          <PhoneOff className="h-7 w-7" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-black pt-[90px] pb-6 text-white">
      <div className="flex-1 overflow-y-auto px-5">
        {tab === 'keypad' && (
          <div className="flex h-full flex-col items-center justify-end pb-4">
            <div className="mb-5 flex min-h-[44px] items-center justify-center text-[28px] font-light tracking-wider tabular-nums">
              {digits || <span className="text-zinc-700">Enter number</span>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
                (key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      playDtmfTone(key);
                      setDigits((d) => (d.length < 14 ? d + key : d));
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2c2c2e] text-[24px] font-medium transition-colors active:bg-zinc-600"
                  >
                    {key}
                  </button>
                )
              )}
            </div>
            <div className="mt-5 flex items-center gap-8">
              <span className="w-12" />
              <button
                type="button"
                onClick={() => {
                  if (!digits) return;
                  onStartCall(digits, digits);
                }}
                aria-label="Call"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#34c759] text-white"
              >
                <Phone className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={() => setDigits((d) => d.slice(0, -1))}
                aria-label="Delete digit"
                className="flex h-12 w-12 items-center justify-center text-zinc-400"
              >
                <Delete className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {tab === 'recents' && (
          <div className="pt-2 pb-4">
            {selectedLog ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedLogId(null)}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Recents
                </button>

                <div className="rounded-2xl border border-white/10 bg-[#15171e] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-[18px] font-bold text-white">
                        {selectedLog.name}
                      </h2>
                      {selectedLog.subtitle && (
                        <p className="mt-0.5 text-[12px] text-zinc-400">
                          {selectedLog.subtitle}
                        </p>
                      )}
                      <p className="mt-1 text-[12px] text-zinc-400 tabular-nums">
                        {selectedLog.number}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartCall(selectedLog.name, selectedLog.number)}
                      aria-label={`Call ${selectedLog.name}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 transition-colors hover:bg-emerald-500/30"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5 text-[11.5px]">
                    <span
                      className={`font-semibold ${
                        selectedLog.status === 'Missed' ||
                        selectedLog.status === 'Call Dropped'
                          ? 'text-red-400'
                          : selectedLog.status === 'Incoming'
                          ? 'text-sky-300'
                          : 'text-emerald-300'
                      }`}
                    >
                      {selectedLog.status}
                      {selectedLog.durationLabel ? ` · ${selectedLog.durationLabel}` : ''}
                    </span>
                    <span className="text-zinc-400 tabular-nums">
                      {selectedLog.dateLabel} · {selectedLog.time}
                    </span>
                  </div>
                </div>

                {selectedLog.lines && selectedLog.lines.length > 0 ? (
                  <div className="space-y-2">
                    <p className="px-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                      Saved Call Transcript
                    </p>
                    {selectedLog.lines.map((line) => {
                      if (line.kind === 'thought') {
                        return (
                          <div
                            key={line.id}
                            className="rounded-2xl border border-dashed border-emerald-400/35 bg-emerald-950/35 px-3.5 py-2.5"
                          >
                            <p className="text-[11px] font-semibold text-emerald-300">
                              {line.speaker}
                            </p>
                            <p className="mt-1 text-[12.5px] leading-relaxed italic text-emerald-100">
                              {line.text}
                            </p>
                          </div>
                        );
                      }
                      if (line.kind === 'system') {
                        return (
                          <div
                            key={line.id}
                            className="rounded-xl border border-red-500/35 bg-red-950/40 px-3.5 py-2 text-center"
                          >
                            <p className="text-[11px] font-bold tracking-wider text-red-300 uppercase">
                              {line.speaker}
                            </p>
                            <p className="mt-0.5 text-[12px] text-red-200">
                              {line.text}
                            </p>
                          </div>
                        );
                      }
                      const isDohyeon = line.speaker.toLowerCase().includes('dohyeon');
                      const isWoman = line.speaker.toLowerCase().includes('woman');
                      return (
                        <div
                          key={line.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5"
                        >
                          <p
                            className={`text-[11px] font-semibold ${
                              isDohyeon
                                ? 'text-amber-300'
                                : isWoman
                                ? 'text-rose-300'
                                : 'text-sky-300'
                            }`}
                          >
                            {line.speaker}
                          </p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-100">
                            {line.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[12.5px] text-zinc-500">
                    No audio transcript saved for this call.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h1 className="text-[28px] font-bold">Recents</h1>
                  <div className="flex rounded-xl bg-zinc-900 p-0.5 text-[11.5px] font-medium">
                    {(['all', 'missed'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setRecentsFilter(mode)}
                        className={`rounded-lg px-2.5 py-1 capitalize transition-colors ${
                          recentsFilter === mode
                            ? 'bg-zinc-700 text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCallLogs.length === 0 ? (
                  <p className="py-12 text-center text-[14px] text-zinc-500">
                    {recentsFilter === 'missed'
                      ? 'No missed or dropped calls.'
                      : 'No recent calls.'}
                  </p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {filteredCallLogs.map((log) => {
                      const isAlert =
                        log.status === 'Missed' || log.status === 'Call Dropped';
                      const hasTranscript = Boolean(log.lines && log.lines.length > 0);
                      return (
                        <div
                          key={log.id}
                          className="flex items-center justify-between gap-2.5 py-3"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedLogId(log.id)}
                            className="flex min-w-0 flex-1 items-start gap-3 text-left"
                          >
                            <div className="mt-1 shrink-0">
                              {isAlert ? (
                                <PhoneMissed className="h-4 w-4 text-red-400" />
                              ) : log.status === 'Incoming' ? (
                                <PhoneIncoming className="h-4 w-4 text-sky-400" />
                              ) : (
                                <PhoneOutgoing className="h-4 w-4 text-emerald-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p
                                  className={`truncate text-[15px] font-semibold ${
                                    isAlert ? 'text-red-400' : 'text-white'
                                  }`}
                                >
                                  {log.name}
                                </p>
                                {hasTranscript && (
                                  <span className="shrink-0 rounded-md border border-sky-400/30 bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                                    Transcript
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-[12px] text-zinc-400">
                                {log.status}
                                {log.durationLabel ? ` · ${log.durationLabel}` : ''}
                                {log.subtitle ? ` · ${log.subtitle}` : ''}
                              </p>
                              <p className="mt-0.5 text-[11px] text-zinc-500 tabular-nums">
                                {log.dateLabel} · {log.time}
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onStartCall(log.name, log.number)}
                            aria-label={`Call back ${log.name}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-emerald-400 hover:bg-white/10"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="pt-2">
            <h1 className="mb-3 text-[28px] font-bold">Contacts</h1>
            <div className="divide-y divide-white/10">
              {[
                { name: 'Inspector Kang Minhyeok', num: '+82 10-4402-0199' },
                { name: 'Chief Lieutenant', num: '+82 10-4402-0100' },
                { name: 'Dorm 304 (Group)', num: '+82 10-3304-0000' },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onStartCall(c.name, c.num)}
                  className="flex w-full items-center justify-between py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                      <User className="h-4 w-4 text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold">{c.name}</p>
                      <p className="text-[12px] text-zinc-400 tabular-nums">{c.num}</p>
                    </div>
                  </div>
                  <Phone className="h-4 w-4 text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-around border-t border-white/10 pt-3 text-[12px] font-medium">
        {(['recents', 'contacts', 'keypad'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              if (t !== 'recents') setSelectedLogId(null);
            }}
            className={`capitalize ${tab === t ? 'text-blue-400' : 'text-zinc-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 13. SAFARI / GOOGLE (MULTI-TAB) ---------------- */
export const SafariApp: React.FC<{
  unlockedSecondArticle: boolean;
  unlockedThirdArticle?: boolean;
  unlockedFourthArticle?: boolean;
  unlockedMissingChildArchive?: boolean;
  tabs: SafariTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenArticleTab: (articleId: string) => void;
  onCreateGoogleTab: () => void;
  onUpdateTabQuery: (tabId: string, query: string) => void;
  onReachArticleBottom?: (articleId: string) => void;
}> = ({
  unlockedSecondArticle,
  unlockedThirdArticle = false,
  unlockedFourthArticle = false,
  unlockedMissingChildArchive = false,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenArticleTab,
  onCreateGoogleTab,
  onUpdateTabQuery,
  onReachArticleBottom,
}) => {
  const [showTabGrid, setShowTabGrid] = useState(false);
  const [topicFilter, setTopicFilter] = useState<
    'all' | 'breaking' | 'reports' | 'archive'
  >('all');
  const [readProgress, setReadProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomNotifiedSetRef = useRef<Set<string>>(new Set());

  const availableArticles = NEWS_ARTICLES.filter((a) => {
    if (
      a.id === 'allstar-2008' ||
      a.id === 'archive-2008' ||
      a.id === 'univ-campus-safety-report'
    ) {
      return true;
    }
    if (a.id === 'burned-vehicle') return unlockedSecondArticle;
    if (a.id === 'minhyung-murder') return unlockedThirdArticle;
    if (a.id === 'chief-murder') return unlockedFourthArticle;
    if (
      a.id === 'missing-baby-2008-case' ||
      a.id === 'unregistered-adoption-2008' ||
      a.id === 'ggpd-2008-evidence-report' ||
      a.id === 'seongnam-hospital-audit-2008'
    ) {
      return unlockedMissingChildArchive;
    }
    return true;
  });

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const query = activeTab?.query ?? '';
  const activeArticle =
    activeTab?.kind === 'article'
      ? availableArticles.find((a) => a.id === activeTab.articleId) ??
        availableArticles[0]
      : null;

  useEffect(() => {
    setReadProgress(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab?.id, activeArticle?.id, showTabGrid]);

  const handleArticleScroll = () => {
    const el = scrollRef.current;
    if (!el || !activeArticle) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const ratio = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    setReadProgress(ratio);

    if (
      el.scrollTop > 32 &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 28 &&
      !bottomNotifiedSetRef.current.has(activeArticle.id)
    ) {
      bottomNotifiedSetRef.current.add(activeArticle.id);
      onReachArticleBottom?.(activeArticle.id);
    }
  };

  const ARCHIVE_IDS = new Set([
    'archive-2008',
    'missing-baby-2008-case',
    'unregistered-adoption-2008',
    'ggpd-2008-evidence-report',
    'seongnam-hospital-audit-2008',
  ]);
  const REPORT_IDS = new Set([
    'missing-baby-2008-case',
    'ggpd-2008-evidence-report',
    'seongnam-hospital-audit-2008',
    'univ-campus-safety-report',
  ]);
  const q = query.trim().toLowerCase().replace(/\bchildreen\b/g, 'children');
  const queryWords = q && q !== 'gyeong-gwan news' ? q.split(/\s+/).filter(Boolean) : [];
  const matchingArticles = availableArticles
    .filter((article) => {
      if (topicFilter === 'breaking' && ARCHIVE_IDS.has(article.id)) return false;
      if (topicFilter === 'reports' && !REPORT_IDS.has(article.id)) return false;
      if (topicFilter === 'archive' && !ARCHIVE_IDS.has(article.id)) return false;
      if (queryWords.length === 0) return true;
      const blob = [
        article.headline,
        article.byline,
        article.source,
        ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
      ]
        .join(' ')
        .toLowerCase();
      return queryWords.some((word) => blob.includes(word));
    })
    .slice()
    .reverse()
    .sort((a, b) => {
      if (queryWords.length === 0) return 0;
      const score = (art: typeof a) => {
        const blob = [
          art.headline,
          art.byline,
          art.source,
          ...art.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
        ]
          .join(' ')
          .toLowerCase();
        return queryWords.reduce(
          (acc, word) => acc + (blob.includes(word) ? 1 : 0),
          0
        );
      };
      return score(b) - score(a);
    });

  if (showTabGrid) {
    return (
      <div className="flex h-full flex-col justify-between bg-[#0f1014] pt-[90px] pb-5 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <h1 className="text-[18px] font-bold tracking-tight">
            Tabs ({tabs.length})
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onCreateGoogleTab();
                setShowTabGrid(false);
              }}
              className="inline-flex min-h-[34px] items-center gap-1 rounded-full bg-blue-500/20 px-3 text-[12px] font-semibold text-blue-300 hover:bg-blue-500/30"
            >
              <Plus className="h-3.5 w-3.5" />
              New Tab
            </button>
            <button
              type="button"
              onClick={() => setShowTabGrid(false)}
              className="min-h-[34px] px-2 text-[13px] font-semibold text-blue-400"
            >
              Done
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {tabs.map((tab) => {
              const article = tab.articleId
                ? availableArticles.find((a) => a.id === tab.articleId)
                : null;
              const isCurrent = tab.id === activeTab?.id;
              return (
                <div
                  key={tab.id}
                  className={`relative flex h-[170px] flex-col justify-between rounded-2xl border p-3 transition-all ${
                    isCurrent
                      ? 'border-blue-400 bg-[#1a1c24] shadow-[0_0_0_1px_rgba(96,165,250,0.4)]'
                      : 'border-white/10 bg-[#16171d] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-[10.5px] font-semibold text-zinc-400">
                      {tab.kind === 'article' ? 'gyeonggwan-herald' : 'google.com'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      aria-label={`Close ${tab.title}`}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-white/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowTabGrid(false);
                    }}
                    className="flex flex-1 flex-col justify-between pt-2 text-left"
                  >
                    <div>
                      <p className="line-clamp-3 text-[12.5px] font-bold leading-snug text-white">
                        {article ? article.headline : tab.title}
                      </p>
                      {article && (
                        <p className="mt-1.5 line-clamp-2 text-[10.5px] text-zinc-400">
                          {article.byline}
                        </p>
                      )}
                    </div>
                    <span className="text-[10.5px] font-medium text-blue-400">
                      {isCurrent ? 'Active Tab' : 'Switch to tab'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-2.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Available Reports
            </p>
            <div className="space-y-2">
              {availableArticles.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => {
                    onOpenArticleTab(art.id);
                    setShowTabGrid(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#16171d] px-3 py-2.5 text-left hover:bg-[#1f212a]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[10.5px] font-medium text-red-400">
                      {art.source}
                    </p>
                    <p className="truncate text-[12.5px] font-semibold text-white">
                      {art.headline}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 shrink-0 text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-[#101216] pt-[90px] pb-5 text-white">
      {/* Compact Multi-Tab Strip */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-[#0b0d10] px-3 py-2">
        {tabs.map((tab) => {
          const isCurrent = tab.id === activeTab?.id;
          return (
            <div
              key={tab.id}
              className={`flex max-w-[152px] shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11.5px] transition-colors ${
                isCurrent
                  ? 'border-blue-400/50 bg-[#1b202b] font-semibold text-white'
                  : 'border-white/10 bg-[#16181f] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className="truncate text-left"
              >
                {tab.title}
              </button>
              <button
                type="button"
                onClick={() => onCloseTab(tab.id)}
                aria-label={`Close ${tab.title}`}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={onCreateGoogleTab}
          aria-label="New tab"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#16181f] text-zinc-300 hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Article Reading Progress Bar */}
      {activeArticle && (
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-blue-400 transition-[width] duration-100"
            style={{ width: `${Math.round(readProgress * 100)}%` }}
          />
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleArticleScroll}
        className="no-scrollbar flex-1 overflow-y-auto px-4 pt-3.5 pb-5"
      >
        {/* Google Header */}
        <div className="mb-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onCreateGoogleTab}
            className="text-[22px] font-bold tracking-tight"
          >
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </button>
          <button
            type="button"
            onClick={() => setShowTabGrid(true)}
            className="min-h-[32px] rounded-lg px-2 text-[12px] font-medium text-blue-400 hover:bg-white/5"
          >
            Open Tabs ({tabs.length})
          </button>
        </div>

        {activeTab?.kind === 'google' || !activeArticle ? (
          <div className="space-y-4">
            {/* Upgraded Google Search Bar */}
            <div className="flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/15 bg-[#1b1e25] px-4 shadow-inner focus-within:border-blue-400/60">
              <Search className="h-4 w-4 shrink-0 text-blue-400" />
              <input
                value={query}
                onChange={(e) =>
                  activeTab && onUpdateTabQuery(activeTab.id, e.target.value)
                }
                placeholder="Search Gyeong-gwan news or cases..."
                className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-zinc-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => activeTab && onUpdateTabQuery(activeTab.id, '')}
                  aria-label="Clear search query"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5">
              {(
                [
                  { id: 'all', label: 'Top Stories' },
                  { id: 'breaking', label: 'News' },
                  { id: 'reports', label: 'Reports' },
                  { id: 'archive', label: '2008 Archive' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTopicFilter(cat.id)}
                  className={`min-h-[32px] shrink-0 rounded-full border px-3 text-[11.5px] font-medium transition-colors ${
                    topicFilter === cat.id
                      ? 'border-blue-400/60 bg-blue-500/20 text-blue-300'
                      : 'border-white/10 bg-[#171a21] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Clickable Report Shortcuts */}
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => onOpenArticleTab('univ-campus-safety-report')}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-teal-400/25 bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-200 hover:bg-teal-500/20"
              >
                <FileText className="h-3 w-3" />
                Campus Safety Report
              </button>
              {unlockedMissingChildArchive && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenArticleTab('ggpd-2008-evidence-report')}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/20"
                  >
                    <FileText className="h-3 w-3" />
                    GGPD 2008 Report
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenArticleTab('missing-baby-2008-case')}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-400/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-200 hover:bg-blue-500/20"
                  >
                    <FileText className="h-3 w-3" />
                    Missing Child #GG-0814
                  </button>
                </>
              )}
            </div>

            {/* Results Section Label */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11.5px] text-zinc-400">
              <span className="font-semibold tracking-wider uppercase">
                Google News & Reports · Gyeong-gwan
              </span>
              <span className="tabular-nums">
                {matchingArticles.length}{' '}
                {matchingArticles.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {matchingArticles.length > 0 ? (
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#171a21]">
                {matchingArticles.map((article) => {
                  const isLatestCrime =
                    article.id === 'chief-murder' ||
                    (article.id === 'minhyung-murder' && !unlockedFourthArticle);
                  const isReport = REPORT_IDS.has(article.id);
                  const isArchive = ARCHIVE_IDS.has(article.id);
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => onOpenArticleTab(article.id)}
                      className="w-full p-4 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-[#1e222b]"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex min-w-0 items-center gap-2">
                          {isReport ? (
                            <FileText className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          ) : (
                            <Globe className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          )}
                          <span
                            className={`truncate font-semibold ${
                              isLatestCrime ? 'text-red-400' : 'text-zinc-300'
                            }`}
                          >
                            {article.source}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider uppercase ${
                            isReport
                              ? 'bg-amber-500/15 text-amber-300'
                              : isArchive
                              ? 'bg-indigo-500/15 text-indigo-300'
                              : 'bg-red-500/15 text-red-300'
                          }`}
                        >
                          {isReport ? 'Report' : isArchive ? 'Archive' : 'News'}
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-[15px] leading-snug font-bold text-[#8ab4f8]">
                        {article.headline}
                      </h2>
                      <p className="mt-1 text-[11.5px] text-zinc-400">
                        {article.byline}
                      </p>
                      <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-zinc-300">
                        {article.sections[0].paragraphs[0]}
                      </p>
                      <p className="mt-2 text-[11.5px] font-semibold text-blue-400">
                        {isReport ? 'Open full report →' : 'Read full article →'}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#171a21] p-5 text-[13px] text-zinc-400">
                No results for &quot;{query}&quot;. Try searching &quot;AllStar&quot;,
                &quot;2008&quot;, &quot;Minhyung&quot;, or &quot;Gyeong-gwan&quot;.
              </div>
            )}
          </div>
        ) : (
          <article className="rounded-2xl border border-white/10 bg-[#161920] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold tracking-wide text-red-400 uppercase">
                {activeArticle.source}
              </p>
              <FileText className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
            </div>
            <h1 className="mt-2 text-[18px] leading-snug font-bold text-white">
              {activeArticle.headline}
            </h1>
            <p className="mt-2 border-b border-white/10 pb-3 text-[12px] text-zinc-400">
              {activeArticle.byline}
            </p>

            <div className="mt-3.5 space-y-4 text-[13.5px] leading-relaxed text-zinc-200">
              {activeArticle.sections.map((section, idx) => (
                <div key={idx} className="space-y-2.5">
                  {section.heading && (
                    <h2 className="pt-1 text-[13px] font-bold tracking-wide text-white">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-3.5 text-center">
              <p className="text-[11.5px] font-semibold tracking-wider text-zinc-400 uppercase">
                End of Gyeong-gwan Herald Report
              </p>
              <button
                type="button"
                onClick={onCreateGoogleTab}
                className="mt-2 min-h-[36px] text-[12.5px] font-semibold text-blue-400 hover:underline"
              >
                Back to Google News Feed
              </button>
            </div>
          </article>
        )}
      </div>

      {/* Bottom Address & Nav */}
      <div className="border-t border-white/10 bg-[#181a20] px-3 pt-2.5 pb-1">
        <div className="flex items-center gap-2 rounded-xl bg-black/45 px-3 py-2">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span className="truncate text-[13px] text-zinc-200">
            {activeArticle ? 'gyeonggwan-herald.kr' : 'google.com/search'}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between px-3 text-blue-400">
          <button
            type="button"
            disabled={tabs.length <= 1}
            onClick={() => {
              const idx = tabs.findIndex((t) => t.id === activeTab?.id);
              if (idx > 0) onSelectTab(tabs[idx - 1].id);
              else if (tabs.length > 0) onSelectTab(tabs[tabs.length - 1].id);
            }}
            aria-label="Previous tab"
            className="disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={tabs.length <= 1}
            onClick={() => {
              const idx = tabs.findIndex((t) => t.id === activeTab?.id);
              if (idx >= 0 && idx < tabs.length - 1) onSelectTab(tabs[idx + 1].id);
              else if (tabs.length > 0) onSelectTab(tabs[0].id);
            }}
            aria-label="Next tab"
            className="disabled:opacity-30"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onCreateGoogleTab}
            aria-label="New Google search tab"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onOpenArticleTab('archive-2008')}
            aria-label="Open 2008 Archive tab"
            title="2008 Archive Report"
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowTabGrid(true)}
            aria-label="Show all tabs"
            className="relative flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-white/10"
          >
            <Copy className="h-4.5 w-4.5" />
            <span className="text-[11px] font-bold tabular-nums">
              {tabs.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
