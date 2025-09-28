'use client';

import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/storage';
import { membersFromLegacyCategories, normalizeStoredMembers } from '@/lib/members';
import type { StoredMember } from '@/types/stored-member';

export function useStoredMembers() {
  const [members, setMembers] = useState<StoredMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMembers = useCallback((): StoredMember[] => {
    if (typeof window === 'undefined') {
      setMembers([]);
      setIsLoading(false);
      return [];
    }

    try {
      const rawMembers = window.localStorage.getItem(STORAGE_KEYS.members);
      if (rawMembers) {
        const parsed = JSON.parse(rawMembers);
        const normalized = normalizeStoredMembers(parsed);
        setMembers(normalized);
        window.localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(normalized));
        setIsLoading(false);
        return normalized;
      }

      const legacy = window.localStorage.getItem(STORAGE_KEYS.legacyCategories);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        const migrated = membersFromLegacyCategories(parsedLegacy);
        setMembers(migrated);
        if (migrated.length) {
          window.localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(migrated));
        }
        setIsLoading(false);
        return migrated;
      }
    } catch (error) {
      console.error('멤버 정보를 불러오지 못했습니다.', error);
    }

    setMembers([]);
    setIsLoading(false);
    return [];
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return { members, reload: loadMembers, isLoading };
}
