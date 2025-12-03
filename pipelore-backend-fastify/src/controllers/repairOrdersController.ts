import type { FastifyRequest, FastifyReply } from 'fastify';
import { type RepairOrderInput, repairOrderSchema } from '../dtos/repairOrderDTO.js';
import { stripUndefined } from '../utils/stripUndefined.js';
import { notFound, badRequest, serverError } from '../middlewares/errors.js';
const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
type Status = (typeof VALID_STATUSES)[number];

const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
type Priority = (typeof VALID_PRIORITIES)[number];

const validStatus: Status[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const validPriority: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function normalize(v: unknown): string | undefined {
    if (Array.isArray(v)) v = v[0];
    if (typeof v !== 'string') return undefined;
    const t = v.trim();
    return t === '' ? undefined : t.toUpperCase();
}

/**
 * Helpers to safely parse date strings into Date | null
 */
function parseOptionalDate(s: unknown): Date | null {
    if (typeof s !== 'string' || s.trim() === '') return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * GET /api/repair-orders
 * Optional query params: status, priority
 */
export const getAllRepairOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { repairOrdersService } = (request.server as any).services;
        const status = normalize((request.query as any).status);
        const priority = normalize((request.query as any).priority);

        // If no filters → return all
        if (!status && !priority) {
            const orders = await repairOrdersService.getAllRepairOrders();
            return reply.send(orders);
        }

        // Validate allowed values
        if (status && !validStatus.includes(status as Status)) {
            throw badRequest(`Invalid status filter: ${status}`);
        }
        if (priority && !validPriority.includes(priority as Priority)) {
            throw badRequest(`Invalid priority filter: ${priority}`);
        }

        const filters = {
            ...(status ? { status: status as Status } : {}),
            ...(priority ? { priority: priority as Priority } : {}),
        };

        const repairOrders = await repairOrdersService.getAllRepairOrders(filters);
        return reply.send(repairOrders);
    } catch (err) {
        throw err;
    }
};

/**
 * GET /api/repair-orders/:id
 */
export const getRepairOrderById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { repairOrdersService } = (request.server as any).services;
        const { id } = request.params;
        if (!id) throw badRequest('Missing id param');
        const repairOrder = await repairOrdersService.getRepairOrderById(id);
        if (!repairOrder) throw notFound('Repair order not found');

        return reply.send(repairOrder);
    } catch (err) {
        throw err;
    }
};

/**
 * POST /api/repair-orders
 */
export const createRepairOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { repairOrdersService } = (request.server as any).services;
        const parsed = repairOrderSchema.safeParse(request.body);
        if (!parsed.success) {
            throw badRequest('Validation failed');
        }

        const input = parsed.data as RepairOrderInput;
        const createData = {
            ...input,
            dueDate: parseOptionalDate(input.dueDate) ?? undefined,
            completedAt: parseOptionalDate(input.completedAt) ?? undefined,
        };

        const repairOrder = await repairOrdersService.createRepairOrder(createData as any);
        return reply.code(201).send(repairOrder);
    } catch (err: any) {
        if ((err as any)?.name && (err as any).name.startsWith('Prisma')) {
            throw serverError('Database operation failed');
        }
        throw err;
    }
};

type UpdateRepairOrderPayload = Partial<
    Omit<
        RepairOrderInput,
        'dueDate' | 'completedAt' // we'll declare these separately to accept Date | null
    >
> & {
    dueDate?: string | Date | null;
    completedAt?: string | Date | null;
};

/**
 * PUT /api/repair-orders/:id
 */
export const updateRepairOrder = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { repairOrdersService } = (request.server as any).services;

        const { id } = request.params;
        if (!id) throw badRequest('Missing id param');

        const parsed = repairOrderSchema.partial().safeParse(request.body);
        if (!parsed.success) {
            throw badRequest('Validation failed');
        }

        // strip undefined fields from the parsed data
        const rawPartial = stripUndefined<RepairOrderInput>(parsed.data);

        const partialData: UpdateRepairOrderPayload = {
            ...rawPartial,
            // only add dueDate/completedAt if they were provided
            ...(rawPartial.dueDate !== undefined ? { dueDate: parseOptionalDate(rawPartial.dueDate) } : {}),
            ...(rawPartial.completedAt !== undefined ? { completedAt: parseOptionalDate(rawPartial.completedAt) } : {}),
        };

        const updated = await repairOrdersService.updateRepairOrder(id, partialData as any);
        return reply.send(updated);
    } catch (err: any) {
        if ((err as any)?.name && (err as any).name.startsWith('Prisma')) {
            throw serverError('Database operation failed');
        }
        throw err;
    }
};

/**
 * DELETE /api/repair-orders/:id
 */
export const deleteRepairOrder = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { repairOrdersService } = (request.server as any).services;
        const { id } = request.params;
        if (!id) throw badRequest('Missing id param');

        await repairOrdersService.deleteRepairOrder(id);
        return reply.code(204).send();
    } catch (err: any) {
        if ((err as any)?.name && (err as any).name.startsWith('Prisma')) {
            throw serverError('Database operation failed');
        }
        throw err;
    }
};

/**
 * GET /api/repair-orders/late
 */
export const getLateRepairOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { repairOrdersService } = (request.server as any).services;
        const lateRepairOrders = await repairOrdersService.getLateRepairOrders();
        return reply.send(lateRepairOrders);
    } catch (err: any) {
        if ((err as any)?.name && (err as any).name.startsWith('Prisma')) {
            throw serverError('Database operation failed');
        }
        throw err;
    }
};
