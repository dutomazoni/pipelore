import type { PrismaClient, RepairOrder, Priority, Status } from '../generated/prisma/client.js';
import type { CreateRepairOrderData } from '../dtos/repairOrderDTO.js';

export type RepairOrderFilters = {
    status?: Status;
    priority?: Priority;
};

export const repairOrdersRepository = (prisma: PrismaClient) => {
    return {
        findAll: async (filters: RepairOrderFilters = {}): Promise<RepairOrder[]> => {
            const where: any = {};
            if (filters.status !== undefined) where.status = filters.status;
            if (filters.priority !== undefined) where.priority = filters.priority;
            return prisma.repairOrder.findMany({ where });
        },

        findById: async (id: string): Promise<RepairOrder | null> => {
            return prisma.repairOrder.findUnique({ where: { id } });
        },

        create: async (data: CreateRepairOrderData): Promise<RepairOrder> => {
            return prisma.repairOrder.create({
                data: {
                    title: data.title,
                    location: data.location,
                    priority: data.priority,
                    status: data.status,
                    description: data.description ?? null,
                    dueDate: data.dueDate ?? null,
                    completedAt: data.completedAt ?? null,
                },
            });
        },

        update: async (id: string, data: Partial<CreateRepairOrderData>): Promise<RepairOrder> => {
            const updateData: any = {};
            if (data.title !== undefined) updateData.title = data.title;
            if (data.location !== undefined) updateData.location = data.location;
            if (data.priority !== undefined) updateData.priority = data.priority;
            if (data.status !== undefined) updateData.status = data.status;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
            if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;

            return prisma.repairOrder.update({
                where: { id },
                data: updateData,
            });
        },

        delete: async (id: string): Promise<RepairOrder> => {
            return prisma.repairOrder.delete({ where: { id } });
        },

        findLate: async (): Promise<RepairOrder[]> => {
            return prisma.repairOrder.findMany({
                where: {
                    dueDate: { lt: new Date() },
                    status: { notIn: ['COMPLETED', 'CANCELLED'] },
                },
            });
        },
    };
};
