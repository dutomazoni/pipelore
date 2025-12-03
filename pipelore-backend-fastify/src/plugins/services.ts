
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { repairOrdersService } from '../services/repairOrdersService.js';

declare module 'fastify' {
    interface FastifyInstance {
        services: {
            repairOrdersService: ReturnType<typeof repairOrdersService>;
        };
    }
}

const servicesPlugin: FastifyPluginAsync = async (fastify) => {
    const prisma = (fastify as any).prisma;
    fastify.decorate('services', {
        repairOrdersService: repairOrdersService(prisma),
    });
};

export default fp(servicesPlugin, { name: 'fastify-services' });
