import {
  BlackScreenSubtitleBeat,
  CharacterAccount,
  CharacterDossier,
  CharacterDossierUpdate,
  CharacterVitalStatus,
  IgPost,
  JournalEntry,
  JournalScriptedIntro,
  MailItem,
  MailScriptedCompose,
  NarrationMemoItem,
  NewsArticle,
  NoteItem,
  PhotoItem,
  PostComment,
  ScriptedChatStep,
  SocialPost,
  VoiceRecordingItem,
  VoiceRecordingLine,
  WeatherCity,
  WhatsAppChat,
  WhatsAppMessage,
} from '../types/phone';
import { resolveAssetUrl } from '../utils/assets';

const galleryImageModules = import.meta.glob(
  '/src/assets/gallery/**/*.{png,jpg,jpeg,webp,gif,svg,avif}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const profileImageModules = import.meta.glob(
  '/src/assets/profiles/**/*.{png,jpg,jpeg,webp,gif,svg,avif}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const avatarImageModules = import.meta.glob(
  '/src/assets/avatars/*.{png,jpg,jpeg,webp,gif,avif}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const profileTextModules = import.meta.glob(
  '/src/assets/profiles/**/{posts,post}.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const chatTextModules = import.meta.glob(
  '/src/assets/chats/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const noteTextModules = import.meta.glob(
  '/src/assets/notes/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const dossierTextModules = import.meta.glob(
  '/src/assets/dossiers/*/dossier.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const recordingTextModules = import.meta.glob(
  '/src/assets/recordings/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const narrationTextModules = import.meta.glob(
  '/src/assets/narrations/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const emailTextModules = import.meta.glob(
  '/src/assets/emails/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const newsTextModules = import.meta.glob(
  '/src/assets/news/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const journalTextModules = import.meta.glob(
  '/src/assets/journals/*.txt',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

export function loadProfileAvatars(): Record<string, string> {
  const avatars: Record<string, string> = {};

  // Prefer user-added photos (.jpg/.jpeg/.webp/.avif) over placeholder .png/.svg if both exist
  const extPriority = (path: string): number => {
    const lower = path.toLowerCase();
    if (lower.endsWith('.svg')) return 3;
    if (lower.endsWith('.png')) return 2;
    return 1;
  };

  const avatarFolderEntries = Object.entries(avatarImageModules).sort(
    ([a], [b]) => extPriority(a) - extPriority(b)
  );

  for (const [filePath, url] of avatarFolderEntries) {
    const match = filePath.match(/\/src\/assets\/avatars\/([^/]+)\.[^.]+$/i);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    if (!avatars[key]) {
      avatars[key] = url;
    }
  }

  // Secondary fallback: /src/assets/profiles/<user>/avatar.*
  const profileAvatarEntries = Object.entries(profileImageModules).sort(
    ([a], [b]) => extPriority(a) - extPriority(b)
  );

  for (const [filePath, url] of profileAvatarEntries) {
    const match = filePath.match(
      /\/src\/assets\/profiles\/([^/]+)\/avatar\.[^.]+$/i
    );
    if (match && !avatars[match[1].toLowerCase()]) {
      avatars[match[1].toLowerCase()] = url;
    }
  }

  if (avatars.chief_lieutenant) {
    avatars.police = avatars.police ?? avatars.chief_lieutenant;
    avatars.tenente = avatars.tenente ?? avatars.chief_lieutenant;
  }
  if (avatars.dorm_304) {
    avatars.dorm304 = avatars.dorm304 ?? avatars.dorm_304;
    avatars.republica = avatars.republica ?? avatars.dorm_304;
  }
  if (avatars.hyunjun || avatars.hyeonjun) {
    avatars.hyunjun = avatars.hyunjun ?? avatars.hyeonjun;
  }

  return avatars;
}

function formatFilenameTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  return withoutExt
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function parseChapters(raw?: string): number[] | undefined {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'all' || normalized === 'todos' || normalized === '*') {
    return undefined;
  }
  const nums = normalized
    .split(/[,\s;/]+/)
    .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return nums.length > 0 ? nums : undefined;
}

function parseBoolean(raw?: string): boolean {
  if (!raw) return false;
  const val = raw.trim().toLowerCase();
  return val === 'true' || val === 'yes' || val === 'sim' || val === '1';
}

function parseNumber(raw: string | undefined, fallback = 0): number {
  if (!raw) return fallback;
  const n = Number.parseInt(raw.replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function parsePalette(
  raw: string | undefined,
  fallback: [string, string, string]
): [string, string, string] {
  if (!raw) return fallback;
  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) {
    return [parts[0], parts[1], parts[2]];
  }
  if (parts.length === 2) {
    return [parts[0], parts[1], fallback[2]];
  }
  return fallback;
}

function resolvePostImage(
  rawImage: string | undefined,
  accountId: string,
  appName: 'x' | 'instagram'
): string | undefined {
  if (!rawImage) return undefined;
  const trimmed = rawImage.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed || lower === 'none' || lower === 'nenhuma' || lower === 'no' || lower === 'false') {
    return undefined;
  }

  const sameAppPath = `/src/assets/profiles/${accountId}/${appName}/${trimmed}`;
  if (profileImageModules[sameAppPath]) {
    return profileImageModules[sameAppPath];
  }

  const userRootPath = `/src/assets/profiles/${accountId}/${trimmed}`;
  if (profileImageModules[userRootPath]) {
    return profileImageModules[userRootPath];
  }

  const galleryPath = `/src/assets/gallery/${trimmed}`;
  if (galleryImageModules[galleryPath]) {
    return galleryImageModules[galleryPath];
  }

  const normalized = trimmed.startsWith('./') ? trimmed.slice(2) : trimmed;
  const fuzzyProfile = Object.entries(profileImageModules).find(([key]) =>
    key.toLowerCase().endsWith(`/${accountId}/${appName}/${normalized.toLowerCase()}`)
  );
  if (fuzzyProfile) return fuzzyProfile[1];

  const fuzzyGallery = Object.entries(galleryImageModules).find(([key]) =>
    key.toLowerCase().endsWith(`/${normalized.toLowerCase()}`)
  );
  if (fuzzyGallery) return fuzzyGallery[1];

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return resolveAssetUrl(trimmed);
  }

  return undefined;
}

