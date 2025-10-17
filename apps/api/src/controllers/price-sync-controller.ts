import type { Request, Response } from 'express';
import logger from '../lib/logger';

export const refreshPrices = async (_req: Request, res: Response) => {
  logger.info('Price refresh triggered');
  // Placeholder: integrate Cloud Scheduler job to update price data
  res.json({ status: 'queued' });
};
