import { SurveyForm } from '../../components/survey-form';
import { apiFetch } from '../../lib/api-client';
import type { SurveyQuestionDto } from '@homesvr/types';

export const revalidate = 60;

const ToolsPage = async () => {
  const data = await apiFetch<{ questions: SurveyQuestionDto[] }>('/survey');

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">맞춤 설문 도구</h1>
        <p className="text-sm text-slate-400">10개의 질문에 답하면 가중치를 저장하고 맞춤 추천을 제공합니다.</p>
      </header>
      <SurveyForm questions={data.questions} />
    </div>
  );
};

export default ToolsPage;
