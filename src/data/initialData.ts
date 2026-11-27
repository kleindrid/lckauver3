import {
  AlarmItem,
  BlackScreenSubtitleBeat,
  CalendarEvent,
  CallLogItem,
  CallScriptLine,
  ChapterInfo,
  CharacterAccount,
  CharacterDossier,
  DirectMessageItem,
  DirectMessageThread,
  IgPost,
  IgStoryItem,
  JournalEntry,
  JournalScriptedIntro,
  MailItem,
  MailScriptedCompose,
  NarrationMemoItem,
  NewsArticle,
  NoteItem,
  PhotoItem,
  ScriptedChatStep,
  SocialPost,
  VoiceRecordingItem,
  WeatherCity,
  WhatsAppChat,
  WhatsAppMessage,
} from '../types/phone';
import jihoonDinnerImg from '../assets/images/jihoon_suhwan_dinner_1795549583832.jpg';
import dormDeskRamenImg from '../assets/images/dorm_desk_ramen_1795458710161.jpg';
import dormHallwayNightImg from '../assets/images/dorm_hallway_night_1795458710991.jpg';
import dormWindowStreetImg from '../assets/images/dorm_window_street_1795458710655.jpg';
import dormKitchenNightImg from '../assets/images/dorm_kitchen_night_1795458711193.jpg';
import { resolveAssetUrl } from '../utils/assets';
import {
  loadChatsForChapter,
  loadComposeMailById,
  loadDossiersForState,
  loadEmailById,
  loadGalleryFolderPhotos,
  loadInitialMails,
  loadJournalAddendumById,
  loadJournalByChapterList,
  loadJournalEntryById,
  loadJournalScriptedIntro,
  loadNarrationMemo,
  loadNewsArticles,
  loadNotesForChapter,
  loadProfileAvatars,
  loadProfileIgPosts,
  loadProfileXPosts,
  loadRecordingScript,
} from './contentLoader';

const PROFILE_AVATARS = loadProfileAvatars();

// Uploaded social media icons (WhatsApp, X, Instagram only — never used on Case Files)
const RAW_SOCIAL_MEDIA_AVATARS: Record<string, string> = {
  ...PROFILE_AVATARS,
  dohyeon: '/assets/aistudio/Dohyeon_54ba48bc.png',
  wangho: '/assets/aistudio/Wangho_16f58163.png',
  hyunjun: '/assets/aistudio/Hyunjun_bbecb531.png',
  jihoon: '/assets/aistudio/Jihoon_6aef5e78.png',
  kyu: '/assets/aistudio/Hyukkyu_8961c897.png',
  hyukkyu: '/assets/aistudio/Hyukkyu_8961c897.png',
  minhyung: '/assets/aistudio/minhyung_faeccdee.png',
  minseok: '/assets/aistudio/minseok_6f53edbb.png',
  hyungseok: '/assets/aistudio/Moon_16f68cdc.jpg',
  moon: '/assets/aistudio/Moon_16f68cdc.jpg',
  chaewon: '/assets/aistudio/BAEKCHAEWON_c6256561.jpg',
  seoyun: '/assets/aistudio/HANSEOYUN_cebf9276.jpg',
  soyeon: '/assets/aistudio/KANGSOYEON_dbe80e14.jpg',
  yuna: '/assets/aistudio/PARKMINA_f4f1bf14.jpg',
  mina: '/assets/aistudio/SONGMINA_4283b085.jpg',
  wooje: '/assets/aistudio/Wooje_82a7c0c1.jpeg',
  geumjae: '/assets/aistudio/geumjae_dd9cc008.jpg',
  jaehyuk: '/assets/aistudio/jaehyuk_547fff0f.jpg',
  jaehyuck: '/assets/aistudio/jaehyuk_547fff0f.jpg',
  kiin: '/assets/aistudio/kiin_ab2cd0d8.jpg',
  kwanghee: '/assets/aistudio/kwanghee_efd3e62e.jpg',
  mingyu: '/assets/aistudio/mingyu_8a294312.jpg',
  sanghyeok: '/assets/aistudio/sanghyeok_d6878c10.jpg',
  siwoo: '/assets/aistudio/siwoo_cb90276a.jpg',
  suhwan: '/assets/aistudio/suhwan_4520cf29.jpg',
  eunji: '/assets/aistudio/eunji_3e4b949a.jpg',
  twinskulls: '/assets/aistudio/image_27a05910.png',
};

const SOCIAL_MEDIA_AVATARS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_SOCIAL_MEDIA_AVATARS).map(([k, v]) => [k, resolveAssetUrl(v) || v])
);

export const CHAPTERS: ChapterInfo[] = [
  {
    id: 1,
    code: 'Chapter 01',
    title: 'Undercover at the Dorm',
    subtitle: 'Thursday, October 22 · Unlocked',
    summary:
      'Detective Lee Sanghyeok goes undercover as a quiet university student in Dorm 304 to observe the residents after the AllStar band garage murders and the vault breach.',
    unlocked: true,
  },
  {
    id: 2,
    code: 'Chapter 02',
    title: 'Day 02 — Morning After',
    subtitle: 'Friday, October 23 · Unlocked',
    summary:
      'Day 2 begins in Dorm 304. Hyunjun texts anxiously about a routine trip to the grocery market while precinct files tie the stolen costume to Dohyeon’s circle.',
    unlocked: true,
  },
  {
    id: 3,
    code: 'Chapter 03',
    title: 'Day 03 — After the Party',
    subtitle: 'Saturday, October 24 · Unlocked',
    summary:
      'Morning breaks after Dohyeon’s party to devastating news: a young resident has been found dead in the woods nearby. Everyone at the party faces precinct questioning.',
    unlocked: true,
  },
  {
    id: 4,
    code: 'Chapter 04',
    title: 'Day 04 — Silence at the Station',
    subtitle: 'Sunday, October 25 · Unlocked',
    summary:
      'Pre-dawn tragedy strikes the precinct as the Chief Lieutenant and his wife are murdered at home and every electronic device—including the party footage—is destroyed.',
    unlocked: true,
  },
  {
    id: 5,
    code: 'Chapter 05',
    title: 'Day 05 — A Voice in the Dark',
    subtitle: 'Sunday, October 25 · Afternoon · Unlocked',
    summary:
      'Inside Dorm 304, Sanghyeok weighs the unknown number’s offer to meet at a safe spot while Inspector Kang reveals who his trusted protégé really is.',
    unlocked: true,
  },
  {
    id: 6,
    code: 'Chapter 06',
    title: 'Day 06 — Precinct Breach',
    subtitle: 'Monday, October 26 · Morning · Unlocked',
    summary:
      'Morning breaks to an urgent precinct call from Inspector Kang as Dohyeon storms the station using his father’s badge, followed by alarming news from Hyunjun.',
    unlocked: true,
  },
  {
    id: 7,
    code: 'Chapter 07',
    title: 'Day 07 — The Survivor’s Voice',
    subtitle: 'Tuesday, October 27 · Morning · Unlocked',
    summary:
      'During morning class at 10:00 AM, Inspector Kang sends an urgent email asking if Sanghyeok can listen privately—followed by a harrowing audio statement from Ryu Minseok.',
    unlocked: true,
  },
];

export const NEWS_ARTICLES: NewsArticle[] = loadNewsArticles();

const EXTRA_CHAT_AVATARS: Record<string, string> = {
  police: PROFILE_AVATARS.chief_lieutenant,
  tenente: PROFILE_AVATARS.chief_lieutenant,
  dorm304: PROFILE_AVATARS.dorm_304,
  republica: PROFILE_AVATARS.dorm_304,
};

export function getChatsForChapter(chapterId: number): WhatsAppChat[] {
  return loadChatsForChapter(chapterId, SOCIAL_MEDIA_AVATARS, EXTRA_CHAT_AVATARS);
}

export function getTriggeredChatForChapter(
  chapterId: number,
  chatId: string,
  triggerName: string
): WhatsAppChat | undefined {
  return loadChatsForChapter(
    chapterId,
    SOCIAL_MEDIA_AVATARS,
    EXTRA_CHAT_AVATARS,
    triggerName
  ).find((c) => c.id === chatId);
}

export const INITIAL_WHATSAPP_CHATS: WhatsAppChat[] = getChatsForChapter(1);

export function getNotesForChapter(
  chapterId: number,
  deadCharacterIds: string[] = [],
  activeTriggers: string[] = []
): NoteItem[] {
  return loadNotesForChapter(chapterId, deadCharacterIds, activeTriggers);
}

export function getDossiersForState(
  chapterId: number,
  deadCharacterIds: string[] = [],
  activeTriggers: string[] = [],
  missingCharacterIds: string[] = []
): CharacterDossier[] {
  return loadDossiersForState(
    chapterId,
    PROFILE_AVATARS,
    deadCharacterIds,
    activeTriggers,
    missingCharacterIds
  );
}

