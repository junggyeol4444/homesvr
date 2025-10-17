import type { Request, Response } from 'express';
import { subscribePriceAlert, deactivateAlert } from '../services/alert-service';
import { env } from '../app';

export const createPriceAlert = async (req: Request, res: Response) => {
  const { productId, targetPrice, email, slackWebhook, telegramChatId } = req.body;

  if (!productId || !targetPrice) {
    res.status(400).json({ message: 'productId and targetPrice are required' });
    return;
  }

  const alert = await subscribePriceAlert(
    {
      productId,
      targetPrice: Number(targetPrice),
      email,
      slackWebhook,
      telegramChatId
    },
    env.PRICE_ALERT_SALT
  );

  res.status(201).json({ alert });
};

export const cancelPriceAlert = async (req: Request, res: Response) => {
  const { id } = req.params;

  const alert = await deactivateAlert(id);
  res.json({ alert });
};
