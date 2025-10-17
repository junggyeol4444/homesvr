import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const listCompatibility = async (req: Request, res: Response) => {
  const { productId } = req.query;
  if (!productId || typeof productId !== 'string') {
    res.status(400).json({ message: 'productId is required' });
    return;
  }

  const compatibility = await prisma.compatibilityTag.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ compatibility });
};
