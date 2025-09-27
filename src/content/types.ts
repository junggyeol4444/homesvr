export type Platform = 'youtube' | 'chzzk' | 'tiktok';

export interface Episode {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt?: string;
  platform: Platform;
  url: string;
  thumbnail: string;
  series: string[];
  guests: string[];
  tags: string[];
  published: boolean;
}

export interface MemberSocials {
  youtube?: string;
  chzzk?: string;
  tiktok?: string;
  twitch?: string;
  x?: string;
  instagram?: string;
  email?: string;
}

export interface Member {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  bio_en?: string;
  avatar: string;
  socials: MemberSocials;
  featuredVods: string[];
  noticePinned?: string;
  focus?: string[];
  pronouns?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  cover?: string;
  body: string;
  body_en?: string;
  tags: string[];
  publishedAt: string;
  author: string;
}

export interface VodChapter {
  time: number;
  title: string;
}

export interface Vod {
  id: string;
  title: string;
  description?: string;
  platform: Platform;
  videoId: string;
  thumbnail: string;
  series: string[];
  tags: string[];
  chapters?: VodChapter[];
  members: string[];
  publishedAt?: string;
  duration?: number;
}
