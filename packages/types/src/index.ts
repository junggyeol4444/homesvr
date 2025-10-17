import type {
  Category,
  Product,
  ProductSpec,
  ProductPrice,
  ComparisonSnapshot,
  SurveyQuestion,
  SurveyResponse,
  PriceAlert,
  CompatibilityTag
} from '@prisma/client';

type ApiBase<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type CategoryDto = ApiBase<Category> & {
  productCount: number;
};

export type ProductDto = ApiBase<Product> & {
  category: CategoryDto;
  specs: ProductSpecDto[];
  prices: ProductPriceDto[];
  compatibility: CompatibilityTagDto[];
};

export type ProductSpecDto = ApiBase<ProductSpec>;

export type ProductPriceDto = ApiBase<ProductPrice> & {
  retailerName?: string;
  partnerLink?: string;
};

export type ComparisonSnapshotDto = ApiBase<ComparisonSnapshot> & {
  products: ProductDto[];
};

export type SurveyQuestionDto = ApiBase<SurveyQuestion> & {
  options: SurveyOptionDto[];
};

export type SurveyOptionDto = {
  id: string;
  label: string;
  description?: string;
  weightKey: string;
  value: number;
};

export type SurveyResponseDto = ApiBase<SurveyResponse> & {
  answers: Array<{
    questionId: string;
    optionId: string;
    weight: number;
  }>;
  recommendedProductIds: string[];
};

export type PriceAlertDto = ApiBase<PriceAlert> & {
  product: ProductDto;
  channels: Array<'email' | 'slack' | 'telegram'>;
};

export type CompatibilityTagDto = ApiBase<CompatibilityTag> & {
  relatedProductIds: string[];
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ComparisonRequest = {
  productIds: string[];
  criteriaWeights?: Record<string, number>;
};

export type RankingRequest = {
  categoryId: string;
  weightProfileId?: string;
};

export type AlertSubscriptionRequest = {
  productId: string;
  targetPrice: number;
  email?: string;
  slackWebhook?: string;
  telegramChatId?: string;
};

export type SurveySubmissionRequest = {
  answers: Array<{ questionId: string; optionId: string }>;
  contact?: {
    email?: string;
    slack?: string;
    telegram?: string;
  };
};

export type ApiError = {
  message: string;
  code?: string;
  docsUrl?: string;
};
