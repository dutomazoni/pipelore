import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './errors.js';
import { ZodError } from 'zod';

export function createFastifyErrorHandler() {
    return async function fastifyErrorHandler(
        error: FastifyError,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        // Defaults
        let statusCode = 500;
        let message = 'Something went wrong';
        let errors: unknown = undefined;
        const responseBody: any = {
            status: 'error',
            message,
        };


        // AppError
        if (error instanceof AppError) {
            statusCode = error.statusCode;
            responseBody.message = error.message;
        }
        // Zod validation error
        else if (error instanceof ZodError) {
            statusCode = 400;
            responseBody.message = 'Validation error';
        }
        // PrismaKnownRequestError or other Prisma errors (strings for safety)
        else if ((error as any)?.name === 'PrismaClientKnownRequestError') {
            statusCode = 400;
            responseBody.message = 'Database operation failed';
        }
        // native Error fallback
        else if (error instanceof Error) {
            responseBody.message = error.message || message;
        }

        // Log the full error server-side
        request.log.error(error);


        if (process.env.NODE_ENV === 'development' && error.stack) {
            responseBody.stack = error.stack;
        }
        // Send response
        reply.status(statusCode).send(responseBody);
    };
}
