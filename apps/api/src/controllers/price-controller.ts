import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const listPrices = async (req: Request, res: Response) => {
  const { productId } = req.query;

  if (!productId) {
    res.status(400).json({ message: 'productId is required' });
    return;
  }

  const prices = await prisma.productPrice.findMany({
    where: { productId: productId as string },
    orderBy: { capturedAt: 'desc' }
  });

  res.json({ prices });
};
