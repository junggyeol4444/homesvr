'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@homesvr/ui';
import { apiFetch } from '../lib/api-client';

const schema = z.object({
  productId: z.string().min(1),
  targetPrice: z.number().min(1),
  email: z.string().email().optional(),
  slackWebhook: z.string().optional(),
  telegramChatId: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export const PriceAlertForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: '',
      targetPrice: 100000
    }
  });
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const idPrefix = useId();

  const fieldId = (name: keyof FormValues) => `${idPrefix}-${name}`;

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await apiFetch('/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    push({ title: '가격 알림이 등록되었습니다.', variant: 'success' });
    reset();
    setLoading(false);
  });

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">가격 알림 등록</CardTitle>
        <CardDescription className="text-slate-300">
          이메일 또는 메신저 토큰은 Cloud KMS/Secrets Manager에 암호화 저장됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={fieldId('productId')} className="text-xs uppercase text-slate-400">
              제품 ID
            </label>
            <input
              type="text"
              placeholder="제품 고유 ID"
              id={fieldId('productId')}
              {...register('productId')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={fieldId('targetPrice')} className="text-xs uppercase text-slate-400">
              목표 가격
            </label>
            <input
              type="number"
              step="1000"
              id={fieldId('targetPrice')}
              {...register('targetPrice', { valueAsNumber: true })}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={fieldId('email')} className="text-xs uppercase text-slate-400">
              이메일
            </label>
            <input
              type="email"
              id={fieldId('email')}
              {...register('email')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={fieldId('slackWebhook')} className="text-xs uppercase text-slate-400">
              Slack Webhook
            </label>
            <input
              type="url"
              id={fieldId('slackWebhook')}
              {...register('slackWebhook')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={fieldId('telegramChatId')} className="text-xs uppercase text-slate-400">
              Telegram Chat ID
            </label>
            <input
              type="text"
              id={fieldId('telegramChatId')}
              {...register('telegramChatId')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading || formState.isSubmitting}>
              {loading ? '등록 중...' : '가격 알림 신청'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
