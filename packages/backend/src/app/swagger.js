import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const setupSwagger = (app) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const swaggerPath = path.join(__dirname, '../docs/openapi.json');

  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  console.log('Swagger UI disponible en: http://localhost:3000/api-docs');
};
