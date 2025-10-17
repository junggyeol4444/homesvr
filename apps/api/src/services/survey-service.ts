import prisma from '../lib/prisma';
import type { SurveySubmissionRequest } from '@homesvr/types';
import { normalizeWeights } from '../utils/weights';

export const getSurveyQuestions = () =>
  prisma.surveyQuestion.findMany({
    include: { options: true },
    orderBy: { order: 'asc' }
  });

export const submitSurvey = async (payload: SurveySubmissionRequest) => {
  const questions = await prisma.surveyQuestion.findMany({ include: { options: true } });

  const weights = payload.answers.reduce<Record<string, number>>((acc, answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return acc;
    const option = question.options.find((opt) => opt.id === answer.optionId);
    if (!option) return acc;
    acc[option.weightKey] = (acc[option.weightKey] ?? 0) + option.value;
    return acc;
  }, {});

  const normalizedWeights = normalizeWeights(weights);

  const recommended = await prisma.product.findMany({
    take: 5,
    orderBy: { rating: 'desc' }
  });

  const response = await prisma.surveyResponse.create({
    data: {
      weights: normalizedWeights,
      recommendedProductIds: recommended.map((product) => product.id),
      contactEmail: payload.contact?.email,
      contactSlack: payload.contact?.slack,
      contactTelegram: payload.contact?.telegram
    }
  });

  return {
    response,
    recommended
  };
};
