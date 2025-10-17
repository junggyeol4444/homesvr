import type { Request, Response } from 'express';
import { getProductById, getProducts, compareProducts, rankProducts } from '../services/product-service';
import logger from '../lib/logger';

export const listProducts = async (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, sort, page, pageSize } = req.query;

  const specs = Object.entries(req.query)
    .filter(([key]) => key.startsWith('spec_'))
    .reduce<Record<string, string>>((acc, [key, value]) => {
      const label = key.replace('spec_', '');
      acc[label] = String(value);
      return acc;
    }, {});

  const result = await getProducts({
    category: category as string | undefined,
    search: search as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as 'price' | 'rating' | 'reviews' | undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    specs
  });

  res.json({
    total: result.total,
    page: Number(page ?? 1),
    pageSize: Number(pageSize ?? 20),
    items: result.items.map(({ category: categoryData, ...product }) => ({
      ...product,
      category: categoryData
    }))
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  const { _count, ...category } = product.category as typeof product.category & { _count?: { products: number } };
  res.json({
    ...product,
    category: {
      ...category,
      productCount: _count?.products ?? 0
    }
  });
};

export const compareProductsController = async (req: Request, res: Response) => {
  const { productIds, criteriaWeights } = req.body;

  if (!Array.isArray(productIds) || productIds.length < 2) {
    res.status(400).json({ message: 'productIds must contain at least two items' });
    return;
  }

  try {
    const comparison = await compareProducts({ productIds, criteriaWeights });
    res.json({
      comparison,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error({ error }, 'Failed to compare products');
    res.status(500).json({ message: 'Failed to compare products' });
  }
};

export const rankProductsController = async (req: Request, res: Response) => {
  const { categoryId, weightProfileId } = req.query;

  if (!categoryId || typeof categoryId !== 'string') {
    res.status(400).json({ message: 'categoryId is required' });
    return;
  }

  const ranked = await rankProducts({
    categoryId,
    weightProfileId: weightProfileId as string | undefined
  });

  res.json({
    items: ranked,
    generatedAt: new Date().toISOString()
  });
};
