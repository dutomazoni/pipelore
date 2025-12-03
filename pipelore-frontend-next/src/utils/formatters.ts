import { Status } from './types';

export const getStatusColor = (status: Status): string => {
    switch (status) {
        case Status.OPEN:
            return 'bg-yellow-100 text-yellow-800';
        case Status.IN_PROGRESS:
            return 'bg-blue-100 text-blue-800';
        case Status.COMPLETED:
            return 'bg-green-100 text-green-800';
        case Status.CANCELLED:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export function formatDateForApi(dateString: string | undefined | null): string | undefined {
    if (!dateString) return undefined;
    return new Date(`${dateString}T00:00:00.000Z`).toISOString();
}

export function formatDateForForm(date: string | null | undefined): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
}
