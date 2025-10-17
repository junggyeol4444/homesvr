import type { Request, Response } from 'express';
import logger from '../lib/logger';

export const errorHandler = (err: Error, _req: Request, res: Response) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ message: err.message ?? 'Internal server error' });
};
