import { promises as fs } from 'fs';
import path from 'path';
import type { Episode, Post } from '@/content/types';

const contentDir = path.join(process.cwd(), 'src', 'content');

async function ensureFile(filePath: string, fallback: unknown) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
  }
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  const filePath = path.join(contentDir, filename);
  await ensureFile(filePath, fallback);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw.trim()) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read ${filename}`, error);
    return fallback;
  }
}

async function writeJsonFile<T>(filename: string, data: T) {
  const filePath = path.join(contentDir, filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function loadAdminPosts() {
  return readJsonFile<Post[]>('posts.json', []);
}

export async function saveAdminPosts(posts: Post[]) {
  await writeJsonFile('posts.json', posts);
}

export async function loadAdminEpisodes() {
  return readJsonFile<Episode[]>('episodes.json', []);
}

export async function saveAdminEpisodes(episodes: Episode[]) {
  await writeJsonFile('episodes.json', episodes);
}
