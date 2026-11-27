import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'motion/react';
import { AlertTriangle, ChevronLeft, Globe, Heart, Instagram, Mail, MessageCircle, Mic, Newspaper, Phone, RotateCcw, Search, Smartphone, X } from 'lucide-react';
import {
  ActiveCall,
  AlarmItem,
  AppId,
  CalendarEvent,
  CallLogItem,
  ChapterInfo,
  ChapterTask,
  DirectMessageThread,
  IgPost,
  JournalEntry,
  LanguageMode,
  MailItem,
  MailScriptedCompose,
  NarrationMemoItem,
  NoteItem,
  PhotoItem,
  PushNotification,
  SafariTab,
  ScriptedChatStep,
  SocialPost,
  VoiceRecordingItem,
  WallpaperId,
  WeatherCity,
  WhatsAppChat,
  WhatsAppMessage,
} from './types/phone';
import {
  CH4_NEW_OFFICER_MAIL,
  CH5_BISTRO_RECORDING_SCRIPT,
  CH5_INSPECTOR_CALL_SCRIPT,
  CH5_INSPECTOR_WANGHO_MAIL,
  CH5_JIHOON_DINNER_STORY,
  CH5_JOURNAL_SCRIPT,
  CH6_BABY_CASE_SAFARI_ADDENDUM,
  CH6_BABY_CASE_WANGHO_ADDENDUM,
  CH6_HYUNJUN_MINSEOK_ADDRESS_SCRIPT,
  CH6_INSPECTOR_BROTHER_MAIL_SCRIPT,
  CH6_INSPECTOR_KANG_REPLY_MAIL,
  CH6_JOURNAL_AFTER_KANG_HYUNJUN_ADDENDUM,
  CH6_JOURNAL_AFTER_KYU_ADDENDUM,
  CH6_JOURNAL_AFTER_SAFARI_ADDENDUM,
  CH6_JOURNAL_AFTER_WANGHO_ADDENDUM,
  CH6_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM,
  CH6_KYU_DOORSTEP_NARRATION_MEMO,
  CH6_KYU_DOORSTEP_SUBTITLES,
  CH6_MINSEOK_IG_DM_INTRO_SCRIPT,
  CH6_NOTE_AFTER_KANG_HYUNJUN_ADDENDUM,
  CH6_SIWOO_GAS_STORY,
  CH6_WANGHO_NIGHT_SCRIPT,
  CH7_HOSPITAL_NARRATION_MEMO,
  CH7_HOSPITAL_POCKET_NOTE,
  CH7_HOSPITAL_SUBTITLES,
  CH7_JOURNAL_AFTER_HOSPITAL_ADDENDUM,
  CH7_JOURNAL_AFTER_KANG_NIGHT_ADDENDUM,
  CH7_JOURNAL_AFTER_KANG_REPORT_ADDENDUM,
  CH7_JOURNAL_AFTER_MINSEOK_DM_ADDENDUM,
  CH7_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM,
  CH7_JOURNAL_AFTER_WANGHO_URGENT_ADDENDUM,
  CH7_JOURNAL_ENTRY,
  CH7_KANG_CLASS_CHECK_MAIL,
  CH7_KANG_MINSEOK_AUDIO_MAIL,
  CH7_KANG_NIGHT_SUMMONS_MAIL,
  CH7_KANG_REPORT_MAIL_SCRIPT,
  CH7_MINSEOK_IG_DM_OPENING,
  CH7_MINSEOK_IG_DM_SCRIPT,
  CH7_MINSEOK_STATEMENT_RECORDING,
  CH7_SANGHYEOK_CLASS_REPLY_SCRIPT,
  CH7_WANGHO_NIGHT_OPENING,
  CH7_WANGHO_NIGHT_SCRIPT,
  CH7_WANGHO_URGENT_OPENING,
  CH7_WANGHO_URGENT_SCRIPT,
  CHAPTERS,
  CHARACTER_ACCOUNTS,
  getCallLogsForChapter,
  getChatsForChapter,
  getDossiersForState,
  getJournalForChapter,
  getNotesForChapter,
  getTriggeredChatForChapter,
  INITIAL_ALARMS,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_EVENTS,
  INITIAL_IG_POSTS,
  INITIAL_JOURNAL,
  INITIAL_MAILS,
  INITIAL_NOTES,
  INITIAL_PHOTOS,
  INITIAL_TWEETS,
  INITIAL_WHATSAPP_CHATS,
  LIVING_ROOM_RECORDING_SCRIPT,
  LOADED_GALLERY_PHOTOS,
  NEWS_ARTICLES,
} from './data/initialData';
import {
  formatPostRelativeDay,
  getPostRelativeSortMinutes,
} from './data/contentLoader';
import { ChapterSelectScreen } from './components/ChapterSelectScreen';
import { Wallpaper } from './components/Wallpaper';
import { StatusBar } from './components/StatusBar';
import { LockScreen } from './components/LockScreen';
import { HomeScreen } from './components/HomeScreen';
import { SpotlightSearch } from './components/SpotlightSearch';
import { ControlCenter } from './components/ControlCenter';
import { WhatsAppApp } from './components/apps/WhatsAppApp';
import { DossiersApp } from './components/apps/DossiersApp';
import { NarrationsApp } from './components/apps/NarrationsApp';
import { VoiceMemosApp } from './components/apps/VoiceMemosApp';
import {
  CalendarApp,
  CameraApp,
  ClockApp,
  MailApp,
  MapsApp,
  NotesApp,
  PhotosApp,
  WeatherApp,
} from './components/apps/UtilityApps';
import {
  InstagramApp,
  JournalApp,
  PhoneApp,
  SafariApp,
  XApp,
} from './components/apps/SocialAndDockApps';

const CHIEF_INITIAL_NOTIFICATION: PushNotification = {
  id: 'notif-chief-1',
  app: 'whatsapp',
  title: 'Chief Lieutenant',
  body: 'Sanghyeok, any leads from the dorm yet?',
  time: '04:00',
  targetApp: 'whatsapp',
  targetChatId: 'tenente',
};

const GOOGLE_BREAKING_NOTIFICATION: PushNotification = {
  id: 'notif-google-arson',
  app: 'google',
  title: 'Google · Breaking News',
  body: 'New report: Elderly woman found burned alive in vehicle in Gyeong-gwan.',
  time: '04:01',
  targetApp: 'safari',
  targetArticleId: 'burned-vehicle',
};

function createEmergencyBroadcastNotification(
  articleId: string,
  time: string
): PushNotification {
  const article = NEWS_ARTICLES.find((a) => a.id === articleId);
  const isInitialCase = articleId === 'allstar-2008';

  return {
    id: `notif-emergency-${articleId}`,
    app: 'emergency',
    urgent: true,
    title: 'Emergency Broadcast',
    subtitle: 'Gyeong-gwan Police Department',
    body: isInitialCase
      ? 'City-wide alert: Following the AllStar homicides and theft of 2008 evidence, residents are urged to keep doors locked and report any suspicious activity immediately.'
      : `URGENT WARNING: Another fatal murder confirmed in Gyeong-gwan${
          article ? ` (${article.headline.split(':')[0]})` : ''
        }. A serial offender is active—lock all doors and avoid traveling alone.`,
    time,
    targetApp: 'safari',
    targetArticleId: articleId,
  };
}

const INITIAL_EMERGENCY_NOTIFICATION = createEmergencyBroadcastNotification(
  'allstar-2008',
  '04:00'
);

const HYUNJUN_DAY2_NOTIFICATION: PushNotification = {
  id: 'notif-hyunjun-day2',
  app: 'whatsapp',
  title: 'Hyunjun',
  body: 'Hey Sanghyeok, sorry to bother you. Did you leave for the grocery market already?',
  time: '09:15',
  targetApp: 'whatsapp',
  targetChatId: 'hyunjun',
};

const DORM_GROUP_PARTY_NOTIFICATION: PushNotification = {
  id: 'notif-dorm-group-party',
  app: 'whatsapp',
  title: 'Dorm 304 (Group)',
  body: "Hyunjun: Everyone's going to Dohyeon's party tonight—it'll be crowded, so it's actually safer than staying here.",
  time: '17:06',
  targetApp: 'whatsapp',
  targetChatId: 'republica',
};

const MINHYUNG_PRIVATE_NOTIFICATION: PushNotification = {
  id: 'notif-minhyung-confrontation',
  app: 'whatsapp',
  title: 'Lee Minhyung',
  body: "Why have you been investigating me? I saw what you've been writing down.",
  time: '17:08',
  targetApp: 'whatsapp',
  targetChatId: 'minhyung',
};

const MINHYUNG_NEWS_NOTIFICATION: PushNotification = {
  id: 'notif-google-minhyung-ch3',
  app: 'google',
  title: 'Google · Breaking News',
  body: "Young student Lee Minhyung found lifeless in the woods near Dohyeon's residence.",
  time: '10:15',
  targetApp: 'safari',
  targetArticleId: 'minhyung-murder',
};

const CHIEF_MINHYUNG_SUMMONS_NOTIFICATION: PushNotification = {
  id: 'notif-chief-minhyung-ch3',
  app: 'whatsapp',
  title: 'Chief Lieutenant',
  body: "Sanghyeok, you saw the report on Lee Minhyung. We're questioning everyone from Dohyeon's party today.",
  time: '10:22',
  targetApp: 'whatsapp',
  targetChatId: 'tenente',
};

const CHIEF_DOSSIERS_FILE_NOTIFICATION: PushNotification = {
  id: 'notif-chief-dossiers-ch3',
  app: 'whatsapp',
  title: 'Chief Lieutenant',
  body: 'Precinct_Interrogation_Dossiers.pdf — Permanent Case Files added to your phone.',
  time: '20:45',
  targetApp: 'dossiers',
};

const CHIEF_VIDEOS_NOTIFICATION: PushNotification = {
  id: 'notif-chief-videos-ch3',
  app: 'whatsapp',
  title: 'Chief Lieutenant',
  body: "Dohyeon just turned over raw party video files and Lee Minhyung's phone.",
  time: '21:05',
  targetApp: 'whatsapp',
  targetChatId: 'tenente',
};

const CH4_CHIEF_NEWS_NOTIFICATION: PushNotification = {
  id: 'notif-google-chief-ch4',
  app: 'google',
  title: 'Google · Breaking News',
  body: 'Police Chief Lieutenant and his wife found murdered at home; all electronics destroyed.',
  time: '08:30',
  targetApp: 'safari',
  targetArticleId: 'chief-murder',
};

const CH4_DORM_GROUP_NOTIFICATION: PushNotification = {
  id: 'notif-ch4-dorm-group',
  app: 'whatsapp',
  title: 'Dorm 304 (Group)',
  body: "Hyunjun: I can't take this anymore. I'm serious this time—I have to get out of here today.",
  time: '08:42',
  targetApp: 'whatsapp',
  targetChatId: 'republica',
};

const CH4_HYUNJUN_PRIVATE_NOTIFICATION: PushNotification = {
  id: 'notif-ch4-hyunjun-private',
  app: 'whatsapp',
  title: 'Talk to Hyunjun Privately',
  body: 'Hyunjun is packing to leave. Ask him in WhatsApp if he suspects anyone.',
  time: '08:45',
  targetApp: 'whatsapp',
  targetChatId: 'hyunjun',
};

const CH4_UNKNOWN_NUMBER_NOTIFICATION: PushNotification = {
  id: 'notif-ch4-unknown-number',
  app: 'whatsapp',
  title: 'Unknown Number',
  body: "I saw what you've been writing in that notebook, Lee Sanghyeok. Keep digging and you'll end up just like your lieutenant.",
  time: '14:15',
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH4_NEW_OFFICER_MAIL_NOTIFICATION: PushNotification = {
  id: 'notif-ch4-new-officer-mail',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: 'Case Handover: Task Force Reassignment',
  body: 'I have been assigned to take over the case effective immediately. Read encrypted instructions.',
  time: '14:16',
  targetApp: 'mail',
};

const CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION: PushNotification = {
  id: 'notif-ch5-wangho-mail',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: 'Protected Contact: Han Wangho',
  body: 'The unknown number who messaged you is almost certainly my trusted protégé, Han Wangho. Read immediately.',
  time: '16:40',
  targetApp: 'mail',
};

const CH5_UNKNOWN_BISTRO_NOTIFICATION: PushNotification = {
  id: 'notif-ch5-unknown-bistro',
  app: 'whatsapp',
  title: 'Unknown Number',
  body: "Did you think it over? We shouldn't talk here for long—can you meet tonight?",
  time: '16:42',
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH5_WANGHO_WOOJE_NOTIFICATION: PushNotification = {
  id: 'notif-ch5-wangho-wooje',
  app: 'whatsapp',
  title: 'Han Wangho',
  body: "Sorry for taking so long to reply, I just got back to my place. That was Wooje—we're close friends, don't worry.",
  time: '23:10',
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH6_MISSED_CALL_NOTIFICATION: PushNotification = {
  id: 'notif-ch6-missed-call',
  app: 'phone',
  title: 'Missed Call · Inspector Kang Minhyeok',
  body: 'Incoming precinct call. Tap to pick up and listen.',
  time: '08:15',
  targetApp: 'phone',
};

const CH6_HYUNJUN_MORNING_NOTIFICATION: PushNotification = {
  id: 'notif-ch6-hyunjun-morning',
  app: 'whatsapp',
  title: 'Hyunjun',
  body: 'Hey Sanghyeok, sorry to bother you this early. Have you noticed Moon has been skipping all his university classes lately?',
  time: '08:22',
  targetApp: 'whatsapp',
  targetChatId: 'hyunjun',
};

const CH6_WANGHO_GEUMJAE_NOTIFICATION: PushNotification = {
  id: 'notif-ch6-wangho-geumjae',
  app: 'whatsapp',
  title: 'Han Wangho',
  body: 'Sanghyeok, do you have a minute? Something just happened.',
  time: '10:45',
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH6_INSPECTOR_KANG_REPLY_NOTIFICATION: PushNotification = {
  id: 'notif-ch6-kang-reply',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: "Re: Secret Records on Wangho's Lost Brother",
  body: "No confidential info beyond what's published. That woman was filing a restraining order because Wangho kept following her family asking for a DNA test.",
  time: '15:10',
  targetApp: 'mail',
};

const CH7_KANG_CLASS_CHECK_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-kang-class',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: 'Urgent — Are you in class right now?',
  body: 'Are you in class right now?',
  time: '10:00',
  urgent: true,
  targetApp: 'mail',
};

const CH7_KANG_MINSEOK_AUDIO_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-kang-audio',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: "Voice File: Ryu Minseok's Official Statement",
  body: 'Encrypted audio file attached. Tap to open Mail and listen to Minseok’s statement.',
  time: '10:02',
  urgent: true,
  targetApp: 'mail',
};

const CH7_HYUNJUN_LUNCH_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-hyunjun-lunch',
  app: 'whatsapp',
  title: 'Hyunjun',
  body: 'Hey Sanghyeok, want to grab lunch together once class lets out?',
  time: '10:07',
  targetApp: 'whatsapp',
  targetChatId: 'hyunjun',
};

const CH7_WANGHO_URGENT_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-wangho-urgent',
  app: 'whatsapp',
  title: 'Han Wangho',
  body: 'Geumjae just showed up here at my house. He agreed to take the DNA test, but it has to be kept hidden from his mother.',
  time: '16:14',
  urgent: true,
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH7_WANGHO_NIGHT_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-wangho-night',
  app: 'whatsapp',
  title: 'Han Wangho',
  body: 'Made it back safely, hyung. Just wanted to thank you again for coming down to the hospital and waiting there with me.',
  time: '19:45',
  targetApp: 'whatsapp',
  targetChatId: 'unknown',
};

const CH7_KANG_NIGHT_SUMMONS_NOTIFICATION: PushNotification = {
  id: 'notif-ch7-kang-night-summons',
  app: 'mail',
  title: 'Mail · Inspector Kang Minhyeok',
  subtitle: 'CONFIDENTIAL — Precinct Meet Tonight',
  body: "We pulled the McDonald's & nearby CCTV—suspect movement caught. An escort will pick you up tonight.",
  time: '19:56',
  urgent: true,
  targetApp: 'mail',
};

const INITIAL_SAFARI_TABS: SafariTab[] = [
  {
    id: 'tab-allstar',
    kind: 'article',
    title: 'AllStar Murders (2026)',
    articleId: 'allstar-2008',
  },
  {
    id: 'tab-archive-2008',
    kind: 'article',
    title: '2008 Archive Report',
    articleId: 'archive-2008',
  },
];

function getArticleTabTitle(articleId: string): string {
  if (articleId === 'allstar-2008') return 'AllStar Murders (2026)';
  if (articleId === 'archive-2008') return '2008 Archive Report';
  if (articleId === 'burned-vehicle') return 'Gyeong-gwan Arson';
  if (articleId === 'minhyung-murder') return 'Student Found Dead';
  if (articleId === 'chief-murder') return 'Lieutenant Murdered';
  if (articleId === 'missing-baby-2008-case') return 'Missing Case #GG-0814';
  if (articleId === 'unregistered-adoption-2008') return '2008 Cold Case Thread';
  if (articleId === 'ggpd-2008-evidence-report') return 'GGPD Report #GG-0814-B';
  if (articleId === 'seongnam-hospital-audit-2008') return '2009 Birth Audit Report';
  if (articleId === 'univ-campus-safety-report') return 'GGU Campus Safety';
  return 'Gyeong-gwan Herald';
}

function timeToMinutes(hhmm: string): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return -1;
  return Number.parseInt(m[1], 10) * 60 + Number.parseInt(m[2], 10);
}

