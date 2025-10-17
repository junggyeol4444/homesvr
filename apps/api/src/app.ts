import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { validateServerEnv } from '@homesvr/config';
import { errorHandler } from './middleware/error-handler';
import router from './routes';
import { createOpenApiSpec } from './docs/swagger';

const env = validateServerEnv(process.env);

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

const swaggerSpec = createOpenApiSpec();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));

app.use('/api', router);
app.use(errorHandler);

export default app;
export { env };
