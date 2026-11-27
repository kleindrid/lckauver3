export type AppId =
  | 'photos'
  | 'mail'
  | 'weather'
  | 'calendar'
  | 'notes'
  | 'maps'
  | 'x'
  | 'camera'
  | 'clock'
  | 'journal'
  | 'instagram'
  | 'phone'
  | 'safari'
  | 'whatsapp'
  | 'dossiers'
  | 'recorder'
  | 'narrations';

export type LanguageMode = 'en' | 'pt';

export type WallpaperId =
  | 'seongnam-night'
  | 'aurora-wave'
  | 'midnight-indigo'
  | 'emerald-dusk';

export interface ChapterInfo {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  unlocked: boolean;
}

export interface ChapterTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface NewsArticle {
  id: string;
  source: string;
  headline: string;
  byline: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export interface SafariTab {
  id: string;
  kind: 'google' | 'article';
  title: string;
  articleId?: string;
  query?: string;
}

export interface PushNotification {
  id: string;
  app: 'whatsapp' | 'google' | 'emergency' | 'mail' | 'phone' | 'instagram';
  title: string;
  subtitle?: string;
  body: string;
  time: string;
  urgent?: boolean;
  targetApp: AppId;
  targetChatId?: string;
  targetArticleId?: string;
  targetDmAccountId?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'me' | 'them';
  senderName?: string;
  text: string;
  time: string;
  read?: boolean;
  attachment?: {
    type: 'dossier';
    title: string;
    subtitle: string;
  };
}

export interface ScriptedChatStep {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  delayMs?: number;
}

export interface WhatsAppChat {
  id: string;
  name: string;
  subtitle: string;
  number: string;
  lastTime: string;
  unread: number;
  messages: WhatsAppMessage[];
  script?: ScriptedChatStep[];
  scriptIndex?: number;
  isTyping?: boolean;
  avatarUrl?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  date: string;
  location: string;
  palette: [string, string, string];
  dataUrl?: string;
  favorite: boolean;
  caption: string;
  source?: 'camera' | 'gallery' | 'system';
  folder?: string;
}

export interface MailItem {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  audioAttachment?: VoiceRecordingItem;
  quickReplyLabel?: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  time: string;
  location: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  date: string;
  mood: string;
}

export interface JournalScriptedIntro {
  id: string;
  title: string;
  mood: string;
  date: string;
  prefilledText: string;
  typedText: string;
}

export interface MailScriptedCompose {
  id: string;
  to: string;
  subject: string;
  body: string;
  time: string;
}

export interface IgActivityAlert {
  id: string;
  accountId: string;
  text: string;
  time: string;
  postId?: string;
}

export interface DirectMessageItem {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface DirectMessageThread {
  id: string;
  accountId: string;
  platform: 'x' | 'instagram';
  unread: number;
  chapters?: number[];
  messages: DirectMessageItem[];
  script?: ScriptedChatStep[];
  scriptIndex?: number;
  isTyping?: boolean;
}

export interface WeatherCity {
  id: string;
  name: string;
  tempC: number;
  condition: string;
  highC: number;
  lowC: number;
  hourly: { time: string; tempC: number; icon: 'sun' | 'cloud' | 'rain' }[];
}

export interface CharacterAccount {
  id: string;
  name: string;
  xHandle: string;
  igHandle: string;
  bio: string;
  followers: string;
  following: string;
  verified?: boolean;
  avatarPalette: [string, string];
  avatarUrl?: string;
}

export interface PostComment {
  id: string;
  accountId: string;
  author: string;
  handle: string;
  time: string;
  text: string;
  createdChapter?: number;
}

export interface SocialPost {
  id: string;
  accountId: string;
  author: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  reposts: number;
  reposted: boolean;
  bookmarked?: boolean;
  community?: 'university';
  badge?: string;
  comments?: PostComment[];
  chapters?: number[];
  createdChapter?: number;
  imageUrl?: string;
}

export interface IgPost {
  id: string;
  accountId: string;
  user: string;
  location: string;
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  palette: [string, string, string];
  time: string;
  comments?: PostComment[];
  chapters?: number[];
  createdChapter?: number;
  imageUrl?: string;
}

export interface IgStoryItem {
  id: string;
  accountId: string;
  imageUrl?: string;
  caption: string;
  taggedHandle?: string;
  taggedAccountId?: string;
  location?: string;
  time: string;
  seen?: boolean;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export interface CallScriptLine {
  id: string;
  speaker: string;
  text: string;
  atSeconds: number;
  kind?: 'dialogue' | 'thought' | 'system';
}

export interface ActiveCall {
  id?: string;
  name: string;
  subtitle?: string;
  number: string;
  status: 'Incoming...' | 'Calling...' | 'Connected' | 'Call Dropped';
  startedAt: number;
  lines?: CallScriptLine[];
  durationSeconds?: number;
}

export interface CallLogItem {
  id: string;
  name: string;
  subtitle?: string;
  number: string;
  status: 'Incoming' | 'Outgoing' | 'Missed' | 'Call Dropped';
  time: string;
  dateLabel: string;
  durationLabel?: string;
  lines?: CallScriptLine[];
}

export type CharacterVitalStatus = 'alive' | 'dead' | 'missing' | 'detained';

export interface CharacterDossierUpdate {
  id: string;
  title: string;
  text: string;
  chapters?: number[];
  exactChapters?: number[];
  ifDead?: string[];
  ifAlive?: string[];
  time?: string;
}

export interface CharacterDossier {
  id: string;
  name: string;
  age: string;
  role: string;
  residence: string;
  attendedParty: boolean;
  status: CharacterVitalStatus;
  deadFromChapter?: number;
  alibi: string;
  interrogationSummary: string;
  detectiveNotes: string;
  avatarUrl?: string;
  updates: CharacterDossierUpdate[];
}

export interface VoiceRecordingLine {
  id: string;
  speaker: string;
  text: string;
  atSeconds: number;
}

export interface VoiceRecordingItem {
  id: string;
  title: string;
  date: string;
  durationSeconds: number;
  lines: VoiceRecordingLine[];
}

export interface BlackScreenSubtitleBeat {
  id: string;
  kind: 'narration' | 'dialogue';
  speaker?: string;
  text: string;
}

export interface NarrationMemoItem {
  id: string;
  chapter: number;
  title: string;
  location: string;
  dateTime: string;
  summary: string;
  beats: BlackScreenSubtitleBeat[];
}
