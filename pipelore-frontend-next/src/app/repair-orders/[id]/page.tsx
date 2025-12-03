import React from 'react';
import { notFound } from 'next/navigation';
import { fetchRepairOrderById, updateRepairOrder } from '@/utils/api';
import { revalidatePath } from 'next/cache';

import type { CreateRepairOrderInput, UpdateRepairOrderInput } from '@/utils/types';
import RepairOrderForm from "@/app/components/RepairOrderForm.client";

type CreateOrUpdate = CreateRepairOrderInput | UpdateRepairOrderInput;

async function handleUpdateRepairOrder(data: CreateOrUpdate) {
    'use server';

    if (!('id' in data)) {
        return { success: false, error: 'Missing id for update' };
    }

    try {
        await updateRepairOrder(data as UpdateRepairOrderInput);
        revalidatePath('/repair-orders');
        revalidatePath(`/repair-orders/${data.id}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating repair order:', error);
        return { success: false, error: 'Failed to update repair order' };
    }
}

export default async function EditRepairOrderPage({ params}: { params: Promise<{ id: string }> }) {
    let repairOrder;
    const {id} = await (params);
    try {
        repairOrder = await fetchRepairOrderById(id);
    } catch (error) {
        console.error('Error fetching repair order:', error);
        notFound();
    }

    return (
        <RepairOrderForm
            initialData={repairOrder}
            isEditing={true}
            onSubmit={handleUpdateRepairOrder}
        />
    );
}