export default function App() {
  // Chapters & selection (null = Main Screen)
  const [chapters, setChapters] = useState<ChapterInfo[]>(CHAPTERS);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // Core Phone OS state
  const [isLocked, setIsLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [igStoryOpen, setIgStoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageMode>('en');
  const [wallpaper, setWallpaper] = useState<WallpaperId>('seongnam-night');
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [brightness, setBrightness] = useState(100);

  // Narrative & Notification States
  const [exploredApps, setExploredApps] = useState<Set<AppId>>(() => new Set());
  const [postedNewsIds, setPostedNewsIds] = useState<string[]>(['allstar-2008']);
  const dispatchedNewsIdsRef = useRef<Set<string>>(new Set(['allstar-2008']));
  const replyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatReplyTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(
    new Map()
  );
  const transitionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ch4AfterXTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ch5MailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ch5FollowupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ch5NightTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ch6MorningTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearChatReplyTimers = (chatId?: string) => {
    if (chatId) {
      const timers = chatReplyTimersRef.current.get(chatId) ?? [];
      timers.forEach((id) => clearTimeout(id));
      chatReplyTimersRef.current.delete(chatId);
      return;
    }
    chatReplyTimersRef.current.forEach((timers) => {
      timers.forEach((id) => clearTimeout(id));
    });
    chatReplyTimersRef.current.clear();
  };

  const clearReplyTimers = () => {
    replyTimersRef.current.forEach((id) => clearTimeout(id));
    replyTimersRef.current = [];
    clearChatReplyTimers();
  };

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach((id) => clearTimeout(id));
    transitionTimersRef.current = [];
  };

  const clearCh4AfterXTimers = () => {
    ch4AfterXTimersRef.current.forEach((id) => clearTimeout(id));
    ch4AfterXTimersRef.current = [];
  };

  const clearCh5MailTimer = () => {
    if (ch5MailTimerRef.current) {
      clearTimeout(ch5MailTimerRef.current);
      ch5MailTimerRef.current = null;
    }
    if (ch5FollowupTimerRef.current) {
      clearTimeout(ch5FollowupTimerRef.current);
      ch5FollowupTimerRef.current = null;
    }
  };

  const clearCh5NightTimers = () => {
    ch5NightTimersRef.current.forEach((id) => clearTimeout(id));
    ch5NightTimersRef.current = [];
  };

  const ch6KangReplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ch7TimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dmReplyTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(
    new Map()
  );

  const clearCh6MorningTimers = () => {
    ch6MorningTimersRef.current.forEach((id) => clearTimeout(id));
    ch6MorningTimersRef.current = [];
  };

  const clearCh6KangReplyTimer = () => {
    if (ch6KangReplyTimerRef.current) {
      clearTimeout(ch6KangReplyTimerRef.current);
      ch6KangReplyTimerRef.current = null;
    }
  };

  const clearCh7Timers = () => {
    ch7TimersRef.current.forEach((id) => clearTimeout(id));
    ch7TimersRef.current = [];
  };

  const clearDmReplyTimers = (key?: string) => {
    if (key) {
      const list = dmReplyTimersRef.current.get(key);
      if (list) {
        list.forEach((id) => clearTimeout(id));
        dmReplyTimersRef.current.delete(key);
      }
      return;
    }
    dmReplyTimersRef.current.forEach((list) =>
      list.forEach((id) => clearTimeout(id))
    );
    dmReplyTimersRef.current.clear();
  };

  useEffect(() => {
    return () => {
      clearReplyTimers();
      clearTransitionTimers();
      clearCh4AfterXTimers();
      clearCh5MailTimer();
      clearCh5NightTimers();
      clearCh6MorningTimers();
      clearCh6KangReplyTimer();
      clearDmReplyTimers();
    };
  }, []);

  const [chapterPromptOpen, setChapterPromptOpen] = useState(false);
  const [dismissedPromptChapters, setDismissedPromptChapters] = useState<number[]>([]);
  const [skipChapterHintOpen, setSkipChapterHintOpen] = useState(false);
  const [dormPartyDispatched, setDormPartyDispatched] = useState(false);
  const [readDormGroupCh2, setReadDormGroupCh2] = useState(false);
  const [minhyungDispatched, setMinhyungDispatched] = useState(false);
  const ch2EveningStartedRef = useRef(false);

  // Chapter 3 & Death-State Tracking
  const [deadCharacters, setDeadCharacters] = useState<string[]>([]);
  const [missingCharacters, setMissingCharacters] = useState<string[]>([]);
  const [activeTriggers, setActiveTriggers] = useState<string[]>([]);
  const [dossiersUnlocked, setDossiersUnlocked] = useState(false);
  const [ch3NewsPopupOpen, setCh3NewsPopupOpen] = useState(false);
  const [ch3ChiefTriggered, setCh3ChiefTriggered] = useState(false);
  const [nightTransition, setNightTransition] = useState(false);
  const [checkedDossierInCh3, setCheckedDossierInCh3] = useState(false);
  const [livingRoomThoughtOpen, setLivingRoomThoughtOpen] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecordingItem[]>([]);
  const [autoStartLivingRoomRecording, setAutoStartLivingRoomRecording] = useState(false);
  const [capturedLivingRoomRecording, setCapturedLivingRoomRecording] = useState(false);
  const [ch3VideosChiefTriggered, setCh3VideosChiefTriggered] = useState(false);
  const ch3PopupShownRef = useRef(false);
  const ch3ChiefTriggeredRef = useRef(false);
  const nightTransitionTriggeredRef = useRef(false);
  const livingRoomThoughtShownRef = useRef(false);
  const ch3VideosTriggeredRef = useRef(false);
  const prevActiveAppRef = useRef<AppId | null>(null);

  // Chapter 4 States & Refs
  const [ch4NewsPopupOpen, setCh4NewsPopupOpen] = useState(false);
  const [ch4NewsRead, setCh4NewsRead] = useState(false);
  const [ch4DormGroupDispatched, setCh4DormGroupDispatched] = useState(false);
  const [readDormGroupCh4, setReadDormGroupCh4] = useState(false);
  const [ch4HyunjunDispatched, setCh4HyunjunDispatched] = useState(false);
  const [ch4ClueRevealed, setCh4ClueRevealed] = useState(false);
  const [inspectedSiwooX, setInspectedSiwooX] = useState(false);
  const [inspectedSiwooIg, setInspectedSiwooIg] = useState(false);
  const [inspectedMinseokX, setInspectedMinseokX] = useState(false);
  const [inspectedMinseokIg, setInspectedMinseokIg] = useState(false);
  const [ch4BlackFadeTransition, setCh4BlackFadeTransition] = useState(false);
  const [ch4UnknownAndMailDispatched, setCh4UnknownAndMailDispatched] = useState(false);
  const [readUnknownChatCh4, setReadUnknownChatCh4] = useState(false);
  const [readNewOfficerMailCh4, setReadNewOfficerMailCh4] = useState(false);
  const ch4PopupShownRef = useRef(false);
  const ch4GroupDispatchedRef = useRef(false);
  const ch4HyunjunDispatchedRef = useRef(false);
  const ch4AfterXStartedRef = useRef(false);
  const ch4ToCh5TriggeredRef = useRef(false);

  // Chapter 5 States
  const [ch5JournalCompleted, setCh5JournalCompleted] = useState(false);
  const [ch5InspectorMailDispatched, setCh5InspectorMailDispatched] = useState(false);
  const [ch5InspectorMailRead, setCh5InspectorMailRead] = useState(false);
  const [ch5UnknownFollowupDispatched, setCh5UnknownFollowupDispatched] = useState(false);
  const ch5UnknownFollowupRef = useRef(false);
  const [ch5NightTransition, setCh5NightTransition] = useState(false);
  const [autoStartCh5BistroRecording, setAutoStartCh5BistroRecording] = useState(false);
  const [capturedCh5BistroRecording, setCapturedCh5BistroRecording] = useState(false);
  const ch5NightTransitionTriggeredRef = useRef(false);
  const [ch5LateNightTransition, setCh5LateNightTransition] = useState(false);
  const [ch5LateNightDispatched, setCh5LateNightDispatched] = useState(false);
  const [ch5CheckedX, setCh5CheckedX] = useState(false);
  const [ch5ViewedJihoonStory, setCh5ViewedJihoonStory] = useState(false);
  const [ch5WanghoWoojeReplied, setCh5WanghoWoojeReplied] = useState(false);
  const [ch5ReadWoojeReply, setCh5ReadWoojeReply] = useState(false);
  const ch5LateNightTriggeredRef = useRef(false);
  const ch5WoojeReplyTriggeredRef = useRef(false);
  const ch5ToCh6TriggeredRef = useRef(false);

  // Chapter 6 States
  const [ch6MorningDispatched, setCh6MorningDispatched] = useState(false);
  const [ch6MorningCallCompleted, setCh6MorningCallCompleted] = useState(false);
  const [ch6HyunjunMorningDispatched, setCh6HyunjunMorningDispatched] = useState(false);
  const [ch6WanghoThoughtOpen, setCh6WanghoThoughtOpen] = useState(false);
  const [ch6CheckedWanghoSocial, setCh6CheckedWanghoSocial] = useState(false);
  const [ch6WanghoFadeTransition, setCh6WanghoFadeTransition] = useState(false);
  const [ch6WanghoMessageDispatched, setCh6WanghoMessageDispatched] = useState(false);
  const [ch6BabyCaseThoughtOpen, setCh6BabyCaseThoughtOpen] = useState(false);
  const [ch6SearchedMissingBaby, setCh6SearchedMissingBaby] = useState(false);
  const [ch6ReadMissingBabyNews, setCh6ReadMissingBabyNews] = useState(false);
  const [ch6GeumjaeThoughtOpen, setCh6GeumjaeThoughtOpen] = useState(false);
  const [ch6CheckedGeumjaeX, setCh6CheckedGeumjaeX] = useState(false);
  const [ch6CheckedGeumjaeIg, setCh6CheckedGeumjaeIg] = useState(false);
  const ch6CheckedGeumjaeSocial = ch6CheckedGeumjaeX && ch6CheckedGeumjaeIg;
  const [ch6AfterGeumjaeFadeTransition, setCh6AfterGeumjaeFadeTransition] = useState(false);
  const [ch6MailComposePending, setCh6MailComposePending] = useState(false);
  const [ch6SentInspectorMail, setCh6SentInspectorMail] = useState(false);
  const [ch6MinseokThoughtOpen, setCh6MinseokThoughtOpen] = useState(false);
  const [ch6MinseokLikedTwo, setCh6MinseokLikedTwo] = useState(false);
  const [ch6MinseokDmThoughtOpen, setCh6MinseokDmThoughtOpen] = useState(false);
  const [ch6KangReplyDispatched, setCh6KangReplyDispatched] = useState(false);
  const [ch6KangReplyRead, setCh6KangReplyRead] = useState(false);
  const [ch6MinseokVisitFadeTransition, setCh6MinseokVisitFadeTransition] =
    useState(false);
  const [ch6HyunjunMinseokDispatched, setCh6HyunjunMinseokDispatched] =
    useState(false);
  const [ch6KyuDoorstepPhase, setCh6KyuDoorstepPhase] = useState<
    'intro' | 'subtitles' | null
  >(null);
  const [ch6KyuDoorstepStep, setCh6KyuDoorstepStep] = useState(0);
  const [ch6KyuDoorstepCompleted, setCh6KyuDoorstepCompleted] = useState(false);
  const [ch6NightWanghoFadeTransition, setCh6NightWanghoFadeTransition] =
    useState(false);
  const [ch6NightWanghoDispatched, setCh6NightWanghoDispatched] =
    useState(false);
  const [ch6EndOverlayOpen, setCh6EndOverlayOpen] = useState(false);
  const [igInitialDmAccountId, setIgInitialDmAccountId] = useState<string | null>(null);
  const [activeIgDmAccountId, setActiveIgDmAccountId] = useState<string | null>(null);
  const ch6CallTriggeredRef = useRef(false);
  const ch6HyunjunMorningTriggeredRef = useRef(false);
  const ch6WanghoThoughtShownRef = useRef(false);
  const ch6WanghoFadeTriggeredRef = useRef(false);
  const ch6BabyCaseThoughtShownRef = useRef(false);
  const ch6GeumjaeThoughtShownRef = useRef(false);
  const ch6AfterGeumjaeFadeTriggeredRef = useRef(false);
  const ch6MinseokThoughtShownRef = useRef(false);
  const ch6MinseokDmThoughtShownRef = useRef(false);
  const ch6KangReplyTriggeredRef = useRef(false);
  const ch6MinseokVisitFadeTriggeredRef = useRef(false);
  const ch6KyuDoorstepTriggeredRef = useRef(false);
  const ch6NightWanghoFadeTriggeredRef = useRef(false);
  const ch6EndTriggeredRef = useRef(false);

  // Chapter 7 States
  const [ch7KangClassMailDispatched, setCh7KangClassMailDispatched] = useState(false);
  const [ch7KangClassMailRead, setCh7KangClassMailRead] = useState(false);
  const [ch7ClassReplyPending, setCh7ClassReplyPending] = useState(false);
  const [ch7ClassReplySent, setCh7ClassReplySent] = useState(false);
  const [ch7MinseokAudioMailDispatched, setCh7MinseokAudioMailDispatched] =
    useState(false);
  const [ch7MinseokStatementHeard, setCh7MinseokStatementHeard] = useState(false);
  const [recorderInitialRecordingId, setRecorderInitialRecordingId] = useState<string | null>(
    null
  );
  const [recorderAutoPlayInitial, setRecorderAutoPlayInitial] = useState(false);
  const [recorderSavedNoticeId, setRecorderSavedNoticeId] = useState<string | null>(null);
  const [ch6ViewedSiwooStory, setCh6ViewedSiwooStory] = useState(false);
  const [ch7HyunjunLunchDispatched, setCh7HyunjunLunchDispatched] = useState(false);
  const [ch7AfterHyunjunThoughtOpen, setCh7AfterHyunjunThoughtOpen] = useState(false);
  const [ch7CheckedKyuX, setCh7CheckedKyuX] = useState(false);
  const [ch7CheckedJihoonX, setCh7CheckedJihoonX] = useState(false);
  const [ch7ViewedJihoonStory, setCh7ViewedJihoonStory] = useState(false);
  const [ch7ViewedSiwooStory, setCh7ViewedSiwooStory] = useState(false);
  const ch7CheckedX =
    ch7CheckedKyuX &&
    ch7CheckedJihoonX &&
    ch7ViewedJihoonStory &&
    ch7ViewedSiwooStory;
  const [ch7MinseokDmFadeTransition, setCh7MinseokDmFadeTransition] = useState(false);
  const [ch7MinseokDmDispatched, setCh7MinseokDmDispatched] = useState(false);
  const [ch7KangReportThoughtOpen, setCh7KangReportThoughtOpen] = useState(false);
  const [ch7KangReportMailPending, setCh7KangReportMailPending] = useState(false);
  const [ch7KangReportMailSent, setCh7KangReportMailSent] = useState(false);
  const [ch7WanghoUrgentDispatched, setCh7WanghoUrgentDispatched] = useState(false);
  const [ch7HospitalScenePhase, setCh7HospitalScenePhase] = useState<
    'intro' | 'subtitles' | null
  >(null);
  const [ch7HospitalSceneStep, setCh7HospitalSceneStep] = useState(0);
  const [ch7HospitalSceneCompleted, setCh7HospitalSceneCompleted] = useState(false);
  const [ch7HomeFadeTransition, setCh7HomeFadeTransition] = useState(false);
  const [ch7WanghoNightDispatched, setCh7WanghoNightDispatched] = useState(false);
  const [ch7WoojeThoughtOpen, setCh7WoojeThoughtOpen] = useState(false);
  const [ch7WoojeThoughtDone, setCh7WoojeThoughtDone] = useState(false);
  const [ch7KangNightMailDispatched, setCh7KangNightMailDispatched] = useState(false);
  const [ch7KangNightMailRead, setCh7KangNightMailRead] = useState(false);
  const [ch7EndOverlayOpen, setCh7EndOverlayOpen] = useState(false);
  const ch7ClassMailTriggeredRef = useRef(false);
  const ch7AudioMailTriggeredRef = useRef(false);
  const ch7HyunjunLunchTriggeredRef = useRef(false);
  const ch7AfterHyunjunThoughtShownRef = useRef(false);
  const ch7MinseokDmFadeTriggeredRef = useRef(false);
  const ch7KangReportThoughtShownRef = useRef(false);
  const ch7WanghoUrgentTriggeredRef = useRef(false);
  const ch7HospitalSceneTriggeredRef = useRef(false);
  const ch7HomeFadeTriggeredRef = useRef(false);
  const ch7WoojeThoughtShownRef = useRef(false);
  const ch7KangNightMailTriggeredRef = useRef(false);
  const ch7EndTriggeredRef = useRef(false);

  const activeIgDmAccountIdRef = useRef<string | null>(null);
  activeIgDmAccountIdRef.current = activeIgDmAccountId;
  const [directMessages, setDirectMessages] = useState<DirectMessageThread[]>(
    INITIAL_DIRECT_MESSAGES
  );

  const [chapterTransition, setChapterTransition] = useState<{
    phase: 'fade-to-black' | 'title' | 'fade-out';
    targetChapter: number;
  } | null>(null);

  const [safariTabs, setSafariTabs] = useState<SafariTab[]>(INITIAL_SAFARI_TABS);
  const [activeSafariTabId, setActiveSafariTabId] = useState<string>('tab-allstar');
  const [viewedSecondNews, setViewedSecondNews] = useState(false);
  const [viewedArchive2008, setViewedArchive2008] = useState(false);
  const [lockNotifications, setLockNotifications] = useState<PushNotification[]>([
    INITIAL_EMERGENCY_NOTIFICATION,
    CHIEF_INITIAL_NOTIFICATION,
  ]);
  const [bannerNotifications, setBannerNotifications] = useState<PushNotification[]>([
    INITIAL_EMERGENCY_NOTIFICATION,
    CHIEF_INITIAL_NOTIFICATION,
  ]);

  // App States
  const [chats, setChats] = useState<WhatsAppChat[]>(INITIAL_WHATSAPP_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [photos, setPhotos] = useState<PhotoItem[]>(() => [
    ...LOADED_GALLERY_PHOTOS,
    ...INITIAL_PHOTOS,
  ]);
  const [photosInitialTab, setPhotosInitialTab] = useState<
    'all' | 'dormitory' | 'camera' | 'favorites'
  >('all');
  const [mails, setMails] = useState<MailItem[]>(INITIAL_MAILS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [weatherCity, setWeatherCity] = useState<WeatherCity | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [tweets, setTweets] = useState<SocialPost[]>(INITIAL_TWEETS);
  const [igPosts, setIgPosts] = useState<IgPost[]>(INITIAL_IG_POSTS);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(() =>
    getCallLogsForChapter(1)
  );
  const [phoneTime, setPhoneTime] = useState<string>('04:00');

  const activeChatIdRef = useRef<string | null>(null);
  activeChatIdRef.current = activeChatId;
  const activeAppRef = useRef<AppId | null>(null);
  activeAppRef.current = activeApp;

  const advancePhoneTime = (nextTime?: string, force = false) => {
    if (!nextTime) return;
    setPhoneTime((prev) => {
      if (force) return nextTime;
      const prevM = timeToMinutes(prev);
      const nextM = timeToMinutes(nextTime);
      if (nextM >= 0 && (prevM < 0 || nextM >= prevM)) {
        return nextTime;
      }
      return prev;
    });
  };

  const dossiers = useMemo(
    () =>
      getDossiersForState(
        selectedChapter ?? 1,
        deadCharacters,
        activeTriggers,
        missingCharacters
      ),
    [selectedChapter, deadCharacters, activeTriggers, missingCharacters]
  );

  // Refresh dynamic chapter & death-state notes whenever conditional state changes (keeping user edits)
  useEffect(() => {
    if (selectedChapter === null) return;
    const baseNotes = getNotesForChapter(
      selectedChapter,
      deadCharacters,
      activeTriggers
    );
    setNotes((prev) => {
      const customNotes = prev.filter((n) => !n.id.startsWith('note-ch'));
      return [...customNotes, ...baseNotes];
    });
  }, [selectedChapter, deadCharacters, activeTriggers]);

  const timeStr = phoneTime;
  const dateLabel =
    selectedChapter === 7
      ? 'Tuesday, October 27'
      : selectedChapter === 6
      ? 'Monday, October 26'
      : selectedChapter === 2
      ? 'Friday, October 23'
      : selectedChapter === 3
      ? 'Saturday, October 24'
      : selectedChapter === 4 || selectedChapter === 5
      ? 'Sunday, October 25'
      : 'Thursday, October 22';
  const weekdayLabel =
    selectedChapter === 7
      ? 'Tuesday'
      : selectedChapter === 6
      ? 'Monday'
      : selectedChapter === 2
      ? 'Friday'
      : selectedChapter === 3
      ? 'Saturday'
      : selectedChapter === 4 || selectedChapter === 5
      ? 'Sunday'
      : 'Thursday';
  const dayNumber =
    selectedChapter === 7
      ? 27
      : selectedChapter === 6
      ? 26
      : selectedChapter === 2
      ? 23
      : selectedChapter === 3
      ? 24
      : selectedChapter === 4 || selectedChapter === 5
      ? 25
      : 22;

  // Auto-connect outgoing phone calls after 1.6s (never auto-answer incoming or dropped calls)
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'Calling...') return;
    const t = setTimeout(() => {
      setActiveCall((prev) =>
        prev && prev.status === 'Calling...' ? { ...prev, status: 'Connected' } : prev
      );
    }, 1600);
    return () => clearTimeout(t);
  }, [activeCall]);

  // Unlock second Google breaking news report in Chapter 1 after player explores X, Notes, and Safari
  useEffect(() => {
    if (
      selectedChapter === 1 &&
      !postedNewsIds.includes('burned-vehicle') &&
      exploredApps.has('x') &&
      exploredApps.has('notes') &&
      exploredApps.has('safari')
    ) {
      const timer = setTimeout(() => {
        setPostedNewsIds((prev) =>
          prev.includes('burned-vehicle') ? prev : [...prev, 'burned-vehicle']
        );
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [selectedChapter, exploredApps, postedNewsIds]);

  // Trigger an urgent Police Emergency Broadcast (and Google alert) EVERY time a new news article is posted
  useEffect(() => {
    if (selectedChapter === null) return;
    const newlyPosted = postedNewsIds.filter(
      (id) => !dispatchedNewsIdsRef.current.has(id)
    );
    if (newlyPosted.length === 0) return;

    const incoming: PushNotification[] = [];
    newlyPosted.forEach((articleId) => {
      dispatchedNewsIdsRef.current.add(articleId);
      const emergencyNotif = createEmergencyBroadcastNotification(articleId, '04:01');
      incoming.push(emergencyNotif);
      if (articleId === 'burned-vehicle') {
        incoming.push(GOOGLE_BREAKING_NOTIFICATION);
      }
    });

    setLockNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const uniqueNew = incoming.filter((n) => !existingIds.has(n.id));
      return [...uniqueNew, ...prev];
    });
    setBannerNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const uniqueNew = incoming.filter((n) => !existingIds.has(n.id));
      return [...uniqueNew, ...prev].slice(0, 2);
    });
  }, [selectedChapter, postedNewsIds]);

  // Auto-dismiss top banner notifications 9s after being visible (while unlocked)
  useEffect(() => {
    if (isLocked || bannerNotifications.length === 0) return;
    const t = setTimeout(() => setBannerNotifications([]), 9000);
    return () => clearTimeout(t);
  }, [isLocked, bannerNotifications]);

  // Track when the player reads the newly unlocked arson report or 2008 archive in Safari
  useEffect(() => {
    if (activeApp !== 'safari') return;
    const activeTab = safariTabs.find((t) => t.id === activeSafariTabId);
    if (
      activeTab?.kind === 'article' &&
      activeTab.articleId === 'burned-vehicle' &&
      postedNewsIds.includes('burned-vehicle')
    ) {
      setViewedSecondNews(true);
    }
    if (activeTab?.kind === 'article' && activeTab.articleId === 'archive-2008') {
      setViewedArchive2008(true);
      if (selectedChapter === 2) {
        advancePhoneTime('12:00');
      }
    }
    if (
      selectedChapter === 4 &&
      activeTab?.kind === 'article' &&
      activeTab.articleId === 'chief-murder'
    ) {
      setCh4NewsRead(true);
    }
    if (
      selectedChapter === 6 &&
      activeTab?.kind === 'article' &&
      (activeTab.articleId === 'missing-baby-2008-case' ||
        activeTab.articleId === 'unregistered-adoption-2008' ||
        activeTab.articleId === 'ggpd-2008-evidence-report' ||
        activeTab.articleId === 'seongnam-hospital-audit-2008')
    ) {
      setCh6SearchedMissingBaby(true);
      setCh6ReadMissingBabyNews(true);
      setActiveTriggers((prev) =>
        prev.includes('ch6_missing_baby_archive')
          ? prev
          : [...prev, 'ch6_missing_baby_archive']
      );
    }
  }, [activeApp, safariTabs, activeSafariTabId, postedNewsIds, selectedChapter]);

  // Chapter 2: Advance to 17:00 after exploring Instagram and X and returning to Home Screen, then trigger Dorm Group Chat + Minhyung DM
  useEffect(() => {
    if (selectedChapter !== 2) return;
    if (!exploredApps.has('instagram') || !exploredApps.has('x')) return;
    if (
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition
    ) {
      return;
    }

    advancePhoneTime('17:00');
    if (ch2EveningStartedRef.current) return;
    ch2EveningStartedRef.current = true;

    const groupTimer = setTimeout(() => {
      advancePhoneTime('17:06');
      const isViewingGroup =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'republica';

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== 'republica') return c;
          return {
            ...c,
            lastTime: '17:06',
            unread: isViewingGroup ? 0 : c.unread + 3,
            messages: [
              ...c.messages,
              {
                id: 'ch2-grp-1',
                sender: 'them',
                senderName: 'Hyunjun',
                text: "Did you guys see everyone posting about Dohyeon's party tonight? Half the campus is going.",
                time: '17:04',
              },
              {
                id: 'ch2-grp-2',
                sender: 'them',
                senderName: 'Moon',
                text: "Honestly, it'll probably be safer there than sitting alone in Dorm 304. Nobody's going to try anything with that many people around.",
                time: '17:05',
              },
              {
                id: 'ch2-grp-3',
                sender: 'them',
                senderName: 'Hyunjun',
                text: "Exactly—it's going to be super crowded and Dohyeon has security at the gate. Sanghyeok, you should come with us tonight.",
                time: '17:06',
              },
            ],
          };
        })
      );

      setDormPartyDispatched(true);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === DORM_GROUP_PARTY_NOTIFICATION.id)
          ? prev
          : [DORM_GROUP_PARTY_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === DORM_GROUP_PARTY_NOTIFICATION.id)
          ? prev
          : [DORM_GROUP_PARTY_NOTIFICATION, ...prev].slice(0, 2)
      );
    }, 1200);

    const minhyungTimer = setTimeout(() => {
      const loadedMinhyung = getTriggeredChatForChapter(2, 'minhyung', 'evening');
      const minhyungAvatar =
        loadedMinhyung?.avatarUrl ??
        CHARACTER_ACCOUNTS.find((a) => a.id === 'minhyung')?.avatarUrl;
      const firstMinhyungMsg = loadedMinhyung?.messages[0];
      const triggerTime = firstMinhyungMsg?.time || '17:08';
      advancePhoneTime(triggerTime);

      const isViewingMinhyung =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'minhyung';

      const minhyungChatObj: WhatsAppChat = loadedMinhyung
        ? {
            ...loadedMinhyung,
            avatarUrl: minhyungAvatar,
            lastTime: triggerTime,
            unread: isViewingMinhyung ? 0 : loadedMinhyung.unread || 1,
          }
        : {
            id: 'minhyung',
            name: 'Lee Minhyung',
            subtitle: 'Dorm 304 · Room 304-C',
            number: '+82 10-5590-3043',
            lastTime: triggerTime,
            unread: isViewingMinhyung ? 0 : 1,
            avatarUrl: minhyungAvatar,
            messages: [
              {
                id: 'ch2-min-1',
                sender: 'them',
                text: "Sanghyeok. Don't ignore this—why are you investigating me? I saw the notes you've been writing about my schedule and my desk.",
                time: triggerTime,
              },
            ],
            script: [
              {
                id: 'ch2-min-step-1',
                sender: 'me',
                text: "I'm not investigating anyone. With everything going on in Gyeong-gwan, I just keep track of when people come and go.",
                time: '17:09',
              },
              {
                id: 'ch2-min-step-2',
                sender: 'them',
                text: "Save it. Everyone else in Dorm 304 is panicking about tonight's party, and you haven't flinched once. Stay out of my business.",
                time: '17:10',
                delayMs: 6000,
              },
            ],
            scriptIndex: 0,
          };

      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== 'minhyung');
        return [minhyungChatObj, ...filtered];
      });

      const minhyungNotif: PushNotification = {
        ...MINHYUNG_PRIVATE_NOTIFICATION,
        title: minhyungChatObj.name,
        body: firstMinhyungMsg?.text ?? MINHYUNG_PRIVATE_NOTIFICATION.body,
        time: triggerTime,
      };

      setMinhyungDispatched(true);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === minhyungNotif.id) ? prev : [minhyungNotif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === minhyungNotif.id)
          ? prev
          : [minhyungNotif, ...prev].slice(0, 2)
      );
    }, 5200);

    replyTimersRef.current.push(groupTimer, minhyungTimer);
  }, [
    selectedChapter,
    exploredApps,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
  ]);

  // Mark Dorm 304 Group Chat read in Chapter 2 once opened after party messages arrive
  useEffect(() => {
    if (
      selectedChapter === 2 &&
      dormPartyDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'republica'
    ) {
      setReadDormGroupCh2(true);
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== DORM_GROUP_PARTY_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== DORM_GROUP_PARTY_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, dormPartyDispatched, activeApp, activeChatId]);

  // Chapter 3: Show Breaking News popup once user unlocks phone in Chapter 3
  useEffect(() => {
    if (
      selectedChapter !== 3 ||
      isLocked ||
      chapterTransition ||
      ch3PopupShownRef.current
    ) {
      return;
    }
    const timer = setTimeout(() => {
      if (ch3PopupShownRef.current) return;
      ch3PopupShownRef.current = true;
      setCh3NewsPopupOpen(true);
    }, 550);
    return () => clearTimeout(timer);
  }, [selectedChapter, isLocked, chapterTransition]);

  const triggerCh4DormGroupPanic = () => {
    if (selectedChapter !== 4 || ch4GroupDispatchedRef.current) return;
    ch4GroupDispatchedRef.current = true;
    setCh4DormGroupDispatched(true);
    setActiveTriggers((prev) =>
      prev.includes('ch4_chief_news') ? prev : [...prev, 'ch4_chief_news']
    );

    const groupPanicChat = getTriggeredChatForChapter(
      4,
      'republica',
      'ch4_chief_news'
    );
    const triggerTime = groupPanicChat?.lastTime || '08:42';
    advancePhoneTime(triggerTime);

    const isViewingGroup =
      activeAppRef.current === 'whatsapp' &&
      activeChatIdRef.current === 'republica';

    if (groupPanicChat) {
      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== 'republica');
        return [
          {
            ...groupPanicChat,
            unread: isViewingGroup ? 0 : groupPanicChat.unread || 4,
          },
          ...filtered,
        ];
      });
    }

    const groupNotif: PushNotification = {
      ...CH4_DORM_GROUP_NOTIFICATION,
      body: groupPanicChat?.messages[2]?.text
        ? `Hyunjun: ${groupPanicChat.messages[2].text}`
        : CH4_DORM_GROUP_NOTIFICATION.body,
      time: triggerTime,
    };

    setLockNotifications((prev) =>
      prev.some((n) => n.id === groupNotif.id) ? prev : [groupNotif, ...prev]
    );
    setBannerNotifications((prev) =>
      prev.some((n) => n.id === groupNotif.id)
        ? prev
        : [groupNotif, ...prev].slice(0, 2)
    );
  };

  // Chapter 3 & 4: Handle reaching the bottom of key breaking news reports in Safari
  const handleReachArticleBottom = (articleId: string) => {
    if (
      selectedChapter === 4 &&
      articleId === 'chief-murder' &&
      !ch4GroupDispatchedRef.current
    ) {
      triggerCh4DormGroupPanic();
      return;
    }

    if (
      selectedChapter !== 3 ||
      articleId !== 'minhyung-murder' ||
      ch3ChiefTriggeredRef.current
    ) {
      return;
    }
    ch3ChiefTriggeredRef.current = true;
    setCh3ChiefTriggered(true);
    setActiveTriggers((prev) =>
      prev.includes('minhyung_news') ? prev : [...prev, 'minhyung_news']
    );

    const chiefChat = getTriggeredChatForChapter(3, 'tenente', 'minhyung_news');
    if (chiefChat) {
      advancePhoneTime(chiefChat.lastTime || '10:22');
      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== 'tenente');
        return [chiefChat, ...filtered];
      });
    }

    const chiefNotif: PushNotification = {
      ...CHIEF_MINHYUNG_SUMMONS_NOTIFICATION,
      body:
        chiefChat?.messages[0]?.text ??
        CHIEF_MINHYUNG_SUMMONS_NOTIFICATION.body,
      time: chiefChat?.lastTime || '10:22',
    };

    setLockNotifications((prev) =>
      prev.some((n) => n.id === chiefNotif.id) ? prev : [chiefNotif, ...prev]
    );
    setBannerNotifications((prev) =>
      prev.some((n) => n.id === chiefNotif.id)
        ? prev
        : [chiefNotif, ...prev].slice(0, 2)
    );
  };

  // Chapter 4 fallback: if player opened & viewed 'chief-murder' then exited Safari, also trigger Dorm 304 panic
  useEffect(() => {
    if (
      selectedChapter === 4 &&
      ch4NewsRead &&
      activeApp !== 'safari' &&
      !ch4GroupDispatchedRef.current
    ) {
      const t = setTimeout(() => {
        triggerCh4DormGroupPanic();
      }, 650);
      return () => clearTimeout(t);
    }
  }, [selectedChapter, ch4NewsRead, activeApp]);

  // Chapter 3: Fade out to black after exiting WhatsApp once Chief's summons chat finishes -> pull clock to night -> send permanent Interrogation Dossiers file
  useEffect(() => {
    const prevApp = prevActiveAppRef.current;
    prevActiveAppRef.current = activeApp;

    if (selectedChapter !== 3) return;
    if (!ch3ChiefTriggered || dossiersUnlocked || nightTransitionTriggeredRef.current) {
      return;
    }
    if (prevApp !== 'whatsapp' || activeApp === 'whatsapp') return;

    const chiefChat = chats.find((c) => c.id === 'tenente');
    const chiefRepliedCount =
      chiefChat?.messages.filter((m) => m.sender === 'me').length ?? 0;
    const chiefScriptDone = Boolean(
      chiefChat &&
        !chiefChat.isTyping &&
        (!chiefChat.script ||
          (chiefChat.scriptIndex ?? 0) >= chiefChat.script.length)
    );
    if (chiefRepliedCount === 0 || !chiefScriptDone) return;

    nightTransitionTriggeredRef.current = true;
    setNightTransition(true);

    const tApply = setTimeout(() => {
      advancePhoneTime('20:45');
      setDossiersUnlocked(true);
      setActiveTriggers((prev) =>
        prev.includes('dossiers_unlocked') ? prev : [...prev, 'dossiers_unlocked']
      );
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== 'tenente') return c;
          return {
            ...c,
            lastTime: '20:45',
            unread: c.unread + 1,
            messages: [
              ...c.messages,
              {
                id: 'ch3-chief-dossier-file',
                sender: 'them',
                time: '20:45',
                text: 'Questioning just wrapped up. Here is the compiled interrogation dossier file on everyone questioned today—saved permanently to your phone under Case Files.',
                attachment: {
                  type: 'dossier',
                  title: 'Precinct_Interrogation_Dossiers.pdf',
                  subtitle: '17 Resident & Party Guest Profiles · Tap to open',
                },
              },
            ],
          };
        })
      );

      setLockNotifications((prev) =>
        prev.some((n) => n.id === CHIEF_DOSSIERS_FILE_NOTIFICATION.id)
          ? prev
          : [CHIEF_DOSSIERS_FILE_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CHIEF_DOSSIERS_FILE_NOTIFICATION.id)
          ? prev
          : [CHIEF_DOSSIERS_FILE_NOTIFICATION, ...prev].slice(0, 2)
      );
    }, 650);

    const tReveal = setTimeout(() => {
      setNightTransition(false);
    }, 2400);

    transitionTimersRef.current.push(tApply, tReveal);
  }, [activeApp, selectedChapter, ch3ChiefTriggered, dossiersUnlocked, chats]);

  // Chapter 3: After user checks a dossier, trigger Sanghyeok's living room inner-thought popup
  useEffect(() => {
    if (
      selectedChapter !== 3 ||
      !dossiersUnlocked ||
      !checkedDossierInCh3 ||
      isLocked ||
      nightTransition ||
      chapterTransition ||
      livingRoomThoughtShownRef.current
    ) {
      return;
    }

    const delayMs = activeApp !== 'dossiers' ? 450 : 5200;
    const timer = setTimeout(() => {
      if (livingRoomThoughtShownRef.current) return;
      livingRoomThoughtShownRef.current = true;
      setLivingRoomThoughtOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    dossiersUnlocked,
    checkedDossierInCh3,
    activeApp,
    isLocked,
    nightTransition,
    chapterTransition,
  ]);

  // Chapter 3 Finale: After Voice Memos recording completes, Chief Lieutenant texts about Dohyeon's party videos & Minhyung's phone
  useEffect(() => {
    if (
      selectedChapter !== 3 ||
      !capturedLivingRoomRecording ||
      ch3VideosTriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch3VideosTriggeredRef.current) return;
      ch3VideosTriggeredRef.current = true;
      setCh3VideosChiefTriggered(true);
      setActiveTriggers((prev) =>
        prev.includes('living_room_recorded')
          ? prev
          : [...prev, 'living_room_recorded']
      );

      const videosChat = getTriggeredChatForChapter(
        3,
        'tenente',
        'living_room_recorded'
      );
      const triggerTime = videosChat?.lastTime || '21:05';
      advancePhoneTime(triggerTime);

      const isViewingChief =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'tenente';

      if (videosChat) {
        setChats((prev) => {
          const existingChief = prev.find((c) => c.id === 'tenente');
          if (!existingChief) {
            return [
              {
                ...videosChat,
                unread: isViewingChief ? 0 : videosChat.unread || 2,
              },
              ...prev,
            ];
          }
          const existingIds = new Set(existingChief.messages.map((m) => m.id));
          const appendedMessages = videosChat.messages.filter(
            (m) => !existingIds.has(m.id)
          );
          const updatedChief: WhatsAppChat = {
            ...existingChief,
            lastTime: triggerTime,
            unread: isViewingChief
              ? 0
              : existingChief.unread + appendedMessages.length,
            isTyping: false,
            messages: [...existingChief.messages, ...appendedMessages],
            script: videosChat.script,
            scriptIndex: 0,
          };
          return [updatedChief, ...prev.filter((c) => c.id !== 'tenente')];
        });
      }

      const notif: PushNotification = {
        ...CHIEF_VIDEOS_NOTIFICATION,
        body:
          videosChat?.messages[0]?.text ?? CHIEF_VIDEOS_NOTIFICATION.body,
        time: triggerTime,
      };
      setLockNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
      );
    }, 1400);

    return () => clearTimeout(timer);
  }, [selectedChapter, capturedLivingRoomRecording]);

  // Chapter 4: Show Breaking News popup once user unlocks phone in Chapter 4
  useEffect(() => {
    if (
      selectedChapter !== 4 ||
      isLocked ||
      chapterTransition ||
      ch4PopupShownRef.current
    ) {
      return;
    }
    const timer = setTimeout(() => {
      if (ch4PopupShownRef.current) return;
      ch4PopupShownRef.current = true;
      setCh4NewsPopupOpen(true);
    }, 550);
    return () => clearTimeout(timer);
  }, [selectedChapter, isLocked, chapterTransition]);

  // Chapter 4: Reading Hyunjun's Dorm 304 panic unlocks private chat with Hyunjun
  useEffect(() => {
    if (
      selectedChapter !== 4 ||
      !ch4DormGroupDispatched ||
      activeApp !== 'whatsapp' ||
      activeChatId !== 'republica'
    ) {
      return;
    }

    setReadDormGroupCh4(true);
    setLockNotifications((prev) =>
      prev.filter((n) => n.id !== CH4_DORM_GROUP_NOTIFICATION.id)
    );
    setBannerNotifications((prev) =>
      prev.filter((n) => n.id !== CH4_DORM_GROUP_NOTIFICATION.id)
    );

    if (ch4HyunjunDispatchedRef.current) return;

    const timer = setTimeout(() => {
      if (ch4HyunjunDispatchedRef.current) return;
      ch4HyunjunDispatchedRef.current = true;
      setCh4HyunjunDispatched(true);
      setActiveTriggers((prev) =>
        prev.includes('ch4_group_panic') ? prev : [...prev, 'ch4_group_panic']
      );

      const hyunjunCh4 = getTriggeredChatForChapter(
        4,
        'hyunjun',
        'ch4_group_panic'
      );
      advancePhoneTime('08:45');

      if (hyunjunCh4) {
        setChats((prev) => {
          const filtered = prev.filter((c) => c.id !== 'hyunjun');
          return [{ ...hyunjunCh4, lastTime: '08:45' }, ...filtered];
        });
      }

      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH4_HYUNJUN_PRIVATE_NOTIFICATION.id)
          ? prev
          : [CH4_HYUNJUN_PRIVATE_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH4_HYUNJUN_PRIVATE_NOTIFICATION.id)
          ? prev
          : [CH4_HYUNJUN_PRIVATE_NOTIFICATION, ...prev].slice(0, 2)
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedChapter, ch4DormGroupDispatched, activeApp, activeChatId]);

  // Chapter 4: Once private Hyunjun conversation finishes, unlock the Siwoo & Minseok leads in Notes & Dossiers
  useEffect(() => {
    if (selectedChapter !== 4 || !ch4HyunjunDispatched || ch4ClueRevealed) {
      return;
    }
    const hChat = chats.find((c) => c.id === 'hyunjun');
    const scriptDone = Boolean(
      hChat &&
        !hChat.isTyping &&
        hChat.messages.length >= 5 &&
        (!hChat.script || (hChat.scriptIndex ?? 0) >= hChat.script.length)
    );
    if (!scriptDone) return;

    setCh4ClueRevealed(true);
    setActiveTriggers((prev) =>
      prev.includes('ch4_hyunjun_clue')
        ? prev
        : [...prev, 'ch4_hyunjun_clue']
    );
  }, [selectedChapter, ch4HyunjunDispatched, ch4ClueRevealed, chats]);

  // Chapter 4: After investigating Siwoo & Minseok on both X and Instagram and returning to the Home Screen,
  // wait a moment -> fade to black -> dispatch Unknown Number WhatsApp & new officer's Mail
  useEffect(() => {
    if (
      selectedChapter !== 4 ||
      !ch4ClueRevealed ||
      !inspectedSiwooX ||
      !inspectedSiwooIg ||
      !inspectedMinseokX ||
      !inspectedMinseokIg ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch4AfterXStartedRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch4AfterXStartedRef.current) return;
      ch4AfterXStartedRef.current = true;
      setCh4BlackFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('14:15');
        const unknownChat = getTriggeredChatForChapter(
          4,
          'unknown',
          'ch4_x_investigated'
        );
        const triggerTime = unknownChat?.lastTime || '14:15';

        if (unknownChat) {
          setChats((prev) => {
            const filtered = prev.filter((c) => c.id !== 'unknown');
            return [
              {
                ...unknownChat,
                lastTime: triggerTime,
                unread: unknownChat.unread || 2,
              },
              ...filtered,
            ];
          });
        }

        setMails((prev) => {
          const filtered = prev.filter((m) => m.id !== CH4_NEW_OFFICER_MAIL.id);
          return [CH4_NEW_OFFICER_MAIL, ...filtered];
        });

        const unknownNotif: PushNotification = {
          ...CH4_UNKNOWN_NUMBER_NOTIFICATION,
          body:
            unknownChat?.messages[unknownChat.messages.length - 1]?.text ??
            CH4_UNKNOWN_NUMBER_NOTIFICATION.body,
          time: triggerTime,
        };

        setCh4UnknownAndMailDispatched(true);
        setActiveTriggers((prev) =>
          prev.includes('ch4_x_investigated')
            ? prev
            : [...prev, 'ch4_x_investigated']
        );
        setLockNotifications((prev) => {
          const filtered = prev.filter(
            (n) =>
              n.id !== unknownNotif.id &&
              n.id !== CH4_NEW_OFFICER_MAIL_NOTIFICATION.id
          );
          return [CH4_NEW_OFFICER_MAIL_NOTIFICATION, unknownNotif, ...filtered];
        });
        setBannerNotifications((prev) => {
          const filtered = prev.filter(
            (n) =>
              n.id !== unknownNotif.id &&
              n.id !== CH4_NEW_OFFICER_MAIL_NOTIFICATION.id
          );
          return [
            CH4_NEW_OFFICER_MAIL_NOTIFICATION,
            unknownNotif,
            ...filtered,
          ].slice(0, 2);
        });
      }, 650);

      const revealTimer = setTimeout(() => {
        setCh4BlackFadeTransition(false);
      }, 2400);

      ch4AfterXTimersRef.current.push(applyTimer, revealTimer);
    }, 2200);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch4ClueRevealed,
    inspectedSiwooX,
    inspectedSiwooIg,
    inspectedMinseokX,
    inspectedMinseokIg,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
  ]);

  // Mark Unknown Number WhatsApp chat as read once opened in Chapter 4
  useEffect(() => {
    if (
      selectedChapter === 4 &&
      ch4UnknownAndMailDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'unknown'
    ) {
      setReadUnknownChatCh4(true);
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch4UnknownAndMailDispatched, activeApp, activeChatId]);

  const unknownChat = chats.find((c) => c.id === 'unknown');
  const unknownScriptDone = Boolean(
    ch4UnknownAndMailDispatched &&
      readUnknownChatCh4 &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  // Chapter 4 -> Chapter 5 auto-fade once Unknown Number chat finishes and user returns to Home Screen
  useEffect(() => {
    if (
      selectedChapter !== 4 ||
      !unknownScriptDone ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch4BlackFadeTransition ||
      ch4ToCh5TriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch4ToCh5TriggeredRef.current) return;
      ch4ToCh5TriggeredRef.current = true;
      handleAdvanceWithTransition(5);
    }, 1050);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    unknownScriptDone,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch4BlackFadeTransition,
  ]);

  // Chapter 5: After reading Inspector Kang's email, Unknown Number sends a new message
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !ch5InspectorMailDispatched ||
      !ch5InspectorMailRead ||
      ch5UnknownFollowupRef.current
    ) {
      return;
    }

    ch5FollowupTimerRef.current = setTimeout(() => {
      if (ch5UnknownFollowupRef.current) return;
      ch5UnknownFollowupRef.current = true;
      setCh5UnknownFollowupDispatched(true);
      setActiveTriggers((prev) =>
        prev.includes('ch5_wangho_mail_read')
          ? prev
          : [...prev, 'ch5_wangho_mail_read']
      );

      const followupChat = getTriggeredChatForChapter(
        5,
        'unknown',
        'ch5_wangho_mail_read'
      );
      const triggerTime = followupChat?.lastTime || '16:42';
      advancePhoneTime(triggerTime);

      const isViewingUnknown =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'unknown';

      if (followupChat) {
        setChats((prev) => {
          const existing = prev.find((c) => c.id === 'unknown');
          if (!existing) {
            return [
              {
                ...followupChat,
                unread: isViewingUnknown ? 0 : followupChat.unread || 1,
              },
              ...prev,
            ];
          }
          const existingIds = new Set(existing.messages.map((m) => m.id));
          const appended = followupChat.messages.filter(
            (m) => !existingIds.has(m.id)
          );
          const updated: WhatsAppChat = {
            ...existing,
            lastTime: triggerTime,
            unread: isViewingUnknown ? 0 : existing.unread + appended.length,
            isTyping: false,
            messages: [...existing.messages, ...appended],
            script: followupChat.script,
            scriptIndex: 0,
          };
          return [updated, ...prev.filter((c) => c.id !== 'unknown')];
        });
      }

      const notif: PushNotification = {
        ...CH5_UNKNOWN_BISTRO_NOTIFICATION,
        body:
          followupChat?.messages[0]?.text ??
          CH5_UNKNOWN_BISTRO_NOTIFICATION.body,
        time: triggerTime,
      };
      setLockNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
      );
    }, 1050);

    return () => {
      if (ch5FollowupTimerRef.current) {
        clearTimeout(ch5FollowupTimerRef.current);
        ch5FollowupTimerRef.current = null;
      }
    };
  }, [selectedChapter, ch5InspectorMailDispatched, ch5InspectorMailRead]);

  // Chapter 5: Once Unknown Number confirms he is Han Wangho, reveal his identity on the chat header
  useEffect(() => {
    if (selectedChapter !== 5 || !ch5UnknownFollowupDispatched) return;
    const uChat = chats.find((c) => c.id === 'unknown');
    if (!uChat) return;
    const confirmedName = uChat.messages.some(
      (m) => m.sender === 'them' && m.text.includes('Han Wangho')
    );
    if (!confirmedName || uChat.name === 'Han Wangho') return;

    const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
    setChats((prev) =>
      prev.map((c) =>
        c.id === 'unknown'
          ? {
              ...c,
              name: 'Han Wangho',
              subtitle: 'Verified Contact · Protected Ally',
              avatarUrl: wanghoAvatar ?? c.avatarUrl,
            }
          : c
      )
    );
  }, [selectedChapter, ch5UnknownFollowupDispatched, chats]);

  const ch5BistroConfirmed = Boolean(
    selectedChapter === 5 &&
      ch5UnknownFollowupDispatched &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  // Chapter 5: After finishing the bistro arrangement with Han Wangho and returning to Home Screen,
  // fade to night -> open Voice Memos recording the bistro conversation
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !ch5BistroConfirmed ||
      capturedCh5BistroRecording ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch5NightTransitionTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch5NightTransitionTriggeredRef.current) return;
      ch5NightTransitionTriggeredRef.current = true;
      setCh5NightTransition(true);

      const openTimer = setTimeout(() => {
        advancePhoneTime('21:15');
        setAutoStartCh5BistroRecording(true);
        setActiveApp('recorder');
      }, 650);

      const revealTimer = setTimeout(() => {
        setCh5NightTransition(false);
      }, 2350);

      ch5NightTimersRef.current.push(openTimer, revealTimer);
    }, 950);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch5BistroConfirmed,
    capturedCh5BistroRecording,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
  ]);

  // Chapter 5: After the bistro voice recording ends, fade in cutting to 23:00 where Sanghyeok texts Wangho asking who that was (no reply yet)
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !capturedCh5BistroRecording ||
      ch5LateNightDispatched ||
      ch5NightTransition ||
      chapterTransition ||
      ch5LateNightTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch5LateNightTriggeredRef.current) return;
      ch5LateNightTriggeredRef.current = true;
      setCh5LateNightTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('23:00');
        setCh5LateNightDispatched(true);
        setActiveTriggers((prev) =>
          prev.includes('ch5_late_night') ? prev : [...prev, 'ch5_late_night']
        );

        const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
        setChats((prev) => {
          const existing = prev.find((c) => c.id === 'unknown');
          const sanghyeokMsg: WhatsAppMessage = {
            id: 'ch5-sh-who-was-that',
            sender: 'me',
            time: '23:00',
            read: false,
            text: "Who was that guy at the bistro? The one who walked up calling you hyung—did he hear anything we talked about?",
          };
          if (!existing) {
            const created: WhatsAppChat = {
              id: 'unknown',
              name: 'Han Wangho',
              subtitle: 'Verified Contact · Protected Ally',
              number: '+82 10-0000-0404',
              avatarUrl: wanghoAvatar,
              lastTime: '23:00',
              unread: 0,
              messages: [sanghyeokMsg],
            };
            return [created, ...prev];
          }
          const alreadyHas = existing.messages.some((m) => m.id === sanghyeokMsg.id);
          const updated: WhatsAppChat = {
            ...existing,
            name: 'Han Wangho',
            subtitle: 'Verified Contact · Protected Ally',
            avatarUrl: wanghoAvatar ?? existing.avatarUrl,
            lastTime: '23:00',
            unread: 0,
            isTyping: false,
            script: undefined,
            scriptIndex: 0,
            messages: alreadyHas
              ? existing.messages
              : [...existing.messages, sanghyeokMsg],
          };
          return [updated, ...prev.filter((c) => c.id !== 'unknown')];
        });

        setActiveChatId('unknown');
        setActiveApp('whatsapp');
      }, 650);

      const revealTimer = setTimeout(() => {
        setCh5LateNightTransition(false);
      }, 2350);

      ch5NightTimersRef.current.push(applyTimer, revealTimer);
    }, 2000);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    capturedCh5BistroRecording,
    ch5LateNightDispatched,
    ch5NightTransition,
    chapterTransition,
  ]);

  // Chapter 5 (23:00): Track when Sanghyeok checks X to see Kim Hyukkyu's indirect betrayal posts
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !ch5LateNightDispatched ||
      ch5CheckedX ||
      activeApp !== 'x' ||
      ch5LateNightTransition
    ) {
      return;
    }
    const timer = setTimeout(() => {
      setCh5CheckedX(true);
    }, 900);
    return () => clearTimeout(timer);
  }, [selectedChapter, ch5LateNightDispatched, ch5CheckedX, activeApp, ch5LateNightTransition]);

  // Chapter 5: Once Sanghyeok has checked both X (Hyukkyu's indirects) and Instagram (Jihoon's Story tagging Suhwan)
  // AND returned to the Home Screen, Han Wangho finally replies explaining who Wooje is
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !ch5LateNightDispatched ||
      !ch5CheckedX ||
      !ch5ViewedJihoonStory ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch5LateNightTransition ||
      igStoryOpen ||
      ch5WanghoWoojeReplied ||
      ch5WoojeReplyTriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch5WoojeReplyTriggeredRef.current) return;
      ch5WoojeReplyTriggeredRef.current = true;
      setCh5WanghoWoojeReplied(true);
      setActiveTriggers((prev) =>
        prev.includes('ch5_wooje_explained')
          ? prev
          : [...prev, 'ch5_wooje_explained']
      );

      const woojeChat = getTriggeredChatForChapter(
        5,
        'unknown',
        'ch5_social_checked'
      );
      const triggerTime = woojeChat?.lastTime || '23:10';
      advancePhoneTime(triggerTime);

      const isViewingWangho =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'unknown';
      if (isViewingWangho) {
        setCh5ReadWoojeReply(true);
      }

      const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
      const fallbackMessages: WhatsAppMessage[] = [
        {
          id: 'ch5-wooje-fallback-1',
          sender: 'them',
          time: '23:09',
          text: "Sorry for taking so long to reply, I just got back to my place. That was Wooje—we're close friends, don't worry.",
        },
        {
          id: 'ch5-wooje-fallback-2',
          sender: 'them',
          time: '23:09',
          text: "He moved here about three years ago to study. He isn't close with his family at all, so we grew close because I was his senior in college.",
        },
        {
          id: 'ch5-wooje-fallback-3',
          sender: 'them',
          time: '23:10',
          text: "Honestly we do everything together like brothers. He can be a little clingy sometimes, which is why he walked right up on us like that—but it's fine, he didn't hear anything we talked about.",
        },
      ];

      setChats((prev) => {
        const existing = prev.find((c) => c.id === 'unknown');
        const newMsgs = woojeChat?.messages ?? fallbackMessages;
        if (!existing) {
          return [
            {
              id: 'unknown',
              name: 'Han Wangho',
              subtitle: 'Verified Contact · Protected Ally',
              number: '+82 10-0000-0404',
              avatarUrl: wanghoAvatar,
              lastTime: triggerTime,
              unread: isViewingWangho ? 0 : newMsgs.length,
              messages: newMsgs,
              script: woojeChat?.script,
              scriptIndex: 0,
            },
            ...prev,
          ];
        }
        const existingIds = new Set(existing.messages.map((m) => m.id));
        const appended = newMsgs.filter((m) => !existingIds.has(m.id));
        const updatedMessages = existing.messages
          .map((m) =>
            m.id === 'ch5-sh-who-was-that' ? { ...m, read: true } : m
          )
          .concat(appended);
        const updated: WhatsAppChat = {
          ...existing,
          name: 'Han Wangho',
          subtitle: 'Verified Contact · Protected Ally',
          avatarUrl: wanghoAvatar ?? existing.avatarUrl,
          lastTime: triggerTime,
          unread: isViewingWangho ? 0 : existing.unread + appended.length,
          isTyping: false,
          messages: updatedMessages,
          script: woojeChat?.script,
          scriptIndex: 0,
        };
        return [updated, ...prev.filter((c) => c.id !== 'unknown')];
      });

      const notif: PushNotification = {
        ...CH5_WANGHO_WOOJE_NOTIFICATION,
        body:
          woojeChat?.messages[0]?.text ?? CH5_WANGHO_WOOJE_NOTIFICATION.body,
        time: triggerTime,
      };
      setLockNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch5LateNightDispatched,
    ch5CheckedX,
    ch5ViewedJihoonStory,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch5LateNightTransition,
    igStoryOpen,
    ch5WanghoWoojeReplied,
  ]);

  // Mark Wangho's Wooje explanation chat read when viewed in WhatsApp
  useEffect(() => {
    if (
      selectedChapter === 5 &&
      ch5WanghoWoojeReplied &&
      activeApp === 'whatsapp' &&
      activeChatId === 'unknown'
    ) {
      setCh5ReadWoojeReply(true);
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH5_WANGHO_WOOJE_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH5_WANGHO_WOOJE_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch5WanghoWoojeReplied, activeApp, activeChatId]);

  const ch5WoojeChatDone = Boolean(
    selectedChapter === 5 &&
      ch5WanghoWoojeReplied &&
      ch5ReadWoojeReply &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  // Chapter 5 -> Chapter 6 auto-fade once Wangho's Wooje chat finishes and user returns to Home Screen
  useEffect(() => {
    if (
      selectedChapter !== 5 ||
      !ch5WoojeChatDone ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch5LateNightTransition ||
      ch5ToCh6TriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch5ToCh6TriggeredRef.current) return;
      ch5ToCh6TriggeredRef.current = true;
      handleAdvanceWithTransition(6);
    }, 1050);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch5WoojeChatDone,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch5LateNightTransition,
  ]);

  // Chapter 6: Start Monday 08:15 with an incoming precinct call from Inspector Kang Minhyeok
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      ch6MorningDispatched ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6CallTriggeredRef.current
    ) {
      return;
    }

    const callTimer = setTimeout(() => {
      if (ch6CallTriggeredRef.current) return;
      ch6CallTriggeredRef.current = true;
      setCh6MorningDispatched(true);
      advancePhoneTime('08:15', true);
      setActiveCall({
        id: CH5_INSPECTOR_CALL_SCRIPT.id,
        name: CH5_INSPECTOR_CALL_SCRIPT.name,
        subtitle: CH5_INSPECTOR_CALL_SCRIPT.subtitle,
        number: CH5_INSPECTOR_CALL_SCRIPT.number,
        status: 'Incoming...',
        startedAt: Date.now(),
        lines: CH5_INSPECTOR_CALL_SCRIPT.lines,
        durationSeconds: CH5_INSPECTOR_CALL_SCRIPT.durationSeconds,
      });
      setActiveApp('phone');
    }, 650);

    ch6MorningTimersRef.current.push(callTimer);

    return () => clearTimeout(callTimer);
  }, [
    selectedChapter,
    ch6MorningDispatched,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
  ]);

  // Chapter 6: After Inspector Kang's call cuts out, Hyunjun messages Sanghyeok (08:22)
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6MorningCallCompleted ||
      ch6HyunjunMorningDispatched ||
      ch6HyunjunMorningTriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6HyunjunMorningTriggeredRef.current) return;
      ch6HyunjunMorningTriggeredRef.current = true;
      setCh6HyunjunMorningDispatched(true);

      const hyunjunMorning = getTriggeredChatForChapter(
        6,
        'hyunjun',
        'ch6_morning_call'
      );
      const triggerTime = hyunjunMorning?.lastTime || '08:22';
      advancePhoneTime(triggerTime);

      const isViewingHyunjun =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'hyunjun';

      const hyunjunAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'hyunjun')?.avatarUrl;
      const fallbackMessages: WhatsAppMessage[] = [
        {
          id: 'ch6-hyunjun-fallback-1',
          sender: 'them',
          time: '08:22',
          text: 'Hey Sanghyeok, sorry to bother you this early. Have you noticed Moon has been skipping all his university classes lately?',
        },
        {
          id: 'ch6-hyunjun-fallback-2',
          sender: 'them',
          time: '08:22',
          text: 'Also, did you manage to talk to Minseok yet?',
        },
      ];

      setChats((prev) => {
        const existing = prev.find((c) => c.id === 'hyunjun');
        const nextMsgs = hyunjunMorning?.messages ?? fallbackMessages;
        if (!existing) {
          return [
            {
              id: 'hyunjun',
              name: hyunjunMorning?.name ?? 'Hyunjun',
              subtitle: hyunjunMorning?.subtitle ?? 'Dorm 304 · Private conversation',
              number: hyunjunMorning?.number ?? '+82 10-8812-3041',
              avatarUrl: hyunjunAvatar,
              lastTime: triggerTime,
              unread: isViewingHyunjun ? 0 : hyunjunMorning?.unread ?? nextMsgs.length,
              messages: nextMsgs,
              script: hyunjunMorning?.script,
              scriptIndex: 0,
            },
            ...prev,
          ];
        }
        const existingIds = new Set(existing.messages.map((m) => m.id));
        const appended = nextMsgs.filter((m) => !existingIds.has(m.id));
        const updated: WhatsAppChat = {
          ...existing,
          avatarUrl: hyunjunAvatar ?? existing.avatarUrl,
          lastTime: triggerTime,
          unread: isViewingHyunjun
            ? 0
            : existing.unread + (appended.length || hyunjunMorning?.unread || 2),
          isTyping: false,
          messages: [...existing.messages, ...appended],
          script: hyunjunMorning?.script,
          scriptIndex: 0,
        };
        return [updated, ...prev.filter((c) => c.id !== 'hyunjun')];
      });

      const notif: PushNotification = {
        ...CH6_HYUNJUN_MORNING_NOTIFICATION,
        body:
          hyunjunMorning?.messages[0]?.text ??
          CH6_HYUNJUN_MORNING_NOTIFICATION.body,
        time: triggerTime,
      };
      setLockNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedChapter, ch6MorningCallCompleted, ch6HyunjunMorningDispatched]);

  // Clear Hyunjun morning push notification when viewed
  useEffect(() => {
    if (
      selectedChapter === 6 &&
      ch6HyunjunMorningDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'hyunjun'
    ) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch6HyunjunMorningDispatched, activeApp, activeChatId]);

  const tenenteChat = chats.find((c) => c.id === 'tenente');
  const repliedToChief =
    (tenenteChat?.messages.filter((m) => m.sender === 'me').length ?? 0) > 0;
  const completedCh3VideosChief = Boolean(
    ch3VideosChiefTriggered &&
      tenenteChat &&
      !tenenteChat.isTyping &&
      (!tenenteChat.script ||
        (tenenteChat.scriptIndex ?? 0) >= tenenteChat.script.length)
  );

  const hyunjunChat = chats.find((c) => c.id === 'hyunjun');
  const hyunjunScriptRemaining = Boolean(
    hyunjunChat?.script &&
      (hyunjunChat.scriptIndex ?? 0) < hyunjunChat.script.length
  );
  const repliedToHyunjun =
    (hyunjunChat?.messages.filter((m) => m.sender === 'me').length ?? 0) > 0 &&
    !hyunjunScriptRemaining;
  const ch6HyunjunMorningCompleted = Boolean(
    selectedChapter === 6 &&
      ch6HyunjunMorningDispatched &&
      hyunjunChat &&
      !hyunjunChat.isTyping &&
      (!hyunjunChat.script ||
        (hyunjunChat.scriptIndex ?? 0) >= hyunjunChat.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 6 && ch6HyunjunMorningCompleted) {
      setActiveTriggers((prev) =>
        prev.includes('ch6_hyunjun_morning')
          ? prev
          : [...prev, 'ch6_hyunjun_morning']
      );
    }
  }, [selectedChapter, ch6HyunjunMorningCompleted]);

  // Chapter 6: Once Inspector Kang's call & Hyunjun's morning chat finish and user is on Home Screen,
  // show Sanghyeok's thought pop-up about investigating Wangho
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6MorningCallCompleted ||
      !ch6HyunjunMorningCompleted ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      activeCall ||
      ch6WanghoThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6WanghoThoughtShownRef.current) return;
      ch6WanghoThoughtShownRef.current = true;
      setCh6WanghoThoughtOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6MorningCallCompleted,
    ch6HyunjunMorningCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    activeCall,
  ]);

  // Chapter 6: After checking Wangho's social profile and returning to the Home Screen,
  // fade to black -> Han Wangho sends a WhatsApp message (10:45)
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6CheckedWanghoSocial ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6WanghoMessageDispatched ||
      ch6WanghoFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch6WanghoFadeTriggeredRef.current) return;
      ch6WanghoFadeTriggeredRef.current = true;
      setCh6WanghoThoughtOpen(false);
      setCh6WanghoFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('10:45');
        const wanghoGeumjae = getTriggeredChatForChapter(
          6,
          'unknown',
          'ch6_wangho_social_checked'
        );
        const triggerTime = wanghoGeumjae?.lastTime || '10:45';
        const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
        const fallbackMsgs: WhatsAppMessage[] = [
          {
            id: 'ch6-wangho-geumjae-fallback-1',
            sender: 'them',
            time: '10:45',
            text: 'Sanghyeok, do you have a minute? Something just happened.',
          },
        ];

        setChats((prev) => {
          const existing = prev.find((c) => c.id === 'unknown');
          const nextMsgs = wanghoGeumjae?.messages ?? fallbackMsgs;
          if (!existing) {
            return [
              {
                id: 'unknown',
                name: 'Han Wangho',
                subtitle: 'Verified Contact · Protected Ally',
                number: '+82 10-0000-0404',
                avatarUrl: wanghoAvatar,
                lastTime: triggerTime,
                unread: wanghoGeumjae?.unread ?? nextMsgs.length,
                messages: nextMsgs,
                script: wanghoGeumjae?.script,
                scriptIndex: 0,
              },
              ...prev,
            ];
          }
          const existingIds = new Set(existing.messages.map((m) => m.id));
          const appended = nextMsgs.filter((m) => !existingIds.has(m.id));
          const updated: WhatsAppChat = {
            ...existing,
            name: 'Han Wangho',
            subtitle: 'Verified Contact · Protected Ally',
            avatarUrl: wanghoAvatar ?? existing.avatarUrl,
            lastTime: triggerTime,
            unread: existing.unread + (appended.length || wanghoGeumjae?.unread || 1),
            isTyping: false,
            messages: [...existing.messages, ...appended],
            script: wanghoGeumjae?.script,
            scriptIndex: 0,
          };
          return [updated, ...prev.filter((c) => c.id !== 'unknown')];
        });

        const notif: PushNotification = {
          ...CH6_WANGHO_GEUMJAE_NOTIFICATION,
          body:
            wanghoGeumjae?.messages[0]?.text ??
            CH6_WANGHO_GEUMJAE_NOTIFICATION.body,
          time: triggerTime,
        };
        setLockNotifications((prev) =>
          prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
        );
        setBannerNotifications((prev) =>
          prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
        );
        setCh6WanghoMessageDispatched(true);
      }, 650);

      const revealTimer = setTimeout(() => {
        setCh6WanghoFadeTransition(false);
      }, 2350);

      ch6MorningTimersRef.current.push(applyTimer, revealTimer);
    }, 950);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch6CheckedWanghoSocial,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6WanghoMessageDispatched,
  ]);

  const ch6WanghoGeumjaeCompleted = Boolean(
    selectedChapter === 6 &&
      ch6WanghoMessageDispatched &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 6 && ch6WanghoGeumjaeCompleted) {
      setActiveTriggers((prev) =>
        prev.includes('ch6_wangho_geumjae')
          ? prev
          : [...prev, 'ch6_wangho_geumjae']
      );
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j6' &&
          !entry.body.includes(CH6_JOURNAL_AFTER_WANGHO_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH6_JOURNAL_AFTER_WANGHO_ADDENDUM}`,
              }
            : entry
        )
      );
      setNotes((prev) =>
        prev.map((note) =>
          note.title === '2008 Baby Case' &&
          !note.body.includes(CH6_BABY_CASE_WANGHO_ADDENDUM)
            ? {
                ...note,
                updatedAt: 'Oct 26 · 10:52',
                body: `${note.body}\n\n${CH6_BABY_CASE_WANGHO_ADDENDUM}`,
              }
            : note
        )
      );
    }
  }, [selectedChapter, ch6WanghoGeumjaeCompleted]);

  // Chapter 6: After Wangho's chat about Geumjae concludes and player returns to Home Screen,
  // show Sanghyeok's inner thought about checking the 2008 missing baby case online
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6WanghoGeumjaeCompleted ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6WanghoFadeTransition ||
      activeCall ||
      ch6WanghoThoughtOpen ||
      ch6BabyCaseThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6BabyCaseThoughtShownRef.current) return;
      ch6BabyCaseThoughtShownRef.current = true;
      setCh6BabyCaseThoughtOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6WanghoGeumjaeCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6WanghoFadeTransition,
    activeCall,
    ch6WanghoThoughtOpen,
  ]);

  useEffect(() => {
    if (selectedChapter === 6 && ch6SearchedMissingBaby) {
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j6' &&
          !entry.body.includes(CH6_JOURNAL_AFTER_SAFARI_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH6_JOURNAL_AFTER_SAFARI_ADDENDUM}`,
              }
            : entry
        )
      );
      setNotes((prev) =>
        prev.map((note) =>
          note.title === '2008 Baby Case' &&
          !note.body.includes(CH6_BABY_CASE_SAFARI_ADDENDUM)
            ? {
                ...note,
                updatedAt: 'Oct 26 · 10:56',
                body: `${note.body}\n\n${CH6_BABY_CASE_SAFARI_ADDENDUM}`,
              }
            : note
        )
      );
    }
  }, [selectedChapter, ch6SearchedMissingBaby]);

  // Clear Chapter 6 Wangho notification when opening his chat
  useEffect(() => {
    if (
      selectedChapter === 6 &&
      ch6WanghoMessageDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'unknown'
    ) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch6WanghoMessageDispatched, activeApp, activeChatId]);

  // Chapter 6: After reading the missing baby news in Safari and returning to Home Screen,
  // prompt Sanghyeok to investigate Geumjae's social accounts
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6ReadMissingBabyNews ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6WanghoFadeTransition ||
      ch6AfterGeumjaeFadeTransition ||
      activeCall ||
      ch6BabyCaseThoughtOpen ||
      ch6GeumjaeThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6GeumjaeThoughtShownRef.current) return;
      ch6GeumjaeThoughtShownRef.current = true;
      setCh6GeumjaeThoughtOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6ReadMissingBabyNews,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6WanghoFadeTransition,
    ch6AfterGeumjaeFadeTransition,
    activeCall,
    ch6BabyCaseThoughtOpen,
  ]);

  // Chapter 6: After checking Geumjae's socials (finding nothing, not even a photo) and returning to Home Screen,
  // fade to black -> hours pass (14:30) -> open Mail with Sanghyeok writing to Inspector Kang
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6CheckedGeumjaeSocial ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6AfterGeumjaeFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch6AfterGeumjaeFadeTriggeredRef.current) return;
      ch6AfterGeumjaeFadeTriggeredRef.current = true;
      setCh6GeumjaeThoughtOpen(false);
      setCh6AfterGeumjaeFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('14:30');
        setCh6MailComposePending(true);
        setActiveApp('mail');
      }, 650);

      const revealTimer = setTimeout(() => {
        setCh6AfterGeumjaeFadeTransition(false);
      }, 2350);

      ch6MorningTimersRef.current.push(applyTimer, revealTimer);
    }, 850);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch6CheckedGeumjaeSocial,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
  ]);

  const handleCompleteCh6InspectorMail = (compose: MailScriptedCompose) => {
    if (selectedChapter !== 6 || ch6SentInspectorMail) return;
    setCh6MailComposePending(false);
    setCh6SentInspectorMail(true);
    advancePhoneTime(compose.time || '14:30');
    setMails((prev) => [
      {
        id: compose.id,
        from: `To: Inspector Kang Minhyeok · GGPD`,
        email: compose.to,
        subject: compose.subject,
        preview: compose.body.slice(0, 72),
        body: compose.body,
        time: compose.time || '14:30',
        unread: false,
      },
      ...prev.filter((m) => m.id !== compose.id),
    ]);
    setActiveApp(null);
  };

  // Chapter 6: After sending the email to Inspector Kang, show Sanghyeok's thought bubble
  // about reaching out to Minseok while waiting for Kang's reply
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6SentInspectorMail ||
      ch6MailComposePending ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6AfterGeumjaeFadeTransition ||
      activeCall ||
      ch6MinseokThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6MinseokThoughtShownRef.current) return;
      ch6MinseokThoughtShownRef.current = true;
      setCh6MinseokThoughtOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6SentInspectorMail,
    ch6MailComposePending,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6AfterGeumjaeFadeTransition,
    activeCall,
  ]);

  const ch6MinseokLikedCount = useMemo(
    () => igPosts.filter((p) => p.accountId === 'minseok' && p.liked).length,
    [igPosts]
  );

  // Chapter 6: After liking 2 of Minseok's Instagram posts, mark task done & prepare Sanghyeok's polite introduction DM
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6SentInspectorMail ||
      ch6MinseokLikedCount < 2 ||
      ch6MinseokLikedTwo
    ) {
      return;
    }

    setCh6MinseokThoughtOpen(false);
    setCh6MinseokLikedTwo(true);

    setDirectMessages((prev) => {
      const existing = prev.find(
        (t) => t.platform === 'instagram' && t.accountId === 'minseok'
      );
      if (existing) {
        if (existing.messages.length > 0 || existing.script?.length) {
          return prev;
        }
        return prev.map((t) =>
          t.id === existing.id
            ? {
                ...t,
                script: CH6_MINSEOK_IG_DM_INTRO_SCRIPT,
                scriptIndex: 0,
                isTyping: false,
              }
            : t
        );
      }
      const created: DirectMessageThread = {
        id: 'dm-ig-minseok-ch6',
        accountId: 'minseok',
        platform: 'instagram',
        unread: 0,
        chapters: [6],
        messages: [],
        script: CH6_MINSEOK_IG_DM_INTRO_SCRIPT,
        scriptIndex: 0,
        isTyping: false,
      };
      return [created, ...prev];
    });
  }, [
    selectedChapter,
    ch6SentInspectorMail,
    ch6MinseokLikedCount,
    ch6MinseokLikedTwo,
  ]);

  // Open the "Maybe if I send him a message...?" thought immediately after liking the 2nd post
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6SentInspectorMail ||
      !ch6MinseokLikedTwo ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6AfterGeumjaeFadeTransition ||
      activeCall ||
      ch6MinseokDmThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6MinseokDmThoughtShownRef.current) return;
      ch6MinseokDmThoughtShownRef.current = true;
      setCh6MinseokDmThoughtOpen(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6SentInspectorMail,
    ch6MinseokLikedTwo,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6AfterGeumjaeFadeTransition,
    activeCall,
  ]);

  const minseokIgDmThread = directMessages.find(
    (t) => t.platform === 'instagram' && t.accountId === 'minseok'
  );
  const ch6MinseokDmSent = Boolean(
    selectedChapter === 6 &&
      ch6MinseokLikedTwo &&
      minseokIgDmThread &&
      !minseokIgDmThread.isTyping &&
      minseokIgDmThread.messages.some((m) => m.sender === 'me') &&
      (!minseokIgDmThread.script ||
        (minseokIgDmThread.scriptIndex ?? 0) >= minseokIgDmThread.script.length)
  );

  // Chapter 6: While Minseok does not reply right away, Inspector Kang replies to Sanghyeok's email
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6MinseokDmSent ||
      ch6KangReplyDispatched ||
      ch6KangReplyTriggeredRef.current
    ) {
      return;
    }

    ch6KangReplyTriggeredRef.current = true;
    clearCh6KangReplyTimer();
    ch6KangReplyTimerRef.current = setTimeout(() => {
      advancePhoneTime('15:10');
      setMails((prev) => [
        CH6_INSPECTOR_KANG_REPLY_MAIL,
        ...prev.filter((m) => m.id !== CH6_INSPECTOR_KANG_REPLY_MAIL.id),
      ]);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH6_INSPECTOR_KANG_REPLY_NOTIFICATION.id)
          ? prev
          : [CH6_INSPECTOR_KANG_REPLY_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH6_INSPECTOR_KANG_REPLY_NOTIFICATION.id)
          ? prev
          : [CH6_INSPECTOR_KANG_REPLY_NOTIFICATION, ...prev].slice(0, 2)
      );
      setCh6KangReplyDispatched(true);
    }, 2200);
  }, [selectedChapter, ch6MinseokDmSent, ch6KangReplyDispatched]);

  // Chapter 6: After reading Inspector Kang's reply and returning to the Home Screen,
  // fade to black -> advance 2 hours ahead (17:10) -> Sanghyeok asks Hyunjun where Minseok lives & with whom
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6KangReplyRead ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6AfterGeumjaeFadeTransition ||
      activeCall ||
      ch6MinseokVisitFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch6MinseokVisitFadeTriggeredRef.current) return;
      ch6MinseokVisitFadeTriggeredRef.current = true;
      setCh6MinseokVisitFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('17:10');
        setChats((prev) =>
          prev.map((c) =>
            c.id === 'hyunjun'
              ? {
                  ...c,
                  unread: 0,
                  isTyping: false,
                  script: CH6_HYUNJUN_MINSEOK_ADDRESS_SCRIPT,
                  scriptIndex: 0,
                }
              : c
          )
        );
        setCh6HyunjunMinseokDispatched(true);
      }, 650);

      const openChatTimer = setTimeout(() => {
        setActiveChatId('hyunjun');
        setActiveApp('whatsapp');
      }, 1900);

      const revealTimer = setTimeout(() => {
        setCh6MinseokVisitFadeTransition(false);
      }, 2350);

      ch6MorningTimersRef.current.push(applyTimer, openChatTimer, revealTimer);
    }, 750);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch6KangReplyRead,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6AfterGeumjaeFadeTransition,
    activeCall,
  ]);

  const ch6HyunjunForMinseok = chats.find((c) => c.id === 'hyunjun');
  const ch6HyunjunMinseokCompleted = Boolean(
    selectedChapter === 6 &&
      ch6HyunjunMinseokDispatched &&
      ch6HyunjunForMinseok &&
      !ch6HyunjunForMinseok.isTyping &&
      (!ch6HyunjunForMinseok.script ||
        (ch6HyunjunForMinseok.scriptIndex ?? 0) >=
          ch6HyunjunForMinseok.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 6 && ch6HyunjunMinseokCompleted) {
      setActiveTriggers((prev) =>
        prev.includes('ch6_hyunjun_minseok_address')
          ? prev
          : [...prev, 'ch6_hyunjun_minseok_address']
      );
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j6' &&
          !entry.body.includes(CH6_JOURNAL_AFTER_KANG_HYUNJUN_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH6_JOURNAL_AFTER_KANG_HYUNJUN_ADDENDUM}`,
              }
            : entry
        )
      );
      setNotes((prev) =>
        prev.map((note) =>
          note.title === '2008 Baby Case' &&
          !note.body.includes(CH6_NOTE_AFTER_KANG_HYUNJUN_ADDENDUM)
            ? {
                ...note,
                updatedAt: 'Oct 26 · 17:13',
                body: `${note.body}\n\n${CH6_NOTE_AFTER_KANG_HYUNJUN_ADDENDUM}`,
              }
            : note
        )
      );
    }
  }, [selectedChapter, ch6HyunjunMinseokCompleted]);

  // Chapter 6: After finishing conversation with Hyunjun and returning to the Home Screen,
  // screen fades to black advancing half an hour (17:40) and stays black showing narration/dialogue with Kyu
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6HyunjunMinseokCompleted ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6MinseokVisitFadeTransition ||
      activeCall ||
      ch6KyuDoorstepTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch6KyuDoorstepTriggeredRef.current) return;
      ch6KyuDoorstepTriggeredRef.current = true;
      setCh6KyuDoorstepPhase('intro');
      setCh6KyuDoorstepStep(0);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('17:40');
      }, 650);

      const subtitlesTimer = setTimeout(() => {
        setCh6KyuDoorstepPhase('subtitles');
      }, 2400);

      ch6MorningTimersRef.current.push(applyTimer, subtitlesTimer);
    }, 650);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch6HyunjunMinseokCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6MinseokVisitFadeTransition,
    activeCall,
  ]);

  useEffect(() => {
    if (ch6KyuDoorstepPhase !== 'subtitles') return;
    if (ch6KyuDoorstepStep >= CH6_KYU_DOORSTEP_SUBTITLES.length - 1) return;

    const timer = setTimeout(() => {
      setCh6KyuDoorstepStep((prev) =>
        Math.min(prev + 1, CH6_KYU_DOORSTEP_SUBTITLES.length - 1)
      );
    }, 5800);

    return () => clearTimeout(timer);
  }, [ch6KyuDoorstepPhase, ch6KyuDoorstepStep]);

  const handleFinishCh6KyuDoorstep = () => {
    setCh6KyuDoorstepPhase(null);
    setCh6KyuDoorstepCompleted(true);
    advancePhoneTime('17:45');
    setActiveTriggers((prev) =>
      prev.includes('ch6_kyu_doorstep') ? prev : [...prev, 'ch6_kyu_doorstep']
    );
    setJournalEntries((prev) =>
      prev.map((entry) =>
        entry.id === 'j6' &&
        !entry.body.includes(CH6_JOURNAL_AFTER_KYU_ADDENDUM)
          ? {
              ...entry,
              body: `${entry.body}\n\n${CH6_JOURNAL_AFTER_KYU_ADDENDUM}`,
            }
          : entry
      )
    );
  };

  // Chapter 6: After finishing the doorstep encounter with Kyu on the Home Screen,
  // fade to black -> advance to 22:00 -> open WhatsApp with Han Wangho for their night conversation
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6KyuDoorstepCompleted ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6KyuDoorstepPhase ||
      activeCall ||
      ch6NightWanghoFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch6NightWanghoFadeTriggeredRef.current) return;
      ch6NightWanghoFadeTriggeredRef.current = true;
      setCh6NightWanghoFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('22:00');
        setChats((prev) =>
          prev.map((c) =>
            c.id === 'unknown'
              ? {
                  ...c,
                  unread: 0,
                  isTyping: false,
                  script: CH6_WANGHO_NIGHT_SCRIPT,
                  scriptIndex: 0,
                }
              : c
          )
        );
        setCh6NightWanghoDispatched(true);
      }, 650);

      const openChatTimer = setTimeout(() => {
        setActiveChatId('unknown');
        setActiveApp('whatsapp');
      }, 1900);

      const revealTimer = setTimeout(() => {
        setCh6NightWanghoFadeTransition(false);
      }, 2350);

      ch6MorningTimersRef.current.push(applyTimer, openChatTimer, revealTimer);
    }, 750);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch6KyuDoorstepCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6KyuDoorstepPhase,
    activeCall,
  ]);

  const ch6WanghoNightCompleted = Boolean(
    selectedChapter === 6 &&
      ch6NightWanghoDispatched &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 6 && ch6WanghoNightCompleted) {
      setActiveTriggers((prev) =>
        prev.includes('ch6_wangho_night') ? prev : [...prev, 'ch6_wangho_night']
      );
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j6' &&
          !entry.body.includes(CH6_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH6_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM}`,
              }
            : entry
        )
      );
    }
  }, [selectedChapter, ch6WanghoNightCompleted]);

  // Chapter 6 Finale: End Chapter 06 ONLY after the user completes the 22:00 Wangho chat AND returns to the main Home Screen
  useEffect(() => {
    if (
      selectedChapter !== 6 ||
      !ch6WanghoNightCompleted ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch6NightWanghoFadeTransition ||
      activeCall ||
      ch6EndTriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch6EndTriggeredRef.current) return;
      ch6EndTriggeredRef.current = true;
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === 6
            ? { ...ch, subtitle: 'Monday, October 26 · Completed' }
            : ch
        )
      );
      setCh6EndOverlayOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch6WanghoNightCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch6NightWanghoFadeTransition,
    activeCall,
  ]);

  // Chapter 7 Opening (10:00 AM): Inspector Kang emails Sanghyeok during class asking if he can hear Minseok's testimony
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      chapterTransition ||
      ch7KangClassMailDispatched ||
      ch7ClassMailTriggeredRef.current
    ) {
      return;
    }

    ch7ClassMailTriggeredRef.current = true;
    const timer = setTimeout(() => {
      advancePhoneTime('10:00');
      setMails((prev) => [
        CH7_KANG_CLASS_CHECK_MAIL,
        ...prev.filter((m) => m.id !== CH7_KANG_CLASS_CHECK_MAIL.id),
      ]);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_CLASS_CHECK_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_CLASS_CHECK_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_CLASS_CHECK_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_CLASS_CHECK_NOTIFICATION, ...prev].slice(0, 2)
      );
      setCh7KangClassMailDispatched(true);
    }, 750);

    ch7TimersRef.current.push(timer);
  }, [selectedChapter, chapterTransition, ch7KangClassMailDispatched]);

  const handleQuickReplyMail = (mailId: string) => {
    if (mailId !== CH7_KANG_CLASS_CHECK_MAIL.id) return;
    if (ch7ClassReplySent || ch7ClassReplyPending) return;
    setCh7KangClassMailRead(true);
    setCh7ClassReplyPending(true);
  };

  const handleCompleteCh7ClassReply = (compose: MailScriptedCompose) => {
    if (selectedChapter !== 7 || ch7ClassReplySent) return;
    setCh7ClassReplyPending(false);
    setCh7ClassReplySent(true);
    advancePhoneTime(compose.time || '10:01');
    setMails((prev) => [
      {
        id: compose.id,
        from: 'To: Inspector Kang Minhyeok · GGPD',
        email: compose.to,
        subject: compose.subject,
        preview: compose.body.slice(0, 72),
        body: compose.body,
        time: compose.time || '10:01',
        unread: false,
      },
      ...prev.filter((m) => m.id !== compose.id),
    ]);
  };

  // Chapter 7 (10:02 AM): Right after Sanghyeok replies from class, Inspector Kang sends Minseok's voice recording
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7ClassReplySent ||
      ch7MinseokAudioMailDispatched ||
      ch7AudioMailTriggeredRef.current
    ) {
      return;
    }

    ch7AudioMailTriggeredRef.current = true;
    const timer = setTimeout(() => {
      advancePhoneTime('10:02');
      setMails((prev) => [
        CH7_KANG_MINSEOK_AUDIO_MAIL,
        ...prev.filter((m) => m.id !== CH7_KANG_MINSEOK_AUDIO_MAIL.id),
      ]);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_MINSEOK_AUDIO_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_MINSEOK_AUDIO_NOTIFICATION, ...prev].slice(0, 2)
      );
      setRecordings((prev) =>
        prev.some((r) => r.id === CH7_MINSEOK_STATEMENT_RECORDING.id)
          ? prev
          : [CH7_MINSEOK_STATEMENT_RECORDING, ...prev]
      );
      setCh7MinseokAudioMailDispatched(true);
    }, 1400);

    ch7TimersRef.current.push(timer);
  }, [selectedChapter, ch7ClassReplySent, ch7MinseokAudioMailDispatched]);

  const handleCompleteVoiceRecordingPlayback = (recordingId: string) => {
    if (recordingId !== CH7_MINSEOK_STATEMENT_RECORDING.id) return;
    setCh7MinseokStatementHeard(true);
    advancePhoneTime('10:05');
    setMissingCharacters((prev) =>
      prev.includes('kwanghee') ? prev : [...prev, 'kwanghee']
    );
    setActiveTriggers((prev) =>
      prev.includes('ch7_minseok_statement')
        ? prev
        : [...prev, 'ch7_minseok_statement']
    );
    setJournalEntries((prev) =>
      prev.some((e) => e.id === CH7_JOURNAL_ENTRY.id)
        ? prev
        : [CH7_JOURNAL_ENTRY, ...prev]
    );
  };

  const handleOpenMailAudioAttachment = (
    mailId: string,
    recording: VoiceRecordingItem
  ) => {
    setRecordings((prev) =>
      prev.some((r) => r.id === recording.id) ? prev : [recording, ...prev]
    );
    if (mailId === CH7_KANG_MINSEOK_AUDIO_MAIL.id) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id)
      );
    }
    setRecorderInitialRecordingId(recording.id);
    setRecorderAutoPlayInitial(true);
    setRecorderSavedNoticeId(recording.id);
    handleOpenApp('recorder');
  };

  // Chapter 7 (10:07 AM): After Sanghyeok finishes listening to Minseok's full recording,
  // Hyunjun messages on WhatsApp asking to get lunch; Sanghyeok declines saying he has errands.
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7MinseokStatementHeard ||
      ch7HyunjunLunchDispatched ||
      ch7HyunjunLunchTriggeredRef.current
    ) {
      return;
    }

    ch7HyunjunLunchTriggeredRef.current = true;
    const timer = setTimeout(() => {
      setCh7HyunjunLunchDispatched(true);

      const hyunjunLunch = getTriggeredChatForChapter(
        7,
        'hyunjun',
        'ch7_minseok_statement'
      );
      const triggerTime = hyunjunLunch?.lastTime || '10:07';
      advancePhoneTime(triggerTime);

      const isViewingHyunjun =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'hyunjun';
      const hyunjunAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'hyunjun')?.avatarUrl;
      const fallbackMessages: WhatsAppMessage[] = [
        {
          id: 'ch7-hyunjun-lunch-1',
          sender: 'them',
          time: '10:07',
          text: 'Hey Sanghyeok, want to grab lunch together once class lets out?',
        },
      ];
      const fallbackScript: ScriptedChatStep[] = [
        {
          id: 'ch7-hj-lunch-me',
          sender: 'me',
          time: '10:08',
          text: "Can't today, sorry. I have some errands to run right after class.",
        },
        {
          id: 'ch7-hj-lunch-ok',
          sender: 'them',
          time: '10:08',
          delayMs: 2000,
          text: 'Ok.',
        },
      ];

      setChats((prev) => {
        const existing = prev.find((c) => c.id === 'hyunjun');
        const nextMsgs = hyunjunLunch?.messages ?? fallbackMessages;
        const nextScript = hyunjunLunch?.script ?? fallbackScript;
        if (!existing) {
          return [
            {
              id: 'hyunjun',
              name: hyunjunLunch?.name ?? 'Hyunjun',
              subtitle: hyunjunLunch?.subtitle ?? 'Dorm 304 · Private conversation',
              number: hyunjunLunch?.number ?? '+82 10-8812-3041',
              avatarUrl: hyunjunAvatar,
              lastTime: triggerTime,
              unread: isViewingHyunjun ? 0 : hyunjunLunch?.unread ?? nextMsgs.length,
              messages: nextMsgs,
              script: nextScript,
              scriptIndex: 0,
            },
            ...prev,
          ];
        }
        const existingIds = new Set(existing.messages.map((m) => m.id));
        const appended = nextMsgs.filter((m) => !existingIds.has(m.id));
        const updated: WhatsAppChat = {
          ...existing,
          avatarUrl: hyunjunAvatar ?? existing.avatarUrl,
          lastTime: triggerTime,
          unread: isViewingHyunjun
            ? 0
            : existing.unread + (appended.length || hyunjunLunch?.unread || 1),
          isTyping: false,
          messages: [...existing.messages, ...appended],
          script: nextScript,
          scriptIndex: 0,
        };
        return [updated, ...prev.filter((c) => c.id !== 'hyunjun')];
      });

      const notif: PushNotification = {
        ...CH7_HYUNJUN_LUNCH_NOTIFICATION,
        body:
          hyunjunLunch?.messages[0]?.text ?? CH7_HYUNJUN_LUNCH_NOTIFICATION.body,
        time: triggerTime,
      };
      setLockNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev].slice(0, 2)
      );
    }, 1600);

    ch7TimersRef.current.push(timer);
  }, [selectedChapter, ch7MinseokStatementHeard, ch7HyunjunLunchDispatched]);

  // Clear Chapter 7 Hyunjun lunch notification when viewed
  useEffect(() => {
    if (
      selectedChapter === 7 &&
      ch7HyunjunLunchDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'hyunjun'
    ) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch7HyunjunLunchDispatched, activeApp, activeChatId]);

  const ch7HyunjunChat = chats.find((c) => c.id === 'hyunjun');
  const ch7HyunjunLunchCompleted = Boolean(
    selectedChapter === 7 &&
      ch7HyunjunLunchDispatched &&
      ch7HyunjunChat &&
      !ch7HyunjunChat.isTyping &&
      (!ch7HyunjunChat.script ||
        (ch7HyunjunChat.scriptIndex ?? 0) >= ch7HyunjunChat.script.length)
  );

  // Chapter 7: After Hyunjun's lunch message concludes, prompt Sanghyeok's thought
  // about checking what Kyu and Jihoon were doing on X and Instagram
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7HyunjunLunchCompleted ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      activeCall ||
      ch7AfterHyunjunThoughtShownRef.current
    ) {
      return;
    }

    const delayMs = activeApp === 'whatsapp' ? 1800 : 550;
    const timer = setTimeout(() => {
      if (ch7AfterHyunjunThoughtShownRef.current) return;
      ch7AfterHyunjunThoughtShownRef.current = true;
      setCh7AfterHyunjunThoughtOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch7HyunjunLunchCompleted,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    activeCall,
  ]);

  // Chapter 7 (16:00): After Hyunjun's lunch exchange & checking Kyu/Jihoon on X + IG stories,
  // wait until user returns to the Home Screen, then fade to black -> 16:00 -> Minseok finally replies on IG DM
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7HyunjunLunchCompleted ||
      !ch7CheckedX ||
      ch7MinseokDmDispatched ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      activeCall ||
      ch7MinseokDmFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch7MinseokDmFadeTriggeredRef.current) return;
      ch7MinseokDmFadeTriggeredRef.current = true;
      setCh7MinseokDmFadeTransition(true);

      const applyTimer = setTimeout(() => {
        advancePhoneTime('16:00');
        setDirectMessages((prev) => {
          const existing = prev.find(
            (t) => t.platform === 'instagram' && t.accountId === 'minseok'
          );
          const ch6IntroMessages = CH6_MINSEOK_IG_DM_INTRO_SCRIPT.map((step) => ({
            id: step.id,
            sender: step.sender,
            text: step.text,
            time: step.time ?? '14:37',
          }));
          if (!existing) {
            const created: DirectMessageThread = {
              id: 'dm-ig-minseok-ch7',
              accountId: 'minseok',
              platform: 'instagram',
              unread: 0,
              chapters: [6, 7],
              messages: [...ch6IntroMessages, ...CH7_MINSEOK_IG_DM_OPENING],
              script: CH7_MINSEOK_IG_DM_SCRIPT,
              scriptIndex: 0,
              isTyping: false,
            };
            return [created, ...prev];
          }
          const existingIds = new Set(existing.messages.map((m) => m.id));
          const seedPrior =
            existing.messages.length === 0 ? ch6IntroMessages : [];
          const newOpening = CH7_MINSEOK_IG_DM_OPENING.filter(
            (m) => !existingIds.has(m.id)
          );
          return prev.map((t) =>
            t.id === existing.id
              ? {
                  ...t,
                  unread: 0,
                  chapters: [6, 7],
                  isTyping: false,
                  messages: [...t.messages, ...seedPrior, ...newOpening],
                  script: CH7_MINSEOK_IG_DM_SCRIPT,
                  scriptIndex: 0,
                }
              : t
          );
        });
        setCh7MinseokDmDispatched(true);
      }, 650);

      const openIgTimer = setTimeout(() => {
        setIgInitialDmAccountId('minseok');
        setActiveApp('instagram');
      }, 1900);

      const revealTimer = setTimeout(() => {
        setCh7MinseokDmFadeTransition(false);
      }, 2350);

      ch7TimersRef.current.push(applyTimer, openIgTimer, revealTimer);
    }, 800);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch7HyunjunLunchCompleted,
    ch7CheckedX,
    ch7MinseokDmDispatched,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    activeCall,
  ]);

  const ch7MinseokDmCompleted = Boolean(
    selectedChapter === 7 &&
      ch7MinseokDmDispatched &&
      minseokIgDmThread &&
      !minseokIgDmThread.isTyping &&
      (!minseokIgDmThread.script ||
        (minseokIgDmThread.scriptIndex ?? 0) >= minseokIgDmThread.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 7 && ch7MinseokDmCompleted) {
      setActiveTriggers((prev) =>
        prev.includes('ch7_minseok_dm') ? prev : [...prev, 'ch7_minseok_dm']
      );
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j7' &&
          !entry.body.includes(CH7_JOURNAL_AFTER_MINSEOK_DM_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_MINSEOK_DM_ADDENDUM}`,
              }
            : entry
        )
      );
    }
  }, [selectedChapter, ch7MinseokDmCompleted]);

  // Chapter 7: After talking with Minseok and returning to Home Screen,
  // show Sanghyeok's thought popup about reporting back to Inspector Kang via email
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7MinseokDmCompleted ||
      ch7KangReportMailSent ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch7MinseokDmFadeTransition ||
      activeCall ||
      ch7KangReportThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch7KangReportThoughtShownRef.current) return;
      ch7KangReportThoughtShownRef.current = true;
      setCh7KangReportMailPending(true);
      setCh7KangReportThoughtOpen(true);
    }, 650);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch7MinseokDmCompleted,
    ch7KangReportMailSent,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch7MinseokDmFadeTransition,
    activeCall,
  ]);

  const handleCompleteCh7KangReportMail = (compose: MailScriptedCompose) => {
    if (selectedChapter !== 7 || ch7KangReportMailSent) return;
    setCh7KangReportMailPending(false);
    setCh7KangReportMailSent(true);
    advancePhoneTime(compose.time || '16:12');
    setMails((prev) => [
      {
        id: compose.id,
        from: 'To: Inspector Kang Minhyeok · GGPD',
        email: compose.to,
        subject: compose.subject,
        preview: compose.body.slice(0, 72),
        body: compose.body,
        time: compose.time || '16:12',
        unread: false,
      },
      ...prev.filter((m) => m.id !== compose.id),
    ]);
  };

  useEffect(() => {
    if (selectedChapter === 7 && ch7KangReportMailSent) {
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j7' &&
          !entry.body.includes(CH7_JOURNAL_AFTER_KANG_REPORT_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_KANG_REPORT_ADDENDUM}`,
              }
            : entry
        )
      );
    }
  }, [selectedChapter, ch7KangReportMailSent]);

  // Chapter 7 (16:14): After sending Inspector Kang the report email, Wangho urgently messages Sanghyeok
  // saying Geumjae came to his house and agreed to take the DNA test in secret from his mother
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7KangReportMailSent ||
      ch7WanghoUrgentDispatched ||
      ch7WanghoUrgentTriggeredRef.current
    ) {
      return;
    }

    ch7WanghoUrgentTriggeredRef.current = true;
    const timer = setTimeout(() => {
      advancePhoneTime('16:14');
      const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
      const isViewingWangho =
        activeAppRef.current === 'whatsapp' &&
        activeChatIdRef.current === 'unknown';

      setChats((prev) => {
        const existing = prev.find((c) => c.id === 'unknown');
        if (!existing) {
          return [
            {
              id: 'unknown',
              name: 'Han Wangho',
              subtitle: 'Verified Contact · Protected Ally',
              number: '+82 10-0000-0404',
              avatarUrl: wanghoAvatar,
              lastTime: '16:14',
              unread: isViewingWangho ? 0 : CH7_WANGHO_URGENT_OPENING.length,
              messages: CH7_WANGHO_URGENT_OPENING,
              script: CH7_WANGHO_URGENT_SCRIPT,
              scriptIndex: 0,
            },
            ...prev,
          ];
        }
        const existingIds = new Set(existing.messages.map((m) => m.id));
        const appended = CH7_WANGHO_URGENT_OPENING.filter(
          (m) => !existingIds.has(m.id)
        );
        const updated: WhatsAppChat = {
          ...existing,
          name: 'Han Wangho',
          subtitle: 'Verified Contact · Protected Ally',
          avatarUrl: wanghoAvatar ?? existing.avatarUrl,
          lastTime: '16:14',
          unread: isViewingWangho
            ? 0
            : existing.unread + (appended.length || CH7_WANGHO_URGENT_OPENING.length),
          isTyping: false,
          messages: [...existing.messages, ...appended],
          script: CH7_WANGHO_URGENT_SCRIPT,
          scriptIndex: 0,
        };
        return [updated, ...prev.filter((c) => c.id !== 'unknown')];
      });

      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH7_WANGHO_URGENT_NOTIFICATION.id)
          ? prev
          : [CH7_WANGHO_URGENT_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH7_WANGHO_URGENT_NOTIFICATION.id)
          ? prev
          : [CH7_WANGHO_URGENT_NOTIFICATION, ...prev].slice(0, 2)
      );
      setCh7WanghoUrgentDispatched(true);
    }, 1400);

    ch7TimersRef.current.push(timer);
  }, [selectedChapter, ch7KangReportMailSent, ch7WanghoUrgentDispatched]);

  // Clear Chapter 7 Wangho urgent notification when opening his chat
  useEffect(() => {
    if (
      selectedChapter === 7 &&
      ch7WanghoUrgentDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'unknown'
    ) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch7WanghoUrgentDispatched, activeApp, activeChatId]);

  const ch7WanghoUrgentCompleted = Boolean(
    selectedChapter === 7 &&
      ch7WanghoUrgentDispatched &&
      (ch7HospitalSceneCompleted ||
        ch7WanghoNightDispatched ||
        (unknownChat &&
          !unknownChat.isTyping &&
          (!unknownChat.script ||
            (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)))
  );

  useEffect(() => {
    if (selectedChapter === 7 && ch7WanghoUrgentCompleted) {
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j7' &&
          !entry.body.includes(CH7_JOURNAL_AFTER_WANGHO_URGENT_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_WANGHO_URGENT_ADDENDUM}`,
              }
            : entry
        )
      );
    }
  }, [selectedChapter, ch7WanghoUrgentCompleted]);

  // Chapter 7 (19:00): After Wangho's urgent WhatsApp chat finishes, fade to black ->
  // transition to Gyeong-gwan General Hospital narration (Geumjae's draw, Wooje lurking, Siwoo at ER pharmacy)
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7WanghoUrgentCompleted ||
      ch7HospitalSceneCompleted ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch7MinseokDmFadeTransition ||
      activeCall ||
      ch7HospitalSceneTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch7HospitalSceneTriggeredRef.current) return;
      ch7HospitalSceneTriggeredRef.current = true;
      setCh7HospitalScenePhase('intro');
      setCh7HospitalSceneStep(0);

      const applyTimer = setTimeout(() => {
        setActiveApp(null);
        advancePhoneTime('19:00');
      }, 650);

      const subtitlesTimer = setTimeout(() => {
        setCh7HospitalScenePhase('subtitles');
      }, 2400);

      ch7TimersRef.current.push(applyTimer, subtitlesTimer);
    }, 1800);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch7WanghoUrgentCompleted,
    ch7HospitalSceneCompleted,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch7MinseokDmFadeTransition,
    activeCall,
  ]);

  useEffect(() => {
    if (ch7HospitalScenePhase !== 'subtitles') return;
    if (ch7HospitalSceneStep >= CH7_HOSPITAL_SUBTITLES.length - 1) return;

    const timer = setTimeout(() => {
      setCh7HospitalSceneStep((prev) =>
        Math.min(prev + 1, CH7_HOSPITAL_SUBTITLES.length - 1)
      );
    }, 6800);

    return () => clearTimeout(timer);
  }, [ch7HospitalScenePhase, ch7HospitalSceneStep]);

  const handleFinishCh7HospitalScene = () => {
    setCh7HospitalScenePhase(null);
    setCh7HospitalSceneCompleted(true);
    advancePhoneTime('19:10');
    setActiveTriggers((prev) =>
      prev.includes('ch7_hospital_scene') ? prev : [...prev, 'ch7_hospital_scene']
    );
    setNotes((prev) =>
      prev.some((n) => n.id === CH7_HOSPITAL_POCKET_NOTE.id)
        ? prev
        : [CH7_HOSPITAL_POCKET_NOTE, ...prev]
    );
    setJournalEntries((prev) =>
      prev.map((entry) =>
        entry.id === 'j7' &&
        !entry.body.includes(CH7_JOURNAL_AFTER_HOSPITAL_ADDENDUM)
          ? {
              ...entry,
              body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_HOSPITAL_ADDENDUM}`,
            }
          : entry
      )
    );
  };

  // Chapter 7 (19:45): After Hospital scene finishes, Sanghyeok returns home to Dorm 304 ->
  // Wangho sends thank-you & evening messages before going out to game with Wooje
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7HospitalSceneCompleted ||
      ch7WanghoNightDispatched ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch7HospitalScenePhase ||
      activeCall ||
      ch7HomeFadeTriggeredRef.current
    ) {
      return;
    }

    const waitTimer = setTimeout(() => {
      if (ch7HomeFadeTriggeredRef.current) return;
      ch7HomeFadeTriggeredRef.current = true;
      setCh7HomeFadeTransition(true);

      const applyTimer = setTimeout(() => {
        setActiveApp(null);
        advancePhoneTime('19:45');
        const wanghoAvatar = CHARACTER_ACCOUNTS.find((a) => a.id === 'wangho')?.avatarUrl;
        const isViewingWangho =
          activeAppRef.current === 'whatsapp' &&
          activeChatIdRef.current === 'unknown';

        setChats((prev) => {
          const existing = prev.find((c) => c.id === 'unknown');
          if (!existing) {
            return [
              {
                id: 'unknown',
                name: 'Han Wangho',
                subtitle: 'Verified Contact · Protected Ally',
                number: '+82 10-0000-0404',
                avatarUrl: wanghoAvatar,
                lastTime: '19:45',
                unread: isViewingWangho ? 0 : CH7_WANGHO_NIGHT_OPENING.length,
                messages: CH7_WANGHO_NIGHT_OPENING,
                script: CH7_WANGHO_NIGHT_SCRIPT,
                scriptIndex: 0,
              },
              ...prev,
            ];
          }
          const existingIds = new Set(existing.messages.map((m) => m.id));
          const appended = CH7_WANGHO_NIGHT_OPENING.filter(
            (m) => !existingIds.has(m.id)
          );
          const updated: WhatsAppChat = {
            ...existing,
            name: 'Han Wangho',
            subtitle: 'Verified Contact · Protected Ally',
            avatarUrl: wanghoAvatar ?? existing.avatarUrl,
            lastTime: '19:45',
            unread: isViewingWangho
              ? 0
              : existing.unread + (appended.length || CH7_WANGHO_NIGHT_OPENING.length),
            isTyping: false,
            messages: [...existing.messages, ...appended],
            script: CH7_WANGHO_NIGHT_SCRIPT,
            scriptIndex: 0,
          };
          return [updated, ...prev.filter((c) => c.id !== 'unknown')];
        });

        setLockNotifications((prev) =>
          prev.some((n) => n.id === CH7_WANGHO_NIGHT_NOTIFICATION.id)
            ? prev
            : [CH7_WANGHO_NIGHT_NOTIFICATION, ...prev]
        );
        setBannerNotifications((prev) =>
          prev.some((n) => n.id === CH7_WANGHO_NIGHT_NOTIFICATION.id)
            ? prev
            : [CH7_WANGHO_NIGHT_NOTIFICATION, ...prev].slice(0, 2)
        );
        setCh7WanghoNightDispatched(true);
      }, 1700);

      const revealTimer = setTimeout(() => {
        setCh7HomeFadeTransition(false);
      }, 2400);

      ch7TimersRef.current.push(applyTimer, revealTimer);
    }, 1100);

    return () => clearTimeout(waitTimer);
  }, [
    selectedChapter,
    ch7HospitalSceneCompleted,
    ch7WanghoNightDispatched,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch7HospitalScenePhase,
    activeCall,
  ]);

  // Clear Chapter 7 Wangho night notification when opening his chat
  useEffect(() => {
    if (
      selectedChapter === 7 &&
      ch7WanghoNightDispatched &&
      activeApp === 'whatsapp' &&
      activeChatId === 'unknown'
    ) {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id)
      );
    }
  }, [selectedChapter, ch7WanghoNightDispatched, activeApp, activeChatId]);

  const ch7WanghoNightCompleted = Boolean(
    selectedChapter === 7 &&
      ch7WanghoNightDispatched &&
      unknownChat &&
      !unknownChat.isTyping &&
      (!unknownChat.script ||
        (unknownChat.scriptIndex ?? 0) >= unknownChat.script.length)
  );

  useEffect(() => {
    if (selectedChapter === 7 && ch7WanghoNightCompleted) {
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry.id === 'j7' &&
          !entry.body.includes(CH7_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM)
            ? {
                ...entry,
                body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM}`,
              }
            : entry
        )
      );
    }
  }, [selectedChapter, ch7WanghoNightCompleted]);

  // Chapter 7: Returning to Home Screen after Wangho's night goodbye triggers Sanghyeok's thought popup about Wooje
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7WanghoNightCompleted ||
      ch7WoojeThoughtDone ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch7HomeFadeTransition ||
      activeCall ||
      ch7WoojeThoughtShownRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch7WoojeThoughtShownRef.current) return;
      ch7WoojeThoughtShownRef.current = true;
      setCh7WoojeThoughtOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch7WanghoNightCompleted,
    ch7WoojeThoughtDone,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch7HomeFadeTransition,
    activeCall,
  ]);

  // Chapter 7 (19:56): After Wooje thought popup, Inspector Kang sends confidential precinct summons email with CCTV news
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7WoojeThoughtDone ||
      ch7KangNightMailDispatched ||
      ch7KangNightMailTriggeredRef.current
    ) {
      return;
    }

    ch7KangNightMailTriggeredRef.current = true;
    const timer = setTimeout(() => {
      advancePhoneTime('19:56');
      setMails((prev) => [
        CH7_KANG_NIGHT_SUMMONS_MAIL,
        ...prev.filter((m) => m.id !== CH7_KANG_NIGHT_SUMMONS_MAIL.id),
      ]);
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_NIGHT_SUMMONS_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_NIGHT_SUMMONS_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH7_KANG_NIGHT_SUMMONS_NOTIFICATION.id)
          ? prev
          : [CH7_KANG_NIGHT_SUMMONS_NOTIFICATION, ...prev].slice(0, 2)
      );
      setCh7KangNightMailDispatched(true);
    }, 1600);

    ch7TimersRef.current.push(timer);
  }, [selectedChapter, ch7WoojeThoughtDone, ch7KangNightMailDispatched]);

  // Chapter 7 Finale: End Chapter 07 after reading Inspector Kang's night summons email & returning to the Home Screen
  useEffect(() => {
    if (
      selectedChapter !== 7 ||
      !ch7KangNightMailRead ||
      activeApp !== null ||
      isLocked ||
      searchOpen ||
      controlCenterOpen ||
      chapterTransition ||
      ch7HomeFadeTransition ||
      activeCall ||
      ch7EndTriggeredRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (ch7EndTriggeredRef.current) return;
      ch7EndTriggeredRef.current = true;
      advancePhoneTime('19:58');
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === 7
            ? { ...ch, subtitle: 'Tuesday, October 27 · Completed' }
            : ch
        )
      );
      setCh7EndOverlayOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    ch7KangNightMailRead,
    activeApp,
    isLocked,
    searchOpen,
    controlCenterOpen,
    chapterTransition,
    ch7HomeFadeTransition,
    activeCall,
  ]);

  const narrationMemos = useMemo<NarrationMemoItem[]>(() => {
    const list: NarrationMemoItem[] = [];
    if (selectedChapter === 7 && ch7HospitalSceneCompleted) {
      list.push(CH7_HOSPITAL_NARRATION_MEMO);
    }
    if ((selectedChapter !== null && selectedChapter >= 7) || ch6KyuDoorstepCompleted) {
      list.push(CH6_KYU_DOORSTEP_NARRATION_MEMO);
    }
    return list;
  }, [selectedChapter, ch6KyuDoorstepCompleted, ch7HospitalSceneCompleted]);

  const minhyungChat = chats.find((c) => c.id === 'minhyung');
  const minhyungScriptRemaining = Boolean(
    minhyungChat?.script &&
      (minhyungChat.scriptIndex ?? 0) < minhyungChat.script.length
  );
  const repliedToMinhyung =
    minhyungDispatched &&
    (minhyungChat?.messages.filter((m) => m.sender === 'me').length ?? 0) > 0 &&
    !minhyungScriptRemaining;

  const chapterTasks: ChapterTask[] =
    selectedChapter === 1
      ? [
          {
            id: 't-chief',
            label: 'Reply to Chief Lieutenant in WhatsApp',
            completed: repliedToChief,
          },
          {
            id: 't-notes',
            label: 'Read Lee S.’s Dorm 304 routine logs in Notes',
            completed: exploredApps.has('notes'),
          },
          {
            id: 't-x',
            label: 'Inspect character timelines in X',
            completed: exploredApps.has('x'),
          },
          {
            id: 't-safari',
            label: 'Read the AllStar crime report in Safari',
            completed: exploredApps.has('safari'),
          },
          {
            id: 't-arson',
            label: 'Read the new Gyeong-gwan Park arson report in Safari',
            completed: viewedSecondNews,
          },
        ]
      : selectedChapter === 2
      ? [
          {
            id: 't2-hyunjun',
            label: 'Talk with Hyunjun in WhatsApp (09:20)',
            completed: repliedToHyunjun,
          },
          {
            id: 't2-archive',
            label: 'Explore the 2008 Archive Report tab in Safari (12:00)',
            completed: viewedArchive2008,
          },
          {
            id: 't2-social',
            label: "Check tonight's party posts on Instagram & X (17:00)",
            completed: exploredApps.has('instagram') && exploredApps.has('x'),
          },
          {
            id: 't2-group',
            label: "Read the Dorm 304 group chat about Dohyeon's party",
            completed: readDormGroupCh2,
          },
          {
            id: 't2-minhyung',
            label: "Answer Lee Minhyung's private message in WhatsApp",
            completed: repliedToMinhyung,
          },
        ]
      : selectedChapter === 3
      ? [
          {
            id: 't3-news',
            label: 'Read the Lee Minhyung breaking report to the bottom in Google/Safari',
            completed: ch3ChiefTriggered,
          },
          {
            id: 't3-chief',
            label: 'Answer Chief Lieutenant & exit WhatsApp to attend questioning',
            completed: dossiersUnlocked,
          },
          {
            id: 't3-dossiers',
            label: 'Open permanent Case Files to inspect the interrogation dossiers',
            completed: dossiersUnlocked && checkedDossierInCh3,
          },
          {
            id: 't3-record',
            label: 'Record Hyunjun & Moon in the living room (Voice Memos)',
            completed: capturedLivingRoomRecording,
          },
          {
            id: 't3-chief-videos',
            label: "Read & reply to Chief Lieutenant's update on Dohyeon's party videos",
            completed: completedCh3VideosChief,
          },
        ]
      : selectedChapter === 4
      ? [
          {
            id: 't4-news',
            label: 'Read the Chief Lieutenant breaking report in Google/Safari',
            completed: ch4DormGroupDispatched,
          },
          {
            id: 't4-group',
            label: "Check Hyunjun's panic messages in Dorm 304 (Group)",
            completed: readDormGroupCh4,
          },
          {
            id: 't4-hyunjun',
            label: 'Ask Hyunjun privately in WhatsApp if he suspects anyone',
            completed: ch4ClueRevealed,
          },
          {
            id: 't4-x-profiles',
            label: "Investigate Siwoo and Minseok's profiles on X & Instagram",
            completed:
              inspectedSiwooX &&
              inspectedSiwooIg &&
              inspectedMinseokX &&
              inspectedMinseokIg,
          },
          {
            id: 't4-unknown-mail',
            label:
              'Talk with the Unknown Number on WhatsApp (and check Mail), then return to Home Screen',
            completed: unknownScriptDone || readNewOfficerMailCh4,
          },
        ]
      : selectedChapter === 5
      ? [
          {
            id: 't5-journal',
            label: "Watch Sanghyeok finish writing his Day 05 Journal entry",
            completed: ch5JournalCompleted,
          },
          {
            id: 't5-wangho-mail',
            label: "Read Inspector Kang's email identifying Han Wangho",
            completed: ch5InspectorMailDispatched && ch5InspectorMailRead,
          },
          {
            id: 't5-unknown-bistro',
            label: "Ask Wangho's name & arrange to meet later at the bistro in WhatsApp",
            completed: ch5BistroConfirmed,
          },
          {
            id: 't5-bistro-recording',
            label: 'Meet Han Wangho at the bistro & record the briefing (Voice Memos)',
            completed: capturedCh5BistroRecording,
          },
          {
            id: 't5-check-x',
            label: "Check Hyukkyu's indirect posts on X (23:00)",
            completed: ch5CheckedX,
          },
          {
            id: 't5-check-ig-story',
            label: "Watch Jihoon's Instagram Story tagging Suhwan (23:00)",
            completed: ch5ViewedJihoonStory,
          },
          {
            id: 't5-wangho-wooje',
            label: "Read Han Wangho's WhatsApp reply about Wooje",
            completed: ch5WanghoWoojeReplied && ch5ReadWoojeReply,
          },
        ]
      : selectedChapter === 6
      ? [
          {
            id: 't6-morning-call',
            label: "Answer Inspector Kang's morning call about Viper (08:15)",
            completed: ch6MorningCallCompleted,
          },
          {
            id: 't6-hyunjun-morning',
            label: "Talk with Hyunjun about Moon & his travel ban (08:22)",
            completed: ch6HyunjunMorningCompleted,
          },
          {
            id: 't6-wangho-social',
            label: "Investigate Han Wangho's profile on X",
            completed: ch6CheckedWanghoSocial,
          },
          {
            id: 't6-wangho-geumjae',
            label: 'Talk with Han Wangho about Geumjae & the restraining order (10:45)',
            completed: ch6WanghoGeumjaeCompleted,
          },
          {
            id: 't6-missing-baby-search',
            label: 'Search & read the 2008 missing baby case news in Safari',
            completed: ch6ReadMissingBabyNews,
          },
          {
            id: 't6-geumjae-social',
            label: "Investigate Geumjae's profiles on X & Instagram",
            completed: ch6CheckedGeumjaeSocial,
          },
          {
            id: 't6-email-kang',
            label: "Email Inspector Kang about Wangho's lost brother (14:30)",
            completed: ch6SentInspectorMail,
          },
          {
            id: 't6-minseok-likes',
            label: "Open Minseok's Instagram & like 2 of his posts",
            completed: ch6MinseokLikedTwo,
          },
          {
            id: 't6-minseok-dm',
            label: 'Send a polite Instagram DM to Ryu Minseok',
            completed: ch6MinseokDmSent,
          },
          {
            id: 't6-kang-reply',
            label: "Read Inspector Kang's email reply (15:10)",
            completed: ch6KangReplyDispatched && ch6KangReplyRead,
          },
          {
            id: 't6-hyunjun-minseok-address',
            label:
              "Ask Hyunjun where Minseok lives & head over with Minhyung's things (17:10)",
            completed: ch6HyunjunMinseokCompleted,
          },
          {
            id: 't6-kyu-doorstep',
            label: "Visit Minseok's house & speak with Kyu at the door (17:40)",
            completed: ch6KyuDoorstepCompleted,
          },
          {
            id: 't6-wangho-night',
            label: 'Message Han Wangho before turning in for the night (22:00)',
            completed: ch6WanghoNightCompleted,
          },
        ]
      : [
          {
            id: 't7-kang-class-mail',
            label:
              "Read Inspector Kang's 10:00 AM email & reply from class",
            completed: ch7KangClassMailRead && ch7ClassReplySent,
          },
          {
            id: 't7-minseok-statement',
            label:
              "Listen to Ryu Minseok's precinct voice statement sent by Inspector Kang (10:02)",
            completed: ch7MinseokStatementHeard,
          },
          {
            id: 't7-hyunjun-lunch',
            label: "Reply to Hyunjun's lunch message on WhatsApp (10:07)",
            completed: ch7HyunjunLunchCompleted,
          },
          {
            id: 't7-check-x',
            label: "Check Kyu's & Jihoon's X pages and Instagram stories (Jihoon & Siwoo)",
            completed: ch7CheckedX,
          },
          {
            id: 't7-minseok-dm',
            label: "Read & reply to Minseok's Instagram DM (16:00)",
            completed: ch7MinseokDmCompleted,
          },
          {
            id: 't7-kang-report-mail',
            label: 'Email Inspector Kang with social media leads & verification requests',
            completed: ch7KangReportMailSent,
          },
          {
            id: 't7-wangho-urgent',
            label: "Answer Han Wangho's urgent message about Geumjae (16:14)",
            completed: ch7WanghoUrgentCompleted,
          },
          {
            id: 't7-hospital-scene',
            label: 'Wait with Han Wangho & Geumjae at Gyeong-gwan General Hospital (19:00)',
            completed: ch7HospitalSceneCompleted,
          },
          {
            id: 't7-wangho-night',
            label: "Reply to Wangho's messages after returning to Dorm 304 (19:45)",
            completed: ch7WanghoNightCompleted,
          },
          {
            id: 't7-kang-night-mail',
            label: "Read Inspector Kang's confidential night summons email (19:56)",
            completed: ch7KangNightMailRead,
          },
        ];

  // Automatically unlock Chapter 02, Chapter 03, and Chapter 04 as each chapter's tasks finish
  useEffect(() => {
    if (
      selectedChapter === 1 &&
      chapterTasks.length > 0 &&
      chapterTasks.every((t) => t.completed)
    ) {
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === 2
            ? { ...ch, unlocked: true, subtitle: 'Friday, October 23 · Unlocked' }
            : ch
        )
      );
    }
    if (
      selectedChapter === 2 &&
      chapterTasks.length > 0 &&
      chapterTasks.every((t) => t.completed)
    ) {
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === 3
            ? { ...ch, unlocked: true, subtitle: 'Saturday, October 24 · Unlocked' }
            : ch
        )
      );
    }
    if (
      selectedChapter === 3 &&
      chapterTasks.length > 0 &&
      chapterTasks.every((t) => t.completed)
    ) {
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === 4
            ? { ...ch, unlocked: true, subtitle: 'Sunday, October 25 · Unlocked' }
            : ch
        )
      );
    }
  }, [
    selectedChapter,
    repliedToChief,
    repliedToHyunjun,
    readDormGroupCh2,
    repliedToMinhyung,
    exploredApps,
    viewedSecondNews,
    viewedArchive2008,
    ch3ChiefTriggered,
    dossiersUnlocked,
    checkedDossierInCh3,
    capturedLivingRoomRecording,
    completedCh3VideosChief,
  ]);

  // Show an advance-to-next-chapter popup once all tasks for Chapters 1, 2, or 3 are completed
  const allCurrentTasksComplete =
    chapterTasks.length > 0 && chapterTasks.every((t) => t.completed);

  useEffect(() => {
    if (
      selectedChapter === null ||
      (selectedChapter !== 1 && selectedChapter !== 2 && selectedChapter !== 3) ||
      !allCurrentTasksComplete ||
      chapterTransition ||
      nightTransition ||
      dismissedPromptChapters.includes(selectedChapter)
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setChapterPromptOpen(true);
    }, 950);
    return () => clearTimeout(timer);
  }, [
    selectedChapter,
    allCurrentTasksComplete,
    chapterTransition,
    nightTransition,
    dismissedPromptChapters,
  ]);

  // Auto-hide the "Skip Chapter" hint toast after 7 seconds
  useEffect(() => {
    if (!skipChapterHintOpen) return;
    const t = setTimeout(() => setSkipChapterHintOpen(false), 7000);
    return () => clearTimeout(t);
  }, [skipChapterHintOpen]);

  const handleOpenApp = (app: AppId) => {
    setIsLocked(false);
    setSearchOpen(false);
    setControlCenterOpen(false);
    if (
      app === 'x' ||
      app === 'instagram' ||
      app === 'notes' ||
      app === 'safari' ||
      app === 'dossiers'
    ) {
      setExploredApps((prev) => {
        if (prev.has(app)) return prev;
        const next = new Set(prev);
        next.add(app);
        return next;
      });
    }
    if (app === 'whatsapp') {
      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, unread: 0 } : c))
      );
    }
    if (app !== 'instagram') {
      setIgStoryOpen(false);
    }
    setActiveApp(app);
  };

  const handleUnlock = (targetApp?: AppId) => {
    setIsLocked(false);
    setControlCenterOpen(false);
    if (targetApp) {
      handleOpenApp(targetApp);
    }
  };

  const handleOpenArticleTab = (articleId: string) => {
    const existing = safariTabs.find(
      (t) => t.kind === 'article' && t.articleId === articleId
    );
    if (existing) {
      setActiveSafariTabId(existing.id);
      return;
    }
    const newTab: SafariTab = {
      id: `tab-${articleId}-${Date.now()}`,
      kind: 'article',
      title: getArticleTabTitle(articleId),
      articleId,
    };
    setSafariTabs((prev) => [...prev, newTab]);
    setActiveSafariTabId(newTab.id);
  };

  const handleCreateGoogleTab = (initialQuery = 'Gyeong-gwan news') => {
    const newTab: SafariTab = {
      id: `tab-google-${Date.now()}`,
      kind: 'google',
      title: 'Google Search',
      query: initialQuery,
    };
    setSafariTabs((prev) => [...prev, newTab]);
    setActiveSafariTabId(newTab.id);
  };

  const handleOpenSafariSearch = (searchQuery: string) => {
    const normalizedTarget = searchQuery.trim().toLowerCase();
    const existing = safariTabs.find(
      (t) =>
        t.kind === 'google' &&
        (t.query ?? '').trim().toLowerCase() === normalizedTarget
    );
    if (existing) {
      setActiveSafariTabId(existing.id);
    } else {
      handleCreateGoogleTab(searchQuery);
    }
    if (selectedChapter === 6) {
      setCh6SearchedMissingBaby(true);
      advancePhoneTime('10:56');
    }
    handleOpenApp('safari');
  };

  const handleCloseSafariTab = (tabId: string) => {
    setSafariTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === tabId);
      const remaining = prev.filter((t) => t.id !== tabId);
      if (remaining.length === 0) {
        const fallback: SafariTab = {
          id: `tab-google-${Date.now()}`,
          kind: 'google',
          title: 'Google Search',
          query: 'Gyeong-gwan news',
        };
        setActiveSafariTabId(fallback.id);
        return [fallback];
      }
      if (activeSafariTabId === tabId) {
        const nextIdx = Math.max(0, Math.min(idx, remaining.length - 1));
        setActiveSafariTabId(remaining[nextIdx].id);
      }
      return remaining;
    });
  };

  const handleUpdateSafariTabQuery = (tabId: string, query: string) => {
    setSafariTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, query } : t))
    );
    const normalized = query.trim().toLowerCase();
    if (
      selectedChapter === 6 &&
      normalized.includes('2008') &&
      (normalized.includes('missing') ||
        normalized.includes('child') ||
        normalized.includes('baby') ||
        normalized.includes('infant'))
    ) {
      setCh6SearchedMissingBaby(true);
      advancePhoneTime('10:56');
    }
  };

  const handleTapNotification = (notif: PushNotification) => {
    setBannerNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    setLockNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    if (notif.id === CH6_MISSED_CALL_NOTIFICATION.id) {
      setActiveCall({
        id: CH5_INSPECTOR_CALL_SCRIPT.id,
        name: CH5_INSPECTOR_CALL_SCRIPT.name,
        subtitle: CH5_INSPECTOR_CALL_SCRIPT.subtitle,
        number: CH5_INSPECTOR_CALL_SCRIPT.number,
        status: 'Incoming...',
        startedAt: Date.now(),
        lines: CH5_INSPECTOR_CALL_SCRIPT.lines,
        durationSeconds: CH5_INSPECTOR_CALL_SCRIPT.durationSeconds,
      });
      handleOpenApp('phone');
      return;
    }
    if (notif.targetApp === 'whatsapp' && notif.targetChatId) {
      setActiveChatId(notif.targetChatId);
      setChats((prev) =>
        prev.map((c) =>
          c.id === notif.targetChatId ? { ...c, unread: 0 } : c
        )
      );
      handleOpenApp('whatsapp');
      return;
    }
    if (notif.targetApp === 'safari' && notif.targetArticleId) {
      if (notif.targetArticleId === 'minhyung-murder') {
        ch3PopupShownRef.current = true;
        setCh3NewsPopupOpen(false);
      }
      if (notif.targetArticleId === 'chief-murder') {
        ch4PopupShownRef.current = true;
        setCh4NewsPopupOpen(false);
      }
      handleOpenArticleTab(notif.targetArticleId);
      handleOpenApp('safari');
      return;
    }
    if (notif.targetApp === 'instagram' && notif.targetDmAccountId) {
      setIgInitialDmAccountId(notif.targetDmAccountId);
      handleOpenApp('instagram');
      return;
    }
    handleOpenApp(notif.targetApp);
  };

  const handleGoHome = () => {
    setActiveApp(null);
    setIgStoryOpen(false);
    setPhotosInitialTab('all');
    setSearchOpen(false);
    setControlCenterOpen(false);
  };

  const handleHomeBarDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -35 || info.velocity.y < -250) {
      handleGoHome();
    }
  };

  const handleSendWhatsApp = (
    chatId: string,
    text: string,
    timeOverride?: string
  ) => {
    const currentChat = chats.find((c) => c.id === chatId);
    const currentScriptIndex = currentChat?.scriptIndex ?? 0;
    const currentStep = currentChat?.script?.[currentScriptIndex];
    const isScriptedMeStep = Boolean(currentStep && currentStep.sender === 'me');
    const nextScriptIndex = isScriptedMeStep
      ? currentScriptIndex + 1
      : currentScriptIndex;

    const nowTime =
      timeOverride || (isScriptedMeStep ? currentStep?.time : undefined) || phoneTime;
    advancePhoneTime(nowTime);

    const peerSteps: ScriptedChatStep[] = [];
    if (currentChat?.script && isScriptedMeStep) {
      let cursor = nextScriptIndex;
      while (
        cursor < currentChat.script.length &&
        currentChat.script[cursor].sender === 'them'
      ) {
        peerSteps.push(currentChat.script[cursor]);
        cursor += 1;
      }
    }

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          unread: 0,
          lastTime: nowTime,
          scriptIndex: nextScriptIndex,
          isTyping: peerSteps.length > 0 ? true : c.isTyping,
          messages: [
            ...c.messages,
            {
              id: `msg-${Date.now()}-${c.messages.length}`,
              sender: 'me',
              text,
              time: nowTime,
              read: true,
            },
          ],
        };
      })
    );

    const clearChatNotifications = (targetId: string) => {
      if (targetId === 'tenente') {
        setLockNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== CHIEF_INITIAL_NOTIFICATION.id &&
              n.id !== CHIEF_VIDEOS_NOTIFICATION.id &&
              n.id !== CHIEF_MINHYUNG_SUMMONS_NOTIFICATION.id
          )
        );
        setBannerNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== CHIEF_INITIAL_NOTIFICATION.id &&
              n.id !== CHIEF_VIDEOS_NOTIFICATION.id &&
              n.id !== CHIEF_MINHYUNG_SUMMONS_NOTIFICATION.id
          )
        );
      }

      if (targetId === 'hyunjun') {
        setLockNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== HYUNJUN_DAY2_NOTIFICATION.id &&
              n.id !== CH4_HYUNJUN_PRIVATE_NOTIFICATION.id &&
              n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id &&
              n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id
          )
        );
        setBannerNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== HYUNJUN_DAY2_NOTIFICATION.id &&
              n.id !== CH4_HYUNJUN_PRIVATE_NOTIFICATION.id &&
              n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id &&
              n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id
          )
        );
      }

      if (targetId === 'minhyung') {
        setLockNotifications((prev) =>
          prev.filter((n) => n.id !== MINHYUNG_PRIVATE_NOTIFICATION.id)
        );
        setBannerNotifications((prev) =>
          prev.filter((n) => n.id !== MINHYUNG_PRIVATE_NOTIFICATION.id)
        );
      }

      if (targetId === 'unknown') {
        setLockNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id &&
              n.id !== CH5_UNKNOWN_BISTRO_NOTIFICATION.id &&
              n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id &&
              n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id &&
              n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id
          )
        );
        setBannerNotifications((prev) =>
          prev.filter(
            (n) =>
              n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id &&
              n.id !== CH5_UNKNOWN_BISTRO_NOTIFICATION.id &&
              n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id &&
              n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id &&
              n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id
          )
        );
      }
    };

    clearChatNotifications(chatId);

    let cumulativeDelay = 0;
    const chatTimers = chatReplyTimersRef.current.get(chatId) ?? [];
    peerSteps.forEach((step, idx) => {
      cumulativeDelay += step.delayMs ?? 6000;
      const isLastInBurst = idx === peerSteps.length - 1;
      const msgTime = step.time || nowTime;

      const timer = setTimeout(() => {
        advancePhoneTime(msgTime);
        const isViewingChat =
          activeAppRef.current === 'whatsapp' &&
          activeChatIdRef.current === chatId;

        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              unread: isViewingChat ? 0 : c.unread + 1,
              isTyping: !isLastInBurst,
              lastTime: msgTime,
              scriptIndex: nextScriptIndex + idx + 1,
              messages: [
                ...c.messages,
                {
                  id: `${step.id}-${Date.now()}-${idx}`,
                  sender: 'them',
                  text: step.text,
                  time: msgTime,
                },
              ],
            };
          })
        );
      }, cumulativeDelay);

      chatTimers.push(timer);
    });
    if (chatTimers.length > 0) {
      chatReplyTimersRef.current.set(chatId, chatTimers);
    }
  };

  const handleSkipWhatsApp = (chatId: string) => {
    clearChatReplyTimers(chatId);

    const currentChat = chats.find((c) => c.id === chatId);
    const script = currentChat?.script ?? [];
    const startIdx = currentChat?.scriptIndex ?? 0;
    const remainingSteps = script.slice(startIdx);

    const lastTime =
      remainingSteps[remainingSteps.length - 1]?.time ||
      currentChat?.lastTime ||
      phoneTime;
    if (remainingSteps.length > 0) {
      advancePhoneTime(lastTime);
    }

    const appendedMessages: WhatsAppMessage[] = remainingSteps.map((step, idx) => ({
      id: `${step.id}-skip-${Date.now()}-${idx}`,
      sender: step.sender,
      text: step.text,
      time: step.time || currentChat?.lastTime || phoneTime,
      read: step.sender === 'me' ? true : undefined,
    }));

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          unread: 0,
          isTyping: false,
          lastTime: appendedMessages.length > 0 ? lastTime : c.lastTime,
          scriptIndex: c.script?.length ?? c.scriptIndex ?? 0,
          messages: [...c.messages, ...appendedMessages],
        };
      })
    );

    if (chatId === 'tenente') {
      setLockNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== CHIEF_INITIAL_NOTIFICATION.id &&
            n.id !== CHIEF_VIDEOS_NOTIFICATION.id &&
            n.id !== CHIEF_MINHYUNG_SUMMONS_NOTIFICATION.id
        )
      );
      setBannerNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== CHIEF_INITIAL_NOTIFICATION.id &&
            n.id !== CHIEF_VIDEOS_NOTIFICATION.id &&
            n.id !== CHIEF_MINHYUNG_SUMMONS_NOTIFICATION.id
        )
      );
    }

    if (chatId === 'hyunjun') {
      setLockNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== HYUNJUN_DAY2_NOTIFICATION.id &&
            n.id !== CH4_HYUNJUN_PRIVATE_NOTIFICATION.id &&
            n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id &&
            n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id
        )
      );
      setBannerNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== HYUNJUN_DAY2_NOTIFICATION.id &&
            n.id !== CH4_HYUNJUN_PRIVATE_NOTIFICATION.id &&
            n.id !== CH6_HYUNJUN_MORNING_NOTIFICATION.id &&
            n.id !== CH7_HYUNJUN_LUNCH_NOTIFICATION.id
        )
      );
    }

    if (chatId === 'minhyung') {
      setLockNotifications((prev) =>
        prev.filter((n) => n.id !== MINHYUNG_PRIVATE_NOTIFICATION.id)
      );
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== MINHYUNG_PRIVATE_NOTIFICATION.id)
      );
    }

    if (chatId === 'unknown') {
      setLockNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id &&
            n.id !== CH5_UNKNOWN_BISTRO_NOTIFICATION.id &&
            n.id !== CH5_WANGHO_WOOJE_NOTIFICATION.id &&
            n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id &&
            n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id &&
            n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id
        )
      );
      setBannerNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== CH4_UNKNOWN_NUMBER_NOTIFICATION.id &&
            n.id !== CH5_UNKNOWN_BISTRO_NOTIFICATION.id &&
            n.id !== CH5_WANGHO_WOOJE_NOTIFICATION.id &&
            n.id !== CH6_WANGHO_GEUMJAE_NOTIFICATION.id &&
            n.id !== CH7_WANGHO_URGENT_NOTIFICATION.id &&
            n.id !== CH7_WANGHO_NIGHT_NOTIFICATION.id
        )
      );
    }
  };

  const formatCallDuration = (startedAt: number) => {
    const totalSecs = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const upsertCallLog = (entry: CallLogItem) => {
    setCallLogs((prev) => [entry, ...prev.filter((l) => l.id !== entry.id)]);
  };

  const handleStartCall = (name: string, number: string) => {
    setActiveCall({
      name,
      number,
      status: 'Calling...',
      startedAt: Date.now(),
    });
    setActiveApp('phone');
  };

  const handleAcceptIncomingCall = () => {
    setLockNotifications((prev) =>
      prev.filter((n) => n.id !== CH6_MISSED_CALL_NOTIFICATION.id)
    );
    setBannerNotifications((prev) =>
      prev.filter((n) => n.id !== CH6_MISSED_CALL_NOTIFICATION.id)
    );
    setActiveCall((prev) =>
      prev ? { ...prev, status: 'Connected', startedAt: Date.now() } : null
    );
  };

  const handleCompleteScriptedCall = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, status: 'Call Dropped' } : null
    );
    if (selectedChapter === 6) {
      setCh6MorningCallCompleted(true);
      setActiveTriggers((prev) =>
        prev.includes('ch6_morning_call') ? prev : [...prev, 'ch6_morning_call']
      );
      upsertCallLog({
        id: 'call-log-ch6-inspector',
        name: CH5_INSPECTOR_CALL_SCRIPT.name,
        subtitle: CH5_INSPECTOR_CALL_SCRIPT.subtitle,
        number: CH5_INSPECTOR_CALL_SCRIPT.number,
        status: 'Call Dropped',
        time: '08:15',
        dateLabel: 'Monday, Oct 26',
        durationLabel: '01:14',
        lines: CH5_INSPECTOR_CALL_SCRIPT.lines,
      });
    }
  };

  const handleEndCall = () => {
    const endedCall = activeCall;
    const isIncompleteMorningCall =
      selectedChapter === 6 &&
      endedCall?.id === CH5_INSPECTOR_CALL_SCRIPT.id &&
      !ch6MorningCallCompleted;

    if (endedCall && endedCall.status !== 'Call Dropped') {
      if (endedCall.id === CH5_INSPECTOR_CALL_SCRIPT.id) {
        if (isIncompleteMorningCall) {
          upsertCallLog({
            id: 'call-log-ch6-inspector',
            name: endedCall.name,
            subtitle: endedCall.subtitle,
            number: endedCall.number,
            status: 'Missed',
            time: '08:15',
            dateLabel: 'Monday, Oct 26',
          });
        }
      } else {
        upsertCallLog({
          id: `call-log-out-${Date.now()}`,
          name: endedCall.name,
          subtitle: endedCall.subtitle,
          number: endedCall.number,
          status: 'Outgoing',
          time: phoneTime,
          dateLabel: `${weekdayLabel}, Oct ${dayNumber}`,
          durationLabel:
            endedCall.status === 'Connected'
              ? formatCallDuration(endedCall.startedAt)
              : '00:00',
        });
      }
    }

    setActiveCall(null);
    if (isIncompleteMorningCall) {
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH6_MISSED_CALL_NOTIFICATION.id)
          ? prev
          : [CH6_MISSED_CALL_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH6_MISSED_CALL_NOTIFICATION.id)
          ? prev
          : [CH6_MISSED_CALL_NOTIFICATION, ...prev].slice(0, 2)
      );
      setActiveApp(null);
    }
  };

  const handleSendDirectMessage = (
    platform: 'x' | 'instagram',
    accountId: string,
    text: string,
    timeOverride?: string
  ) => {
    const key = `${platform}:${accountId}`;
    const existingThread = directMessages.find(
      (t) => t.platform === platform && t.accountId === accountId
    );
    const currentScriptIndex = existingThread?.scriptIndex ?? 0;
    const currentStep = existingThread?.script?.[currentScriptIndex];
    const isScriptedMeStep = Boolean(currentStep && currentStep.sender === 'me');
    const nextScriptIndex = isScriptedMeStep
      ? currentScriptIndex + 1
      : currentScriptIndex;

    const nowTime =
      timeOverride || (isScriptedMeStep ? currentStep?.time : undefined) || phoneTime;
    advancePhoneTime(nowTime);

    const peerSteps: ScriptedChatStep[] = [];
    if (existingThread?.script && isScriptedMeStep) {
      let cursor = nextScriptIndex;
      while (
        cursor < existingThread.script.length &&
        existingThread.script[cursor].sender === 'them'
      ) {
        peerSteps.push(existingThread.script[cursor]);
        cursor += 1;
      }
    }

    const newMsg = {
      id: `dm-${platform}-${Date.now()}`,
      sender: 'me' as const,
      text,
      time: nowTime,
    };

    setDirectMessages((prev) => {
      const idx = prev.findIndex(
        (t) => t.platform === platform && t.accountId === accountId
      );
      if (idx >= 0) {
        return prev.map((t, i) =>
          i === idx
            ? {
                ...t,
                unread: 0,
                scriptIndex: nextScriptIndex,
                isTyping: peerSteps.length > 0 ? true : t.isTyping,
                messages: [...t.messages, newMsg],
              }
            : t
        );
      }
      const created: DirectMessageThread = {
        id: `dm-${platform}-${accountId}-${Date.now()}`,
        accountId,
        platform,
        unread: 0,
        chapters: selectedChapter ? [selectedChapter] : [1, 2, 3, 4, 5, 6],
        messages: [newMsg],
      };
      return [created, ...prev];
    });

    if (peerSteps.length > 0) {
      let cumulativeDelay = 0;
      const dmTimers = dmReplyTimersRef.current.get(key) ?? [];
      peerSteps.forEach((step, idx) => {
        cumulativeDelay += step.delayMs ?? 3000;
        const isLastInBurst = idx === peerSteps.length - 1;
        const msgTime = step.time || nowTime;

        const timer = setTimeout(() => {
          advancePhoneTime(msgTime);
          const isViewingDm =
            platform === 'instagram' &&
            activeAppRef.current === 'instagram' &&
            activeIgDmAccountIdRef.current === accountId;

          setDirectMessages((prev) =>
            prev.map((t) => {
              if (t.platform !== platform || t.accountId !== accountId) return t;
              return {
                ...t,
                unread: isViewingDm ? 0 : t.unread + 1,
                isTyping: !isLastInBurst,
                scriptIndex: nextScriptIndex + idx + 1,
                messages: [
                  ...t.messages,
                  {
                    id: `${step.id}-${Date.now()}-${idx}`,
                    sender: 'them',
                    text: step.text,
                    time: msgTime,
                  },
                ],
              };
            })
          );
        }, cumulativeDelay);

        dmTimers.push(timer);
      });
      dmReplyTimersRef.current.set(key, dmTimers);
    }
  };

  const handleSkipDirectMessage = (
    platform: 'x' | 'instagram',
    accountId: string
  ) => {
    const key = `${platform}:${accountId}`;
    clearDmReplyTimers(key);

    const existingThread = directMessages.find(
      (t) => t.platform === platform && t.accountId === accountId
    );
    const script = existingThread?.script ?? [];
    const startIdx = existingThread?.scriptIndex ?? 0;
    const remainingSteps = script.slice(startIdx);
    const lastTime = remainingSteps[remainingSteps.length - 1]?.time || phoneTime;
    if (remainingSteps.length > 0) {
      advancePhoneTime(lastTime);
    }

    const appended = remainingSteps.map((step, idx) => ({
      id: `${step.id}-skip-${Date.now()}-${idx}`,
      sender: step.sender,
      text: step.text,
      time: step.time || phoneTime,
    }));

    setDirectMessages((prev) =>
      prev.map((t) =>
        t.platform === platform && t.accountId === accountId
          ? {
              ...t,
              unread: 0,
              isTyping: false,
              scriptIndex: t.script?.length ?? t.scriptIndex ?? 0,
              messages: [...t.messages, ...appended],
            }
          : t
      )
    );
  };

  const handleMarkDmRead = (platform: 'x' | 'instagram', accountId: string) => {
    setDirectMessages((prev) =>
      prev.map((t) =>
        t.platform === platform && t.accountId === accountId
          ? { ...t, unread: 0 }
          : t
      )
    );
  };

  const handleCompleteCh5JournalIntro = (entry: JournalEntry) => {
    if (selectedChapter !== 5 || ch5JournalCompleted) return;
    setCh5JournalCompleted(true);
    setJournalEntries((prev) =>
      prev.some((e) => e.id === entry.id) ? prev : [entry, ...prev]
    );
    setActiveApp(null);

    clearCh5MailTimer();
    ch5MailTimerRef.current = setTimeout(() => {
      advancePhoneTime('16:40');
      setMails((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== CH5_INSPECTOR_WANGHO_MAIL.id
        );
        return [CH5_INSPECTOR_WANGHO_MAIL, ...filtered];
      });
      setActiveTriggers((prev) =>
        prev.includes('ch5_wangho_mail') ? prev : [...prev, 'ch5_wangho_mail']
      );
      setLockNotifications((prev) =>
        prev.some((n) => n.id === CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION.id)
          ? prev
          : [CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION, ...prev]
      );
      setBannerNotifications((prev) =>
        prev.some((n) => n.id === CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION.id)
          ? prev
          : [CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION, ...prev].slice(0, 2)
      );
      setCh5InspectorMailDispatched(true);
    }, 550);
  };

  const resetForChapter = (chapterId: number, keepUserAdditions = false) => {
    clearReplyTimers();
    clearCh4AfterXTimers();
    clearCh5MailTimer();
    clearCh5NightTimers();
    clearCh6MorningTimers();
    clearCh6KangReplyTimer();
    clearCh7Timers();
    clearDmReplyTimers();
    setIsLocked(chapterId !== 5 && chapterId !== 6 && chapterId !== 7 && chapterId !== 8);
    setActiveApp(chapterId === 5 || chapterId === 8 ? 'journal' : null);
    prevActiveAppRef.current = null;
    setSearchOpen(false);
    setControlCenterOpen(false);
    setLanguage('en');
    setWallpaper('seongnam-night');
    setAirplaneMode(false);
    setWifiEnabled(true);
    setBluetoothEnabled(true);
    setFlashlightOn(false);
    setBrightness(100);
    setWeatherCity(null);
    setActiveChatId(null);
    setActiveCall(null);
    setExploredApps(new Set());
    setSafariTabs(INITIAL_SAFARI_TABS);
    setActiveSafariTabId('tab-allstar');
    setViewedSecondNews(false);
    setViewedArchive2008(false);
    setDormPartyDispatched(false);
    setReadDormGroupCh2(false);
    setMinhyungDispatched(false);
    setSkipChapterHintOpen(false);
    ch2EveningStartedRef.current = false;

    const initialDead =
      chapterId >= 4
        ? ['minhyung', 'tenente']
        : chapterId >= 3
        ? ['minhyung']
        : [];
    setDeadCharacters(initialDead);
    setMissingCharacters([]);
    const initialTriggers =
      chapterId >= 8
        ? [
            'ch5_wangho_mail',
            'ch5_bistro_recorded',
            'ch5_wooje_explained',
            'ch6_morning_call',
            'ch6_hyunjun_morning',
            'ch6_wangho_geumjae',
            'ch6_missing_baby_archive',
            'ch6_hyunjun_minseok_address',
            'ch6_kyu_doorstep',
            'ch6_wangho_night',
            'ch7_minseok_statement',
          ]
        : chapterId >= 7
        ? [
            'ch5_wangho_mail',
            'ch5_bistro_recorded',
            'ch5_wooje_explained',
            'ch6_morning_call',
            'ch6_hyunjun_morning',
            'ch6_wangho_geumjae',
            'ch6_missing_baby_archive',
            'ch6_hyunjun_minseok_address',
            'ch6_kyu_doorstep',
            'ch6_wangho_night',
          ]
        : chapterId >= 6
        ? ['ch5_wangho_mail', 'ch5_bistro_recorded', 'ch5_wooje_explained']
        : [];
    setActiveTriggers(initialTriggers);
    setDossiersUnlocked(chapterId >= 4);
    setCh3NewsPopupOpen(false);
    setCh3ChiefTriggered(false);
    setNightTransition(false);
    setCheckedDossierInCh3(false);
    setLivingRoomThoughtOpen(false);
    setAutoStartLivingRoomRecording(false);
    setCapturedLivingRoomRecording(false);
    setCh3VideosChiefTriggered(false);
    setRecordings(
      chapterId >= 6
        ? [CH5_BISTRO_RECORDING_SCRIPT, LIVING_ROOM_RECORDING_SCRIPT]
        : chapterId >= 4
        ? [LIVING_ROOM_RECORDING_SCRIPT]
        : []
    );
    ch3PopupShownRef.current = false;
    ch3ChiefTriggeredRef.current = false;
    nightTransitionTriggeredRef.current = false;
    livingRoomThoughtShownRef.current = false;
    ch3VideosTriggeredRef.current = false;

    setCh4NewsPopupOpen(false);
    setCh4NewsRead(false);
    setCh4DormGroupDispatched(false);
    setReadDormGroupCh4(false);
    setCh4HyunjunDispatched(false);
    setCh4ClueRevealed(false);
    setInspectedSiwooX(false);
    setInspectedSiwooIg(false);
    setInspectedMinseokX(false);
    setInspectedMinseokIg(false);
    setCh4BlackFadeTransition(false);
    setCh4UnknownAndMailDispatched(false);
    setReadUnknownChatCh4(false);
    setReadNewOfficerMailCh4(false);
    ch4PopupShownRef.current = false;
    ch4GroupDispatchedRef.current = false;
    ch4HyunjunDispatchedRef.current = false;
    ch4AfterXStartedRef.current = false;
    ch4ToCh5TriggeredRef.current = false;

    setCh5JournalCompleted(false);
    setCh5InspectorMailDispatched(false);
    setCh5InspectorMailRead(false);
    setCh5UnknownFollowupDispatched(false);
    ch5UnknownFollowupRef.current = false;
    setCh5NightTransition(false);
    setAutoStartCh5BistroRecording(false);
    setCapturedCh5BistroRecording(false);
    ch5NightTransitionTriggeredRef.current = false;
    setCh5LateNightTransition(false);
    setCh5LateNightDispatched(false);
    setCh5CheckedX(false);
    setCh5ViewedJihoonStory(false);
    setCh5WanghoWoojeReplied(false);
    setCh5ReadWoojeReply(false);
    ch5LateNightTriggeredRef.current = false;
    ch5WoojeReplyTriggeredRef.current = false;
    ch5ToCh6TriggeredRef.current = false;
    setCh6MorningDispatched(false);
    setCh6MorningCallCompleted(false);
    setCh6HyunjunMorningDispatched(false);
    setCh6WanghoThoughtOpen(false);
    setCh6CheckedWanghoSocial(false);
    setCh6WanghoFadeTransition(false);
    setCh6WanghoMessageDispatched(false);
    setCh6BabyCaseThoughtOpen(false);
    setCh6SearchedMissingBaby(false);
    setCh6ReadMissingBabyNews(false);
    setCh6GeumjaeThoughtOpen(false);
    setCh6CheckedGeumjaeX(false);
    setCh6CheckedGeumjaeIg(false);
    setCh6AfterGeumjaeFadeTransition(false);
    setCh6MailComposePending(false);
    setCh6SentInspectorMail(false);
    setCh6MinseokThoughtOpen(false);
    setCh6MinseokLikedTwo(false);
    setCh6MinseokDmThoughtOpen(false);
    setCh6KangReplyDispatched(false);
    setCh6KangReplyRead(false);
    setCh6MinseokVisitFadeTransition(false);
    setCh6HyunjunMinseokDispatched(false);
    setCh6KyuDoorstepPhase(null);
    setCh6KyuDoorstepStep(0);
    setCh6KyuDoorstepCompleted(false);
    setCh6NightWanghoFadeTransition(false);
    setCh6NightWanghoDispatched(false);
    setCh6EndOverlayOpen(false);
    setIgInitialDmAccountId(null);
    setActiveIgDmAccountId(null);
    ch6CallTriggeredRef.current = false;
    ch6HyunjunMorningTriggeredRef.current = false;
    ch6WanghoThoughtShownRef.current = false;
    ch6WanghoFadeTriggeredRef.current = false;
    ch6BabyCaseThoughtShownRef.current = false;
    ch6GeumjaeThoughtShownRef.current = false;
    ch6AfterGeumjaeFadeTriggeredRef.current = false;
    ch6MinseokThoughtShownRef.current = false;
    ch6MinseokDmThoughtShownRef.current = false;
    ch6KangReplyTriggeredRef.current = false;
    ch6MinseokVisitFadeTriggeredRef.current = false;
    ch6KyuDoorstepTriggeredRef.current = false;
    ch6NightWanghoFadeTriggeredRef.current = false;
    ch6EndTriggeredRef.current = false;
    setCh7KangClassMailDispatched(false);
    setCh7KangClassMailRead(false);
    setCh7ClassReplyPending(false);
    setCh7ClassReplySent(false);
    setCh7MinseokAudioMailDispatched(false);
    setCh7MinseokStatementHeard(false);
    setRecorderInitialRecordingId(null);
    setRecorderAutoPlayInitial(false);
    setRecorderSavedNoticeId(null);
    setCh6ViewedSiwooStory(false);
    setCh7HyunjunLunchDispatched(false);
    setCh7AfterHyunjunThoughtOpen(false);
    setCh7CheckedKyuX(false);
    setCh7CheckedJihoonX(false);
    setCh7ViewedJihoonStory(false);
    setCh7ViewedSiwooStory(false);
    setCh7MinseokDmFadeTransition(false);
    setCh7MinseokDmDispatched(false);
    setCh7KangReportThoughtOpen(false);
    setCh7KangReportMailPending(false);
    setCh7KangReportMailSent(false);
    setCh7WanghoUrgentDispatched(false);
    setCh7HospitalScenePhase(null);
    setCh7HospitalSceneStep(0);
    setCh7HospitalSceneCompleted(false);
    setCh7HomeFadeTransition(false);
    setCh7WanghoNightDispatched(false);
    setCh7WoojeThoughtOpen(false);
    setCh7WoojeThoughtDone(false);
    setCh7KangNightMailDispatched(false);
    setCh7KangNightMailRead(false);
    setCh7EndOverlayOpen(false);
    ch7ClassMailTriggeredRef.current = false;
    ch7AudioMailTriggeredRef.current = false;
    ch7HyunjunLunchTriggeredRef.current = false;
    ch7AfterHyunjunThoughtShownRef.current = false;
    ch7MinseokDmFadeTriggeredRef.current = false;
    ch7KangReportThoughtShownRef.current = false;
    ch7WanghoUrgentTriggeredRef.current = false;
    ch7HospitalSceneTriggeredRef.current = false;
    ch7HomeFadeTriggeredRef.current = false;
    ch7WoojeThoughtShownRef.current = false;
    ch7KangNightMailTriggeredRef.current = false;
    ch7EndTriggeredRef.current = false;
    setDirectMessages(
      chapterId === 7 || chapterId === 8
        ? [
            {
              id: 'dm-ig-minseok-ch6',
              accountId: 'minseok',
              platform: 'instagram',
              unread: 0,
              chapters: [6, 7, 8],
              messages: CH6_MINSEOK_IG_DM_INTRO_SCRIPT.map((step) => ({
                id: step.id,
                sender: step.sender,
                text: step.text,
                time: step.time ?? '14:37',
              })),
            },
            ...INITIAL_DIRECT_MESSAGES,
          ]
        : INITIAL_DIRECT_MESSAGES
    );

    setPhoneTime(
      chapterId === 2
        ? '09:15'
        : chapterId === 3
        ? '10:15'
        : chapterId === 4
        ? '08:30'
        : chapterId === 5
        ? '16:35'
        : chapterId === 6
        ? '08:15'
        : chapterId === 7
        ? '10:00'
        : chapterId === 8
        ? '08:15'
        : '04:00'
    );
    setChats(getChatsForChapter(chapterId));
    setMails((prev) => {
      if (chapterId === 5) {
        return [{ ...CH4_NEW_OFFICER_MAIL, unread: false }, ...INITIAL_MAILS];
      }
      if (chapterId === 6) {
        return [
          { ...CH5_INSPECTOR_WANGHO_MAIL, unread: false },
          { ...CH4_NEW_OFFICER_MAIL, unread: false },
          ...INITIAL_MAILS,
        ];
      }
      if (chapterId === 7) {
        return [
          { ...CH6_INSPECTOR_KANG_REPLY_MAIL, unread: false },
          { ...CH5_INSPECTOR_WANGHO_MAIL, unread: false },
          { ...CH4_NEW_OFFICER_MAIL, unread: false },
          ...INITIAL_MAILS,
        ];
      }
      if (chapterId === 8) {
        return [
          { ...CH7_KANG_NIGHT_SUMMONS_MAIL, unread: false },
          { ...CH6_INSPECTOR_KANG_REPLY_MAIL, unread: false },
          ...INITIAL_MAILS,
        ];
      }
      return keepUserAdditions
        ? prev.filter(
            (m) =>
              m.id !== CH4_NEW_OFFICER_MAIL.id &&
              m.id !== CH5_INSPECTOR_WANGHO_MAIL.id &&
              m.id !== CH6_INSPECTOR_KANG_REPLY_MAIL.id &&
              m.id !== CH6_INSPECTOR_BROTHER_MAIL_SCRIPT.id &&
              m.id !== CH7_KANG_CLASS_CHECK_MAIL.id &&
              m.id !== CH7_SANGHYEOK_CLASS_REPLY_SCRIPT.id &&
              m.id !== CH7_KANG_MINSEOK_AUDIO_MAIL.id &&
              m.id !== CH7_KANG_REPORT_MAIL_SCRIPT.id
          )
        : INITIAL_MAILS;
    });
    setNotes((prev) => {
      const baseNotes = getNotesForChapter(chapterId, initialDead, initialTriggers);
      if (!keepUserAdditions) return baseNotes;
      const customNotes = prev.filter((n) => !n.id.startsWith('note-ch'));
      return [...customNotes, ...baseNotes];
    });
    setCallLogs(getCallLogsForChapter(chapterId));
    setJournalEntries((prev) => {
      const baseEntries = getJournalForChapter(chapterId === 5 ? 4 : chapterId);
      if (!keepUserAdditions) return baseEntries;
      const customEntries = prev.filter(
        (e) => e.id.startsWith('j-') && e.id !== CH5_JOURNAL_SCRIPT.id
      );
      return [...customEntries, ...baseEntries];
    });

    if (chapterId === 2) {
      setPostedNewsIds(['allstar-2008', 'burned-vehicle']);
      dispatchedNewsIdsRef.current = new Set(['allstar-2008', 'burned-vehicle']);
      setLockNotifications([HYUNJUN_DAY2_NOTIFICATION]);
      setBannerNotifications([HYUNJUN_DAY2_NOTIFICATION]);
    } else if (chapterId === 3) {
      setPostedNewsIds(['allstar-2008', 'burned-vehicle', 'minhyung-murder']);
      dispatchedNewsIdsRef.current = new Set([
        'allstar-2008',
        'burned-vehicle',
        'minhyung-murder',
      ]);
      setLockNotifications([MINHYUNG_NEWS_NOTIFICATION]);
      setBannerNotifications([MINHYUNG_NEWS_NOTIFICATION]);
    } else if (chapterId === 4) {
      setPostedNewsIds([
        'allstar-2008',
        'burned-vehicle',
        'minhyung-murder',
        'chief-murder',
      ]);
      dispatchedNewsIdsRef.current = new Set([
        'allstar-2008',
        'burned-vehicle',
        'minhyung-murder',
        'chief-murder',
      ]);
      setLockNotifications([CH4_CHIEF_NEWS_NOTIFICATION]);
      setBannerNotifications([CH4_CHIEF_NEWS_NOTIFICATION]);
    } else if (chapterId === 5 || chapterId === 6 || chapterId === 7 || chapterId === 8) {
      setPostedNewsIds([
        'allstar-2008',
        'burned-vehicle',
        'minhyung-murder',
        'chief-murder',
        'twinskulls-influencers-murder',
      ]);
      dispatchedNewsIdsRef.current = new Set([
        'allstar-2008',
        'burned-vehicle',
        'minhyung-murder',
        'chief-murder',
        'twinskulls-influencers-murder',
      ]);
      setLockNotifications([]);
      setBannerNotifications([]);
    } else {
      setPostedNewsIds(['allstar-2008']);
      dispatchedNewsIdsRef.current = new Set(['allstar-2008']);
      setLockNotifications([
        INITIAL_EMERGENCY_NOTIFICATION,
        CHIEF_INITIAL_NOTIFICATION,
      ]);
      setBannerNotifications([
        INITIAL_EMERGENCY_NOTIFICATION,
        CHIEF_INITIAL_NOTIFICATION,
      ]);
    }
  };

  const handleResetDemo = () => {
    const ch = selectedChapter ?? 1;
    setChapterPromptOpen(false);
    setDismissedPromptChapters((prev) => prev.filter((id) => id !== ch));
    resetForChapter(ch);
  };

  const handleAdvanceWithTransition = (nextId: number) => {
    const hasNext = chapters.some((c) => c.id === nextId);
    if (!hasNext) return;

    clearTransitionTimers();
    setChapterPromptOpen(false);
    setSkipChapterHintOpen(false);
    setControlCenterOpen(false);
    setSearchOpen(false);

    setChapters((prev) =>
      prev.map((c) =>
        c.id === nextId
          ? {
              ...c,
              unlocked: true,
              subtitle:
                nextId === 2
                  ? 'Friday, October 23 · Unlocked'
                  : nextId === 3
                  ? 'Saturday, October 24 · Unlocked'
                  : nextId === 5
                  ? 'Sunday, October 25 · Afternoon · Unlocked'
                  : nextId === 6
                  ? 'Monday, October 26 · Morning · Unlocked'
                  : nextId === 7
                  ? 'Tuesday, October 27 · Morning · Unlocked'
                  : 'Sunday, October 25 · Unlocked',
            }
          : c
      )
    );

    setChapterTransition({ phase: 'fade-to-black', targetChapter: nextId });

    const t1 = setTimeout(() => {
      resetForChapter(nextId, true);
      setSelectedChapter(nextId);
      setDismissedPromptChapters((prev) => prev.filter((id) => id !== nextId));
      setChapterTransition({ phase: 'title', targetChapter: nextId });
    }, 600);

    const t2 = setTimeout(() => {
      setChapterTransition({ phase: 'fade-out', targetChapter: nextId });
    }, 2350);

    const t3 = setTimeout(() => {
      setChapterTransition(null);
    }, 2950);

    transitionTimersRef.current = [t1, t2, t3];
  };

  const handleSkipChapter = () => {
    if (selectedChapter === null) return;
    handleAdvanceWithTransition(selectedChapter + 1);
  };

  const unreadMailCount = mails.filter((m) => m.unread).length;
  const unreadWhatsappCount = chats.reduce((acc, c) => acc + c.unread, 0);

  if (selectedChapter === null) {
    return (
      <ChapterSelectScreen
        chapters={chapters}
        onSelectChapter={(chapterId) => {
          clearTransitionTimers();
          setChapterTransition(null);
          setChapterPromptOpen(false);
          setDismissedPromptChapters((prev) => prev.filter((id) => id !== chapterId));
          resetForChapter(chapterId);
          setSelectedChapter(chapterId);
        }}
      />
    );
  }

  const transitionTargetInfo = chapterTransition
    ? chapters.find((c) => c.id === chapterTransition.targetChapter)
    : undefined;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-black sm:px-3 sm:py-4">
      {/* Quick Preview Switcher on Desktop only */}
      <div className="relative z-10 mb-3 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md sm:flex">
        <button
          type="button"
          onClick={() => {
            clearTransitionTimers();
            setChapterTransition(null);
            setChapterPromptOpen(false);
            setSelectedChapter(null);
          }}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-indigo-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Chapters
        </button>
        <span className="h-3.5 w-px bg-white/15" />
        <span className="inline-flex items-center gap-1.5 px-2 text-[12px] font-medium text-zinc-300">
          <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
          Lee S. · Ch. {selectedChapter}
        </span>
        <span className="h-3.5 w-px bg-white/15" />
        <button
          type="button"
          onClick={() => {
            setIsLocked(true);
            setActiveApp(null);
          }}
          className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
            isLocked ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'
          }`}
        >
          Lock Screen
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLocked(false);
            setActiveApp(null);
          }}
          className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
            !isLocked && !activeApp
              ? 'bg-white text-black'
              : 'text-zinc-300 hover:bg-white/10'
          }`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveChatId(null);
            handleOpenApp('whatsapp');
          }}
          className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
            !isLocked && activeApp === 'whatsapp'
              ? 'bg-white text-black'
              : 'text-zinc-300 hover:bg-white/10'
          }`}
        >
          WhatsApp
        </button>
        <span className="h-3.5 w-px bg-white/15" />
        <button
          type="button"
          onClick={handleResetDemo}
          title="Reset phone state"
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Mobile-first full viewport container; tall 9:16 iPhone chassis on desktop */}
      <div className="relative z-10 flex h-[100dvh] w-full max-w-[430px] flex-col bg-black sm:h-[880px] sm:min-h-[700px] sm:max-h-[calc(100dvh-64px)] sm:max-w-[380px] sm:rounded-[54px] sm:border-[4px] sm:border-[#2c2c32] sm:bg-[#141418] sm:p-[11px] sm:shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_0_2px_1px_rgba(255,255,255,0.12)]">
        {/* Hardware Side Buttons (desktop frame) */}
        <div className="pointer-events-none absolute top-[128px] -left-[7px] hidden h-7 w-[3px] rounded-l-sm bg-[#323238] sm:block" />
        <div className="pointer-events-none absolute top-[176px] -left-[7px] hidden h-14 w-[3px] rounded-l-sm bg-[#323238] sm:block" />
        <div className="pointer-events-none absolute top-[244px] -left-[7px] hidden h-14 w-[3px] rounded-l-sm bg-[#323238] sm:block" />
        <button
          type="button"
          onClick={() => {
            setIsLocked((v) => !v);
            setControlCenterOpen(false);
          }}
          title="Power / Lock button"
          aria-label="Lock or Wake Phone"
          className="absolute top-[192px] -right-[8px] hidden h-20 w-[4px] rounded-r-sm bg-[#3b3b42] transition-colors hover:bg-white/60 sm:block"
        />

        {/* Inner Display Screen */}
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-black sm:rounded-[44px]">
          {/* Wallpaper (visible behind LockScreen & HomeScreen) */}
          <Wallpaper
            wallpaper={wallpaper}
            blurred={searchOpen || controlCenterOpen}
          />

          {/* Flashlight Illumination Glow */}
          {flashlightOn && (
            <div
              className="pointer-events-none absolute inset-0 z-30"
              style={{
                background:
                  'radial-gradient(circle at 20% 88%, rgba(255,255,235,0.28) 0%, transparent 55%)',
              }}
            />
          )}

          {/* Persistent Top Status Bar */}
          <StatusBar
            timeStr={timeStr}
            airplaneMode={airplaneMode}
            wifiEnabled={wifiEnabled}
            activeCall={activeCall}
            lightSurface={
              !isLocked &&
              !controlCenterOpen &&
              (activeApp === 'x' ||
                activeApp === 'photos' ||
                (activeApp === 'instagram' && !igStoryOpen))
            }
            onOpenControlCenter={() => setControlCenterOpen((v) => !v)}
            onTapDynamicIsland={() => {
              if (activeCall) handleOpenApp('phone');
            }}
          />

          {/* Screen Body (Wallpaper + HomeScreen + LockScreen) */}
          <div className="relative flex-1 overflow-hidden">
            {/* Home Screen underneath */}
            {!isLocked && !activeApp && (
              <HomeScreen
                weekdayLabel={weekdayLabel}
                dayNumber={dayNumber}
                chapterNumber={selectedChapter}
                journalEntries={journalEntries}
                weatherCity={weatherCity}
                tempUnit={tempUnit}
                unreadMailCount={unreadMailCount}
                unreadWhatsappCount={unreadWhatsappCount}
                dossiersUnlocked={dossiersUnlocked}
                onOpenApp={handleOpenApp}
                onOpenSearch={() => setSearchOpen(true)}
              />
            )}

            {/* Lock Screen Overlay */}
            <AnimatePresence>
              {isLocked && (
                <LockScreen
                  timeStr={timeStr}
                  dateLabel={dateLabel}
                  language={language}
                  flashlightOn={flashlightOn}
                  notifications={lockNotifications}
                  onTapNotification={handleTapNotification}
                  onToggleLanguage={() =>
                    setLanguage((l) => (l === 'en' ? 'pt' : 'en'))
                  }
                  onToggleFlashlight={() => setFlashlightOn((v) => !v)}
                  onUnlock={handleUnlock}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Open App Window (edge-to-edge behind StatusBar) */}
          <AnimatePresence>
            {!isLocked && activeApp && (
              <motion.div
                key={activeApp}
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 24 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute inset-0 z-20 flex flex-col overflow-hidden ${
                  activeApp === 'x' ||
                  activeApp === 'photos' ||
                  (activeApp === 'instagram' && !igStoryOpen)
                    ? 'bg-white'
                    : 'bg-black'
                }`}
              >
                {/* Floating < Home Capsule consistent across all open apps */}
                {!(activeApp === 'instagram' && igStoryOpen) && (
                  <button
                    type="button"
                    onClick={handleGoHome}
                    aria-label="Back to Home Screen"
                    className={`absolute top-[50px] left-3.5 z-30 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[13px] font-medium backdrop-blur-xl transition-transform active:scale-95 ${
                      activeApp === 'x' ||
                      activeApp === 'photos' ||
                      (activeApp === 'instagram' && !igStoryOpen)
                        ? 'border-black/[0.06] bg-white/90 text-zinc-900 shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:bg-white'
                        : 'border-white/15 bg-white/[0.12] text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:bg-white/[0.18]'
                    }`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Home</span>
                  </button>
                )}

                <div className="flex-1 overflow-hidden">
                    {activeApp === 'whatsapp' && (
                      <WhatsAppApp
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={(id) => {
                          setActiveChatId(id);
                          if (id) {
                            setChats((prev) =>
                              prev.map((c) =>
                                c.id === id ? { ...c, unread: 0 } : c
                              )
                            );
                          }
                        }}
                        onSendMessage={handleSendWhatsApp}
                        onSkipMessages={handleSkipWhatsApp}
                        onAdvanceTime={advancePhoneTime}
                        onStartCall={handleStartCall}
                        onOpenMaps={() => handleOpenApp('maps')}
                        onOpenDossiers={() => handleOpenApp('dossiers')}
                      />
                    )}
                    {activeApp === 'dossiers' && (
                      <DossiersApp
                        dossiers={dossiers}
                        chapterNumber={selectedChapter}
                        onInspectDossier={() => {
                          if (selectedChapter === 3) {
                            setCheckedDossierInCh3(true);
                          }
                        }}
                      />
                    )}
                    {activeApp === 'recorder' && (
                      <VoiceMemosApp
                        recordings={recordings}
                        liveScript={
                          selectedChapter === 3 && !capturedLivingRoomRecording
                            ? LIVING_ROOM_RECORDING_SCRIPT
                            : selectedChapter === 5 &&
                              ch5BistroConfirmed &&
                              !capturedCh5BistroRecording
                            ? CH5_BISTRO_RECORDING_SCRIPT
                            : null
                        }
                        autoStartLive={
                          selectedChapter === 5
                            ? autoStartCh5BistroRecording
                            : autoStartLivingRoomRecording
                        }
                        initialRecordingId={recorderInitialRecordingId}
                        autoPlayInitial={recorderAutoPlayInitial}
                        savedNoticeRecordingId={recorderSavedNoticeId}
                        completedRecordingIds={
                          ch7MinseokStatementHeard
                            ? [CH7_MINSEOK_STATEMENT_RECORDING.id]
                            : []
                        }
                        onConsumeAutoStart={() => {
                          setAutoStartLivingRoomRecording(false);
                          setAutoStartCh5BistroRecording(false);
                        }}
                        onConsumeInitialRecording={() => {
                          setRecorderInitialRecordingId(null);
                          setRecorderAutoPlayInitial(false);
                        }}
                        onCompletePlayback={handleCompleteVoiceRecordingPlayback}
                        onFinishLiveRecording={(saved) => {
                          if (selectedChapter === 5) {
                            setCapturedCh5BistroRecording(true);
                            setActiveTriggers((prev) =>
                              prev.includes('ch5_bistro_recorded')
                                ? prev
                                : [...prev, 'ch5_bistro_recorded']
                            );
                          } else {
                            setCapturedLivingRoomRecording(true);
                          }
                          setRecordings((prev) =>
                            prev.some((r) => r.id === saved.id) ? prev : [saved, ...prev]
                          );
                        }}
                        onAddManualRecording={(manual) =>
                          setRecordings((prev) => [manual, ...prev])
                        }
                      />
                    )}
                    {activeApp === 'narrations' && (
                      <NarrationsApp memos={narrationMemos} />
                    )}
                    {activeApp === 'photos' && (
                      <PhotosApp
                        photos={photos}
                        initialTab={photosInitialTab}
                        onOpenCamera={() => handleOpenApp('camera')}
                        onToggleFav={(id) =>
                          setPhotos((prev) =>
                            prev.map((p) =>
                              p.id === id ? { ...p, favorite: !p.favorite } : p
                            )
                          )
                        }
                        onDeletePhoto={(id) =>
                          setPhotos((prev) => prev.filter((p) => p.id !== id))
                        }
                      />
                    )}
                    {activeApp === 'mail' && (
                      <MailApp
                        mails={mails}
                        scriptedCompose={
                          selectedChapter === 6 &&
                          ch6MailComposePending &&
                          !ch6SentInspectorMail
                            ? CH6_INSPECTOR_BROTHER_MAIL_SCRIPT
                            : selectedChapter === 7 &&
                              ch7ClassReplyPending &&
                              !ch7ClassReplySent
                            ? CH7_SANGHYEOK_CLASS_REPLY_SCRIPT
                            : selectedChapter === 7 &&
                              ch7KangReportMailPending &&
                              !ch7KangReportMailSent
                            ? CH7_KANG_REPORT_MAIL_SCRIPT
                            : null
                        }
                        autoStartScripted={
                          (selectedChapter === 6 &&
                            ch6MailComposePending &&
                            !ch6SentInspectorMail &&
                            !ch6AfterGeumjaeFadeTransition) ||
                          (selectedChapter === 7 &&
                            ch7ClassReplyPending &&
                            !ch7ClassReplySent &&
                            !chapterTransition) ||
                          (selectedChapter === 7 &&
                            ch7KangReportMailPending &&
                            !ch7KangReportMailSent &&
                            !chapterTransition)
                        }
                        repliedMailIds={
                          ch7ClassReplySent ? [CH7_KANG_CLASS_CHECK_MAIL.id] : []
                        }
                        savedAudioRecordingIds={recordings.map((r) => r.id)}
                        completedAudioMailIds={
                          ch7MinseokStatementHeard
                            ? [CH7_KANG_MINSEOK_AUDIO_MAIL.id]
                            : []
                        }
                        onCompleteScriptedMail={(compose) => {
                          if (compose.id === CH7_SANGHYEOK_CLASS_REPLY_SCRIPT.id) {
                            handleCompleteCh7ClassReply(compose);
                          } else if (compose.id === CH7_KANG_REPORT_MAIL_SCRIPT.id) {
                            handleCompleteCh7KangReportMail(compose);
                          } else {
                            handleCompleteCh6InspectorMail(compose);
                          }
                        }}
                        onQuickReplyMail={handleQuickReplyMail}
                        onOpenAudioAttachment={handleOpenMailAudioAttachment}
                        onReadMail={(id) => {
                          setMails((prev) =>
                            prev.map((m) =>
                              m.id === id ? { ...m, unread: false } : m
                            )
                          );
                          if (id === CH4_NEW_OFFICER_MAIL.id) {
                            setReadNewOfficerMailCh4(true);
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH4_NEW_OFFICER_MAIL_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH4_NEW_OFFICER_MAIL_NOTIFICATION.id
                              )
                            );
                          }
                          if (id === CH5_INSPECTOR_WANGHO_MAIL.id) {
                            setCh5InspectorMailRead(true);
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH5_INSPECTOR_WANGHO_MAIL_NOTIFICATION.id
                              )
                            );
                          }
                          if (id === CH6_INSPECTOR_KANG_REPLY_MAIL.id) {
                            setCh6KangReplyRead(true);
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH6_INSPECTOR_KANG_REPLY_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH6_INSPECTOR_KANG_REPLY_NOTIFICATION.id
                              )
                            );
                          }
                          if (id === CH7_KANG_CLASS_CHECK_MAIL.id) {
                            setCh7KangClassMailRead(true);
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_CLASS_CHECK_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_CLASS_CHECK_NOTIFICATION.id
                              )
                            );
                          }
                          if (id === CH7_KANG_MINSEOK_AUDIO_MAIL.id) {
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_MINSEOK_AUDIO_NOTIFICATION.id
                              )
                            );
                          }
                          if (id === CH7_KANG_NIGHT_SUMMONS_MAIL.id) {
                            setCh7KangNightMailRead(true);
                            setLockNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_NIGHT_SUMMONS_NOTIFICATION.id
                              )
                            );
                            setBannerNotifications((prev) =>
                              prev.filter(
                                (n) => n.id !== CH7_KANG_NIGHT_SUMMONS_NOTIFICATION.id
                              )
                            );
                            setJournalEntries((prev) =>
                              prev.map((entry) =>
                                entry.id === 'j7' &&
                                !entry.body.includes(CH7_JOURNAL_AFTER_KANG_NIGHT_ADDENDUM)
                                  ? {
                                      ...entry,
                                      body: `${entry.body}\n\n${CH7_JOURNAL_AFTER_KANG_NIGHT_ADDENDUM}`,
                                    }
                                  : entry
                              )
                            );
                          }
                        }}
                        onSendMail={(to, subject, body) =>
                          setMails((prev) => [
                            {
                              id: `sent-${Date.now()}`,
                              from: `To: ${to}`,
                              email: to,
                              subject,
                              preview: body.slice(0, 60),
                              body,
                              time: 'Just now',
                              unread: false,
                            },
                            ...prev,
                          ])
                        }
                      />
                    )}
                    {activeApp === 'weather' && (
                      <WeatherApp
                        selectedCity={weatherCity}
                        tempUnit={tempUnit}
                        onSelectCity={setWeatherCity}
                        onToggleUnit={() =>
                          setTempUnit((u) => (u === 'C' ? 'F' : 'C'))
                        }
                      />
                    )}
                    {activeApp === 'calendar' && (
                      <CalendarApp
                        events={events}
                        onAddEvent={(day, title, time, location) =>
                          setEvents((prev) => [
                            ...prev,
                            {
                              id: `ev-${Date.now()}`,
                              day,
                              title,
                              time,
                              location,
                              color: '#3b82f6',
                            },
                          ])
                        }
                      />
                    )}
                    {activeApp === 'notes' && (
                      <NotesApp
                        notes={notes}
                        onSaveNote={(updated) =>
                          setNotes((prev) =>
                            prev.map((n) => (n.id === updated.id ? updated : n))
                          )
                        }
                        onCreateNote={() => {
                          const item: NoteItem = {
                            id: `note-${Date.now()}`,
                            title: '',
                            body: '',
                            updatedAt: 'Just now',
                          };
                          setNotes((prev) => [item, ...prev]);
                          return item;
                        }}
                        onDeleteNote={(id) =>
                          setNotes((prev) => prev.filter((n) => n.id !== id))
                        }
                      />
                    )}
                    {activeApp === 'maps' && (
                      <MapsApp chapter={selectedChapter} />
                    )}
                    {activeApp === 'camera' && (
                      <CameraApp
                        latestPhoto={photos[0]}
                        onCapturePhoto={(photo) =>
                          setPhotos((prev) => [photo, ...prev])
                        }
                        onOpenCameraRoll={() => {
                          setPhotosInitialTab('camera');
                          handleOpenApp('photos');
                        }}
                      />
                    )}
                    {activeApp === 'clock' && (
                      <ClockApp
                        alarms={alarms}
                        onToggleAlarm={(id) =>
                          setAlarms((prev) =>
                            prev.map((a) =>
                              a.id === id ? { ...a, enabled: !a.enabled } : a
                            )
                          )
                        }
                      />
                    )}
                    {activeApp === 'x' && (
                      <XApp
                        posts={tweets
                          .filter((p) => {
                            if (!p.chapters) return true;
                            if (p.chapters.length === 1 && p.chapters[0] === 5) {
                              return (
                                (selectedChapter === 5 && ch5LateNightDispatched) ||
                                selectedChapter >= 6
                              );
                            }
                            return (
                              p.chapters.includes(selectedChapter) ||
                              (selectedChapter >= 5 && p.chapters.includes(4))
                            );
                          })
                          .sort(
                            (a, b) =>
                              getPostRelativeSortMinutes(
                                a.time,
                                a.createdChapter,
                                selectedChapter
                              ) -
                              getPostRelativeSortMinutes(
                                b.time,
                                b.createdChapter,
                                selectedChapter
                              )
                          )
                          .map((p) => ({
                            ...p,
                            time: formatPostRelativeDay(
                              p.time,
                              p.createdChapter,
                              selectedChapter
                            ),
                            comments: p.comments?.map((c) => ({
                              ...c,
                              time: formatPostRelativeDay(
                                c.time,
                                c.createdChapter ?? p.createdChapter,
                                selectedChapter
                              ),
                            })),
                          }))}
                        dmThreads={directMessages.filter(
                          (t) =>
                            t.platform === 'x' &&
                            (!t.chapters || t.chapters.includes(selectedChapter))
                        )}
                        onSelectProfile={(accountId) => {
                          if (selectedChapter === 4) {
                            if (accountId === 'siwoo') setInspectedSiwooX(true);
                            if (accountId === 'minseok') setInspectedMinseokX(true);
                          }
                          if (
                            selectedChapter === 5 &&
                            ch5LateNightDispatched &&
                            accountId === 'kyu'
                          ) {
                            setCh5CheckedX(true);
                          }
                          if (selectedChapter === 6) {
                            if (accountId === 'wangho') {
                              setCh6CheckedWanghoSocial(true);
                            }
                            if (accountId === 'geumjae') {
                              setCh6CheckedGeumjaeX(true);
                            }
                          }
                          if (selectedChapter === 7) {
                            if (accountId === 'kyu') setCh7CheckedKyuX(true);
                            if (accountId === 'jihoon') setCh7CheckedJihoonX(true);
                          }
                        }}
                        onSendDm={(accountId, text) =>
                          handleSendDirectMessage('x', accountId, text)
                        }
                        onReadDm={(accountId) =>
                          handleMarkDmRead('x', accountId)
                        }
                        onToggleLike={(id) =>
                          setTweets((prev) =>
                            prev.map((p) =>
                              p.id === id
                                ? {
                                    ...p,
                                    liked: !p.liked,
                                    likes: p.liked ? p.likes - 1 : p.likes + 1,
                                  }
                                : p
                            )
                          )
                        }
                        onToggleRepost={(id) =>
                          setTweets((prev) =>
                            prev.map((p) =>
                              p.id === id
                                ? {
                                    ...p,
                                    reposted: !p.reposted,
                                    reposts: p.reposted
                                      ? p.reposts - 1
                                      : p.reposts + 1,
                                  }
                                : p
                            )
                          )
                        }
                        onToggleBookmark={(id) =>
                          setTweets((prev) =>
                            prev.map((p) =>
                              p.id === id
                                ? { ...p, bookmarked: !p.bookmarked }
                                : p
                            )
                          )
                        }
                        onAddComment={(postId, text) =>
                          setTweets((prev) =>
                            prev.map((p) =>
                              p.id === postId
                                ? {
                                    ...p,
                                    comments: [
                                      ...(p.comments ?? []),
                                      {
                                        id: `xc-${Date.now()}`,
                                        accountId: 'sanghyeok',
                                        author: 'Lee Sanghyeok',
                                        handle: '@sanghyeok_lee',
                                        time: 'today',
                                        createdChapter: selectedChapter,
                                        text,
                                      },
                                    ],
                                  }
                                : p
                            )
                          )
                        }
                        onCreatePost={(text, community) =>
                          setTweets((prev) => [
                            {
                              id: `tw-${Date.now()}`,
                              accountId: 'sanghyeok',
                              author: 'Lee Sanghyeok',
                              handle: '@sanghyeok_lee',
                              time: 'today',
                              createdChapter: selectedChapter,
                              text,
                              likes: 0,
                              liked: false,
                              reposts: 0,
                              reposted: false,
                              bookmarked: false,
                              community,
                              badge: community === 'university' ? '304' : undefined,
                            },
                            ...prev,
                          ])
                        }
                      />
                    )}
                    {activeApp === 'journal' && (
                      <JournalApp
                        entries={journalEntries}
                        readOnly={selectedChapter >= 5}
                        scriptedIntro={
                          selectedChapter === 5 && !ch5JournalCompleted
                            ? CH5_JOURNAL_SCRIPT
                            : null
                        }
                        autoStartScripted={
                          selectedChapter === 5 &&
                          !ch5JournalCompleted &&
                          !chapterTransition
                        }
                        onCompleteScriptedIntro={handleCompleteCh5JournalIntro}
                        onAddEntry={(title, body, mood) =>
                          setJournalEntries((prev) => [
                            {
                              id: `j-${Date.now()}`,
                              title,
                              body,
                              mood,
                              date:
                                selectedChapter === 7
                                  ? 'Tuesday, Oct 27'
                                  : selectedChapter === 6
                                  ? 'Monday, Oct 26'
                                  : selectedChapter === 4 || selectedChapter === 5
                                  ? 'Sunday, Oct 25'
                                  : selectedChapter === 3
                                  ? 'Saturday, Oct 24'
                                  : selectedChapter === 2
                                  ? 'Friday, Oct 23'
                                  : 'Thursday, Oct 22',
                            },
                            ...prev,
                          ])
                        }
                      />
                    )}
                    {activeApp === 'instagram' && (
                      <InstagramApp
                        posts={igPosts
                          .filter(
                            (p) =>
                              !p.chapters ||
                              p.chapters.includes(selectedChapter) ||
                              (selectedChapter >= 5 && p.chapters.includes(4))
                          )
                          .sort(
                            (a, b) =>
                              getPostRelativeSortMinutes(
                                a.time,
                                a.createdChapter,
                                selectedChapter
                              ) -
                              getPostRelativeSortMinutes(
                                b.time,
                                b.createdChapter,
                                selectedChapter
                              )
                          )
                          .map((p) => ({
                            ...p,
                            time: formatPostRelativeDay(
                              p.time,
                              p.createdChapter,
                              selectedChapter
                            ),
                            comments: p.comments?.map((c) => ({
                              ...c,
                              time: formatPostRelativeDay(
                                c.time,
                                c.createdChapter ?? p.createdChapter,
                                selectedChapter
                              ),
                            })),
                          }))}
                        stories={
                          selectedChapter === 5 && ch5LateNightDispatched
                            ? [
                                {
                                  ...CH5_JIHOON_DINNER_STORY,
                                  seen: ch5ViewedJihoonStory,
                                },
                              ]
                            : selectedChapter === 6
                            ? [
                                {
                                  ...CH6_SIWOO_GAS_STORY,
                                  seen: ch6ViewedSiwooStory,
                                },
                                {
                                  ...CH5_JIHOON_DINNER_STORY,
                                  time: 'Sun · 22:54',
                                  seen: true,
                                },
                              ]
                            : selectedChapter >= 7
                            ? [
                                {
                                  ...CH6_SIWOO_GAS_STORY,
                                  seen: ch7ViewedSiwooStory,
                                },
                                {
                                  ...CH5_JIHOON_DINNER_STORY,
                                  time: 'Sun · 22:54',
                                  seen: ch7ViewedJihoonStory,
                                },
                              ]
                            : []
                        }
                        onViewStory={(storyId) => {
                          if (storyId === CH5_JIHOON_DINNER_STORY.id) {
                            if (selectedChapter === 5) setCh5ViewedJihoonStory(true);
                            if (selectedChapter === 7) setCh7ViewedJihoonStory(true);
                          }
                          if (storyId === CH6_SIWOO_GAS_STORY.id) {
                            if (selectedChapter === 6) setCh6ViewedSiwooStory(true);
                            if (selectedChapter === 7) setCh7ViewedSiwooStory(true);
                          }
                        }}
                        onSelectProfile={(accountId) => {
                          if (selectedChapter === 4) {
                            if (accountId === 'siwoo') setInspectedSiwooIg(true);
                            if (accountId === 'minseok') setInspectedMinseokIg(true);
                          }
                          if (selectedChapter === 6 && accountId === 'geumjae') {
                            setCh6CheckedGeumjaeIg(true);
                          }
                        }}
                        initialDmAccountId={igInitialDmAccountId}
                        onConsumeInitialDm={() => setIgInitialDmAccountId(null)}
                        dmThreads={directMessages.filter(
                          (t) =>
                            t.platform === 'instagram' &&
                            (!t.chapters || t.chapters.includes(selectedChapter))
                        )}
                        onSendDm={(accountId, text, timeOverride) =>
                          handleSendDirectMessage(
                            'instagram',
                            accountId,
                            text,
                            timeOverride
                          )
                        }
                        onSkipDm={(accountId) =>
                          handleSkipDirectMessage('instagram', accountId)
                        }
                        onAdvanceTime={advancePhoneTime}
                        onReadDm={(accountId) =>
                          handleMarkDmRead('instagram', accountId)
                        }
                        onActiveDmChange={setActiveIgDmAccountId}
                        onStoryOpenChange={setIgStoryOpen}
                        onToggleLike={(id) =>
                          setIgPosts((prev) =>
                            prev.map((p) =>
                              p.id === id
                                ? {
                                    ...p,
                                    liked: !p.liked,
                                    likes: p.liked ? p.likes - 1 : p.likes + 1,
                                  }
                                : p
                            )
                          )
                        }
                        onToggleSave={(id) =>
                          setIgPosts((prev) =>
                            prev.map((p) =>
                              p.id === id ? { ...p, saved: !p.saved } : p
                            )
                          )
                        }
                        onAddComment={(postId, text) =>
                          setIgPosts((prev) =>
                            prev.map((p) =>
                              p.id === postId
                                ? {
                                    ...p,
                                    comments: [
                                      ...(p.comments ?? []),
                                      {
                                        id: `igc-${Date.now()}`,
                                        accountId: 'sanghyeok',
                                        author: 'Lee Sanghyeok',
                                        handle: 'lee.sanghyeok',
                                        time: 'today',
                                        createdChapter: selectedChapter,
                                        text,
                                      },
                                    ],
                                  }
                                : p
                            )
                          )
                        }
                      />
                    )}
                    {activeApp === 'phone' && (
                      <PhoneApp
                        activeCall={activeCall}
                        callLogs={callLogs}
                        onStartCall={handleStartCall}
                        onEndCall={handleEndCall}
                        onAcceptCall={handleAcceptIncomingCall}
                        onCompleteScriptedCall={handleCompleteScriptedCall}
                      />
                    )}
                    {activeApp === 'safari' && (
                      <SafariApp
                        unlockedSecondArticle={postedNewsIds.includes('burned-vehicle')}
                        unlockedThirdArticle={postedNewsIds.includes('minhyung-murder')}
                        unlockedFourthArticle={postedNewsIds.includes('chief-murder')}
                        unlockedMissingChildArchive={selectedChapter >= 6}
                        tabs={safariTabs}
                        activeTabId={activeSafariTabId}
                        onSelectTab={setActiveSafariTabId}
                        onCloseTab={handleCloseSafariTab}
                        onOpenArticleTab={handleOpenArticleTab}
                        onCreateGoogleTab={() => handleCreateGoogleTab()}
                        onUpdateTabQuery={handleUpdateSafariTabQuery}
                        onReachArticleBottom={handleReachArticleBottom}
                      />
                    )}
                  </div>

                  {/* Swipe-up or Tap Home Indicator Bar inside any open app */}
                  <motion.button
                    type="button"
                    drag="y"
                    dragConstraints={{ top: -80, bottom: 0 }}
                    dragSnapToOrigin
                    onDragEnd={handleHomeBarDragEnd}
                    onClick={handleGoHome}
                    aria-label="Return to Home Screen"
                    className="absolute right-0 bottom-0 left-0 z-40 flex h-6 cursor-pointer items-end justify-center pb-1.5"
                  >
                    <span
                      className={`h-[5px] w-[134px] rounded-full ${
                        activeApp === 'x' ||
                        activeApp === 'photos' ||
                        (activeApp === 'instagram' && !igStoryOpen)
                          ? 'bg-zinc-900/75'
                          : 'bg-white/90 shadow'
                      }`}
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          {/* Live Top iOS Push Notification Banner Stack when unlocked */}
          <AnimatePresence>
            {!isLocked && bannerNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -36, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -28, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[52px] right-3 left-3 z-50 flex flex-col gap-2"
              >
                {bannerNotifications.map((banner) => {
                  const isEmergency = banner.app === 'emergency';
                  return (
                    <div
                      key={banner.id}
                      className={`flex items-start gap-2.5 rounded-[22px] border p-3 shadow-[0_14px_34px_rgba(0,0,0,0.68)] backdrop-blur-xl ${
                        isEmergency
                          ? 'border-red-500/50 bg-[#2a090d]/95'
                          : 'border-white/15 bg-[#1b1c22]/92'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleTapNotification(banner)}
                        className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      >
                        <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[13px] font-bold text-white">
                          {isEmergency ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-inner">
                              <AlertTriangle className="h-4 w-4" />
                            </span>
                          ) : banner.app === 'google' ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[16px] font-black text-[#4285F4]">
                              G
                            </span>
                          ) : banner.app === 'mail' ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-inner">
                              <Mail className="h-4 w-4" />
                            </span>
                          ) : banner.app === 'phone' ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#34c759] text-white shadow-inner">
                              <Phone className="h-4 w-4" />
                            </span>
                          ) : banner.app === 'instagram' ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white shadow-inner">
                              <Instagram className="h-4 w-4" />
                            </span>
                          ) : (
                            <>
                              <span>{banner.title[0]}</span>
                              <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-[5px] bg-[#25d366] text-[9px] font-bold text-white">
                                W
                              </span>
                            </>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`truncate ${
                                isEmergency
                                  ? 'text-[11.5px] font-bold tracking-wider text-red-400 uppercase'
                                  : 'text-[13px] font-semibold text-white'
                              }`}
                            >
                              {banner.title}
                            </span>
                            <span className="shrink-0 text-[10.5px] text-zinc-400 tabular-nums">
                              {banner.time}
                            </span>
                          </div>
                          {banner.subtitle && (
                            <p className="mt-0.5 truncate text-[12px] font-semibold text-white">
                              {banner.subtitle}
                            </p>
                          )}
                          <p
                            className={`mt-0.5 text-[12px] leading-snug ${
                              isEmergency
                                ? 'line-clamp-3 text-red-100/90'
                                : 'line-clamp-2 text-zinc-200'
                            }`}
                          >
                            {banner.body}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setBannerNotifications((prev) =>
                            prev.filter((n) => n.id !== banner.id)
                          )
                        }
                        aria-label="Dismiss notification"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotlight Search Overlay */}
          <AnimatePresence>
            {searchOpen && !isLocked && (
              <SpotlightSearch
                notes={notes}
                chats={chats}
                dossiersUnlocked={dossiersUnlocked}
                onClose={() => setSearchOpen(false)}
                onOpenApp={handleOpenApp}
              />
            )}
          </AnimatePresence>

          {/* Control Center & Help Bar Overlay */}
          <AnimatePresence>
            {controlCenterOpen && (
              <ControlCenter
                chapterNumber={selectedChapter}
                hasNextChapter={chapters.some((c) => c.id === selectedChapter + 1)}
                chapterTasks={chapterTasks}
                airplaneMode={airplaneMode}
                wifiEnabled={wifiEnabled}
                bluetoothEnabled={bluetoothEnabled}
                flashlightOn={flashlightOn}
                brightness={brightness}
                onToggleAirplane={() => setAirplaneMode((v) => !v)}
                onToggleWifi={() => setWifiEnabled((v) => !v)}
                onToggleBluetooth={() => setBluetoothEnabled((v) => !v)}
                onToggleFlashlight={() => setFlashlightOn((v) => !v)}
                onChangeBrightness={setBrightness}
                onLockPhone={() => {
                  setControlCenterOpen(false);
                  setIsLocked(true);
                }}
                onSkipChapter={handleSkipChapter}
                onReturnHome={() => {
                  setControlCenterOpen(false);
                  clearTransitionTimers();
                  setChapterTransition(null);
                  setChapterPromptOpen(false);
                  setSelectedChapter(null);
                }}
                onClose={() => setControlCenterOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Chapter Completed Confirmation Popup */}
          <AnimatePresence>
            {chapterPromptOpen &&
              !chapterTransition &&
              (selectedChapter === 1 || selectedChapter === 2 || selectedChapter === 3) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 z-[55] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[300px] overflow-hidden rounded-[24px] border border-white/15 bg-[#1c1c21]/95 text-center shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
                >
                  <div className="px-5 pt-5 pb-4">
                    <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wider text-emerald-300 uppercase">
                      Chapter 0{selectedChapter} Complete
                    </span>
                    <h3 className="mt-2.5 text-[17px] font-bold tracking-tight text-white">
                      Advance to Chapter {selectedChapter + 1}?
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">
                      All investigation tasks for this chapter are finished. You can advance now, or advance later if you want to see more things on the phone first.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setChapterPromptOpen(false);
                        setDismissedPromptChapters((prev) =>
                          prev.includes(selectedChapter)
                            ? prev
                            : [...prev, selectedChapter]
                        );
                        setSkipChapterHintOpen(true);
                      }}
                      className="py-3 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Not Yet
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdvanceWithTransition(selectedChapter + 1)}
                      className="py-3 text-[14px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/15 hover:text-blue-300"
                    >
                      Yes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip Chapter Control Bar Instruction Banner (after clicking Not Yet) */}
          <AnimatePresence>
            {skipChapterHintOpen && !chapterPromptOpen && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-4 bottom-8 left-4 z-[54] rounded-2xl border border-white/15 bg-[#1b1c22]/95 p-3.5 shadow-[0_18px_42px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white">
                      Exploring freely
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-300">
                      You can go to the next chapter anytime by swiping down the{' '}
                      <span className="font-semibold text-white">Control Bar</span>{' '}
                      and clicking on{' '}
                      <span className="font-semibold text-amber-300">
                        Skip Chapter
                      </span>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSkipChapterHintOpen(false)}
                    aria-label="Close message"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 3 Breaking News Popup — Lee Minhyung Found Dead */}
          <AnimatePresence>
            {ch3NewsPopupOpen && !isLocked && !chapterTransition && !nightTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[56] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-red-500/35 bg-[#17181f]/98 shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <Newspaper className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] font-bold tracking-[0.14em] uppercase">
                        Breaking News · Gyeong-gwan
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[16.5px] leading-snug font-bold text-white">
                      Young man found dead in the woods near Dohyeon&apos;s house
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">
                      Police identified the victim as 24-year-old Dorm 304 student{' '}
                      <span className="font-semibold text-white">Lee Minhyung</span>.
                      Read the full Gyeong-gwan Herald report carefully.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCh3NewsPopupOpen(false)}
                      className="min-h-[44px] text-[13.5px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Later
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCh3NewsPopupOpen(false);
                        handleOpenArticleTab('minhyung-murder');
                        handleOpenApp('safari');
                      }}
                      className="min-h-[44px] text-[13.5px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/15 hover:text-blue-300"
                    >
                      Read Report
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 4 Breaking News Popup — Chief Lieutenant & Wife Murdered, Electronics Destroyed */}
          <AnimatePresence>
            {ch4NewsPopupOpen && !isLocked && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[56] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-red-500/40 bg-[#17181f]/98 shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <Newspaper className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] font-bold tracking-[0.14em] uppercase">
                        Urgent News · Gyeong-gwan
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[16.5px] leading-snug font-bold text-white">
                      Police Lieutenant and wife murdered at home; all electronics destroyed
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">
                      Every device inside the residence—including the{' '}
                      <span className="font-semibold text-white">party video footage</span>{' '}
                      submitted last night—was smashed before dawn.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCh4NewsPopupOpen(false)}
                      className="min-h-[44px] text-[13.5px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Later
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCh4NewsPopupOpen(false);
                        handleOpenArticleTab('chief-murder');
                        handleOpenApp('safari');
                      }}
                      className="min-h-[44px] text-[13.5px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/15 hover:text-blue-300"
                    >
                      Read Report
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Living Room Voice Recording */}
          <AnimatePresence>
            {livingRoomThoughtOpen && !isLocked && !chapterTransition && !nightTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.button
                  type="button"
                  onClick={() => {
                    setLivingRoomThoughtOpen(false);
                    advancePhoneTime('20:52');
                    setAutoStartLivingRoomRecording(true);
                    handleOpenApp('recorder');
                  }}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)] transition-colors hover:border-red-400/40"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mic className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                        Lee Sanghyeok
                      </span>
                    </div>
                    <p className="mt-2.5 text-[15px] leading-relaxed font-medium text-white italic">
                      &ldquo;Moon and Hyunjun are talking in the living room, maybe I should record this.&rdquo;
                    </p>
                  </div>
                  <div className="flex min-h-[46px] items-center justify-center gap-2 border-t border-white/10 bg-red-500/12 px-4 text-[13.5px] font-semibold text-red-400">
                    <Mic className="h-4 w-4" />
                    <span>Open Voice Memos &amp; Record</span>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 6 Investigate Wangho */}
          <AnimatePresence>
            {ch6WanghoThoughtOpen && !isLocked && !chapterTransition && !ch6WanghoFadeTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 shrink-0 text-sky-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCh6WanghoThoughtOpen(false)}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;I need to investigate Wangho too. Why was that woman at the precinct demanding a restraining order against him? Let me check his X profile first.&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCh6WanghoThoughtOpen(false);
                      handleOpenApp('x');
                    }}
                    className="flex w-full min-h-[46px] items-center justify-center gap-2 border-t border-white/10 bg-sky-500/15 px-4 text-[13px] font-semibold text-sky-400 transition-colors hover:bg-sky-500/25 hover:text-sky-300"
                  >
                    <span>Open X</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 6 Missing Baby Case Search */}
          <AnimatePresence>
            {ch6BabyCaseThoughtOpen && !isLocked && !chapterTransition && !ch6WanghoFadeTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 shrink-0 text-blue-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCh6BabyCaseThoughtOpen(false)}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;Before anything else, I should investigate the missing baby case further—could there be something online? Wangho&apos;s point isn&apos;t something to throw away. If the baby really is his brother, that resident becomes a suspect.&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCh6BabyCaseThoughtOpen(false);
                      handleOpenSafariSearch('2008 missing children south korea');
                    }}
                    className="flex w-full min-h-[48px] items-center justify-center gap-2 border-t border-white/10 bg-blue-500/15 px-4 text-[13px] font-semibold text-blue-300 transition-colors hover:bg-blue-500/25 hover:text-blue-200"
                  >
                    <Search className="h-4 w-4 shrink-0" />
                    <span>Open Safari &amp; Search Case</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 6 Investigate Geumjae Socials */}
          <AnimatePresence>
            {ch6GeumjaeThoughtOpen &&
              !isLocked &&
              !chapterTransition &&
              !ch6WanghoFadeTransition &&
              !ch6AfterGeumjaeFadeTransition && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 8 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                  >
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-center justify-between gap-2 text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                            Lee Sanghyeok
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCh6GeumjaeThoughtOpen(false)}
                          aria-label="Close thought"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                        &ldquo;If that missing baby really is Wangho&apos;s lost brother, let me look into Geumjae&apos;s socials first—see if there&apos;s a photo of him or anything connected to 2008.&rdquo;
                      </p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => {
                          setCh6GeumjaeThoughtOpen(false);
                          handleOpenApp('x');
                        }}
                        className="min-h-[44px] text-[13px] font-semibold text-sky-400 transition-colors hover:bg-sky-500/15 hover:text-sky-300"
                      >
                        Open X
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCh6GeumjaeThoughtOpen(false);
                          handleOpenApp('instagram');
                        }}
                        className="min-h-[44px] text-[13px] font-semibold text-pink-400 transition-colors hover:bg-pink-500/15 hover:text-pink-300"
                      >
                        Open Instagram
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 6 Get in Touch with Minseok */}
          <AnimatePresence>
            {ch6MinseokThoughtOpen &&
              !isLocked &&
              !chapterTransition &&
              !ch6AfterGeumjaeFadeTransition && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 8 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                  >
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-center justify-between gap-2 text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 shrink-0 text-pink-400" />
                          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                            Lee Sanghyeok
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCh6MinseokThoughtOpen(false)}
                          aria-label="Close thought"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                        &ldquo;I should probably try to get in touch with Minseok while I wait for his response... Let me open Minseok&apos;s Instagram and like his posts first.&rdquo;
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCh6MinseokThoughtOpen(false);
                        handleOpenApp('instagram');
                      }}
                      className="flex w-full min-h-[46px] items-center justify-center gap-2 border-t border-white/10 bg-pink-500/15 px-4 text-[13px] font-semibold text-pink-300 transition-colors hover:bg-pink-500/25 hover:text-pink-200"
                    >
                      <Instagram className="h-4 w-4 shrink-0" />
                      <span>Open Instagram</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 6 Maybe Send Minseok a Message */}
          <AnimatePresence>
            {ch6MinseokDmThoughtOpen && !isLocked && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 shrink-0 text-purple-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCh6MinseokDmThoughtOpen(false)}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;Maybe if I send him a message...?&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCh6MinseokDmThoughtOpen(false);
                      setIgInitialDmAccountId('minseok');
                      handleOpenApp('instagram');
                    }}
                    className="flex w-full min-h-[46px] items-center justify-center gap-2 border-t border-white/10 bg-purple-500/18 px-4 text-[13px] font-semibold text-purple-200 transition-colors hover:bg-purple-500/28 hover:text-white"
                  >
                    <Instagram className="h-4 w-4 shrink-0" />
                    <span>Message Minseok on Instagram</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 7 Check Kyu & Jihoon on X and Instagram */}
          <AnimatePresence>
            {ch7AfterHyunjunThoughtOpen && !isLocked && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 shrink-0 text-sky-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCh7AfterHyunjunThoughtOpen(false)}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;Minseok mentioned Kyu and Jihoon, what were they doing by that time?&rdquo;
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => {
                        setCh7AfterHyunjunThoughtOpen(false);
                        handleOpenApp('x');
                      }}
                      className="min-h-[44px] text-[13px] font-semibold text-sky-400 transition-colors hover:bg-sky-500/15 hover:text-sky-300"
                    >
                      Open X
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCh7AfterHyunjunThoughtOpen(false);
                        handleOpenApp('instagram');
                      }}
                      className="min-h-[44px] text-[13px] font-semibold text-pink-400 transition-colors hover:bg-pink-500/15 hover:text-pink-300"
                    >
                      Open Instagram
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 7 Report Back to Inspector Kang via Email */}
          <AnimatePresence>
            {ch7KangReportThoughtOpen && !isLocked && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-sky-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCh7KangReportThoughtOpen(false)}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;I should probably report back to Inspector Kang about everything I found.&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCh7KangReportThoughtOpen(false);
                      setCh7KangReportMailPending(true);
                      handleOpenApp('mail');
                    }}
                    className="flex w-full min-h-[46px] items-center justify-center gap-2 border-t border-white/10 bg-sky-500/18 px-4 text-[13px] font-semibold text-sky-300 transition-colors hover:bg-sky-500/28 hover:text-white"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>Open Email</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 Fade-to-Black Transition -> Two Hours Later (17:10) Asking Hyunjun Where Minseok Lives */}
          <AnimatePresence>
            {ch6MinseokVisitFadeTransition && (
              <motion.div
                key="ch6-minseok-visit-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Two Hours Later
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  17:10
                </p>
                <p className="mt-2 max-w-[245px] text-[13px] leading-relaxed text-zinc-400">
                  Still no reply from Minseok on Instagram. Asking Hyunjun where he lives...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 Black-Screen Encounter (17:40) -> Sanghyeok & Kyu at Minseok's Doorstep */}
          <AnimatePresence>
            {ch6KyuDoorstepPhase && (
              <motion.div
                key="ch6-kyu-doorstep-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                onClick={() => {
                  if (ch6KyuDoorstepPhase !== 'subtitles') return;
                  if (
                    ch6KyuDoorstepStep <
                    CH6_KYU_DOORSTEP_SUBTITLES.length - 1
                  ) {
                    setCh6KyuDoorstepStep((prev) => prev + 1);
                  } else {
                    handleFinishCh6KyuDoorstep();
                  }
                }}
                className={`absolute inset-0 z-[59] flex flex-col bg-black px-7 text-center select-none ${
                  ch6KyuDoorstepPhase === 'subtitles'
                    ? 'cursor-pointer justify-between pt-14 pb-11'
                    : 'items-center justify-center'
                }`}
              >
                {ch6KyuDoorstepPhase === 'intro' ? (
                  <>
                    <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                      Thirty Minutes Later
                    </span>
                    <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                      17:40
                    </p>
                    <p className="mt-2 max-w-[245px] text-[13px] leading-relaxed text-zinc-400">
                      Seongnam Side-Street House...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="font-mono tracking-[0.18em] uppercase tabular-nums">
                        17:40 · {ch6KyuDoorstepStep + 1} /{' '}
                        {CH6_KYU_DOORSTEP_SUBTITLES.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinishCh6KyuDoorstep();
                        }}
                        className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Skip
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {(() => {
                        const beat =
                          CH6_KYU_DOORSTEP_SUBTITLES[ch6KyuDoorstepStep];
                        if (!beat) return null;
                        return (
                          <motion.div
                            key={beat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
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
                              className={`max-w-[295px] text-[15px] leading-[1.7] ${
                                beat.kind === 'narration'
                                  ? 'font-normal text-zinc-300 italic'
                                  : 'font-medium text-white'
                              }`}
                            >
                              {beat.text}
                            </p>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {CH6_KYU_DOORSTEP_SUBTITLES.map((item, idx) => (
                          <span
                            key={item.id}
                            className={`h-1 rounded-full transition-all ${
                              idx === ch6KyuDoorstepStep
                                ? 'w-5 bg-white/80'
                                : idx < ch6KyuDoorstepStep
                                ? 'w-1.5 bg-white/35'
                                : 'w-1.5 bg-white/15'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
                        {ch6KyuDoorstepStep <
                        CH6_KYU_DOORSTEP_SUBTITLES.length - 1
                          ? 'Tap anywhere to continue'
                          : 'Tap anywhere to finish'}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 7 Fade-to-Black Transition -> 16:00 Minseok Finally Replies on Instagram DM */}
          <AnimatePresence>
            {ch7MinseokDmFadeTransition && (
              <motion.div
                key="ch7-minseok-dm-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Afternoon
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  16:00
                </p>
                <p className="mt-2 max-w-[250px] text-[13px] leading-relaxed text-zinc-400">
                  A few hours pass back at Dorm 304...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 7 Black-Screen Scene (19:00) -> Gyeong-gwan General Hospital Observation */}
          <AnimatePresence>
            {ch7HospitalScenePhase && (
              <motion.div
                key="ch7-hospital-scene-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                onClick={() => {
                  if (ch7HospitalScenePhase !== 'subtitles') return;
                  if (
                    ch7HospitalSceneStep <
                    CH7_HOSPITAL_SUBTITLES.length - 1
                  ) {
                    setCh7HospitalSceneStep((prev) => prev + 1);
                  } else {
                    handleFinishCh7HospitalScene();
                  }
                }}
                className={`absolute inset-0 z-[59] flex flex-col bg-black px-7 text-center select-none ${
                  ch7HospitalScenePhase === 'subtitles'
                    ? 'cursor-pointer justify-between pt-14 pb-11'
                    : 'items-center justify-center'
                }`}
              >
                {ch7HospitalScenePhase === 'intro' ? (
                  <>
                    <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                      Later That Evening
                    </span>
                    <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                      19:00
                    </p>
                    <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-zinc-400">
                      Gyeong-gwan General Hospital · Diagnostic Wing...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="font-mono tracking-[0.18em] uppercase tabular-nums">
                        19:00 · {ch7HospitalSceneStep + 1} /{' '}
                        {CH7_HOSPITAL_SUBTITLES.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinishCh7HospitalScene();
                        }}
                        className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Skip
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {(() => {
                        const beat =
                          CH7_HOSPITAL_SUBTITLES[ch7HospitalSceneStep];
                        if (!beat) return null;
                        return (
                          <motion.div
                            key={beat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
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
                        );
                      })()}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {CH7_HOSPITAL_SUBTITLES.map((item, idx) => (
                          <span
                            key={item.id}
                            className={`h-1 rounded-full transition-all ${
                              idx === ch7HospitalSceneStep
                                ? 'w-5 bg-white/80'
                                : idx < ch7HospitalSceneStep
                                ? 'w-1.5 bg-white/35'
                                : 'w-1.5 bg-white/15'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
                        {ch7HospitalSceneStep <
                        CH7_HOSPITAL_SUBTITLES.length - 1
                          ? 'Tap anywhere to continue'
                          : 'Tap anywhere to finish'}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 7 Fade-to-Black Transition -> 19:45 Returning Home to Dorm 304 */}
          <AnimatePresence>
            {ch7HomeFadeTransition && (
              <motion.div
                key="ch7-home-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Thirty Minutes Later
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  19:45
                </p>
                <p className="mt-2 max-w-[250px] text-[13px] leading-relaxed text-zinc-400">
                  Returning to Dorm 304...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sanghyeok Inner Thought Popup — Chapter 7 Suspicion About Wooje at the Hospital */}
          <AnimatePresence>
            {ch7WoojeThoughtOpen && !isLocked && !chapterTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[57] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[310px] overflow-hidden rounded-[22px] border border-white/15 bg-[#15171e]/98 text-left shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 shrink-0 text-amber-400" />
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                          Lee Sanghyeok
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCh7WoojeThoughtOpen(false);
                          setCh7WoojeThoughtDone(true);
                        }}
                        aria-label="Close thought"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed font-medium text-white italic">
                      &ldquo;What could Wooje have been doing at the hospital? I know Wangho told me not to suspect him, but this whole situation feels pretty strange.&rdquo;
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => {
                        setCh7WoojeThoughtOpen(false);
                        setCh7WoojeThoughtDone(true);
                        handleOpenApp('instagram');
                      }}
                      className="min-h-[44px] text-[13px] font-semibold text-pink-400 transition-colors hover:bg-pink-500/15 hover:text-pink-300"
                    >
                      Open Instagram
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCh7WoojeThoughtOpen(false);
                        setCh7WoojeThoughtDone(true);
                      }}
                      className="min-h-[44px] text-[13px] font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 7 End Screen -> Triggers after reading Inspector Kang's night summons email & returning to Home Screen */}
          <AnimatePresence>
            {ch7EndOverlayOpen && (
              <motion.div
                key="ch7-end-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeInOut' }}
                className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black px-7 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">
                  End of Chapter 07
                </span>
                <h2 className="mt-3 text-[24px] font-bold tracking-tight text-white">
                  Midnight Summons
                </h2>
                <p className="mt-1 text-[12px] font-medium tracking-[0.14em] text-zinc-500 uppercase">
                  October 27 · 19:58
                </p>
                <p className="mt-5 max-w-[260px] text-[13.5px] leading-relaxed text-zinc-300">
                  While Wangho heads out to game with Wooje, Sanghyeok waits quietly inside Dorm 304 for Inspector Kang’s unmarked escort to review the McDonald’s and neighborhood CCTV footage caught overnight.
                </p>
                <div className="mt-8 flex w-full max-w-[235px] flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCh7EndOverlayOpen(false);
                      handleAdvanceWithTransition(8);
                    }}
                    className="min-h-[44px] w-full rounded-xl bg-white px-4 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    Advance to Chapter 08
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCh7EndOverlayOpen(false);
                      setSelectedChapter(null);
                    }}
                    className="min-h-[42px] w-full rounded-xl border border-white/15 bg-white/10 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/15"
                  >
                    Return to Chapter Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setCh7EndOverlayOpen(false)}
                    className="min-h-[40px] w-full rounded-xl border border-white/10 bg-transparent px-4 text-[12.5px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Keep Exploring Phone
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 Fade-to-Black Transition -> 22:00 Night Chat with Han Wangho */}
          <AnimatePresence>
            {ch6NightWanghoFadeTransition && (
              <motion.div
                key="ch6-night-wangho-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Night
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  22:00
                </p>
                <p className="mt-2 max-w-[245px] text-[13px] leading-relaxed text-zinc-400">
                  Back at Dorm 304...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 End Screen -> Triggers after finishing 22:00 Wangho chat & returning to Home Screen */}
          <AnimatePresence>
            {ch6EndOverlayOpen && (
              <motion.div
                key="ch6-end-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeInOut' }}
                className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black px-7 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">
                  End of Chapter 06
                </span>
                <h2 className="mt-3 text-[24px] font-bold tracking-tight text-white">
                  Monday Night
                </h2>
                <p className="mt-1 text-[12px] font-medium tracking-[0.14em] text-zinc-500 uppercase">
                  October 26 · 22:08
                </p>
                <p className="mt-5 max-w-[260px] text-[13.5px] leading-relaxed text-zinc-300">
                  Sanghyeok puts his phone down to get some sleep. Minseok is still missing, Geumjae refuses to speak, and too many questions remain for tomorrow.
                </p>
                <div className="mt-8 flex w-full max-w-[235px] flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCh6EndOverlayOpen(false);
                      handleAdvanceWithTransition(7);
                    }}
                    className="min-h-[44px] w-full rounded-xl bg-white px-4 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    Advance to Chapter 07
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCh6EndOverlayOpen(false);
                      setSelectedChapter(null);
                    }}
                    className="min-h-[42px] w-full rounded-xl border border-white/15 bg-white/10 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/15"
                  >
                    Return to Chapter Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setCh6EndOverlayOpen(false)}
                    className="min-h-[40px] w-full rounded-xl border border-white/10 bg-transparent px-4 text-[12.5px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Keep Exploring Phone
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 Fade-to-Black Transition -> Han Wangho Messages Sanghyeok (10:45) */}
          <AnimatePresence>
            {ch6WanghoFadeTransition && (
              <motion.div
                key="ch6-wangho-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Morning
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  10:45
                </p>
                <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
                  Back at Dorm 304...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 6 Fade-to-Black Transition -> Some Hours Passed (14:30) Emailing Inspector Kang */}
          <AnimatePresence>
            {ch6AfterGeumjaeFadeTransition && (
              <motion.div
                key="ch6-after-geumjae-fade-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Some Hours Passed
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  14:30
                </p>
                <p className="mt-2 max-w-[245px] text-[13px] leading-relaxed text-zinc-400">
                  Nothing on Geumjae&apos;s socials—not even a single photo of him. Writing to Inspector Kang...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Night Fade-to-Black Transition (Chapter 3 Post-Interrogation -> 20:45) */}
          <AnimatePresence>
            {nightTransition && (
              <motion.div
                key="ch3-night-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Night
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  20:45
                </p>
                <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
                  Returning to Dorm 304 after precinct questioning...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 4 Post-X Fade-to-Black Transition -> Unknown Number & New Officer Mail */}
          <AnimatePresence>
            {ch4BlackFadeTransition && (
              <motion.div
                key="ch4-after-x-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Afternoon
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  14:15
                </p>
                <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
                  Hours after checking Siwoo and Minseok&apos;s timelines...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 5 Night Fade-to-Black Transition -> Riverside Bistro Voice Recording */}
          <AnimatePresence>
            {ch5NightTransition && (
              <motion.div
                key="ch5-night-bistro-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Night
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  21:15
                </p>
                <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
                  Meeting Han Wangho at Riverside Bistro...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter 5 Late Night Cut Transition -> 23:00 Back at Dorm 304 */}
          <AnimatePresence>
            {ch5LateNightTransition && (
              <motion.div
                key="ch5-late-night-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Later That Night
                </span>
                <p className="mt-3 text-[24px] font-bold tracking-tight text-white tabular-nums">
                  23:00
                </p>
                <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-zinc-400">
                  Back inside Dorm 304...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fade-to-Black Chapter Title Transition Overlay */}
          <AnimatePresence>
            {chapterTransition && (
              <motion.div
                key="chapter-transition-overlay"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: chapterTransition.phase === 'fade-out' ? 0 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black px-8 text-center"
              >
                <AnimatePresence mode="wait">
                  {chapterTransition.phase === 'title' && (
                    <motion.div
                      key={`ch-title-${chapterTransition.targetChapter}`}
                      initial={{ opacity: 0, scale: 0.94, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.03, y: -4 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">
                        The Bunny Cursed
                      </span>
                      <h2 className="mt-3 text-[34px] font-bold tracking-tight text-white">
                        Chapter {chapterTransition.targetChapter}
                      </h2>
                      {transitionTargetInfo && (
                        <p className="mt-1.5 text-[13.5px] font-medium text-zinc-400">
                          {transitionTargetInfo.title}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brightness Overlay */}
          {brightness < 100 && (
            <div
              className="pointer-events-none absolute inset-0 z-50 bg-black"
              style={{ opacity: (100 - brightness) / 130 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