export const INITIAL_NOTES: NoteItem[] = getNotesForChapter(1);

export const LIVING_ROOM_RECORDING_SCRIPT: VoiceRecordingItem =
  loadRecordingScript('chapter3_living_room') ?? {
    id: 'chapter3_living_room',
    title: 'Dorm 304 — Living Room',
    date: 'Oct 24 · 20:52',
    durationSeconds: 45,
    lines: [
      {
        id: 'lr-1',
        speaker: 'Hyunjun',
        atSeconds: 1,
        text: 'I’ve already told my mom. I’m dropping out of college and getting out of here.',
      },
      {
        id: 'lr-2',
        speaker: 'Moon',
        atSeconds: 5,
        text: "But... you won't be able to leave town while you're under investigation.",
      },
      {
        id: 'lr-3',
        speaker: 'Hyunjun',
        atSeconds: 9,
        text: "I'm going to talk to them at the police station. I have nothing to do with this... (saddened) And I have nothing to do with these deaths. They can't force me to stay here.",
      },
      {
        id: 'lr-4',
        speaker: 'Moon',
        atSeconds: 15,
        text: 'You said you were afraid of (...), but to me, he seems so normal...',
      },
      {
        id: 'lr-5',
        speaker: 'Hyunjun',
        atSeconds: 19,
        text: 'Has it ever crossed your mind that it could be him?',
      },
      {
        id: 'lr-6',
        speaker: 'Moon',
        atSeconds: 23,
        text: "I don't think he would do something like that.",
      },
      {
        id: 'lr-7',
        speaker: 'Hyunjun',
        atSeconds: 27,
        text: 'Before we went to the party, he stalked (...) all the way down the street.',
      },
      {
        id: 'lr-8',
        speaker: 'Moon',
        atSeconds: 31,
        text: "But he wouldn't kill someone over that, right?",
      },
      {
        id: 'lr-9',
        speaker: 'Hyunjun',
        atSeconds: 35,
        text: "Huh? What's going on? Why are you defending him?",
      },
      {
        id: 'lr-10',
        speaker: 'Moon',
        atSeconds: 39,
        text: "I'm not...",
      },
      {
        id: 'lr-11',
        speaker: 'Hyunjun',
        atSeconds: 42,
        text: "I'm going to sleep...",
      },
    ],
  };

export const CH5_BISTRO_RECORDING_SCRIPT: VoiceRecordingItem =
  loadRecordingScript('chapter5_bistro') ?? {
    id: 'chapter5_bistro',
    title: 'Riverside Bistro — Corner Booth',
    date: 'Oct 25 · 21:15',
    durationSeconds: 80,
    lines: [
      {
        id: 'bistro-1',
        speaker: 'Han Wangho',
        atSeconds: 1,
        text: "Sit with your back to the partition and keep the phone flat under your sleeve. Don't look toward the entrance—if anyone from the precinct spots us together, both our covers are blown.",
      },
      {
        id: 'bistro-2',
        speaker: 'Lee Sanghyeok',
        atSeconds: 6,
        text: "I read Inspector Kang's encrypted briefing. He vouched for you, Han Wangho—the kid who survived the 2008 home invasion. Why operate completely off-grid instead of working inside the station?",
      },
      {
        id: 'bistro-3',
        speaker: 'Han Wangho',
        atSeconds: 12,
        text: "Because Gyeong-gwan PD isn't just leaking—someone inside is actively steering this case. In 2008, my parents were killed and my baby brother vanished without a trace. Half the witness logs from that night mysteriously disappeared from precinct archives.",
      },
      {
        id: 'bistro-4',
        speaker: 'Lee Sanghyeok',
        atSeconds: 19,
        text: "Look at what happened before dawn. Dohyeon handed over party video files and Minhyung's confiscated phone to the Chief Lieutenant—and hours later, the Lieutenant and his wife were murdered at home with every electronic device smashed.",
      },
      {
        id: 'bistro-5',
        speaker: 'Han Wangho',
        atSeconds: 26,
        text: "Whoever struck his house knew the exact hour he planned to watch those drives. Even the 2008 rabbit costume wasn't broken out of the evidence vault—an internal officer badge cleared that vault door at 01:12 AM the night AllStar died.",
      },
      {
        id: 'bistro-6',
        speaker: 'Lee Sanghyeok',
        atSeconds: 33,
        text: "An inside badge... Then the person feeding targets to the killer knows our movements in real time. Inside Dorm 304, Hyunjun told me Son Siwoo was tailing Minhyung around Dohyeon's party all night, yet Moon kept defending Siwoo behind closed doors.",
      },
      {
        id: 'bistro-7',
        speaker: 'Han Wangho',
        atSeconds: 40,
        text: "Siwoo's roommate Mingyu is close to that same circle, and Siwoo has been tangled up with Ryu Minseok, Jihoon, and Kyu for months. Think about the link between AllStar and Dohyeon's villa guest list—both trace right back to the families involved in 2008.",
      },
      {
        id: 'bistro-8',
        speaker: 'Lee Sanghyeok',
        atSeconds: 47,
        text: "Wait—if Minhyung really was filming everything for his YouTube channel, could a copy of the party footage have survived somewhere outside the Chief Lieutenant's house?",
      },
      {
        id: 'bistro-9',
        speaker: 'Han Wangho',
        atSeconds: 53,
        text: "Yes. Minhyung set his phone to auto-sync raw clips to an unlisted cloud draft folder whenever he hit Wi-Fi or mobile data. I pulled server logs showing his account uploaded one final video packet at 02:18 AM—right from the woods behind Dohyeon's house.",
      },
      {
        id: 'bistro-10',
        speaker: 'Lee Sanghyeok',
        atSeconds: 60,
        text: "At 02:18 AM?! Then Minhyung caught his killer on video moments before he died. Who besides Dohyeon knew where to find that backup—or had access to Minhyung's login?",
      },
      {
        id: 'bistro-11',
        speaker: 'Han Wangho',
        atSeconds: 66,
        text: "Only two people knew his editing password, plus whoever cornered him near the rear gate. Listen closely, Sanghyeok—there's something critical Inspector Kang kept out of his email about Park Jaehyuck and the missing child from 2008. The boy who survived—",
      },
      {
        id: 'bistro-12',
        speaker: 'Unknown Voice',
        atSeconds: 73,
        text: "Wangho hyung?! Wait—why didn't you tell me you were here?!",
      },
      {
        id: 'bistro-13',
        speaker: 'Han Wangho',
        atSeconds: 77,
        text: "(sharp whisper) Keep your voice down—stop the recording right now!",
      },
    ],
  };

export const LOADED_GALLERY_PHOTOS: PhotoItem[] = loadGalleryFolderPhotos();

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'dorm-1',
    title: 'Desk & Ramen Cup — 03:40',
    date: 'Oct 22 · 03:40',
    location: 'Dorm 304 · Study Desk',
    palette: ['#292018', '#523b28', '#8c6b4f'],
    dataUrl: dormDeskRamenImg,
    favorite: true,
    caption:
      'Messy desk inside Room 304-D with open observation notebooks and an empty ramen cup.',
    source: 'gallery',
    folder: 'Dormitory',
  },
  {
    id: 'dorm-2',
    title: 'Dorm 304 Hallway — 04:00',
    date: 'Oct 22 · 04:00',
    location: 'Dorm 304 · 3rd Floor Corridor',
    palette: ['#18181b', '#27272a', '#3f3f46'],
    dataUrl: dormHallwayNightImg,
    favorite: false,
    caption:
      'Dimly lit corridor outside Rooms 304-A, 304-B, and 304-C before dawn.',
    source: 'gallery',
    folder: 'Dormitory',
  },
  {
    id: 'dorm-3',
    title: 'Window View · Seongnam-ro',
    date: 'Oct 22 · 03:52',
    location: 'Dorm 304 · East Window',
    palette: ['#0f172a', '#1e293b', '#475569'],
    dataUrl: dormWindowStreetImg,
    favorite: false,
    caption:
      'Looking out through half-open blinds onto the quiet street below Dorm 304.',
    source: 'gallery',
    folder: 'Dormitory',
  },
  {
    id: 'dorm-4',
    title: 'Shared Kitchen Counter',
    date: 'Oct 22 · 03:30',
    location: 'Dorm 304 · Common Kitchen',
    palette: ['#1c1917', '#292524', '#57534e'],
    dataUrl: dormKitchenNightImg,
    favorite: false,
    caption:
      'Black coffee mug left on the shared counter near the electric kettle.',
    source: 'gallery',
    folder: 'Dormitory',
  },
  {
    id: 'p1',
    title: 'Dorm 304 Exterior',
    date: 'Oct 22 · 13:15',
    location: 'Seongnam-ro 304 · Gyeong-gwan',
    palette: ['#1e1b4b', '#334155', '#64748b'],
    favorite: true,
    caption: 'Move-in reference photo taken under student cover.',
    source: 'system',
  },
  {
    id: 'p2',
    title: 'Student ID Card',
    date: 'Oct 21 · 18:00',
    location: 'Gyeong-gwan University',
    palette: ['#0f172a', '#1d4ed8', '#60a5fa'],
    favorite: false,
    caption: 'Undercover credential — Lee Sanghyeok, transfer student.',
    source: 'system',
  },
  {
    id: 'p3',
    title: 'Precinct Safety Advisory',
    date: 'Oct 22 · 16:05',
    location: 'Downtown Gyeong-gwan',
    palette: ['#450a0a', '#991b1b', '#f87171'],
    favorite: false,
    caption: 'Posted hours after the AllStar rehearsal garage fire.',
    source: 'system',
  },
];

