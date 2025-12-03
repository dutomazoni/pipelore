import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import "dotenv/config";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.js';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
    const url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
    const adapter = new PrismaBetterSqlite3({ url });
    const prisma = new PrismaClient({ adapter });

    // ensure client connected
    await prisma.$connect();
    fastify.decorate('prisma', prisma);

    // close client on shutdown
    fastify.addHook('onClose', async (instance) => {
        await prisma.$disconnect();
    });
};

export default fp(prismaPlugin, {
    name: 'fastify-prisma',
});
