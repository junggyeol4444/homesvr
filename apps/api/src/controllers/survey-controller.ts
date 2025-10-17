import type { Request, Response } from 'express';
import { getSurveyQuestions, submitSurvey } from '../services/survey-service';

export const listSurveyQuestions = async (_req: Request, res: Response) => {
  const questions = await getSurveyQuestions();
  res.json({ questions });
};

export const submitSurveyResponse = async (req: Request, res: Response) => {
  const { answers, contact } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ message: 'answers are required' });
    return;
  }

  const result = await submitSurvey({ answers, contact });

  res.status(201).json(result);
};
