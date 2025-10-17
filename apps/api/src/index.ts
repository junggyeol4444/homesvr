import app, { env } from './app';
import logger from './lib/logger';

const port = env.PORT ?? 8080;

app.listen(port, () => {
  logger.info(`API server listening on port ${port}`);
});
