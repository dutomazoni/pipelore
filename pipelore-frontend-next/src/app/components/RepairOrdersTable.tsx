import React from 'react';
import Link from 'next/link';
import { RepairOrder } from '@/utils/types';
import { getStatusColor, formatDate } from '@/utils/formatters';
import {translatePriority, translateStatus} from "@/utils/translations";

interface RepairOrdersTableProps {
    orders: RepairOrder[];
    onDelete: (id: string) => Promise<void>;
}

export default function RepairOrdersTable({ orders, onDelete }: RepairOrdersTableProps) {

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Criação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            Nenhuma ordem de serviço encontrada
                        </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order.id} className={` ${getStatusColor(order.status)} hover:bg-gray-50`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.title}</div>
                                {order.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{order.description}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{translatePriority(order.priority)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.dueDate ? formatDate(order.dueDate) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/repair-orders/${order.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => onDelete(order.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}