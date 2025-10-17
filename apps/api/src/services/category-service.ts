import prisma from '../lib/prisma';

export const listCategories = () =>
  prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { name: 'asc' }
  });