export const INITIAL_MAILS: MailItem[] = loadInitialMails();

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'c1',
    day: 22,
    title: 'Dorm 304 Check-In (Cover)',
    time: '13:00',
    location: 'Seongnam-ro 304',
    color: '#3b82f6',
  },
  {
    id: 'c2',
    day: 22,
    title: 'Dorm Gate Locks',
    time: '22:00',
    location: 'Dorm 304 · Main Gate',
    color: '#ef4444',
  },
  {
    id: 'c3',
    day: 23,
    title: 'Observe morning dorm routines',
    time: '06:30',
    location: 'Dorm 304 Common Kitchen',
    color: '#10b981',
  },
];

const FALLBACK_JOURNAL_BY_CHAPTER: { chapter: number; entry: JournalEntry }[] = [
  {
    chapter: 6,
    entry: {
      id: 'j6',
      title: 'Day 06 — Precinct Breach',
      body: "Inspector Kang called from the station at 08:15 while Park Dohyeon was losing control in his office. Dohyeon has been using his father's police badge and credentials to probe local patrol routes on his own, and claimed another victim died last night before a woman interrupted demanding a restraining order against Han Wangho—right before the call dropped. Hyunjun also warned me that Moon has been skipping university classes while police travel restrictions keep everyone inside Gyeong-gwan.",
      date: 'Monday, Oct 26',
      mood: 'Guarded',
    },
  },
  {
    chapter: 5,
    entry: {
      id: 'j5',
      title: 'Day 05 — Weighing the Offer',
      body: "The Chief Lieutenant is gone and every local channel at the station has gone dark. Whoever messaged me from that blocked number already knows Inspector Kang Minhyeok by name. I'm thinking about accepting this unknown number's proposal—only if we meet somewhere public and safe. If they truly answer to the inspector, they might be my only real ally left in Gyeong-gwan.",
      date: 'Sunday, Oct 25',
      mood: 'Cautious',
    },
  },
  {
    chapter: 4,
    entry: {
      id: 'j4',
      title: 'Day 04 — Blackout at Dawn',
      body: 'The Chief Lieutenant and his wife were assassinated in their home before dawn, and every electronic device—including the party footage Dohyeon submitted and Minhyung’s phone—was smashed to pieces. My precinct lifeline is gone. Hyunjun is ready to flee Dorm 304, but his testimony leaves clear leads: Siwoo followed Minhyung all night at the party, and classmate Ryu Minseok was always seen with him.',
      date: 'Sunday, Oct 25',
      mood: 'Urgent',
    },
  },
  {
    chapter: 3,
    entry: {
      id: 'j3',
      title: 'Day 03 — Behind Locked Doors',
      body: 'Police patrols are sweeping Gyeong-gwan after another attack. Moon is openly watching every move I make in the hallway, and Hyunjun keeps his duffel bag packed by the door. Holding my cover steady until Chief Lieutenant clears the next step.',
      date: 'Saturday, Oct 24',
      mood: 'Tense',
    },
  },
  {
    chapter: 2,
    entry: {
      id: 'j2',
      title: 'Day 02 — Morning Market Run',
      body: 'Walked down Main Street to Downtown Gyeong-gwan after last night’s vehicle arson. Hyunjun asked me to keep the dorm gate bolted from the inside and stick to the main road. Precinct archive files and Dohyeon’s connections point closer to how the 2008 rabbit disguise vanished.',
      date: 'Friday, Oct 23',
      mood: 'Alert',
    },
  },
  {
    chapter: 1,
    entry: {
      id: 'j1',
      title: 'Day 01 — 04:00 AM Check',
      body: 'Settled into Dorm 304 alongside Hyunjun, Moon, and Lee Minhyung. The whole city is shaken by Kim K.’s report on the AllStar murders and the missing 2008 rabbit costume. Moon is already watching me too closely, and Hyunjun looks ready to bolt.',
      date: 'Thursday, Oct 22',
      mood: 'Focused',
    },
  },
];

const LOADED_JOURNAL_BY_CHAPTER = loadJournalByChapterList();
const JOURNAL_BY_CHAPTER: { chapter: number; entry: JournalEntry }[] =
  LOADED_JOURNAL_BY_CHAPTER.length > 0
    ? LOADED_JOURNAL_BY_CHAPTER.filter((item) => item.chapter <= 6)
    : FALLBACK_JOURNAL_BY_CHAPTER;

export function getJournalForChapter(chapterId: number): JournalEntry[] {
  return JOURNAL_BY_CHAPTER.filter((item) => item.chapter <= chapterId).map((item) => {
    if (item.chapter === 6 && chapterId >= 7) {
      return {
        ...item.entry,
        body: [
          item.entry.body,
          CH6_JOURNAL_AFTER_WANGHO_ADDENDUM,
          CH6_JOURNAL_AFTER_SAFARI_ADDENDUM,
          CH6_JOURNAL_AFTER_KANG_HYUNJUN_ADDENDUM,
          CH6_JOURNAL_AFTER_KYU_ADDENDUM,
          CH6_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM,
        ].join('\n\n'),
      };
    }
    return item.entry;
  });
}

export const INITIAL_JOURNAL: JournalEntry[] = getJournalForChapter(1);

export const CH5_JOURNAL_SCRIPT: JournalScriptedIntro =
  loadJournalScriptedIntro('j5') ?? {
    id: 'j5',
    title: 'Day 05 — Weighing the Offer',
    mood: 'Cautious',
    date: 'Sunday, Oct 25',
    prefilledText:
      'The Chief Lieutenant is gone and every local channel at the station has gone dark. Whoever messaged me from that blocked number already knows Inspector Kang Minhyeok by name. ',
    typedText:
      "I'm thinking about accepting this unknown number's proposal—only if we meet somewhere public and safe. If they truly answer to the inspector, they might be my only real ally left in Gyeong-gwan.",
  };

export const CH5_JIHOON_DINNER_STORY: IgStoryItem = {
  id: 'ig-story-jihoon-ch5',
  accountId: 'jihoon',
  imageUrl: resolveAssetUrl('/assets/aistudio/image_9fab2999.png')!,
  caption: 'stop to get food.',
  taggedHandle: '@suhwan.p',
  taggedAccountId: 'suhwan',
  location: 'Seongnam Drive-Thru',
  time: '6m',
};

export const CH6_SIWOO_GAS_STORY: IgStoryItem = {
  id: 'ig-story-siwoo-mon2am',
  accountId: 'siwoo',
  imageUrl: resolveAssetUrl('/assets/aistudio/image_f68fb420.png')!,
  caption: '04:00 AM.',
  taggedHandle: '@dohyeon.vip',
  taggedAccountId: 'dohyeon',
  location: 'Outskirts Self-Service Station',
  time: 'Mon · 04:00 AM',
};

