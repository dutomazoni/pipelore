import type {
    RepairOrder,
    Status,
    CreateRepairOrderInput,
    UpdateRepairOrderInput
} from './types';

const API_BASE_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
    : 'http://localhost:4000/api';

/** Helper: read response as JSON or throw helpful error with text snippet */
async function parseJsonOrThrow(res: Response) {
    const text = await res.text();
    if (!res.ok) {
        const snippet = text.slice(0, 800).replace(/\n/g, ' ');
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${snippet}`);
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        const snippet = text.slice(0, 800).replace(/\n/g, ' ');
        throw new Error(`Invalid JSON response (status ${res.status}): ${snippet}`);
    }
}

/** common fetch options */
function defaultOpts(method = 'GET', body?: any) {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    } as RequestInit;
}

export async function fetchRepairOrders(): Promise<RepairOrder[]> {
    const url = `${API_BASE_URL}/repair-orders`;
    try {
        const res = await fetch(url, defaultOpts());
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error('Error fetching repair orders:', err);
        throw err;
    }
}

export async function fetchLateRepairOrders(): Promise<RepairOrder[]> {
    const url = `${API_BASE_URL}/repair-orders/late`;
    try {
        const res = await fetch(url, defaultOpts());
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error('Error fetching repair orders:', err);
        throw err;
    }
}

export async function fetchRepairOrdersByStatus(status: Status): Promise<RepairOrder[]> {
    const url = `${API_BASE_URL}/repair-orders?status=${encodeURIComponent(status)}`;
    try {
        const res = await fetch(url, defaultOpts());
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error(`Error fetching repair orders with status ${status}:`, err);
        throw err;
    }
}

export async function fetchRepairOrderById(id: string): Promise<RepairOrder> {
    if (!id) {
        console.error('ID is undefined or empty');
        throw new Error('ID is required to fetch repair order');
    }

    const url = `${API_BASE_URL}/repair-orders/${encodeURIComponent(id)}`;

    try {
        const res = await fetch(url, defaultOpts());
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error(`Error fetching repair order ${id}:`, err);
        throw err;
    }
}

export async function createRepairOrder(data: CreateRepairOrderInput): Promise<RepairOrder> {
    const url = `${API_BASE_URL}/repair-orders`;
    try {
        const res = await fetch(url, defaultOpts('POST', data));
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error('Error creating repair order:', err);
        throw err;
    }
}

export async function updateRepairOrder(data: UpdateRepairOrderInput): Promise<RepairOrder> {
    const url = `${API_BASE_URL}/repair-orders/${encodeURIComponent(data.id)}`;
    try {
        const res = await fetch(url, defaultOpts('PUT', data));
        return await parseJsonOrThrow(res);
    } catch (err) {
        console.error(`Error updating repair order ${data.id}:`, err);
        throw err;
    }
}

export async function deleteRepairOrder(id: string): Promise<void> {
    const url = `${API_BASE_URL}/repair-orders/${encodeURIComponent(id)}`;
    try {
        const res = await fetch(url, defaultOpts('DELETE'));
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to delete (status ${res.status}): ${text.slice(0, 800)}`);
        }
    } catch (err) {
        console.error(`Error deleting repair order ${id}:`, err);
        throw err;
    }
}
