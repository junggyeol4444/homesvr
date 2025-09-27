export type SupportedLanguage = 'ko' | 'en';

type Dictionary = {
  nav: {
    home: string;
    schedule: string;
    members: string;
    vod: string;
    posts: string;
    legal: string;
  };
  hero: {
    nextShow: string;
    liveSoon: string;
    liveNow: string;
    watchOn: string;
    countdown: string;
    ctaYoutube: string;
    ctaChzzk: string;
    ctaTiktok: string;
    noUpcoming: string;
  };
  common: {
    language: string;
    darkMode: string;
    lightMode: string;
    latestNotices: string;
    highlightVod: string;
    viewAll: string;
    filter: string;
    reset: string;
    empty: string;
    subscribeCalendar: string;
    download: string;
    copyLink: string;
    copied: string;
    tags: string;
    published: string;
    back: string;
    share: string;
    next: string;
    previous: string;
    all: string;
    search: string;
    close: string;
    duration: string;
    featuring: string;
  };
  schedule: {
    title: string;
    week: string;
    month: string;
    platform: string;
    series: string;
    guests: string;
    upcoming: string;
  };
  members: {
    title: string;
    intro: string;
    socials: string;
    notices: string;
    featuredVods: string;
    relatedPosts: string;
    pronouns: string;
    focus: string;
  };
  vod: {
    title: string;
    intro: string;
    searchPlaceholder: string;
    chapters: string;
  };
  posts: {
    title: string;
    intro: string;
    publishedAt: string;
  };
  legal: {
    title: string;
    privacy: string;
    copyright: string;
    ads: string;
  };
};

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  ko: {
    nav: {
      home: '홈',
      schedule: '일정',
      members: '멤버',
      vod: 'VOD',
      posts: '공지',
      legal: '정책'
    },
    hero: {
      nextShow: '다음 방송',
      liveSoon: '잠시 후 시작',
      liveNow: '라이브 중',
      watchOn: '바로가기',
      countdown: '시작까지',
      ctaYoutube: '유튜브',
      ctaChzzk: '치지직',
      ctaTiktok: '틱톡',
      noUpcoming: '예정된 방송이 없습니다. 곧 돌아올게요!'
    },
    common: {
      language: '언어',
      darkMode: '다크 모드',
      lightMode: '라이트 모드',
      latestNotices: '최신 공지',
      highlightVod: '하이라이트',
      viewAll: '전체 보기',
      filter: '필터',
      reset: '초기화',
      empty: '표시할 항목이 없습니다.',
      subscribeCalendar: '캘린더 구독',
      download: '다운로드',
      copyLink: '링크 복사',
      copied: '복사 완료!',
      tags: '태그',
      published: '발행',
      back: '돌아가기',
      share: '공유하기',
      next: '다음',
      previous: '이전',
      all: '전체',
      search: '검색',
      close: '닫기',
      duration: '재생시간',
      featuring: '출연'
    },
    schedule: {
      title: '방송 일정',
      week: '주간',
      month: '월간',
      platform: '플랫폼',
      series: '시리즈',
      guests: '게스트',
      upcoming: '다가오는 방송'
    },
    members: {
      title: '크루 멤버',
      intro: '4444 크루를 소개합니다. 각 멤버의 SNS와 대표 콘텐츠를 확인하세요.',
      socials: 'SNS',
      notices: '공지',
      featuredVods: '대표 VOD',
      relatedPosts: '관련 글',
      pronouns: '프로나운',
      focus: '주요 역할'
    },
    vod: {
      title: 'VOD & 하이라이트',
      intro: '플랫폼, 시리즈, 게스트로 필터링하여 원하는 영상을 찾아보세요.',
      searchPlaceholder: '제목 또는 태그 검색...',
      chapters: '챕터'
    },
    posts: {
      title: '공지 & 블로그',
      intro: '방송 공지와 비하인드 스토리를 확인하세요.',
      publishedAt: '발행일'
    },
    legal: {
      title: '정책',
      privacy: '개인정보 처리방침',
      copyright: '저작권 안내',
      ads: '광고 고지'
    }
  },
  en: {
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      members: 'Members',
      vod: 'VOD',
      posts: 'Posts',
      legal: 'Legal'
    },
    hero: {
      nextShow: 'Next Live',
      liveSoon: 'Starting Soon',
      liveNow: 'Live Now',
      watchOn: 'Watch on',
      countdown: 'Begins in',
      ctaYoutube: 'YouTube',
      ctaChzzk: 'Chzzk',
      ctaTiktok: 'TikTok',
      noUpcoming: 'No scheduled streams yet. Stay tuned!'
    },
    common: {
      language: 'Language',
      darkMode: 'Dark mode',
      lightMode: 'Light mode',
      latestNotices: 'Latest notices',
      highlightVod: 'Highlights',
      viewAll: 'View all',
      filter: 'Filter',
      reset: 'Reset',
      empty: 'Nothing to show just yet.',
      subscribeCalendar: 'Subscribe to calendar',
      download: 'Download',
      copyLink: 'Copy link',
      copied: 'Copied!',
      tags: 'Tags',
      published: 'Published',
      back: 'Back',
      share: 'Share',
      next: 'Next',
      previous: 'Previous',
      all: 'All',
      search: 'Search',
      close: 'Close',
      duration: 'Duration',
      featuring: 'Featuring'
    },
    schedule: {
      title: 'Stream Schedule',
      week: 'Week',
      month: 'Month',
      platform: 'Platform',
      series: 'Series',
      guests: 'Guests',
      upcoming: 'Coming Up'
    },
    members: {
      title: 'Crew Members',
      intro: 'Meet the 4444 crew. Explore their socials and featured videos.',
      socials: 'Socials',
      notices: 'Notices',
      featuredVods: 'Featured VODs',
      relatedPosts: 'Related Posts',
      pronouns: 'Pronouns',
      focus: 'Focus'
    },
    vod: {
      title: 'VOD & Highlights',
      intro: 'Filter by platform, series or guest to find the right video.',
      searchPlaceholder: 'Search by title or tags...',
      chapters: 'Chapters'
    },
    posts: {
      title: 'Announcements & Blog',
      intro: 'Get the latest announcements and behind-the-scenes stories.',
      publishedAt: 'Published'
    },
    legal: {
      title: 'Legal',
      privacy: 'Privacy Policy',
      copyright: 'Copyright Notice',
      ads: 'Advertising Disclosure'
    }
  }
};

export const supportedLanguages: SupportedLanguage[] = ['ko', 'en'];

export function getDictionary(lang?: string) {
  if (!lang || !(supportedLanguages as string[]).includes(lang)) {
    return dictionaries.ko;
  }
  return dictionaries[lang as SupportedLanguage];
}
