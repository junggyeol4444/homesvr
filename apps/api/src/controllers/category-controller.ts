import type { Request, Response } from 'express';
import { listCategories } from '../services/category-service';

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await listCategories();
  res.json({
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category._count.products
    }))
  });
};
