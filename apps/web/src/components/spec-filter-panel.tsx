'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@homesvr/ui';
import { apiFetch } from '../lib/api-client';

type SpecSummary = { label: string; category: string | null; count: number };

export const SpecFilterPanel = ({ categoryId, onFilterChange }: { categoryId?: string; onFilterChange: (filters: Record<string, string>) => void }) => {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { data } = useSWR(categoryId ? `/specs?categoryId=${categoryId}` : '/specs', (url) => apiFetch<{ specs: SpecSummary[] }>(url));

  const handleSelect = (label: string, value: string) => {
    const next = { ...selected, [label]: value };
    setSelected(next);
    onFilterChange(next);
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">스펙 필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-300">
        {(data?.specs ?? []).map((spec) => (
          <div key={spec.label} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-white">{spec.label}</span>
              <Badge variant="outline" className="text-[10px] text-slate-400">
                {spec.count}개
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {['상', '중', '하'].map((level) => (
                <Button
                  key={level}
                  size="sm"
                  variant={selected[spec.label] === level ? 'primary' : 'outline'}
                  onClick={() => handleSelect(spec.label, level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
