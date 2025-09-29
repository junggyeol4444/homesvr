import type { Metadata } from 'next';
import { CategorySidebar } from '@/components/home/category-sidebar';
import { FeaturedVideo } from '@/components/home/featured-video';
import { NoticeBoard } from '@/components/home/notice-board';
import { ScheduleBoard } from '@/components/home/schedule-board';

export const metadata: Metadata = {
  title: '쌀가루집안 방송 허브',
  description: '쌀가루집안의 방송과 소식을 한눈에 확인하세요.'
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-[260px,1fr]">
        <CategorySidebar />
        <div className="space-y-8">
          <FeaturedVideo />
          <div className="grid gap-6 lg:grid-cols-2">
            <NoticeBoard />
            <ScheduleBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
