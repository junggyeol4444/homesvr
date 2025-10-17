'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useId, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  useToast
} from '@homesvr/ui';
import type { ProductDto, SurveyQuestionDto } from '@homesvr/types';
import { apiFetch } from '../lib/api-client';

const schema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionId: z.string()
    })
  ),
  email: z.string().email().optional(),
  slack: z.string().optional(),
  telegram: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

type Recommendation = Pick<ProductDto, 'id' | 'name' | 'brand'> & { rating?: number };

export const SurveyForm = ({ questions }: { questions: SurveyQuestionDto[] }) => {
  const { register, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      answers: questions.map((question) => ({ questionId: question.id, optionId: question.options[0]?.id ?? '' }))
    }
  });
  const { push } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const idPrefix = useId();

  const answers = watch('answers') ?? [];

  const answerFieldName = (index: number) => `answers.${index}.optionId` as const;

  const contactFieldId = useMemo(
    () => ({
      email: `${idPrefix}-email`,
      slack: `${idPrefix}-slack`,
      telegram: `${idPrefix}-telegram`
    }),
    [idPrefix]
  );

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      answers: data.answers,
      contact: {
        email: data.email,
        slack: data.slack,
        telegram: data.telegram
      }
    };

    const response = await apiFetch<{ recommended: Recommendation[] }>('/survey', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setRecommendations(response.recommended ?? []);
    setSubmitted(true);
    push({ title: '추천 결과가 준비되었습니다.', variant: 'success' });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Badge variant="outline" className="text-xs text-slate-300">
                  Q{index + 1}
                </Badge>
                {question.title}
              </CardTitle>
              {question.description && <CardDescription className="text-slate-300">{question.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2">
              {question.options.map((option) => (
                <label key={option.id} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3 text-sm">
                  <input
                    type="radio"
                    value={option.id}
                    {...register(answerFieldName(index))}
                    className="mt-1"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const updated: FormValues['answers'] = answers.map((answer, answerIndex) =>
                        answerIndex === index
                          ? { questionId: question.id, optionId: event.target.value }
                          : answer
                      );
                      setValue('answers', updated, { shouldValidate: true });
                    }}
                  />
                  <div>
                    <span className="font-medium text-white">{option.label}</span>
                    {option.description && <p className="text-xs text-slate-400">{option.description}</p>}
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">알림 채널 선택</CardTitle>
          <CardDescription className="text-slate-300">추천 결과 업데이트와 가격 알림을 받아볼 채널을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={contactFieldId.email} className="text-xs uppercase text-slate-400">
              이메일
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              id={contactFieldId.email}
              {...register('email')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={contactFieldId.slack} className="text-xs uppercase text-slate-400">
              Slack Webhook
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/..."
              id={contactFieldId.slack}
              {...register('slack')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={contactFieldId.telegram} className="text-xs uppercase text-slate-400">
              Telegram Chat ID
            </label>
            <input
              type="text"
              placeholder="@username 또는 ID"
              id={contactFieldId.telegram}
              {...register('telegram')}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? '분석 중...' : '추천 결과 확인'}
      </Button>
      {submitted && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">추천 결과</CardTitle>
            <CardDescription className="text-slate-300">설문 가중치를 기반으로 추천된 상위 모델</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recommendations.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200">
                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.brand}</p>
                </div>
                <a href={`/products/${product.id}`} className="text-xs text-primary">
                  상세 보기 →
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </form>
  );
};