function parseTimeOffsetInfo(timeStr: string): {
  baseDays: number;
  intraDayMinutes: number;
} {
  const s = timeStr.trim().toLowerCase();
  if (!s || s === 'now' || s === 'just now' || s === 'today') {
    return { baseDays: 0, intraDayMinutes: 0 };
  }
  if (s === 'yesterday') {
    return { baseDays: 1, intraDayMinutes: 0 };
  }
  const numMatch = s.match(/(\d+)/);
  const value = numMatch ? Number.parseInt(numMatch[1], 10) : 0;

  if (s.includes('day') || /\d+\s*d\b/.test(s)) {
    return { baseDays: value, intraDayMinutes: 0 };
  }
  if (s.includes('hour') || /\d+\s*h\b/.test(s)) {
    return { baseDays: 0, intraDayMinutes: value * 60 };
  }
  if (s.includes('minute') || s.includes('min') || /\d+\s*m\b/.test(s)) {
    return { baseDays: 0, intraDayMinutes: value };
  }
  return { baseDays: 0, intraDayMinutes: 999 };
}

export function formatPostRelativeDay(
  rawTime: string,
  createdChapter: number | undefined,
  currentChapter: number
): string {
  const { baseDays } = parseTimeOffsetInfo(rawTime);
  const delta =
    createdChapter !== undefined ? Math.max(0, currentChapter - createdChapter) : 0;
  const totalDays = baseDays + delta;
  if (totalDays <= 0) return 'today';
  if (totalDays === 1) return 'yesterday';
  return `${totalDays}d ago`;
}

export function getPostRelativeSortMinutes(
  rawTime: string,
  createdChapter: number | undefined,
  currentChapter: number
): number {
  const { baseDays, intraDayMinutes } = parseTimeOffsetInfo(rawTime);
  const delta =
    createdChapter !== undefined ? Math.max(0, currentChapter - createdChapter) : 0;
  return (baseDays + delta) * 1440 + intraDayMinutes;
}

function parseRelativeTimeMinutes(timeStr: string): number {
  const { baseDays, intraDayMinutes } = parseTimeOffsetInfo(timeStr);
  return baseDays * 1440 + intraDayMinutes;
}

const POST_KNOWN_KEYS = new Set([
  'chapter',
  'chapters',
  'capitulo',
  'capítulo',
  'time',
  'hora',
  'likes',
  'curtidas',
  'reposts',
  'image',
  'imagem',
  'text',
  'texto',
  'author',
  'autor',
  'handle',
  'user',
  'usuario',
  'usuário',
  'location',
  'local',
  'saved',
  'salvo',
  'palette',
  'paleta',
  'caption',
  'legenda',
  'description',
  'descricao',
  'descrição',
  'community',
  'comunidade',
  'badge',
  'comments',
  'comentarios',
  'comentários',
]);

function parsePostComments(
  rawComments: string | undefined,
  postId: string
): PostComment[] | undefined {
  if (!rawComments) return undefined;
  const parsed = rawComments
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split('|').map((p) => p.trim());
      const rawAccId = parts[0].toLowerCase();
      const accountId = rawAccId === 'jaehyuck' ? 'jaehyuk' : rawAccId;
      if (parts.length >= 5) {
        return {
          id: `${postId}-c-${idx + 1}`,
          accountId,
          author: parts[1],
          handle: parts[2],
          time: parts[3],
          text: parts.slice(4).join(' | '),
        };
      }
      if (parts.length === 4) {
        return {
          id: `${postId}-c-${idx + 1}`,
          accountId,
          author: parts[1],
          handle: `@${accountId}`,
          time: parts[2],
          text: parts[3],
        };
      }
      return null;
    })
    .filter((c): c is PostComment => Boolean(c && c.text));

  return parsed.length > 0 ? parsed : undefined;
}

function parsePostBlocks(rawText: string): Record<string, string>[] {
  const cleanedLines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
  const parsed: Record<string, string>[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;

    const fields: Record<string, string> = {};
    let currentKey: string | null = null;

    for (const line of lines) {
      const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
      const candidateKey = match ? match[1].trim().toLowerCase() : '';
      if (match && POST_KNOWN_KEYS.has(candidateKey)) {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      } else if (currentKey) {
        fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
      }
    }

    if (Object.keys(fields).length > 0) {
      parsed.push(fields);
    }
  }

  return parsed;
}