export const CH5_INSPECTOR_CALL_SCRIPT: {
  id: string;
  name: string;
  subtitle: string;
  number: string;
  durationSeconds: number;
  lines: CallScriptLine[];
} = {
  id: 'ch5-morning-call',
  name: 'Inspector Kang Minhyeok',
  subtitle: 'New Police Chief · GGPD',
  number: '+82 10-4402-0199',
  durationSeconds: 74,
  lines: [
    {
      id: 'call-1',
      speaker: 'Inspector Kang',
      atSeconds: 1,
      kind: 'dialogue',
      text: "Sanghyeok, good—you picked up. Park Dohyeon is here at the station completely losing it, yelling that he has the right to investigate these murders too.",
    },
    {
      id: 'call-2',
      speaker: 'Inspector Kang',
      atSeconds: 7,
      kind: 'dialogue',
      text: "Stay on the line. I'm leaving this call open while I deal with him so you can hear what he's saying.",
    },
    {
      id: 'call-3',
      speaker: 'Park Dohyeon ',
      atSeconds: 13,
      kind: 'dialogue',
      text: "You can't shut me out of this investigation! I have every right to dig into what's happening in this town just like your precinct does!",
    },
    {
      id: 'call-4',
      speaker: 'Lee Sanghyeok (Internal)',
      atSeconds: 20,
      kind: 'thought',
      text: "Wait... He's has been using his father's police badge and credentials to probe local patrol routes, acting completely on his own.",
    },
    {
      id: 'call-5',
      speaker: 'Park Dohyeon ',
      atSeconds: 27,
      kind: 'dialogue',
      text: "While you're sitting behind a desk, someone else died last night. I don't know who the victim is yet, but another person is dead!",
    },
    {
      id: 'call-6',
      speaker: 'Inspector Kang',
      atSeconds: 34,
      kind: 'dialogue',
      text: "Hold on—how do you even know someone died last night if we haven't received a single report yet?!",
    },
    {
      id: 'call-7',
      speaker: 'Park Dohyeon',
      atSeconds: 40,
      kind: 'dialogue',
      text: "Because I've been investigating on my own! Stop wasting time and check the city before it's too late!",
    },
    {
      id: 'call-8',
      speaker: 'Inspector Kang',
      atSeconds: 47,
      kind: 'dialogue',
      text: "Enough. Take him out of my office and keep him out of restricted files—now.",
    },
    {
      id: 'call-9',
      speaker: 'Inspector Kang',
      atSeconds: 53,
      kind: 'dialogue',
      text: "Sanghyeok, you still there? On top of that—",
    },
    {
      id: 'call-10',
      speaker: 'Unknown Woman',
      atSeconds: 57,
      kind: 'dialogue',
      text: "Excuse me—Inspector! I need to file a restraining order against Han Wangho right now!",
    },
    {
      id: 'call-11',
      speaker: 'Inspector Kang',
      atSeconds: 62,
      kind: 'dialogue',
      text: "Ma'am, you can't just walk into my office—restraining orders aren't handled through me. Please speak with the clerk at the front desk.",
    },
    {
      id: 'call-12',
      speaker: 'Unknown Woman',
      atSeconds: 67,
      kind: 'dialogue',
      text: "No! I insist on speaking to someone in charge who will actually do something about him today—",
    },
    {
      id: 'call-13',
      speaker: 'Signal Lost',
      atSeconds: 71,
      kind: 'system',
      text: 'The line clicks sharply and cuts out mid-sentence.',
    },
  ],
};

export const CH6_JOURNAL_AFTER_WANGHO_ADDENDUM =
  loadJournalAddendumById('ch6_wangho') ??
  "Update (10:52): Checked Wangho's social feeds—nothing violent, only an obsession over proving someone in his neighborhood is his brother. Soon after, Wangho messaged saying a neighbor called the police to file a report on him; he insists Geumjae is his missing brother and suspects Geumjae's adoptive mother may be tied to the 2008 killer.";

export const CH6_JOURNAL_AFTER_SAFARI_ADDENDUM =
  loadJournalAddendumById('ch6_safari') ??
  "Update (10:56): Searched online for the 2008 missing children records in South Korea. Archived bulletins describe a woman seen carrying a bundled toddler near the rail overpass two days after the attack—and an irregular late birth filing in November 2008 tied to a former Old District household worker. Wangho's suspicion about that resident can't be dismissed anymore.";

export const CH6_BABY_CASE_WANGHO_ADDENDUM =
  "- Geumjae Connection (Ch. 6 · 10:52): Han Wangho confirmed Geumjae's mother is the neighbor trying to file a restraining order against him at the precinct. Age aligns (Geumjae is 20), and Wangho suspects Geumjae's adoptive mother may have ties to the 2008 perpetrator.";

export const CH6_BABY_CASE_SAFARI_ADDENDUM =
  '- Safari Archive & Reports (Ch. 6 · 10:56): Cold Case #GG-0814 + GGPD Field Report log a witness seeing a woman carry a crying toddler in a wool blanket near the rail overpass 420m from the scent trail, plus a delayed November 2008 home-birth filing under a relocated guardian who once worked domestic shifts in the Old District and returned this semester.';

export const CH6_INSPECTOR_BROTHER_MAIL_SCRIPT: MailScriptedCompose =
  loadComposeMailById('ch6-mail-kang-brother') ?? {
    id: 'ch6-mail-kang-brother',
    to: 'kang.minhyeok@ggpd.gov.kr',
    subject: "Confidential: Secret Records on Wangho's Lost Brother",
    time: '14:30',
    body: '',
  };

export const CH6_MINSEOK_IG_DM_INTRO_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ms-intro-1',
    sender: 'me',
    time: '14:37',
    text: "Hi Minseok, sorry to message you out of nowhere. I'm Lee Sanghyeok. I was living in Dorm with Minhyung.",
  },
  {
    id: 'ms-intro-2',
    sender: 'me',
    time: '14:37',
    text: "I'm really sorry for your loss. We've been sorting through a few things left behind in his room, and there are some personal belongings of his I think he'd want someone close to him to have. Can we meet?",
  },
];

export const CH6_HYUNJUN_MINSEOK_ADDRESS_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ch6-hj-addr-1',
    sender: 'me',
    time: '17:10',
    text: 'Hey Hyunjun, ddo you happen to know where Minseok lives?',
  },
  {
    id: 'ch6-hj-addr-2',
    sender: 'them',
    time: '17:11',
    delayMs: 3200,
    text: 'he lives at that Seongnam side-street house just off Seongnam-ro, a few blocks past the corner bakery.',
  },
  {
    id: 'ch6-hj-addr-3',
    sender: 'them',
    time: '17:11',
    delayMs: 3000,
    text: 'He shares the house with Jung Jihoon and Kim Hyukkyu, the nurse. Why, did he message you back?',
  },
  {
    id: 'ch6-hj-addr-4',
    sender: 'me',
    time: '17:12',
    text: "Not yet, no. I still have some of Minhyung's things he left behind in our room, so I'm going to head over and drop them off for him.",
  },
  {
    id: 'ch6-hj-addr-5',
    sender: 'them',
    time: '17:13',
    delayMs: 2800,
    text: 'Be careful walking over there, just let me know once you head back.',
  },
];

export const CH6_JOURNAL_AFTER_KANG_HYUNJUN_ADDENDUM =
  loadJournalAddendumById('ch6_kang_hyunjun') ??
  "Update (17:13): Checked Geumjae's socials—nothing useful, not even a photo of him. Sent an encrypted email to Inspector Kang asking if there were any sealed files on Wangho's brother, then liked two of Minseok's Instagram posts and sent him a polite DM explaining I was Minhyung's dormmate and had some things he left behind. Kang replied that neither he nor his colleagues have anything beyond published records, noted the woman at the station wanted a restraining order because Wangho kept following her family asking for a DNA test, and stressed our priority is identifying the killer. Two hours passed with still no reply from Minseok, so I asked Hyunjun where he lives—Seongnam Side-Street House off Seongnam-ro, shared with Jung Jihoon and Kim Hyukkyu. Heading over now to take Minhyung's things to him.";

export const CH6_NOTE_AFTER_KANG_HYUNJUN_ADDENDUM =
  "- Ch. 6 Afternoon (17:13): Geumjae's X & Instagram have zero photos of him. Inspector Kang confirmed no sealed records exist on Wangho's brother beyond public files, noted Wangho has been following Geumjae's family demanding a DNA test, and reiterated our top priority is identifying the killer. Messaged Minseok politely on IG about Minhyung's belongings (no reply after 2 hours). Hyunjun confirmed Minseok lives at Seongnam Side-Street House off Seongnam-ro with Jung Jihoon and Kim Hyukkyu; going over now to drop off Minhyung's things.";

export type { BlackScreenSubtitleBeat };

export const CH6_KYU_DOORSTEP_NARRATION_MEMO: NarrationMemoItem =
  loadNarrationMemo('narration-ch6-kyu-doorstep') ?? {
    id: 'narration-ch6-kyu-doorstep',
    chapter: 6,
    title: 'Doorstep Confrontation with Kyu',
    location: 'Seongnam Side-Street House',
    dateTime: 'Mon, Oct 26 · 17:40',
    summary:
      "Sanghyeok brings Minhyung's box to Minseok's address and meets Kim Hyukkyu at the door, learning Minseok vanished after a fight.",
    beats: [],
  };

export const CH6_KYU_DOORSTEP_SUBTITLES: BlackScreenSubtitleBeat[] =
  CH6_KYU_DOORSTEP_NARRATION_MEMO.beats;

export const CH6_JOURNAL_AFTER_KYU_ADDENDUM =
  loadJournalAddendumById('ch6_kyu') ??
  'Update (17:45): Reached the Seongnam side-street house Hyunjun gave me, only for Kim Hyukkyu (Kyu) to answer the door. He refused to take anything from a stranger at first until I explained I was Minhyung’s dormmate, posed no danger, and offered to meet elsewhere at another time. Kyu then admitted Minseok has been missing since yesterday, he suspects Minseok fled with Kwanghee after an intense fight between them, and says he has no idea where Minseok is or whether he’ll ever come back.';

