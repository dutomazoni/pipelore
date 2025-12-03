'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    fetchRepairOrders,
    fetchRepairOrdersByStatus,
    fetchRepairOrderById,
    createRepairOrder,
    updateRepairOrder,
    deleteRepairOrder,
} from '@/utils/api';
import {
    RepairOrder,
    CreateRepairOrderInput,
    UpdateRepairOrderInput,
    Status
} from '@/utils/types';

export function useRepairOrders() {
    const [repairOrders, setRepairOrders] = useState<RepairOrder[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let orders: RepairOrder[];

            if (selectedStatus) {
                orders = await fetchRepairOrdersByStatus(selectedStatus);
            } else {
                orders = await fetchRepairOrders();
            }

            setRepairOrders(orders);
        } catch (err) {
            setError('Failed to fetch repair orders. Please try again.');
            console.error('Error in useRepairOrders hook:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus]);

    // Fetch orders on mount and when selectedStatus changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getRepairOrderById = async (id: string): Promise<RepairOrder | null> => {
        try {
            return await fetchRepairOrderById(id);
        } catch (err) {
            setError(`Failed to fetch repair order with ID ${id}.`);
            console.error('Error fetching repair order:', err);
            return null;
        }
    };

    const addRepairOrder = async (data: CreateRepairOrderInput): Promise<boolean> => {
        try {
            const newOrder = await createRepairOrder(data);
            setRepairOrders(prev => [...prev, newOrder]);
            return true;
        } catch (err) {
            setError('Failed to create repair order. Please try again.');
            console.error('Error creating repair order:', err);
            return false;
        }
    };

    const editRepairOrder = async (data: UpdateRepairOrderInput): Promise<boolean> => {
        try {
            const updatedOrder = await updateRepairOrder(data);
            setRepairOrders(prev =>
                prev.map(order => order.id === updatedOrder.id ? updatedOrder : order)
            );
            return true;
        } catch (err) {
            setError(`Failed to update repair order with ID ${data.id}. Please try again.`);
            console.error('Error updating repair order:', err);
            return false;
        }
    };

    const removeRepairOrder = async (id: string): Promise<boolean> => {
        try {
            await deleteRepairOrder(id);
            setRepairOrders(prev => prev.filter(order => order.id !== id));
            return true;
        } catch (err) {
            setError(`Failed to delete repair order with ID ${id}. Please try again.`);
            console.error('Error deleting repair order:', err);
            return false;
        }
    };

    const changeStatusFilter = (status: Status | null) => {
        setSelectedStatus(status);
    };

    const refreshOrders = () => {
        fetchOrders();
    };

    return {
        repairOrders,
        loading,
        error,
        selectedStatus,
        getRepairOrderById,
        addRepairOrder,
        editRepairOrder,
        removeRepairOrder,
        changeStatusFilter,
        refreshOrders
    };
}