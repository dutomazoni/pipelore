'use client';
import { useRouter } from 'next/navigation';
import { RepairOrder } from '@/utils/types';
import RepairOrdersTable from "./RepairOrdersTable";
import RepairOrderCard from "./RepairOrderCard";
import { useRepairOrders } from "@/hooks/useRepairOrders";

interface RepairOrdersListProps {
    initialOrders: RepairOrder[];
    viewMode: 'table' | 'cards';
}

export default function RepairOrdersListClient({ initialOrders, viewMode }: RepairOrdersListProps) {
    const router = useRouter();
    const { removeRepairOrder } = useRepairOrders();

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            const success = await removeRepairOrder(id);
            if (success) {
                router.refresh();
            } else {
                console.error('Failed to delete repair order');
            }
        }
    };

    return viewMode === 'table' ? (
        <div className="mt-6 rounded-lg overflow-hidden bg-background-card border border-border">
            <RepairOrdersTable
                orders={initialOrders}
                onDelete={handleDelete}
            />
        </div>
    ) : (
        <RepairOrderCard
            orders={initialOrders}
            onDelete={handleDelete}
        />
    );
}