export function loadGalleryFolderPhotos(): PhotoItem[] {
  return Object.entries(galleryImageModules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([filePath, url]) => {
      const relative = filePath.replace(/^\/src\/assets\/gallery\//i, '');
      const parts = relative.split('/');
      const filename = parts.pop() ?? 'photo';
      const subfolder = parts.length > 0 ? formatFilenameTitle(parts[0]) : undefined;
      return {
        id: `gal-${relative.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        title: formatFilenameTitle(filename),
        date: subfolder ? `${subfolder} Album` : 'Gallery Folder',
        location: subfolder ? `Dorm 304 · ${subfolder}` : 'src/assets/gallery',
        palette: ['#18181b', '#27272a', '#52525b'],
        dataUrl: url,
        favorite: false,
        caption: subfolder
          ? `Loaded from src/assets/gallery/${parts[0]}/${filename}`
          : `Loaded from src/assets/gallery/${filename}`,
        source: 'gallery',
        folder: subfolder,
      };
    });
}

export function loadProfileXPosts(accounts: CharacterAccount[]): SocialPost[] {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const result: SocialPost[] = [];

  for (const [filePath, raw] of Object.entries(profileTextModules)) {
    const match = filePath.match(/\/src\/assets\/profiles\/([^/]+)\/x\/posts?\.txt$/i);
    if (!match) continue;

    const folderId = match[1];
    const accountId = folderId === 'jaehyuck' ? 'jaehyuk' : folderId;
    const acc = accountMap.get(accountId);
    const blocks = parsePostBlocks(raw);

    blocks.forEach((fields, idx) => {
      const text = fields.text ?? fields.texto ?? '';
      if (!text.trim()) return;

      const author = fields.author ?? fields.autor ?? acc?.name ?? accountId;
      const handle = fields.handle ?? acc?.xHandle ?? `@${accountId}`;
      const time = fields.time ?? fields.hora ?? '1h';
      const likes = parseNumber(fields.likes ?? fields.curtidas, 0);
      const reposts = parseNumber(fields.reposts, 0);
      const chapters = parseChapters(
        fields.chapter ?? fields.chapters ?? fields.capitulo ?? fields['capítulo']
      );
      const imageUrl = resolvePostImage(
        fields.image ?? fields.imagem,
        folderId,
        'x'
      );

      const postId = `x-${accountId}-${idx + 1}`;
      const rawCommunity = (fields.community ?? fields.comunidade ?? '').trim().toLowerCase();
      const community =
        rawCommunity === 'university' ||
        rawCommunity === 'univ' ||
        rawCommunity === 'ggu' ||
        rawCommunity === 'campus'
          ? ('university' as const)
          : undefined;
      const badge = fields.badge?.trim() || undefined;
      const comments = parsePostComments(
        fields.comments ?? fields.comentarios ?? fields['comentários'],
        postId
      );

      const createdChapter =
        chapters && chapters.length > 0 ? Math.min(...chapters) : undefined;

      result.push({
        id: postId,
        accountId,
        author,
        handle,
        time,
        text,
        likes,
        liked: false,
        reposts,
        reposted: false,
        bookmarked: false,
        community,
        badge,
        comments,
        chapters,
        createdChapter,
        imageUrl,
      });
    });
  }

  return result.sort(
    (a, b) => parseRelativeTimeMinutes(a.time) - parseRelativeTimeMinutes(b.time)
  );
}

export function loadProfileIgPosts(accounts: CharacterAccount[]): IgPost[] {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const result: IgPost[] = [];

  for (const [filePath, raw] of Object.entries(profileTextModules)) {
    const match = filePath.match(
      /\/src\/assets\/profiles\/([^/]+)\/instagram\/posts?\.txt$/i
    );
    if (!match) continue;

    const folderId = match[1];
    const accountId = folderId === 'jaehyuck' ? 'jaehyuk' : folderId;
    const acc = accountMap.get(accountId);
    const blocks = parsePostBlocks(raw);

    blocks.forEach((fields, idx) => {
      const caption =
        fields.caption ??
        fields.legenda ??
        fields.description ??
        fields.descricao ??
        fields['descrição'] ??
        '';
      const imageUrl = resolvePostImage(
        fields.image ?? fields.imagem,
        folderId,
        'instagram'
      );
      if (!caption.trim() && !imageUrl) return;

      const user = fields.user ?? fields.usuario ?? acc?.igHandle ?? accountId;
      const location = fields.location ?? fields.local ?? 'Gyeong-gwan';
      const time = fields.time ?? fields.hora ?? '1 HOUR AGO';
      const likes = parseNumber(fields.likes ?? fields.curtidas, 0);
      const saved = parseBoolean(fields.saved ?? fields.salvo);
      const fallbackPalette: [string, string, string] = acc
        ? [acc.avatarPalette[0], acc.avatarPalette[1], '#3f3f46']
        : ['#18181b', '#27272a', '#52525b'];
      const palette = parsePalette(fields.palette ?? fields.paleta, fallbackPalette);
      const chapters = parseChapters(
        fields.chapter ?? fields.chapters ?? fields.capitulo ?? fields['capítulo']
      );
      const postId = `ig-${accountId}-${idx + 1}`;
      const comments = parsePostComments(
        fields.comments ?? fields.comentarios ?? fields['comentários'],
        postId
      );

      const createdChapter =
        chapters && chapters.length > 0 ? Math.min(...chapters) : undefined;

      result.push({
        id: postId,
        accountId,
        user,
        location,
        caption,
        likes,
        liked: false,
        saved,
        palette,
        time,
        comments,
        chapters,
        createdChapter,
        imageUrl,
      });
    });
  }

  return result.sort(
    (a, b) => parseRelativeTimeMinutes(a.time) - parseRelativeTimeMinutes(b.time)
  );
}

const CHAT_KNOWN_KEYS = new Set([
  'id',
  'chapter',
  'chapters',
  'capitulo',
  'capítulo',
  'order',
  'ordem',
  'name',
  'nome',
  'subtitle',
  'subtitulo',
  'number',
  'numero',
  'avatar',
  'unread',
  'trigger',
  'sender',
  'remetente',
  'sendername',
  'author',
  'autor',
  'time',
  'hora',
  'initial',
  'inicial',
  'delay',
  'text',
  'texto',
]);

function parseChatBlocks(rawText: string): Record<string, string>[] {
  const cleanedLines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
  const parsed: Record<string, string>[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;

    const fields: Record<string, string> = {};
    let currentKey: string | null = null;

    for (const line of lines) {
      const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
      const candidateKey = match ? match[1].trim().toLowerCase() : '';
      if (match && CHAT_KNOWN_KEYS.has(candidateKey)) {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      } else if (currentKey) {
        fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
      }
    }

    if (Object.keys(fields).length > 0) {
      parsed.push(fields);
    }
  }

  return parsed;
}

export function loadChatsForChapter(
  chapterId: number,
  profileAvatars: Record<string, string>,
  extraAvatars: Record<string, string> = {},
  triggerFilter?: string
): WhatsAppChat[] {
  interface LoadedChatEntry {
    order: number;
    chat: WhatsAppChat;
  }

  const entries: LoadedChatEntry[] = [];

  for (const [filePath, raw] of Object.entries(chatTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const blocks = parseChatBlocks(raw);
    if (blocks.length === 0) continue;

    const header = blocks[0];
    const chapters = parseChapters(
      header.chapter ?? header.chapters ?? header.capitulo ?? header['capítulo']
    );
    if (chapters && !chapters.includes(chapterId)) continue;

    const chatTrigger = header.trigger?.trim().toLowerCase() || undefined;
    if (triggerFilter) {
      if (chatTrigger !== triggerFilter.toLowerCase()) continue;
    } else if (chatTrigger) {
      continue;
    }

    const id = (header.id ?? filename.replace(/\.txt$/i, '')).trim();
    const fileKey = filename
      .replace(/\.txt$/i, '')
      .replace(/[^a-z0-9_-]/gi, '-');
    const order = parseNumber(header.order ?? header.ordem, 999);
    const name = header.name ?? header.nome ?? id;
    const subtitle = header.subtitle ?? header.subtitulo ?? '';
    const number = header.number ?? header.numero ?? '';
    const avatarKey = (header.avatar ?? id).trim().toLowerCase();
    const avatarUrl = extraAvatars[avatarKey] ?? profileAvatars[avatarKey];
    const unread = parseNumber(header.unread, 0);

    const msgBlocks = blocks.slice(1);
    const initialMessages: WhatsAppMessage[] = [];
    const script: ScriptedChatStep[] = [];
    let enteredScript = false;

    msgBlocks.forEach((fields, idx) => {
      const rawSender = (fields.sender ?? fields.remetente ?? 'them')
        .trim()
        .toLowerCase();
      const sender: 'me' | 'them' =
        rawSender === 'me' || rawSender === 'eu' || rawSender === 'sanghyeok'
          ? 'me'
          : 'them';
      const senderName = (
        fields.sendername ??
        fields.author ??
        fields.autor ??
        ''
      ).trim() || undefined;
      const time = fields.time ?? fields.hora ?? '';
      const text = (fields.text ?? fields.texto ?? '').trim();
      if (!text) return;

      const explicitInitial = fields.initial ?? fields.inicial;
      let isInitial: boolean;
      if (explicitInitial !== undefined) {
        isInitial = parseBoolean(explicitInitial);
      } else {
        if (sender === 'me') enteredScript = true;
        isInitial = !enteredScript && sender === 'them';
      }

      if (isInitial) {
        initialMessages.push({
          id: `${fileKey}-${id}-init-${idx + 1}`,
          sender,
          senderName,
          text,
          time,
          read: sender === 'me' ? true : undefined,
        });
      } else {
        enteredScript = true;
        const rawDelay = fields.delay
          ? parseNumber(fields.delay, 6000)
          : undefined;
        script.push({
          id: `${fileKey}-${id}-step-${idx + 1}`,
          sender,
          text,
          time,
          delayMs: rawDelay,
        });
      }
    });

    const lastMsg = initialMessages[initialMessages.length - 1];
    entries.push({
      order,
      chat: {
        id,
        name,
        subtitle,
        number,
        lastTime: lastMsg?.time ?? '',
        unread,
        messages: initialMessages,
        script: script.length > 0 ? script : undefined,
        scriptIndex: 0,
        avatarUrl,
      },
    });
  }

  return entries
    .sort((a, b) => a.order - b.order || a.chat.name.localeCompare(b.chat.name))
    .map((e) => e.chat);
}

const NOTE_KNOWN_KEYS = new Set([
  'chapter',
  'chapters',
  'capitulo',
  'capítulo',
  'exactchapter',
  'exact_chapter',
  'capituloespecifico',
  'if_dead',
  'ifdead',
  'when_dead',
  'whendead',
  'se_morto',
  'semorto',
  'if_alive',
  'ifalive',
  'when_alive',
  'whenalive',
  'se_vivo',
  'sevivo',
  'trigger',
  'after_event',
  'title',
  'titulo',
  'título',
  'updatedat',
  'updated',
  'time',
  'hora',
  'body',
  'texto',
  'text',
]);

function parseTagList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\s;/]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function matchesConditionalBlock(
  fields: Record<string, string>,
  chapterId: number,
  deadSet: Set<string>,
  triggerSet: Set<string>,
  inheritedChapters?: number[]
): { matches: boolean; chapterOrder: number } {
  const exactChapters = parseChapters(
    fields.exactchapter ?? fields.exact_chapter ?? fields.capituloespecifico
  );
  if (exactChapters && !exactChapters.includes(chapterId)) {
    return { matches: false, chapterOrder: chapterId };
  }

  const blockChapters =
    parseChapters(
      fields.chapter ??
        fields.chapters ??
        fields.capitulo ??
        fields['capítulo']
    ) ?? inheritedChapters;

  if (blockChapters && !blockChapters.some((ch) => ch <= chapterId)) {
    return { matches: false, chapterOrder: chapterId };
  }

  const requiredDead = parseTagList(
    fields.if_dead ?? fields.ifdead ?? fields.when_dead ?? fields.whendead ?? fields.se_morto ?? fields.semorto
  );
  if (requiredDead.length > 0 && !requiredDead.every((id) => deadSet.has(id))) {
    return { matches: false, chapterOrder: chapterId };
  }

  const requiredAlive = parseTagList(
    fields.if_alive ?? fields.ifalive ?? fields.when_alive ?? fields.whenalive ?? fields.se_vivo ?? fields.sevivo
  );
  if (requiredAlive.length > 0 && !requiredAlive.every((id) => !deadSet.has(id))) {
    return { matches: false, chapterOrder: chapterId };
  }

  const requiredTriggers = parseTagList(fields.trigger ?? fields.after_event);
  if (
    requiredTriggers.length > 0 &&
    !requiredTriggers.every((trig) => triggerSet.has(trig))
  ) {
    return { matches: false, chapterOrder: chapterId };
  }

  const matchingChapters = exactChapters
    ? exactChapters
    : blockChapters
    ? blockChapters.filter((ch) => ch <= chapterId)
    : [chapterId];

  return {
    matches: true,
    chapterOrder: Math.max(...matchingChapters),
  };
}

function parseNoteBlocks(rawText: string): Record<string, string>[] {
  const cleanedLines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
  const parsed: Record<string, string>[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;

    const fields: Record<string, string> = {};
    let currentKey: string | null = null;

    for (const line of lines) {
      const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
      const candidateKey = match ? match[1].trim().toLowerCase() : '';
      if (match && NOTE_KNOWN_KEYS.has(candidateKey)) {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      } else if (currentKey) {
        fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
      }
    }

    if (Object.keys(fields).length > 0) {
      parsed.push(fields);
    }
  }

  return parsed;
}

export function loadNotesForChapter(
  chapterId: number,
  deadCharacterIds: string[] = [],
  activeTriggers: string[] = []
): NoteItem[] {
  interface LoadedNoteEntry {
    chapterOrder: number;
    fileIndex: number;
    note: NoteItem;
  }

  const deadSet = new Set(deadCharacterIds.map((id) => id.trim().toLowerCase()));
  const triggerSet = new Set(activeTriggers.map((t) => t.trim().toLowerCase()));
  const entries: LoadedNoteEntry[] = [];

  for (const [filePath, raw] of Object.entries(noteTextModules).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const blocks = parseNoteBlocks(raw);
    if (blocks.length === 0) continue;

    let fileChapters: number[] | undefined;
    const firstBlock = blocks[0];
    if (
      firstBlock &&
      !firstBlock.title &&
      !firstBlock.titulo &&
      !firstBlock['título'] &&
      !firstBlock.body &&
      !firstBlock.texto &&
      !firstBlock.text
    ) {
      fileChapters = parseChapters(
        firstBlock.chapter ??
          firstBlock.chapters ??
          firstBlock.capitulo ??
          firstBlock['capítulo']
      );
      blocks.shift();
    } else {
      const numMatch = filename.match(/chapter[_-]?(\d+)/i);
      if (numMatch) {
        fileChapters = [Number.parseInt(numMatch[1], 10)];
      }
    }

    if (fileChapters && !fileChapters.some((ch) => ch <= chapterId)) continue;

    blocks.forEach((fields, idx) => {
      const cond = matchesConditionalBlock(
        fields,
        chapterId,
        deadSet,
        triggerSet,
        fileChapters
      );
      if (!cond.matches) return;

      const title = (
        fields.title ??
        fields.titulo ??
        fields['título'] ??
        ''
      ).trim();
      const body = (fields.body ?? fields.texto ?? fields.text ?? '').trim();
      const updatedAt = (
        fields.updatedat ??
        fields.updated ??
        fields.time ??
        fields.hora ??
        'Today'
      ).trim();

      if (!title && !body) return;

      entries.push({
        chapterOrder: cond.chapterOrder,
        fileIndex: idx,
        note: {
          id: `note-ch${cond.chapterOrder}-${filename}-${idx + 1}`,
          title,
          body,
          updatedAt,
        },
      });
    });
  }

  return entries
    .sort((a, b) => b.chapterOrder - a.chapterOrder || a.fileIndex - b.fileIndex)
    .map((e) => e.note);
}

const DOSSIER_KNOWN_KEYS = new Set([
  'id',
  'name',
  'nome',
  'age',
  'idade',
  'role',
  'papel',
  'residence',
  'residencia',
  'residência',
  'attendedparty',
  'attended_party',
  'festa',
  'status',
  'deadfromchapter',
  'dead_from_chapter',
  'alibi',
  'interrogationsummary',
  'interrogation_summary',
  'detectivenotes',
  'detective_notes',
  'chapter',
  'chapters',
  'capitulo',
  'capítulo',
  'exactchapter',
  'exact_chapter',
  'capituloespecifico',
  'if_dead',
  'ifdead',
  'when_dead',
  'whendead',
  'se_morto',
  'semorto',
  'if_alive',
  'ifalive',
  'when_alive',
  'whenalive',
  'se_vivo',
  'sevivo',
  'trigger',
  'after_event',
  'time',
  'hora',
  'title',
  'titulo',
  'título',
  'text',
  'texto',
  'body',
]);

function parseDossierBlocks(rawText: string): Record<string, string>[] {
  const cleanedLines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
  const parsed: Record<string, string>[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;

    const fields: Record<string, string> = {};
    let currentKey: string | null = null;

    for (const line of lines) {
      const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
      const candidateKey = match ? match[1].trim().toLowerCase() : '';
      if (match && DOSSIER_KNOWN_KEYS.has(candidateKey)) {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      } else if (currentKey) {
        fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
      }
    }

    if (Object.keys(fields).length > 0) {
      parsed.push(fields);
    }
  }

  return parsed;
}

function normalizeVitalStatus(raw?: string): CharacterVitalStatus {
  const s = (raw ?? 'alive').trim().toLowerCase();
  if (s === 'dead' || s === 'deceased' || s === 'morto' || s === 'morta') {
    return 'dead';
  }
  if (s === 'missing' || s === 'desaparecido' || s === 'desaparecida') {
    return 'missing';
  }
  if (s === 'detained' || s === 'detido' || s === 'arrested') {
    return 'detained';
  }
  return 'alive';
}

export function loadDossiersForState(
  chapterId: number,
  profileAvatars: Record<string, string>,
  deadCharacterIds: string[] = [],
  activeTriggers: string[] = [],
  missingCharacterIds: string[] = []
): CharacterDossier[] {
  const deadSet = new Set(deadCharacterIds.map((id) => id.trim().toLowerCase()));
  const missingSet = new Set(missingCharacterIds.map((id) => id.trim().toLowerCase()));
  const triggerSet = new Set(activeTriggers.map((t) => t.trim().toLowerCase()));
  const dossiers: CharacterDossier[] = [];

  for (const [filePath, raw] of Object.entries(dossierTextModules).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    const folderMatch = filePath.match(/\/src\/assets\/dossiers\/([^/]+)\/dossier\.txt$/i);
    if (!folderMatch) continue;

    const blocks = parseDossierBlocks(raw);
    if (blocks.length === 0) continue;

    const header = blocks[0];
    const id = (header.id ?? folderMatch[1]).trim().toLowerCase();
    const deadFromChapterRaw = header.deadfromchapter ?? header.dead_from_chapter;
    const deadFromChapter = deadFromChapterRaw
      ? parseNumber(deadFromChapterRaw, 999)
      : undefined;

    let status = normalizeVitalStatus(header.status);
    if (deadSet.has(id) || (deadFromChapter !== undefined && chapterId >= deadFromChapter)) {
      status = 'dead';
    } else if (missingSet.has(id)) {
      status = 'missing';
    }

    const effectiveDeadSet = new Set(deadSet);
    if (status === 'dead') {
      effectiveDeadSet.add(id);
    }

    const updates: CharacterDossierUpdate[] = [];
    blocks.slice(1).forEach((fields, idx) => {
      const cond = matchesConditionalBlock(
        fields,
        chapterId,
        effectiveDeadSet,
        triggerSet
      );
      if (!cond.matches) return;

      const title = (fields.title ?? fields.titulo ?? fields['título'] ?? 'Case Update').trim();
      const text = (fields.text ?? fields.texto ?? fields.body ?? '').trim();
      if (!text) return;

      const reqDead = parseTagList(
        fields.if_dead ?? fields.ifdead ?? fields.when_dead ?? fields.whendead ?? fields.se_morto ?? fields.semorto
      );
      const reqAlive = parseTagList(
        fields.if_alive ?? fields.ifalive ?? fields.when_alive ?? fields.whenalive ?? fields.se_vivo ?? fields.sevivo
      );

      updates.push({
        id: `${id}-upd-${idx + 1}`,
        chapters: [cond.chapterOrder],
        time: (fields.time ?? fields.hora ?? 'Oct 24').trim(),
        title,
        text,
        ifDead: reqDead.length > 0 ? reqDead : undefined,
        ifAlive: reqAlive.length > 0 ? reqAlive : undefined,
      });
    });

    const avatarKey = id === 'jaehyuk' ? 'jaehyuck' : id;
    dossiers.push({
      id,
      name: (header.name ?? header.nome ?? id).trim(),
      age: (header.age ?? header.idade ?? '—').trim(),
      role: (header.role ?? header.papel ?? '').trim(),
      residence: (header.residence ?? header.residencia ?? header['residência'] ?? '').trim(),
      attendedParty: parseBoolean(
        header.attendedparty ?? header.attended_party ?? header.festa
      ),
      status,
      deadFromChapter,
      alibi: (header.alibi ?? '').trim(),
      interrogationSummary: (
        header.interrogationsummary ??
        header.interrogation_summary ??
        ''
      ).trim(),
      detectiveNotes: (
        header.detectivenotes ??
        header.detective_notes ??
        ''
      ).trim(),
      avatarUrl: profileAvatars[id] ?? profileAvatars[avatarKey],
      updates,
    });
  }

  // Put deceased first, then party attendees, then Dorm 304 / others alphabetically
  return dossiers.sort((a, b) => {
    if (a.status === 'dead' && b.status !== 'dead') return -1;
    if (b.status === 'dead' && a.status !== 'dead') return 1;
    if (a.attendedParty !== b.attendedParty) return a.attendedParty ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

const RECORDING_KNOWN_KEYS = new Set([
  'title',
  'titulo',
  'date',
  'data',
  'speaker',
  'falante',
  'atseconds',
  'at',
  'time',
  'text',
  'texto',
]);

export function loadRecordingScript(idKey: string): VoiceRecordingItem | null {
  const entry = Object.entries(recordingTextModules).find(([path]) =>
    path.toLowerCase().endsWith(`/${idKey.toLowerCase()}.txt`)
  );
  if (!entry) return null;

  const raw = entry[1];
  const cleanedLines = raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
  const parsed: Record<string, string>[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;

    const fields: Record<string, string> = {};
    let currentKey: string | null = null;
    for (const line of lines) {
      const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
      const candidateKey = match ? match[1].trim().toLowerCase() : '';
      if (match && RECORDING_KNOWN_KEYS.has(candidateKey)) {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      } else if (currentKey) {
        fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
      }
    }
    if (Object.keys(fields).length > 0) {
      parsed.push(fields);
    }
  }

  if (parsed.length === 0) return null;

  const header = parsed[0];
  const hasHeaderMeta = Boolean(header.title || header.titulo || header.date);
  const lineBlocks = hasHeaderMeta ? parsed.slice(1) : parsed;

  const lines: VoiceRecordingLine[] = [];
  lineBlocks.forEach((fields, idx) => {
    const speaker = (fields.speaker ?? fields.falante ?? 'Unknown').trim();
    const text = (fields.text ?? fields.texto ?? '').trim();
    const atSeconds = parseNumber(fields.atseconds ?? fields.at ?? fields.time, idx * 4 + 1);
    if (!text) return;
    lines.push({
      id: `${idKey}-line-${idx + 1}`,
      speaker,
      text,
      atSeconds,
    });
  });

  const lastAt = lines.length > 0 ? lines[lines.length - 1].atSeconds : 0;
  return {
    id: idKey,
    title: (header.title ?? header.titulo ?? 'Voice Recording').trim(),
    date: (header.date ?? header.data ?? 'Oct 24 · 20:52').trim(),
    durationSeconds: lastAt + 3,
    lines,
  };
}

const NARRATION_KNOWN_KEYS = new Set([
  'id',
  'chapter',
  'chapters',
  'capitulo',
  'capítulo',
  'title',
  'titulo',
  'título',
  'location',
  'local',
  'datetime',
  'date',
  'data',
  'summary',
  'resumo',
  'kind',
  'tipo',
  'speaker',
  'falante',
  'text',
  'texto',
]);

export function loadNarrationMemo(idKey: string): NarrationMemoItem | null {
  const normalizedKey = idKey.trim().toLowerCase();

  for (const [filePath, raw] of Object.entries(narrationTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const cleanedLines = raw
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('#'));

    const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
    const parsed: Record<string, string>[] = [];

    for (const block of blocks) {
      const lines = block
        .split('\n')
        .map((l) => l.trimEnd())
        .filter((l) => l.trim().length > 0);
      if (lines.length === 0) continue;

      const fields: Record<string, string> = {};
      let currentKey: string | null = null;
      for (const line of lines) {
        const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
        const candidateKey = match ? match[1].trim().toLowerCase() : '';
        if (match && NARRATION_KNOWN_KEYS.has(candidateKey)) {
          currentKey = candidateKey;
          fields[currentKey] = match[2].trim();
        } else if (currentKey) {
          fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
        }
      }
      if (Object.keys(fields).length > 0) {
        parsed.push(fields);
      }
    }

    if (parsed.length === 0) continue;

    const header = parsed[0];
    const fileSlug = filename.replace(/\.txt$/i, '');
    const id = (header.id ?? fileSlug).trim();
    if (id.toLowerCase() !== normalizedKey && fileSlug !== normalizedKey) {
      continue;
    }

    const chapter = parseNumber(
      header.chapter ?? header.chapters ?? header.capitulo ?? header['capítulo'],
      1
    );
    const title = (header.title ?? header.titulo ?? header['título'] ?? 'Narration').trim();
    const location = (header.location ?? header.local ?? 'Gyeong-gwan').trim();
    const dateTime = (header.datetime ?? header.date ?? header.data ?? '').trim();
    const summary = (header.summary ?? header.resumo ?? '').trim();

    const beats: BlackScreenSubtitleBeat[] = [];
    parsed.slice(1).forEach((fields, idx) => {
      const rawKind = (fields.kind ?? fields.tipo ?? 'narration').trim().toLowerCase();
      const kind: 'narration' | 'dialogue' =
        rawKind === 'dialogue' || rawKind === 'dialogo' || rawKind === 'diálogo' || rawKind === 'fala'
          ? 'dialogue'
          : 'narration';
      const speaker = (fields.speaker ?? fields.falante ?? '').trim() || undefined;
      const text = (fields.text ?? fields.texto ?? '').trim();
      if (!text) return;
      beats.push({
        id: `${id}-beat-${idx + 1}`,
        kind,
        speaker: kind === 'dialogue' ? speaker : undefined,
        text,
      });
    });

    return {
      id,
      chapter,
      title,
      location,
      dateTime,
      summary,
      beats,
    };
  }

  return null;
}

const EMAIL_HEADER_KEYS = new Set([
  'id',
  'type',
  'tipo',
  'category',
  'categoria',
  'order',
  'ordem',
  'from',
  'de',
  'email',
  'to',
  'para',
  'subject',
  'assunto',
  'preview',
  'previa',
  'prévia',
  'time',
  'hora',
  'unread',
  'naolido',
  'quickreplylabel',
  'quick_reply_label',
  'audioattachment',
  'audio_attachment',
  'body',
  'corpo',
  'text',
  'texto',
]);

function parseEmailFile(raw: string): Record<string, string> {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const fields: Record<string, string> = {};
  let inBody = false;
  const bodyLines: string[] = [];
  let currentKey: string | null = null;

  for (const line of lines) {
    if (inBody) {
      bodyLines.push(line.trimEnd());
      continue;
    }

    if (line.trimStart().startsWith('#')) continue;
    if (line.trim().length === 0) continue;

    const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
    const candidateKey = match ? match[1].trim().toLowerCase() : '';
    if (match && EMAIL_HEADER_KEYS.has(candidateKey)) {
      if (
        candidateKey === 'body' ||
        candidateKey === 'corpo' ||
        candidateKey === 'text' ||
        candidateKey === 'texto'
      ) {
        inBody = true;
        if (match[2].trim().length > 0) {
          bodyLines.push(match[2].trim());
        }
      } else {
        currentKey = candidateKey;
        fields[currentKey] = match[2].trim();
      }
    } else if (currentKey) {
      fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
    }
  }

  const joinedBody = bodyLines.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  if (joinedBody) {
    fields.body = joinedBody;
  }

  return fields;
}

function buildMailItemFromFields(
  fields: Record<string, string>,
  fallbackId: string,
  recordingResolver?: (recordingId: string) => VoiceRecordingItem | undefined
): MailItem {
  const audioId = (fields.audioattachment ?? fields.audio_attachment ?? '').trim();
  const quickReply = (fields.quickreplylabel ?? fields.quick_reply_label ?? '').trim();

  return {
    id: (fields.id ?? fallbackId).trim(),
    from: (fields.from ?? fields.de ?? '').trim(),
    email: (fields.email ?? '').trim(),
    subject: (fields.subject ?? fields.assunto ?? '').trim(),
    preview: (fields.preview ?? fields.previa ?? fields['prévia'] ?? '').trim(),
    body: fields.body ?? '',
    time: (fields.time ?? fields.hora ?? '').trim(),
    unread: parseBoolean(fields.unread ?? fields.naolido),
    quickReplyLabel: quickReply || undefined,
    audioAttachment:
      audioId && recordingResolver ? recordingResolver(audioId) : undefined,
  };
}

export function loadInitialMails(): MailItem[] {
  const entries: { order: number; mail: MailItem }[] = [];

  for (const [filePath, raw] of Object.entries(emailTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const fields = parseEmailFile(raw);
    const type = (fields.type ?? fields.tipo ?? 'inbox').trim().toLowerCase();
    const category = (fields.category ?? fields.categoria ?? '').trim().toLowerCase();
    if (type !== 'inbox' || category !== 'initial') continue;

    const fileSlug = filename.replace(/\.txt$/i, '');
    const order = parseNumber(fields.order ?? fields.ordem, 999);
    entries.push({
      order,
      mail: buildMailItemFromFields(fields, fileSlug),
    });
  }

  return entries
    .sort((a, b) => a.order - b.order || a.mail.id.localeCompare(b.mail.id))
    .map((e) => e.mail);
}

export function loadEmailById(
  idKey: string,
  recordingResolver?: (recordingId: string) => VoiceRecordingItem | undefined
): MailItem | null {
  const normalizedKey = idKey.trim().toLowerCase();

  for (const [filePath, raw] of Object.entries(emailTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const fields = parseEmailFile(raw);
    const type = (fields.type ?? fields.tipo ?? 'inbox').trim().toLowerCase();
    if (type !== 'inbox') continue;

    const fileSlug = filename.replace(/\.txt$/i, '');
    const id = (fields.id ?? fileSlug).trim();
    if (id.toLowerCase() !== normalizedKey && fileSlug !== normalizedKey) {
      continue;
    }

    return buildMailItemFromFields(fields, fileSlug, recordingResolver);
  }

  return null;
}

export function loadComposeMailById(idKey: string): MailScriptedCompose | null {
  const normalizedKey = idKey.trim().toLowerCase();

  for (const [filePath, raw] of Object.entries(emailTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const fields = parseEmailFile(raw);
    const type = (fields.type ?? fields.tipo ?? 'inbox').trim().toLowerCase();
    if (type !== 'compose') continue;

    const fileSlug = filename.replace(/\.txt$/i, '');
    const id = (fields.id ?? fileSlug).trim();
    if (id.toLowerCase() !== normalizedKey && fileSlug !== normalizedKey) {
      continue;
    }

    return {
      id,
      to: (fields.to ?? fields.para ?? '').trim(),
      subject: (fields.subject ?? fields.assunto ?? '').trim(),
      body: fields.body ?? '',
      time: (fields.time ?? fields.hora ?? '').trim(),
    };
  }

  return null;
}

const NEWS_KNOWN_KEYS = new Set([
  'id',
  'order',
  'ordem',
  'source',
  'fonte',
  'headline',
  'manchete',
  'title',
  'titulo',
  'título',
  'byline',
  'autor',
  'heading',
  'subtitulo',
  'subtítulo',
  'text',
  'texto',
  'paragraphs',
  'paragrafos',
  'parágrafos',
  'body',
]);

export function loadNewsArticles(): NewsArticle[] {
  const entries: { order: number; article: NewsArticle }[] = [];

  for (const [filePath, raw] of Object.entries(newsTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt') continue;

    const cleanedLines = raw
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('#'));

    const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
    if (blocks.length === 0) continue;

    const parseNewsBlock = (blockText: string): Record<string, string> => {
      const lines = blockText.split('\n').map((l) => l.trimEnd());
      const fields: Record<string, string> = {};
      let currentKey: string | null = null;
      let multilineBuffer: string[] = [];

      const flushMultiline = () => {
        if (currentKey && multilineBuffer.length > 0) {
          fields[currentKey] = multilineBuffer
            .join('\n')
            .replace(/^\n+/, '')
            .replace(/\n+$/, '');
        }
        multilineBuffer = [];
      };

      for (const line of lines) {
        const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
        const candidateKey = match ? match[1].trim().toLowerCase() : '';
        if (match && NEWS_KNOWN_KEYS.has(candidateKey)) {
          flushMultiline();
          currentKey = candidateKey;
          if (match[2].trim().length > 0) {
            multilineBuffer.push(match[2].trim());
          } else {
            fields[currentKey] = '';
          }
        } else if (currentKey) {
          multilineBuffer.push(line.trim());
        }
      }
      flushMultiline();

      return fields;
    };

    const parsedBlocks = blocks
      .map(parseNewsBlock)
      .filter((f) => Object.keys(f).length > 0);
    if (parsedBlocks.length === 0) continue;

    const header = parsedBlocks[0];
    const fileSlug = filename.replace(/\.txt$/i, '');
    const id = (header.id ?? fileSlug).trim();
    const order = parseNumber(header.order ?? header.ordem, 999);
    const source = (header.source ?? header.fonte ?? '').trim();
    const headline = (
      header.headline ??
      header.manchete ??
      header.title ??
      header.titulo ??
      header['título'] ??
      ''
    ).trim();
    const byline = (header.byline ?? header.autor ?? '').trim();

    const sections = parsedBlocks
      .slice(1)
      .map((sec) => {
        const heading = (
          sec.heading ??
          sec.subtitulo ??
          sec['subtítulo'] ??
          ''
        ).trim();
        const rawBody =
          sec.text ??
          sec.texto ??
          sec.paragraphs ??
          sec.paragrafos ??
          sec['parágrafos'] ??
          sec.body ??
          '';
        const paragraphs = rawBody
          .split(/\n\s*\n/)
          .map((p) => p.replace(/\n+/g, ' ').trim())
          .filter(Boolean);
        return {
          heading,
          paragraphs,
        };
      })
      .filter((sec) => sec.paragraphs.length > 0);

    if (!headline && sections.length === 0) continue;

    entries.push({
      order,
      article: {
        id,
        source,
        headline,
        byline,
        sections,
      },
    });
  }

  return entries
    .sort((a, b) => a.order - b.order || a.article.id.localeCompare(b.article.id))
    .map((e) => e.article);
}

const JOURNAL_KNOWN_KEYS = new Set([
  'id',
  'chapter',
  'capitulo',
  'capítulo',
  'title',
  'titulo',
  'título',
  'date',
  'data',
  'mood',
  'humor',
  'body',
  'corpo',
  'texto',
  'text',
  'prefilledtext',
  'typedtext',
]);

function parseJournalFile(raw: string): Record<string, string> {
  const cleanedLines = raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'));

  const fields: Record<string, string> = {};
  let currentKey: string | null = null;

  for (const line of cleanedLines) {
    const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
    const candidateKey = match ? match[1].trim().toLowerCase() : '';
    if (match && JOURNAL_KNOWN_KEYS.has(candidateKey)) {
      currentKey = candidateKey;
      fields[currentKey] = match[2].trim();
    } else if (currentKey) {
      fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
    }
  }

  return fields;
}

function parseJournalAddendumsMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [filePath, raw] of Object.entries(journalTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (filename !== 'addendums.txt' && filename !== 'updates.txt') continue;
    const cleanedLines = raw
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('#'));

    const blocks = cleanedLines.join('\n').split(/^\s*---\s*$/m);
    for (const block of blocks) {
      const lines = block
        .split('\n')
        .map((l) => l.trimEnd())
        .filter((l) => l.trim().length > 0);
      if (lines.length === 0) continue;

      const fields: Record<string, string> = {};
      let currentKey: string | null = null;
      for (const line of lines) {
        const match = line.match(/^([A-Za-zÀ-ÿ0-9_ -]+?):\s*(.*)$/);
        const candidateKey = match ? match[1].trim().toLowerCase() : '';
        if (
          match &&
          (candidateKey === 'id' ||
            candidateKey === 'text' ||
            candidateKey === 'texto' ||
            candidateKey === 'body')
        ) {
          currentKey = candidateKey;
          fields[currentKey] = match[2].trim();
        } else if (currentKey) {
          fields[currentKey] = `${fields[currentKey]}\n${line.trim()}`.trim();
        }
      }
      const id = fields.id?.trim().toLowerCase();
      const text = fields.text ?? fields.texto ?? fields.body ?? '';
      if (id && text) {
        map.set(id, text);
      }
    }
  }
  return map;
}

export function loadJournalAddendumById(idKey: string): string | null {
  const map = parseJournalAddendumsMap();
  return map.get(idKey.trim().toLowerCase()) ?? null;
}

export function loadJournalByChapterList(): { chapter: number; entry: JournalEntry }[] {
  const list: { chapter: number; entry: JournalEntry }[] = [];

  for (const [filePath, raw] of Object.entries(journalTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (
      !filename ||
      filename === 'readme.txt' ||
      filename === 'addendums.txt' ||
      filename === 'updates.txt'
    )
      continue;

    const fields = parseJournalFile(raw);
    const chapterMatch =
      filename.match(/chapter(\d+)/i) ||
      (fields.chapter ? [null, fields.chapter] : null);
    const chapterNum = chapterMatch ? Number.parseInt(chapterMatch[1], 10) : 0;
    if (!chapterNum) continue;

    const id = fields.id || `j${chapterNum}`;
    const title =
      fields.title || fields.titulo || fields['título'] || `Day 0${chapterNum}`;
    const date = fields.date || fields.data || '';
    const mood = fields.mood || fields.humor || 'Focused';
    const body =
      fields.body || fields.corpo || fields.texto || fields.text || '';

    list.push({
      chapter: chapterNum,
      entry: {
        id,
        title,
        date,
        mood,
        body,
      },
    });
  }

  // Descending order so latest chapters appear first (e.g. 6 down to 1)
  return list.sort((a, b) => b.chapter - a.chapter);
}

export function loadJournalEntryById(idKey: string): JournalEntry | null {
  const targetId = idKey.trim().toLowerCase();
  for (const [filePath, raw] of Object.entries(journalTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt' || filename === 'addendums.txt')
      continue;

    const fields = parseJournalFile(raw);
    const chapterMatch = filename.match(/chapter(\d+)/i);
    const chapterNum = chapterMatch ? Number.parseInt(chapterMatch[1], 10) : 0;
    const fileId = (
      fields.id || (chapterNum ? `j${chapterNum}` : '')
    ).toLowerCase();

    if (fileId === targetId || filename.includes(targetId)) {
      return {
        id: fields.id || `j${chapterNum}`,
        title:
          fields.title ||
          fields.titulo ||
          fields['título'] ||
          `Day 0${chapterNum}`,
        date: fields.date || fields.data || '',
        mood: fields.mood || fields.humor || 'Focused',
        body:
          fields.body || fields.corpo || fields.texto || fields.text || '',
      };
    }
  }
  return null;
}

export function loadJournalScriptedIntro(
  idKey: string
): JournalScriptedIntro | null {
  const targetId = idKey.trim().toLowerCase();
  for (const [filePath, raw] of Object.entries(journalTextModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() ?? '';
    if (!filename || filename === 'readme.txt' || filename === 'addendums.txt')
      continue;

    const fields = parseJournalFile(raw);
    const chapterMatch = filename.match(/chapter(\d+)/i);
    const chapterNum = chapterMatch ? Number.parseInt(chapterMatch[1], 10) : 0;
    const fileId = (
      fields.id || (chapterNum ? `j${chapterNum}` : '')
    ).toLowerCase();

    if (fileId === targetId || filename.includes(targetId)) {
      const prefilledText = fields.prefilledtext ?? '';
      const typedText = fields.typedtext ?? '';
      if (!prefilledText && !typedText) return null;
      return {
        id: fields.id || `j${chapterNum}`,
        title:
          fields.title ||
          fields.titulo ||
          fields['título'] ||
          `Day 0${chapterNum}`,
        date: fields.date || fields.data || '',
        mood: fields.mood || fields.humor || 'Cautious',
        prefilledText,
        typedText,
      };
    }
  }
  return null;
}




