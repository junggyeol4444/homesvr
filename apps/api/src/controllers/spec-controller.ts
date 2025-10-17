import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const listSpecs = async (req: Request, res: Response) => {
  const { categoryId } = req.query;

  const specs = await prisma.productSpec.findMany({
    where: categoryId ? { product: { categoryId: categoryId as string } } : undefined,
    select: {
      label: true,
      category: true
    }
  });

  const aggregated = Object.values(
    specs.reduce<Record<string, { label: string; category: string | null; count: number }>>((acc, spec) => {
      const key = spec.label;
      const existing = acc[key];
      if (existing) {
        existing.count += 1;
      } else {
        acc[key] = { label: spec.label, category: spec.category ?? null, count: 1 };
      }
      return acc;
    }, {})
  );

  res.json({ specs: aggregated });
};
