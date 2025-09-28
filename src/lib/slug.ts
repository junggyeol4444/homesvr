import { generateId } from './id';

export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createUniqueSlug(base: string, used: Set<string>) {
  const sanitized = createSlug(base);
  let candidate = sanitized || generateId();
  let suffix = 2;

  while (used.has(candidate)) {
    if (!sanitized) {
      candidate = `${generateId()}-${suffix++}`;
    } else {
      candidate = `${sanitized}-${suffix++}`;
    }
  }

  used.add(candidate);
  return candidate;
}
