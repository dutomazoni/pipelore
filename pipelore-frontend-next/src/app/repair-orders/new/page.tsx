import React from 'react';
import { createRepairOrder } from '@/utils/api';
import { CreateRepairOrderInput, UpdateRepairOrderInput } from '@/utils/types';
import RepairOrderForm from '../../components/RepairOrderForm.client';
import { revalidatePath } from 'next/cache';

// Server action to create a new repair order
async function handleCreateRepairOrder(data: CreateRepairOrderInput | UpdateRepairOrderInput) {
    'use server';

    try {
        // If data is UpdateRepairOrderInput (has id property), convert it to CreateRepairOrderInput
        if ('id' in data) {
            const { id, ...createData } = data;
            if (!createData.title || !createData.location || !createData.priority || !createData.status) {
                throw new Error('Missing required fields for creating repair order');
            }
            await createRepairOrder(createData as CreateRepairOrderInput);
        } else {
            // Data is already CreateRepairOrderInput
            await createRepairOrder(data);
        }

        revalidatePath('/repair-orders');
        return { success: true };
    } catch (error) {
        console.error('Error creating repair order:', error);
        return { success: false, error: 'Failed to create repair order' };
    }
}

export default function NewRepairOrderPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <RepairOrderForm
                onSubmit={handleCreateRepairOrder}
                isEditing={false}
            />
        </div>
    );
}