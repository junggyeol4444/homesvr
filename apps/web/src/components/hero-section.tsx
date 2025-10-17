'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@homesvr/ui';

export const HeroSection = () => (
  <section className="space-y-8 py-16">
    <motion.div
      className="max-w-3xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="rounded-full border border-primary/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary">
        MVP Preview
      </span>
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
        생활가전·디지털 기기를 <span className="text-primary">한 번에 비교</span>하고
        <br className="hidden md:block" />
        맞춤 추천까지 받아보세요.
      </h1>
      <p className="text-lg text-slate-300">
        성능, 가격, 호환성 데이터를 기반으로 한 3-way 비교, 10문항 맞춤 설문, 가격 알림 기능을 제공합니다.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/compare">지금 비교하기</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/tools">맞춤 설문 시작</Link>
        </Button>
      </div>
    </motion.div>
    <div className="grid gap-6 md:grid-cols-3">
      {[{
        title: '실시간 가격 추적',
        description: '제휴 최저가 링크와 가격 변동 알림으로 구매 타이밍을 잡으세요.'
      },
      {
        title: '스펙 필터 DB',
        description: '카테고리별 세분화된 스펙 필터로 필요한 제품만 추려드립니다.'
      },
      {
        title: '호환성 매트릭스',
        description: '게임 액세서리·스마트홈 기기와의 호환 여부를 한 번에 확인.'
      }].map((feature) => (
        <Card key={feature.title} className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription className="text-slate-300">{feature.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">데이터 수집 주기: 1시간 · Looker Studio 대시보드 연동</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);
