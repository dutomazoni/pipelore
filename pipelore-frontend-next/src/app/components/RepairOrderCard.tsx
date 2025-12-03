import React from 'react';
import Link from 'next/link';
import {RepairOrder} from '@/utils/types';
import {getStatusColor, formatDate} from '@/utils/formatters';
import {translatePriority, translateStatus} from "@/utils/translations";

interface RepairOrderCardProps {
    orders: RepairOrder[];
    onDelete: (id: string) => Promise<void>;
}


export default function RepairOrderCard({
                                            orders, onDelete
                                        }: RepairOrderCardProps) {
    return (
        <>
            {
                orders.map((order) => (
                    <div className={`${getStatusColor(order.status)} shadow rounded-lg p-6 mb-4 border border-gray-200`}
                         key={order.id}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{order.title}</h3>
                                <p className="text-sm text-gray-600">{order.location}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {translateStatus(order.status)}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Prioridade</h4>
                            <p className="text-sm">
                                {translatePriority(order.priority)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Descrição</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>
                        </div>

                        {order.dueDate && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Data de Vencimento</h4>
                                <p className="text-sm">
                                    {formatDate(order.dueDate)}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <div>
                                <p>Criado em: {formatDate(order.createdAt)}</p>
                                <p>Atualizado em: {formatDate(order.updatedAt)}</p>
                            </div>

                            <div className="flex space-x-2">
                                <Link
                                    href={`/repair-orders/${order.id}`}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => onDelete(order.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>


    );
}