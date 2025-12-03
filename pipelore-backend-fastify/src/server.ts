import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import repairOrdersRoutes from './routes/repairOrders.js';
import prismaPlugin from './plugins/prisma.js';
import servicesPlugin from './plugins/services.js';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import {createFastifyErrorHandler} from "./middlewares/fastifyErrorHandler.js";
const server = Fastify({logger: true});
server.setErrorHandler(createFastifyErrorHandler());
// register plugins
await server.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
});
await server.register(helmet as any);
await server.register(swagger, {
    openapi: {
        info: {
            title: 'Repair Orders API',
            description: 'API for managing repair orders',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:4000`,
                description: 'Development server'
            }
        ],
        tags: [
            {name: 'repair-orders', description: 'Repair Order related end-points'},
        ],
    },
});
await server.register(swaggerUI, {
    routePrefix: '/docs',
});
await server.register(prismaPlugin);
await server.register(servicesPlugin);
server.get('/api/health', async (request, reply) => {
    return { status: 'ok' };
});

await server.register(repairOrdersRoutes, {prefix: '/api/repair-orders'});

const PORT = Number(process.env.PORT || 4000);
server.listen({port: PORT, host: '0.0.0.0'})
    .then(() => server.log.info(`Server listening on http://localhost:${PORT}`))
    .catch((err) => {
        server.log.error(err);
        process.exit(1);
    });
