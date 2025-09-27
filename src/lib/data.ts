import fs from 'fs';
import path from 'path';
import membersData from '@/content/members.json';
import vodsData from '@/content/vods.json';
import type { Episode, Member, Post, Vod } from '@/content/types';
import { isUpcoming } from './datetime';

const dataDir = path.join(process.cwd(), 'src', 'content');

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw.trim()) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read ${filename}`, error);
    return fallback;
  }
}

function loadEpisodes(): Episode[] {
  return readJsonFile<Episode[]>('episodes.json', []).map((episode) => ({ ...episode }));
}

function loadPosts(): Post[] {
  return readJsonFile<Post[]>('posts.json', [])
    .map((post) => ({ ...post }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

const members = (membersData as Member[]).map((member) => ({ ...member }));
const vods = (vodsData as Vod[])
  .map((vod) => ({ ...vod }))
  .sort((a, b) => {
    const aTime = vodTime(a);
    const bTime = vodTime(b);
    return bTime - aTime;
  });

function vodTime(vod: Vod) {
  return vod.publishedAt ? new Date(vod.publishedAt).getTime() : 0;
}

export function getMembers(): Member[] {
  return members;
}

export function getMemberBySlug(slug: string) {
  return members.find((member) => member.slug === slug);
}

export function getEpisodes() {
  return loadEpisodes()
    .filter((episode) => episode.published)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

export function getUpcomingEpisode(): Episode | undefined {
  return loadEpisodes()
    .filter((episode) => episode.published && isUpcoming(episode.startAt))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
}

export function getUpcomingEpisodes(limit = 6) {
  return loadEpisodes()
    .filter((episode) => episode.published && isUpcoming(episode.startAt))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, limit);
}

export function getPosts(): Post[] {
  return loadPosts();
}

export function getLatestPosts(limit = 3) {
  return loadPosts().slice(0, limit);
}

export function getPostBySlug(slug: string) {
  return loadPosts().find((post) => post.slug === slug);
}

export function getVods(): Vod[] {
  return vods;
}

export function getVodById(id: string) {
  return vods.find((vod) => vod.id === id);
}

export function getPostsByAuthor(slug: string) {
  return loadPosts().filter((post) => post.author === slug);
}

export function getEpisodesByGuest(slug: string) {
  return loadEpisodes().filter((episode) => episode.guests.includes(slug));
}

export function getMembersBySlugList(slugs: string[]) {
  return members.filter((member) => slugs.includes(member.slug));
}