export const CH6_WANGHO_NIGHT_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ch6-wh-night-1',
    sender: 'me',
    time: '22:00',
    text: "Wangho, I wanted to update you honestly tonight. I couldn't find any more information about your missing brother, not online and not through my contacts at the precinct.",
  },
  {
    id: 'ch6-wh-night-2',
    sender: 'me',
    time: '22:00',
    text: "Even so, I promise I'll do everything I can to help convince Geumjae to take a DNA test, even if it's just to put everyone's mind at ease.",
  },
  {
    id: 'ch6-wh-night-3',
    sender: 'them',
    time: '22:01',
    delayMs: 3400,
    text: '...Thank you, Sanghyeok. Honestly, just hearing that from you takes some of the weight off.',
  },
  {
    id: 'ch6-wh-night-4',
    sender: 'them',
    time: '22:02',
    delayMs: 3800,
    text: "To be completely honest, I've felt completely lost these past few days. I don't even know how I'm supposed to act anymore. And it still surprises me how quickly you trusted me.",
  },
  {
    id: 'ch6-wh-night-5',
    sender: 'them',
    time: '22:03',
    delayMs: 3600,
    text: "It's been a really long time since I could talk this openly with someone around my own age without feeling judged or pressured.",
  },
  {
    id: 'ch6-wh-night-6',
    sender: 'me',
    time: '22:04',
    text: "You don't have to carry all of this by yourself.",
  },
  {
    id: 'ch6-wh-night-7',
    sender: 'them',
    time: '22:05',
    delayMs: 3500,
    text: '...Saying things like that so easily. You make it way too easy to rely on you.',
  },
  {
    id: 'ch6-wh-night-8',
    sender: 'them',
    time: '22:05',
    delayMs: 3200,
    text: "Honestly, whenever my phone lights up lately, I catch myself hoping it's you. I feel a lot calmer just knowing you're close by.",
  },
  {
    id: 'ch6-wh-night-9',
    sender: 'me',
    time: '22:06',
    text: "I'll make sure to keep checking in.",
  },
  {
    id: 'ch6-wh-night-10',
    sender: 'them',
    time: '22:07',
    delayMs: 3000,
    text: "Let me walk you back properly next time we meet.",
  },
  {
    id: 'ch6-wh-night-11',
    sender: 'me',
    time: '22:08',
    text: "Deal. I'm going to try to get some sleep now. There's still a lot left to investigate tomorrow. Good night, Wangho.",
  },
  {
    id: 'ch6-wh-night-12',
    sender: 'them',
    time: '22:08',
    delayMs: 2600,
    text: 'Good night, hyung. Sleep well.',
  },
];

export const CH6_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM =
  loadJournalAddendumById('ch6_wangho_night') ??
  "Update (22:08): Messaged Wangho back at 22:00 to tell him neither online records nor my police contacts turned up anything more about his brother, though I promised to do everything I can to persuade Geumjae into taking a DNA test just to give everyone peace of mind. Wangho opened up more than ever—admitting he feels lost, surprised I trusted him so fast, and grateful to finally speak freely with someone his own age without pressure or judgment. Turning in for the night now; there is still far too much left to uncover tomorrow.";

export const CH7_MINSEOK_STATEMENT_RECORDING: VoiceRecordingItem =
  loadRecordingScript('chapter7_minseok_statement') ?? {
    id: 'chapter7_minseok_statement',
    title: 'Ryu Minseok — Precinct Statement',
    date: 'Oct 27 · 09:42',
    durationSeconds: 243,
    lines: [],
  };

const EMAIL_RECORDINGS_MAP: Record<string, VoiceRecordingItem> = {
  chapter7_minseok_statement: CH7_MINSEOK_STATEMENT_RECORDING,
  chapter3_living_room: LIVING_ROOM_RECORDING_SCRIPT,
  chapter5_bistro: CH5_BISTRO_RECORDING_SCRIPT,
};

const resolveEmailRecording = (recordingId: string) =>
  EMAIL_RECORDINGS_MAP[recordingId];

export const CH4_NEW_OFFICER_MAIL: MailItem =
  loadEmailById('ch4-new-officer-mail', resolveEmailRecording) ?? {
    id: 'ch4-new-officer-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'Case Handover: Gyeong-gwan Task Force Reassignment',
    preview: '',
    body: '',
    time: '14:16',
    unread: true,
  };

export const CH5_INSPECTOR_WANGHO_MAIL: MailItem =
  loadEmailById('ch5-wangho-mail', resolveEmailRecording) ?? {
    id: 'ch5-wangho-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'Protected Contact: Han Wangho',
    preview: '',
    body: '',
    time: '16:40',
    unread: true,
  };

export const CH6_INSPECTOR_KANG_REPLY_MAIL: MailItem =
  loadEmailById('ch6-kang-reply-mail', resolveEmailRecording) ?? {
    id: 'ch6-kang-reply-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: "Re: Confidential: Secret Records on Wangho's Lost Brother",
    preview: '',
    body: '',
    time: '15:10',
    unread: true,
  };

export const CH7_KANG_CLASS_CHECK_MAIL: MailItem =
  loadEmailById('ch7-kang-class-check-mail', resolveEmailRecording) ?? {
    id: 'ch7-kang-class-check-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'Urgent — Are you in class right now?',
    preview: 'Are you in class right now?',
    body: '',
    time: '10:00',
    unread: true,
    quickReplyLabel: 'Reply',
  };

export const CH7_KANG_MINSEOK_AUDIO_MAIL: MailItem =
  loadEmailById('ch7-kang-minseok-audio-mail', resolveEmailRecording) ?? {
    id: 'ch7-kang-minseok-audio-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: "Voice File: Ryu Minseok's Official Statement",
    preview: '',
    body: '',
    time: '10:02',
    unread: true,
    audioAttachment: CH7_MINSEOK_STATEMENT_RECORDING,
  };

export const CH7_KANG_NIGHT_SUMMONS_MAIL: MailItem =
  loadEmailById('ch7-kang-night-summons-mail', resolveEmailRecording) ?? {
    id: 'ch7-kang-night-summons-mail',
    from: 'Inspector Kang Minhyeok · GGPD',
    email: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'CONFIDENTIAL — Precinct Meet Tonight (Escort Inbound)',
    preview:
      "Meet me at the precinct tonight. An unmarked unit will escort you in—we pulled the McDonald's and nearby CCTV and caught suspect movement.",
    body: '',
    time: '19:56',
    unread: true,
  };

export const CH7_SANGHYEOK_CLASS_REPLY_SCRIPT: MailScriptedCompose =
  loadComposeMailById('ch7-mail-sanghyeok-class-reply') ?? {
    id: 'ch7-mail-sanghyeok-class-reply',
    to: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'Re: Urgent — Are you in class right now?',
    time: '10:01',
    body: '',
  };

export const CH7_JOURNAL_ENTRY: JournalEntry =
  loadJournalEntryById('j7') ?? {
    id: 'j7',
    title: "Day 07 — The Survivor's Voice",
    body: "At 10:00 AM during class, Inspector Kang emailed asking if I was in class, then sent over Ryu Minseok's recorded precinct testimony. Minseok returned alive on foot early this morning after wandering lost in the woods since Sunday night. According to his statement, a violent fight erupted Sunday evening when Kyu came home and found Kwanghee with Jaehyuk—both Kyu and Jaehyuk fought with Kwanghee, Kyu kicked him out, Jihoon followed Jaehyuk outside, and Kyu never slept at home. Around 10 p.m., the masked Rabbit abducted Minseok from the house and dragged him to an abandoned building on the outskirts of town. Kwanghee showed up looking for him (likely lured by the killer), only for the Rabbit—speaking with a raspy, possibly voice-changed voice—to taunt him about burn scars caused by Kwanghee's family and call him just like his father. Minseok freed one wrist, knocked the revolver loose, and threw it to Kwanghee, but Kwanghee yelled for him to run instead of shooting right away. As Minseok fled, six shots echoed behind him and only the Rabbit silhouette remained standing. At the end of the tape, an investigative agent questioned Minseok suspiciously—pressing him on whether Kwanghee is truly dead and demanding the house's address, which Minseok only knew lies at the very edge of town past the road to the next city—before the recording cut off abruptly.",
    date: 'Tuesday, Oct 27',
    mood: 'Shaken',
  };

export const CH7_MINSEOK_IG_DM_OPENING: DirectMessageItem[] = [
  {
    id: 'ms-ch7-open-1',
    sender: 'them',
    time: '16:00',
    text: "Hi Sanghyeok... I'm so sorry it took me until today to reply to you.",
  },
  {
    id: 'ms-ch7-open-2',
    sender: 'them',
    time: '16:00',
    text: "A lot of awful things happened since Sunday night and honestly I'm still really shaken up.",
  },
  {
    id: 'ms-ch7-open-3',
    sender: 'them',
    time: '16:01',
    text: "I do still want to receive Minhyung's things, thank you for keeping them safe... I'm just hesitating right now because I'm scared to even stay inside my own house, especially now that the police started treating me and the other guys like suspects.",
  },
];

