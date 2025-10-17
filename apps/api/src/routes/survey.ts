import { Router } from 'express';
import { listSurveyQuestions, submitSurveyResponse } from '../controllers/survey-controller';

const router = Router();

router.get('/', listSurveyQuestions);
router.post('/', submitSurveyResponse);

export default router;
