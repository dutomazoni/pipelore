import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import repairOrdersRoutes from '../../src/routes/repairOrders.js';
import prismaPlugin from '../../src/plugins/prisma.js';
import servicesPlugin from '../../src/plugins/services.js';
import { createFastifyErrorHandler } from '../../src/middlewares/fastifyErrorHandler.js';

export async function build() {
  const app = Fastify({ logger: false });
  app.setErrorHandler(createFastifyErrorHandler());
  
  await app.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  await app.register(helmet as any);
  
  await app.register(prismaPlugin);
  await app.register(servicesPlugin);
  await app.register(repairOrdersRoutes, { prefix: '/api/repair-orders' });
  
  return app;
}