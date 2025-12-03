import * as controller from '../controllers/repairOrdersController.js';
import {FastifyPluginAsyncZod} from "fastify-type-provider-zod";

// Response schemas for Swagger documentation
const repairOrderResponse = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        location: { type: 'string' },
        priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
        status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
        dueDate: { type: 'string', format: 'date-time', nullable: true },
        completedAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
};

const repairOrdersResponse = {
    type: 'array',
    items: repairOrderResponse
};

const errorResponse = {
    type: 'object',
    properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        errors: { type: 'object', additionalProperties: true, nullable: true }
    }
};

const repairOrdersRoutes: FastifyPluginAsyncZod = async (fastify) => {
    // GET /api/repair-orders
    fastify.get('/', {
        schema: {
            description: 'Get all repair orders with optional filtering',
            tags: ['repair-orders'],
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
                    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] }
                }
            },
            response: {
                200: repairOrdersResponse,
                400: errorResponse,
                500: errorResponse
            }
        }
    }, controller.getAllRepairOrders);

    // GET /api/repair-orders/late
    fastify.get('/late', {
        schema: {
            description: 'Get all late repair orders (past due date and not completed)',
            tags: ['repair-orders'],
            response: {
                200: repairOrdersResponse,
                500: errorResponse
            }
        }
    }, controller.getLateRepairOrders);

    // GET /api/repair-orders/:id
    fastify.get('/:id', {
        schema: {
            description: 'Get a repair order by ID',
            tags: ['repair-orders'],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string', description: 'Repair order ID' }
                }
            },
            response: {
                200: repairOrderResponse,
                404: errorResponse,
                500: errorResponse
            }
        }
    }, controller.getRepairOrderById);

    // POST /api/repair-orders
    fastify.post('/', {
        schema: {
            description: 'Create a new repair order',
            tags: ['repair-orders'],
            body: {
                type: 'object',
                required: ['title', 'location', 'priority', 'status'],
                properties: {
                    title: { type: 'string', maxLength: 255 },
                    description: { type: 'string', nullable: true },
                    location: { type: 'string' },
                    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
                    status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                    completedAt: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            response: {
                201: repairOrderResponse,
                400: errorResponse,
                500: errorResponse
            }
        }
    }, controller.createRepairOrder);

    // PUT /api/repair-orders/:id
    fastify.put('/:id', {
        schema: {
            description: 'Update an existing repair order',
            tags: ['repair-orders'],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string', description: 'Repair order ID' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string', maxLength: 255 },
                    description: { type: 'string', nullable: true },
                    location: { type: 'string' },
                    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
                    status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                    completedAt: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            response: {
                200: repairOrderResponse,
                400: errorResponse,
                404: errorResponse,
                500: errorResponse
            }
        }
    }, controller.updateRepairOrder);

    // DELETE /api/repair-orders/:id
    fastify.delete('/:id', {
        schema: {
            description: 'Delete a repair order',
            tags: ['repair-orders'],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string', description: 'Repair order ID' }
                }
            },
            response: {
                204: {
                    type: 'null',
                    description: 'No content'
                },
                404: errorResponse,
                500: errorResponse
            }
        }
    }, controller.deleteRepairOrder);
};

export default repairOrdersRoutes;