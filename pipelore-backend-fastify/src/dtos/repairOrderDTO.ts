import { z } from 'zod';
import type {Priority, Status} from "../generated/prisma/enums.js";

export const repairOrderSchema = z.object({
    title: z.string().max(255),
    description: z.string().optional(),
    location: z.string(),
    priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']),
    status: z.enum(['OPEN','IN_PROGRESS','COMPLETED','CANCELLED']),
    dueDate: z.string().refine(s => !isNaN(Date.parse(s)), { message: 'Invalid date' }).optional(),
    completedAt: z.string().refine(s => !isNaN(Date.parse(s)), { message: 'Invalid date' }).optional(),
});

export type RepairOrderInput = z.infer<typeof repairOrderSchema>;

export type CreateRepairOrderData = {
    title: string;
    description: string | null;
    location: string;
    priority: Priority;
    status: Status;
    dueDate: Date | null;
    completedAt: Date | null;
};