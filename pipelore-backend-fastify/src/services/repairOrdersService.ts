import type { RepairOrder } from  '../generated/prisma/client.js';
import type { CreateRepairOrderData, RepairOrderInput } from '../dtos/repairOrderDTO.js';
import { repairOrdersRepository, type RepairOrderFilters } from '../repositories/repairOrdersRepository.js';

export const repairOrdersService = (prismaClient: any) => {
    const repo = repairOrdersRepository(prismaClient);

    return {
        getAllRepairOrders: async (filters: RepairOrderFilters = {}): Promise<RepairOrder[]> => {
            return repo.findAll(filters);
        },

        getRepairOrderById: async (id: string): Promise<RepairOrder | null> => {
            return repo.findById(id);
        },

        createRepairOrder: async (data: RepairOrderInput): Promise<RepairOrder> => {
            const payload: CreateRepairOrderData = {
                title: data.title,
                location: data.location,
                priority: data.priority as any,
                status: data.status as any,
                description: data.description ?? null,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                completedAt: data.completedAt ? new Date(data.completedAt) : null,
            };

            return repo.create(payload);
        },

        updateRepairOrder: async (id: string, data: Partial<RepairOrderInput>): Promise<RepairOrder> => {
            const updateData: Partial<CreateRepairOrderData> = {};

            if (data.title !== undefined) updateData.title = data.title;
            if (data.location !== undefined) updateData.location = data.location;
            if (data.priority !== undefined) updateData.priority = data.priority as any;
            if (data.status !== undefined) updateData.status = data.status as any;
            if (data.description !== undefined) updateData.description = data.description ?? null;
            if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
            if (data.completedAt !== undefined) updateData.completedAt = data.completedAt ? new Date(data.completedAt) : null;

            return repo.update(id, updateData as any);
        },

        deleteRepairOrder: async (id: string): Promise<RepairOrder> => {
            return repo.delete(id);
        },

        getLateRepairOrders: async (): Promise<RepairOrder[]> => {
            return repo.findLate();
        },
    };
};
