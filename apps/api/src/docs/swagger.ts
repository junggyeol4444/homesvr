import swaggerJSDoc from 'swagger-jsdoc';

export const createOpenApiSpec = () =>
  swaggerJSDoc({
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Homesvr API',
        version: '0.1.0',
        description: '가전·디지털 쇼핑 가이드 REST API'
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api'
        }
      ]
    },
    apis: ['src/routes/*.ts']
  });
