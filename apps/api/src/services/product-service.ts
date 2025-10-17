import { Prisma } from '@prisma/client';
import type { ComparisonRequest, RankingRequest } from '@homesvr/types';
import prisma from '../lib/prisma';

export const getProducts = async (params: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | 'rating' | 'reviews';
  page?: number;
  pageSize?: number;
  specs?: Record<string, string>;
}) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, pageSize = 20, specs = {} } = params;

  const where: Prisma.ProductWhereInput = {};
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (minPrice || maxPrice) {
    where.prices = {
      some: {
        amount: {
          gte: minPrice ? new Prisma.Decimal(minPrice) : undefined,
          lte: maxPrice ? new Prisma.Decimal(maxPrice) : undefined
        }
      }
    };
  }

  const specFilters = Object.entries(specs);
  if (specFilters.length > 0) {
    where.AND = specFilters.map(([label, value]) => ({
      specs: {
        some: {
          label,
          value: { contains: value, mode: 'insensitive' }
        }
      }
    }));
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
  if (sort === 'price') orderBy.push({ prices: { _min: { amount: 'asc' } } });
  if (sort === 'rating') orderBy.push({ rating: 'desc' });
  if (sort === 'reviews') orderBy.push({ reviewCount: 'desc' });
  if (orderBy.length === 0) orderBy.push({ createdAt: 'desc' });

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          include: {
            _count: { select: { products: true } }
          }
        },
        specs: true,
        prices: true,
        compatibility: true
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  const mapped = items.map((item) => {
    const { _count, ...category } = item.category as typeof item.category & { _count?: { products: number } };
    return {
      ...item,
      category: {
        ...category,
        productCount: _count?.products ?? 0
      }
    };
  });

  return { total, items: mapped };
};

export const getProductById = (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          _count: { select: { products: true } }
        }
      },
      specs: true,
      prices: true,
      compatibility: true
    }
  });
};

export const compareProducts = async ({ productIds, criteriaWeights }: ComparisonRequest) => {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { specs: true, prices: true, category: true, compatibility: true }
  });

  const weights = {
    performance: 0.33,
    value: 0.33,
    design: 0.34,
    ...(criteriaWeights ?? {})
  };

  const scored = products.map((product) => {
    const base = product.highlightWeights as Record<string, number> | null;
    const score = Object.entries(weights).reduce((acc, [key, weight]) => {
      const baseValue = base?.[key] ?? 0.5;
      return acc + baseValue * weight;
    }, 0);
    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ product, score }) => ({
    id: product.id,
    product,
    score
  }));
};

export const rankProducts = async ({ categoryId, weightProfileId }: RankingRequest) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) return [];

  const snapshots = await prisma.comparisonSnapshot.findMany({
    where: {
      productIds: { hasSome: [] }
    },
    take: 50
  });

  const products = await prisma.product.findMany({
    where: { categoryId },
    include: { specs: true, prices: true, category: true }
  });

  const weights = weightProfileId
    ? (snapshots.find((snapshot) => snapshot.id === weightProfileId)?.weights as Record<string, number> | undefined) ?? {}
    : { performance: 0.4, value: 0.4, design: 0.2 };

  const ranked = products
    .map((product) => {
      const base = (product.highlightWeights as Record<string, number> | null) ?? {};
      const score = Object.entries(weights).reduce((acc, [key, weight]) => {
        const baseValue = base[key] ?? 0.5;
        return acc + baseValue * (weight as number);
      }, 0);
      return { product, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked;
};