export const CH7_MINSEOK_IG_DM_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ms-ch7-1',
    sender: 'me',
    time: '16:02',
    text: "Hey Minseok, please don't apologize at all. Take all the time you need—I wasn't super close to Minhyung since I only lived in the dorm with him for about a month, and even if he could be a little full of himself sometimes, he was genuinely a good, kind person. I know his things belong with people who actually cared about him.",
  },
  {
    id: 'ms-ch7-2',
    sender: 'them',
    time: '16:03',
    delayMs: 7200,
    text: "He really could be a showoff sometimes, yeah... thank you for saying that. It feels good hearing someone talk about him like he was still just himself.",
  },
  {
    id: 'ms-ch7-3',
    sender: 'them',
    time: '16:03',
    delayMs: 7600,
    text: "I'm just terrified right now, Sanghyeok. I had to go down to the police station earlier today, and instead of just helping me, the officers actually started suspecting me.",
  },
  {
    id: 'ms-ch7-4',
    sender: 'me',
    time: '16:04',
    text: 'Wait... what do you mean? Why did you have to go to the precinct?',
  },
  {
    id: 'ms-ch7-5',
    sender: 'them',
    time: '16:05',
    delayMs: 7000,
    text: "I shouldn't even be talking about it, honestly... I hesitated all afternoon, but it's probably going to hit the news in a few hours anyway.",
  },
  {
    id: 'ms-ch7-6',
    sender: 'them',
    time: '16:05',
    delayMs: 8200,
    text: "I was kidnapped by the killer, Sanghyeok. He took me out to some ruined house, and he murdered Kwanghee right in front of me.",
  },
  {
    id: 'ms-ch7-7',
    sender: 'them',
    time: '16:06',
    delayMs: 9200,
    text: "I escaped and spent the whole night lost in the woods... bruised, freezing, completely hurt. I walked more than 20 km on foot thinking I was going to die out there in those trees before I finally stumbled onto the road and kept walking all the way back toward town.",
  },
  {
    id: 'ms-ch7-8',
    sender: 'them',
    time: '16:06',
    delayMs: 7600,
    text: "I ran as far as I possibly could because I was so terrified of getting anywhere near the house or the city while the killer might still be waiting there.",
  },
  {
    id: 'ms-ch7-9',
    sender: 'me',
    time: '16:07',
    text: "Minseok... I'm so sorry you had to go through something that horrific. You survived an impossible night and made it back—please breathe, you don't have to carry all of that by yourself right now.",
  },
  {
    id: 'ms-ch7-10',
    sender: 'them',
    time: '16:08',
    delayMs: 7000,
    text: "Thank you... seriously, just hearing someone believe me without interrogating me helps more than you know.",
  },
  {
    id: 'ms-ch7-11',
    sender: 'them',
    time: '16:08',
    delayMs: 8600,
    text: "I just don't feel safe at home anymore. The killer came right into our house... I mean, I know I'm the one who opened the door, I trusted way too easily. I'm really, really scared to stay in this city, and the worst part is we aren't even allowed to leave.",
  },
  {
    id: 'ms-ch7-12',
    sender: 'me',
    time: '16:09',
    text: "Listen, I'm here to help however I can. You can stay with me at the dorm if you don't want to be alone in that house tonight... though honestly, I don't think anywhere in town is truly safe right now. I don't want to lie to you and promise you'll be completely safe here, but wherever you feel even a little better, that's okay with me.",
  },
  {
    id: 'ms-ch7-13',
    sender: 'them',
    time: '16:10',
    delayMs: 6800,
    text: "I appreciate your honesty more than empty promises. Thank you, Sanghyeok... let me pull myself together and text you once I know what I'm going to do tonight.",
  },
];

export const CH7_JOURNAL_AFTER_MINSEOK_DM_ADDENDUM =
  loadJournalAddendumById('ch7_minseok_dm') ??
  "Update (16:10): Checked Kyu's furious posts alongside Jihoon's unsettling remarks on X, plus Jihoon's Sunday night food-stop story with Suhwan and Siwoo's 4:00 AM Monday gas station story tagging Dohyeon on Instagram, then Minseok finally replied to my Instagram DM at 16:00. Shaken and afraid to return home with police suspecting him and the others, he confirmed he still wants Minhyung's belongings. Playing along as though I hadn't heard Kang's recording, I listened as Minseok opened up about the abduction, Kwanghee's disappearance, walking over 20 km injured through the woods, and fearing the killer inside his own home. Offered to let him stay with me if it helps, without lying that anywhere in Gyeong-gwan is safe.";

export const CH7_KANG_REPORT_MAIL_SCRIPT: MailScriptedCompose =
  loadComposeMailById('ch7-mail-kang-report') ?? {
    id: 'ch7-mail-kang-report',
    to: 'kang.minhyeok@ggpd.gov.kr',
    subject: 'Follow-up: Minseok Statement, Social Media & Verification Requests',
    time: '16:12',
    body: '',
  };

export const CH7_JOURNAL_AFTER_KANG_REPORT_ADDENDUM =
  loadJournalAddendumById('ch7_kang_report') ??
  "Update (16:12): After talking with Minseok and returning to my thoughts, I emailed Inspector Kang to report what I found—Jihoon allegedly being at McDonald's with Suhwan on Sunday night, and Son Siwoo being out with Park Dohyeon at 4:00 AM Monday. I asked Kang to check whether Kyu was at the hospital even though Minseok said he had just returned from his shift, and to pull the McDonald's security camera footage to verify when Jihoon arrived and left.";

export const CH7_WANGHO_URGENT_OPENING: WhatsAppMessage[] = [
  {
    id: 'ch7-wh-urgent-1',
    sender: 'them',
    time: '16:14',
    text: "Sanghyeok, sorry for messaging out of nowhere—it's urgent.",
  },
  {
    id: 'ch7-wh-urgent-2',
    sender: 'them',
    time: '16:14',
    text: 'Geumjae just showed up here at my house. He said he agreed to take the DNA test, but it has to be kept completely hidden from his mother.',
  },
];

export const CH7_WANGHO_URGENT_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ch7-wh-urgent-step-1',
    sender: 'me',
    time: '16:15',
    text: 'Wait, seriously? Do you need any help with that...?',
  },
  {
    id: 'ch7-wh-urgent-step-2',
    sender: 'them',
    time: '16:15',
    delayMs: 3000,
    text: "I honestly don't even know...",
  },
  {
    id: 'ch7-wh-urgent-step-3',
    sender: 'them',
    time: '16:16',
    delayMs: 3600,
    text: "I'm terrified that woman is going to find out and come here to make a huge scene.",
  },
  {
    id: 'ch7-wh-urgent-step-4',
    sender: 'me',
    time: '16:16',
    text: "I'll come down to the hospital and wait there with you. Which clinic are you taking him to?",
  },
  {
    id: 'ch7-wh-urgent-step-5',
    sender: 'them',
    time: '16:17',
    delayMs: 3200,
    text: 'Thank you so much, Sanghyeok... seriously, just hearing that takes a huge weight off.',
  },
  {
    id: 'ch7-wh-urgent-step-6',
    sender: 'them',
    time: '16:17',
    delayMs: 3600,
    text: "I just don't know how long the lab paperwork and test are going to take, and I really don't want to waste your afternoon making you wait around.",
  },
  {
    id: 'ch7-wh-urgent-step-7',
    sender: 'me',
    time: '16:18',
    text: "You're not wasting my time at all—I want to help you however I can. At this point, getting to the bottom of this has become a personal priority for me too.",
  },
  {
    id: 'ch7-wh-urgent-step-8',
    sender: 'me',
    time: '16:18',
    text: "And if Geumjae's mother does show up, I can try talking to her quietly and defusing things before she causes any scene. Send me the wing—I'm already on my way.",
  },
  {
    id: 'ch7-wh-urgent-step-9',
    sender: 'them',
    time: '16:19',
    delayMs: 3000,
    text: "We're heading to the outpatient diagnostic wing at Gyeong-gwan General Hospital. Thank you again, Sanghyeok... see you soon.",
  },
];

export const CH7_JOURNAL_AFTER_WANGHO_URGENT_ADDENDUM =
  loadJournalAddendumById('ch7_wangho_urgent') ??
  "Update (16:19): Right after I emailed Inspector Kang, Wangho sent an urgent message—Geumjae unexpectedly showed up at his house and agreed to take the DNA test, on the condition that it stays completely secret from his mother. Wangho was anxious about her finding out and causing a scene, so I told him I'd meet him at the hospital and wait with him. Even though he thanked me and worried about wasting my time, I made sure he knew I want to help however I can—finding the truth behind 2008 has become personal to me too, and if the woman shows up, I can try talking her down quietly without making a scene.";

