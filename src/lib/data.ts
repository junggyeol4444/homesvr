import episodesData from '@/content/episodes.json';
import membersData from '@/content/members.json';
import postsData from '@/content/posts.json';
import vodsData from '@/content/vods.json';
import type { Episode, Member, Post, Vod } from '@/content/types';
import { isUpcoming } from './datetime';

const episodes = (episodesData as Episode[]).map((episode) => ({ ...episode }));
const members = (membersData as Member[]).map((member) => ({ ...member }));
const posts = (postsData as Post[])
  .map((post) => ({ ...post }))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
  return episodes.filter((episode) => episode.published).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

export function getUpcomingEpisode(): Episode | undefined {
  return getEpisodes()
    .filter((episode) => isUpcoming(episode.startAt))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
}

export function getUpcomingEpisodes(limit = 6) {
  return getEpisodes()
    .filter((episode) => isUpcoming(episode.startAt))
    .slice(0, limit);
}

export function getPosts(): Post[] {
  return posts;
}

export function getLatestPosts(limit = 3) {
  return posts.slice(0, limit);
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getVods(): Vod[] {
  return vods;
}

export function getVodById(id: string) {
  return vods.find((vod) => vod.id === id);
}

export function getPostsByAuthor(slug: string) {
  return posts.filter((post) => post.author === slug);
}

export function getEpisodesByGuest(slug: string) {
  return getEpisodes().filter((episode) => episode.guests.includes(slug));
}

export function getMembersBySlugList(slugs: string[]) {
  return members.filter((member) => slugs.includes(member.slug));
}
