import { Status, Priority } from '@/utils/types';

export const StatusTranslations: Record<Status, string> = {
    [Status.OPEN]: 'Em Aberto',
    [Status.IN_PROGRESS]: 'Em Andamento',
    [Status.COMPLETED]: 'Concluído',
    [Status.CANCELLED]: 'Cancelado'
};

export const PriorityTranslations: Record<Priority, string> = {
    [Priority.LOW]: 'Baixa',
    [Priority.MEDIUM]: 'Média',
    [Priority.HIGH]: 'Alta',
    [Priority.URGENT]: 'Urgente'
};

export function translateStatus(status: Status): string {
    return StatusTranslations[status] || status;
}

export function translatePriority(priority: Priority): string {
    return PriorityTranslations[priority] || priority;
}