export const CH7_HOSPITAL_NARRATION_MEMO: NarrationMemoItem =
  loadNarrationMemo('narration-ch7-hospital-observation') ?? {
    id: 'narration-ch7-hospital-observation',
    chapter: 7,
    title: 'Hospital Hallway',
    location: 'Gyeong-gwan General Hospital',
    dateTime: 'Tue, Oct 27 · 19:00',
    summary:
      "Waiting outside Geumjae's blood draw room with Wangho, Sanghyeok spots known suspects.",
    beats: [],
  };

export const CH7_HOSPITAL_SUBTITLES: BlackScreenSubtitleBeat[] =
  CH7_HOSPITAL_NARRATION_MEMO.beats;

export const CH7_HOSPITAL_POCKET_NOTE: NoteItem = {
  id: 'note-ch7-hospital-pocket',
  title: 'Pocket Note — General Hospital (19:05)',
  updatedAt: 'Oct 27 · 19:10',
  body: `LIVE OBSERVATIONS (TYPED FROM COAT POCKET):
- Location: Gyeong-gwan General Hospital (Outpatient Diagnostic / ER Transition)
- Time: 19:00
- Wooje (@wooje_z): Spotted near outpatient coffee machine, hood up, hunched behind brochure pillar acting like a lookout or tailing Wangho. Wearing an extremely expensive limited-edition designer sports jacket with specific sleeve embroidery. Left through the automatic glass doors right before draw finished.
- Son Siwoo (@sihaos): In ER pharmacy side queue—agitated, glancing over shoulder, tapping foot. Tried to fill a controlled medication using a crumpled prescription missing a required signature and messy cash (wrinkled bills + loose coins, strange for someone in his rich circle). Clerk refused; Siwoo argued aggressively, grabbed slip back before security arrived, bumped straight past me without looking back.`,
};

export const CH7_JOURNAL_AFTER_HOSPITAL_ADDENDUM =
  loadJournalAddendumById('ch7_hospital') ??
  "Update (19:10): Met Wangho outside the blood draw room at Gyeong-gwan General Hospital at 19:00 while Geumjae went inside for the DNA test. Keeping watch near the glass doors, I caught Wooje lurking behind an outpatient brochure pillar with his hood up in a limited-edition embroidered designer jacket—either tailing Wangho or acting as a lookout. Moving casually toward the water dispenser to avoid tipping him off, I also spotted Son Siwoo at the ER pharmacy desperately trying to push through an unsigned controlled-medication prescription with crumpled bills and loose change before bolting past me prior to security arriving. Stayed calm to reassure Wangho while logging both sightings into a pocket note as Wooje slipped out the automatic doors.";

export const CH7_WANGHO_NIGHT_OPENING: WhatsAppMessage[] = [
  {
    id: 'ch7-wh-night-1',
    sender: 'them',
    time: '19:45',
    text: 'Made it back safely, hyung. Just wanted to thank you again for coming down to the hospital and waiting there with me.',
  },
  {
    id: 'ch7-wh-night-2',
    sender: 'them',
    time: '19:45',
    text: "Geumjae got back home without his mother suspecting a thing. The only thing is they didn't tell us exactly when the test result is going to come out...",
  },
];

export const CH7_WANGHO_NIGHT_SCRIPT: ScriptedChatStep[] = [
  {
    id: 'ch7-wh-night-step-1',
    sender: 'me',
    time: '19:46',
    text: "Don't worry too much about that. DNA tests and lab panels usually take a few days to come back anyway—try not to let it keep you on edge tonight.",
  },
  {
    id: 'ch7-wh-night-step-2',
    sender: 'them',
    time: '19:47',
    delayMs: 3200,
    text: 'You always know how to calm me down right when my head starts spinning...',
  },
  {
    id: 'ch7-wh-night-step-3',
    sender: 'them',
    time: '19:47',
    delayMs: 3600,
    text: 'Honestly, having you standing there next to me in that hallway made the whole night feel way less suffocating. Even with everything falling apart around us, being close to you feels strangely safe.',
  },
  {
    id: 'ch7-wh-night-step-4',
    sender: 'me',
    time: '19:48',
    text: "I'm glad I was there with you too, Wangho. Whenever you need someone watching your back, just call me.",
  },
  {
    id: 'ch7-wh-night-step-5',
    sender: 'them',
    time: '19:49',
    delayMs: 3400,
    text: "Careful saying things like that so easily... I'm really going to start looking forward to seeing you more than I probably should.",
  },
  {
    id: 'ch7-wh-night-step-6',
    sender: 'them',
    time: '19:49',
    delayMs: 3200,
    text: "Anyway, I should head out now—I'm going out to game with Wooje for a bit to clear my head. Let's talk tomorrow, okay?",
  },
  {
    id: 'ch7-wh-night-step-7',
    sender: 'me',
    time: '19:50',
    text: 'Alright. Have a good night, get home safe, and message me tomorrow.',
  },
  {
    id: 'ch7-wh-night-step-8',
    sender: 'them',
    time: '19:51',
    delayMs: 2800,
    text: 'Good night, Sanghyeok. Talk tomorrow.',
  },
];

export const CH7_JOURNAL_AFTER_WANGHO_NIGHT_ADDENDUM =
  loadJournalAddendumById('ch7_wangho_night') ??
  "Update (19:51): Returned to Dorm 304 after the hospital. Wangho texted thanking me for coming and worried over not knowing when Geumjae's DNA results would come out; I told him lab matches can take a few days and urged him not to stress tonight. For a few moments that quiet closeness between us crept back in again before he said he was heading out to game with Wooje and we promised to talk tomorrow. Still—I can't shake what Wooje was actually doing lurking in that hospital hallway earlier, even if Wangho told me not to suspect him.";

export const CH7_JOURNAL_AFTER_KANG_NIGHT_ADDENDUM =
  loadJournalAddendumById('ch7_kang_night') ??
  "Update (19:56): Inspector Kang just sent a confidential email ordering me to meet him at precinct headquarters tonight—sending an unmarked unit to escort me quietly so nobody catches us together. They pulled the McDonald's security cameras along with CCTV from several nearby establishments and caught clear suspect movement. Heavy work ahead before dawn.";

const CALL_LOGS_BY_CHAPTER: { chapter: number; log: CallLogItem }[] = [
  {
    chapter: 5,
    log: {
      id: 'call-log-ch4-missed-chief',
      name: 'Chief Lieutenant',
      subtitle: 'GGPD Precinct',
      number: '+82 10-4402-0100',
      status: 'Missed',
      time: '03:41',
      dateLabel: 'Sunday, Oct 25',
    },
  },
  {
    chapter: 3,
    log: {
      id: 'call-log-ch3-chief',
      name: 'Chief Lieutenant',
      subtitle: 'GGPD Precinct',
      number: '+82 10-4402-0100',
      status: 'Incoming',
      time: '10:18',
      dateLabel: 'Saturday, Oct 24',
      durationLabel: '02:05',
    },
  },
  {
    chapter: 1,
    log: {
      id: 'call-log-ch1-dorm',
      name: 'Dorm 304 (Group)',
      subtitle: 'Dormitory Line',
      number: '+82 10-3304-0000',
      status: 'Outgoing',
      time: '22:14',
      dateLabel: 'Wednesday, Oct 21',
      durationLabel: '01:42',
    },
  },
  {
    chapter: 1,
    log: {
      id: 'call-log-ch1-chief',
      name: 'Chief Lieutenant',
      subtitle: 'GGPD Homicide',
      number: '+82 10-4402-0100',
      status: 'Incoming',
      time: '21:05',
      dateLabel: 'Wednesday, Oct 21',
      durationLabel: '03:18',
    },
  },
];

export function getCallLogsForChapter(chapterId: number): CallLogItem[] {
  return CALL_LOGS_BY_CHAPTER.filter((item) => item.chapter <= chapterId).map(
    (item) => item.log
  );
}

export const INITIAL_DIRECT_MESSAGES: DirectMessageThread[] = [];

export const AVAILABLE_WEATHER_CITIES: WeatherCity[] = [
  {
    id: 'gyeong-gwan',
    name: 'Gyeong-gwan',
    tempC: 11,
    condition: 'Overcast · Fog',
    highC: 16,
    lowC: 8,
    hourly: [
      { time: '04:00', tempC: 11, icon: 'cloud' },
      { time: '05:00', tempC: 10, icon: 'cloud' },
      { time: '06:00', tempC: 10, icon: 'rain' },
      { time: '07:00', tempC: 11, icon: 'rain' },
      { time: '08:00', tempC: 12, icon: 'cloud' },
    ],
  },
  {
    id: 'seoul',
    name: 'Seoul',
    tempC: 13,
    condition: 'Light Rain',
    highC: 17,
    lowC: 10,
    hourly: [
      { time: '04:00', tempC: 13, icon: 'rain' },
      { time: '05:00', tempC: 12, icon: 'rain' },
      { time: '06:00', tempC: 12, icon: 'cloud' },
      { time: '07:00', tempC: 13, icon: 'cloud' },
      { time: '08:00', tempC: 14, icon: 'cloud' },
    ],
  },
  {
    id: 'busan',
    name: 'Busan',
    tempC: 16,
    condition: 'Clear Night',
    highC: 21,
    lowC: 14,
    hourly: [
      { time: '04:00', tempC: 16, icon: 'sun' },
      { time: '05:00', tempC: 16, icon: 'cloud' },
      { time: '06:00', tempC: 17, icon: 'cloud' },
      { time: '07:00', tempC: 18, icon: 'cloud' },
      { time: '08:00', tempC: 19, icon: 'sun' },
    ],
  },
];

