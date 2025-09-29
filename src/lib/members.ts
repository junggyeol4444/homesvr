import { generateId } from './id';
import { createUniqueSlug } from './slug';
import type { StoredMember } from '@/types/stored-member';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeStoredMembers(value: unknown): StoredMember[] {
  if (!Array.isArray(value)) return [];

  const used = new Set<string>();
  const normalized: StoredMember[] = [];

  for (const item of value) {
    if (!isRecord(item)) continue;
    const rawName = typeof item.name === 'string' ? item.name.trim() : '';
    if (!rawName) continue;

    const id = typeof item.id === 'string' && item.id ? item.id : generateId();
    const baseSlug = typeof item.slug === 'string' && item.slug ? item.slug : rawName;
    const slug = createUniqueSlug(baseSlug, used);

    normalized.push({
      id,
      name: rawName,
      slug,
      role: typeof item.role === 'string' && item.role.trim() ? item.role.trim() : undefined,
      description:
        typeof item.description === 'string' && item.description.trim() ? item.description.trim() : undefined,
      profileUrl:
        typeof item.profileUrl === 'string' && item.profileUrl.trim() ? item.profileUrl.trim() : undefined,
      avatarUrl:
        typeof item.avatarUrl === 'string' && item.avatarUrl.trim() ? item.avatarUrl.trim() : undefined,
      createdAt: typeof item.createdAt === 'string' && item.createdAt ? item.createdAt : undefined
    });
  }

  return normalized;
}

export function membersFromLegacyCategories(value: unknown): StoredMember[] {
  if (!Array.isArray(value)) return [];
  const used = new Set<string>();
  const migrated: StoredMember[] = [];

  for (const item of value) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    if (!trimmed) continue;

    const slug = createUniqueSlug(trimmed, used);
    migrated.push({ id: generateId(), name: trimmed, slug });
  }

  return migrated;
}
