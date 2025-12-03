import { LucideIcon, CircleDot, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';

export enum Status {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export const StatusIcons: Record<Status, LucideIcon> = {
    [Status.OPEN]: CircleDot,
    [Status.IN_PROGRESS]: PlayCircle,
    [Status.COMPLETED]: CheckCircle2,
    [Status.CANCELLED]: XCircle,
};

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export interface RepairOrder {
    id: string;
    title: string;
    description?: string;
    location: string;
    priority: Priority;
    status: Status;
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRepairOrderInput {
    title: string;
    description?: string;
    location: string;
    priority: Priority;
    status: Status;
    dueDate?: string;
    completedAt?: string;
}

export interface UpdateRepairOrderInput {
    id: string;
    title?: string;
    description?: string;
    location?: string;
    priority?: Priority;
    status?: Status;
    dueDate?: string;
    completedAt?: string;
}