// All Character Accounts for X and Instagram (active cast + dorm mate Lee Minhyung)
const BASE_CHARACTER_ACCOUNTS: CharacterAccount[] = [
  {
    id: 'wangho',
    name: 'Wangho',
    xHandle: '@wangho_98',
    igHandle: 'wangho.han',
    bio: '28. Business Administration | hanwh98@gmail.com',
    followers: '1,420',
    following: '84',
    avatarPalette: ['#4338ca', '#1e1b4b'],
  },
  {
    id: 'kyu',
    name: 'Kyu',
    xHandle: '@kyu_gg',
    igHandle: 'kyuhyukim',
    bio: 'Gyeong-gwan. Nurse',
    followers: '612',
    following: '115',
    avatarPalette: ['#0369a1', '#0f172a'],
  },
  {
    id: 'kwanghee',
    name: 'Kwanghee',
    xHandle: '@kwanghee_live',
    igHandle: 'kwanghee.k',
    bio: 'Don’t take life too seriously.',
    followers: '2,108',
    following: '490',
    avatarPalette: ['#be185d', '#31102f'],
  },
  {
    id: 'minseok',
    name: 'Minseok',
    xHandle: '@minseok_keria',
    igHandle: 'rminseokk',
    bio: 'Trying to keep the house bright.',
    followers: '890',
    following: '230',
    avatarPalette: ['#f59e0b', '#78350f'],
  },
  {
    id: 'jihoon',
    name: 'Jihoon',
    xHandle: '@jihoonjjjj',
    igHandle: 'jihoonjjjj',
    bio: 'Spare me the small talk.',
    followers: '540',
    following: '62',
    avatarPalette: ['#334155', '#09090b'],
  },
  {
    id: 'wooje',
    name: 'Wooje',
    xHandle: '@wooje_z',
    igHandle: 'wooje.days',
    bio: 'Things can be simple.',
    followers: '418',
    following: '95',
    avatarPalette: ['#6d28d9', '#2e1065'],
  },
  {
    id: 'jaehyuk',
    name: 'Jaehyuk',
    xHandle: '@lhj89786',
    igHandle: 'ljh68678',
    bio: 'Mind.',
    followers: '1,945',
    following: '140',
    avatarPalette: ['#047857', '#022c22'],
  },
  {
    id: 'mingyu',
    name: 'Mingyu',
    xHandle: '@jmingyu_fm',
    igHandle: 'lastfmrobbott',
    bio: 'Carry on my waywward son.',
    followers: '376',
    following: '211',
    avatarPalette: ['#4f46e5', '#172554'],
  },
  {
    id: 'siwoo',
    name: 'Siwoo',
    xHandle: '@sihaos',
    igHandle: 'siwoo.afterhours',
    bio: 'IDC',
    followers: '1,632',
    following: '520',
    avatarPalette: ['#dc2626', '#450a0a'],
  },
  {
    id: 'suhwan',
    name: 'Suhwan',
    xHandle: '@suhwan_gg',
    igHandle: 'suhwan.p',
    bio: '!',
    followers: '485',
    following: '132',
    avatarPalette: ['#0284c7', '#082f49'],
  },
  {
    id: 'sanghyeok',
    name: 'Lee Sanghyeok',
    xHandle: '@sanghyeok_lee',
    igHandle: 'lee.sanghyeok',
    bio: '96',
    followers: '94',
    following: '38',
    avatarPalette: ['#27272a', '#09090b'],
  },
  {
    id: 'hyunjun',
    name: 'Hyunjun',
    xHandle: '@hyunjunchoi',
    igHandle: 'hyunjun.c00',
    bio: 'Computer Science',
    followers: '204',
    following: '108',
    avatarPalette: ['#475569', '#0f172a'],
  },
  {
    id: 'hyungseok',
    name: 'Moon',
    xHandle: '@moon_watch',
    igHandle: 'moon.002',
    bio: 'Pay attention...',
    followers: '3120',
    following: '1490',
    avatarPalette: ['#b45309', '#451a03'],
  },
  {
    id: 'minhyung',
    name: 'Lee Minhyung',
    xHandle: '@minhyung01',
    igHandle: 'minhyung.lee',
    bio: 'Film. Youtube @leemhfilm',
    followers: '2300',
    following: '1930',
    avatarPalette: ['#2563eb', '#1e3a8a'],
  },
  {
    id: 'dohyeon',
    name: 'Dohyeon',
    xHandle: '@dohyeon_v',
    igHandle: 'dohyeon.vip',
    bio: 'Economics & International Trade',
    followers: '2,840',
    following: '900',
    avatarPalette: ['#7c3aed', '#1e1b4b'],
  },
  {
    id: 'geumjae',
    name: 'Geumjae',
    xHandle: '@geumjae_18',
    igHandle: 'sgeumjaenew',
    bio: '20',
    followers: '158',
    following: '92',
    avatarPalette: ['#0d9488', '#042f2e'],
  },
  {
    id: 'kiin',
    name: 'Kiin',
    xHandle: '@kiin_press',
    igHandle: 'kiin.investigates',
    bio: 'Investigative Reporter.',
    followers: '8,910',
    following: '612',
    avatarPalette: ['#b91c1c', '#18181b'],
  },
  {
    id: 'soyeon',
    name: 'Kang Soyeon',
    xHandle: '@soyeon_art',
    igHandle: 'soyeon.canvas',
    bio: 'Gyeong-gwan Univ Fine Arts ’23 · ',
    followers: '742',
    following: '286',
    avatarPalette: ['#d97706', '#451a03'],
  },
  {
    id: 'mina',
    name: 'Song Mina',
    xHandle: '@mina_arch',
    igHandle: 'mina.arch',
    bio: 'Architecture Sophomore ·',
    followers: '518',
    following: '240',
    avatarPalette: ['#0284c7', '#0f172a'],
  },
  {
    id: 'chaewon',
    name: 'Baek Chaewon',
    xHandle: '@chaewon_film',
    igHandle: 'chaewon.35mm',
    bio: 'Media & Film Junior · Shooting campus life on 35mm.',
    followers: '1,124',
    following: '312',
    avatarPalette: ['#be123c', '#3b0764'],
  },
  {
    id: 'yuna',
    name: 'Park Yuna',
    xHandle: '@yuna_biz',
    igHandle: 'yuna.ggu',
    bio: 'Surviving midterms.',
    followers: '389',
    following: '295',
    avatarPalette: ['#059669', '#064e3b'],
  },
  {
    id: 'seoyun',
    name: 'Han Seoyun',
    xHandle: '@seoyun_photo',
    igHandle: 'seoyun.film',
    bio: 'Photography Senior',
    followers: '964',
    following: '218',
    avatarPalette: ['#b91c1c', '#450a0a'],
  },
  {
    id: 'eunji',
    name: 'Choi Eunji',
    xHandle: '@eunji_nur',
    igHandle: 'eunji.care',
    bio: 'GGU Nursing ’24 · Student Council Safety Liaison',
    followers: '648',
    following: '304',
    avatarPalette: ['#0ea5e9', '#1e3a8a'],
  },
  {
    id: 'twinskulls',
    name: 'TwinSkulls Crime',
    xHandle: '@TwinSkullsLive',
    igHandle: 'twinskulls.live',
    bio: 'Two hosts, zero filters. Breaking cold cases, live trials & leaked crime tea on YouTube 🎙️💀 Business: twinskullsmedia@gmail.com',
    followers: '684.5K',
    following: '312',
    verified: true,
    avatarPalette: ['#ea580c', '#09090b'],
  },
];

export const CHARACTER_ACCOUNTS: CharacterAccount[] = BASE_CHARACTER_ACCOUNTS.map(
  (acc) => ({
    ...acc,
    avatarUrl: SOCIAL_MEDIA_AVATARS[acc.id],
  })
);

export const INITIAL_TWEETS: SocialPost[] = loadProfileXPosts(CHARACTER_ACCOUNTS);

export const INITIAL_IG_POSTS: IgPost[] = loadProfileIgPosts(CHARACTER_ACCOUNTS);

export const INITIAL_ALARMS: AlarmItem[] = [
  { id: 'a1', time: '06:25', label: 'Watch dorm morning routines', enabled: true },
  { id: 'a2', time: '22:00', label: 'Dorm main gate lock check', enabled: true },
  { id: 'a3', time: '23:15', label: 'Hallway perimeter check', enabled: true },
];
