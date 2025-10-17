import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { slug: 'appliances', name: '생활가전', description: '청소기, 공기청정기 등 생활가전 기기' },
  { slug: 'audio', name: '오디오', description: '스피커, 헤드폰, 사운드바' },
  { slug: 'gaming-accessories', name: '게임 액세서리', description: '컨트롤러, VR, 주변기기' },
  { slug: 'ereader', name: '전자책 리더', description: '전자책 리더기 및 액세서리' }
] as const;

const products = Array.from({ length: 30 }).map((_, index) => {
  const category = categories[index % categories.length];
  const id = index + 1;
  return {
    slug: `product-${id}`,
    name: `가전 제품 ${id}`,
    brand: ['삼성', 'LG', 'Sony', 'Panasonic'][index % 4],
    summary: `주요 기능을 갖춘 MVP 샘플 제품 ${id}`,
    heroImageUrl: `https://images.homesvr.dev/products/${id}.jpg`,
    categorySlug: category.slug,
    rating: 4 + (index % 5) * 0.1,
    reviewCount: 100 + index * 3,
    highlightWeights: {
      performance: Math.random() * 0.5 + 0.5,
      value: Math.random() * 0.5 + 0.5,
      design: Math.random() * 0.5 + 0.5
    },
    specs: [
      { label: '배터리', value: `${8 + (index % 5)}시간`, category: '성능', order: 1, highlight: true },
      { label: '무게', value: `${(1.2 + index * 0.05).toFixed(1)}kg`, category: '휴대성', order: 2 },
      { label: '연결', value: 'Wi-Fi 6 / Bluetooth 5.2', category: '연결성', order: 3 }
    ],
    prices: [
      {
        retailer: '공식 스토어',
        amount: 350000 + index * 10000,
        currency: 'KRW',
        url: `https://partner.homesvr.dev/products/${id}`,
        partnerCode: 'aff-homesvr',
        lowest: true
      },
      {
        retailer: '네이버 스토어',
        amount: 360000 + index * 9500,
        currency: 'KRW',
        url: `https://naver.store/${id}`
      }
    ],
    compatibility: [
      {
        label: '스마트홈 연동',
        description: '구글 홈, 애플 홈킷, 삼성 스마트싱스와 호환',
        relatedProductIds: []
      }
    ]
  };
});

const survey = [
  {
    order: 1,
    title: '사용 목적은 무엇인가요?',
    description: '주 사용 시나리오를 알려주세요.',
    weightKey: 'usage',
    options: [
      { label: '가정용', value: 5, weightKey: 'home' },
      { label: '업무/프로', value: 3, weightKey: 'pro' },
      { label: '휴대용', value: 4, weightKey: 'mobile' }
    ]
  },
  {
    order: 2,
    title: '가장 중요하게 생각하는 요소는?',
    weightKey: 'priority',
    options: [
      { label: '성능', value: 5, weightKey: 'performance' },
      { label: '가격', value: 5, weightKey: 'value' },
      { label: '디자인', value: 4, weightKey: 'design' }
    ]
  }
];

const ensureQuestions = () => {
  const additional = 8;
  for (let i = 0; i < additional; i += 1) {
    survey.push({
      order: survey.length + 1,
      title: `추가 질문 ${i + 1}`,
      description: 'MVP용 추가 설문 문항',
      weightKey: `additional_${i + 1}`,
      options: [
        { label: '매우 그렇다', value: 5, weightKey: `additional_${i + 1}_high` },
        { label: '보통이다', value: 3, weightKey: `additional_${i + 1}_mid` },
        { label: '전혀 아니다', value: 1, weightKey: `additional_${i + 1}_low` }
      ]
    });
  }
};

const main = async () => {
  ensureQuestions();
  await prisma.priceAlert.deleteMany();
  await prisma.compatibilityTag.deleteMany();
  await prisma.comparisonProduct.deleteMany();
  await prisma.comparisonSnapshot.deleteMany();
  await prisma.productPrice.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.surveyOption.deleteMany();
  await prisma.surveyQuestion.deleteMany();

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category
      })
    )
  );

  for (const product of products) {
    const category = createdCategories.find((c) => c.slug === product.categorySlug);
    if (!category) continue;

    const createdProduct = await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        summary: product.summary,
        heroImageUrl: product.heroImageUrl,
        categoryId: category.id,
        rating: product.rating,
        reviewCount: product.reviewCount,
        highlightWeights: product.highlightWeights,
        specs: {
          create: product.specs.map((spec, idx) => ({
            label: spec.label,
            value: spec.value,
            category: spec.category,
            order: spec.order ?? idx,
            highlight: spec.highlight ?? false
          }))
        },
        prices: {
          create: product.prices.map((price) => ({
            retailer: price.retailer,
            amount: price.amount,
            currency: price.currency,
            url: price.url,
            partnerCode: price.partnerCode,
            lowest: price.lowest ?? false
          }))
        },
        compatibility: {
          create: product.compatibility.map((compat) => ({
            label: compat.label,
            description: compat.description,
            relatedProductIds: compat.relatedProductIds
          }))
        }
      }
    });

    await prisma.comparisonSnapshot.create({
      data: {
        name: `${createdProduct.name} 초기 비교`,
        productIds: [createdProduct.id],
        weights: product.highlightWeights ?? {}
      }
    });
  }

  for (const question of survey) {
    await prisma.surveyQuestion.create({
      data: {
        order: question.order,
        title: question.title,
        description: question.description,
        weightKey: question.weightKey,
        options: {
          create: question.options.map((option) => ({
            label: option.label,
            description: option.description,
            value: option.value,
            weightKey: option.weightKey
          }))
        }
      }
    });
  }

  console.info('Seed data loaded successfully.');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
