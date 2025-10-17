import { Prisma } from '@prisma/client';
import type { AlertSubscriptionRequest } from '@homesvr/types';
import prisma from '../lib/prisma';

export const subscribePriceAlert = async (payload: AlertSubscriptionRequest, salt: string) => {
  const product = await prisma.product.findUnique({ where: { id: payload.productId } });
  if (!product) {
    throw new Error('Product not found');
  }

  const alert = await prisma.priceAlert.create({
    data: {
      productId: payload.productId,
      targetPrice: new Prisma.Decimal(payload.targetPrice),
      email: payload.email,
      slackWebhook: payload.slackWebhook,
      telegramChatId: payload.telegramChatId,
      salt
    }
  });

  return alert;
};

export const listActiveAlerts = async (productId: string) => {
  return prisma.priceAlert.findMany({
    where: { productId, active: true }
  });
};

export const deactivateAlert = async (id: string) => {
  return prisma.priceAlert.update({
    where: { id },
    data: { active: false }
  });
};
