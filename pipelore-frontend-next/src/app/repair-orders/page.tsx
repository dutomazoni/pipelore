import React from 'react';
import Link from 'next/link';
import {RepairOrder, Status, StatusIcons} from '@/utils/types';
import {translateStatus} from "@/utils/translations";
import {
    Search,
    ClipboardList,
    Clock,
    Plus, ClipboardX
} from 'lucide-react';
import RepairOrdersListClient from "@/app/components/RepairOrdersList.client";


export default async function RepairOrdersPage({
                                                   searchParams: searchParamsPromise,
                                               }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

    const searchParams = await searchParamsPromise;
    const statusFilter = (Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status) as Status | undefined;
    const viewParam = Array.isArray(searchParams.view) ? searchParams.view[0] : searchParams.view;
    const viewMode = viewParam === 'table' ? 'table' : 'cards';
    const filter = Array.isArray(searchParams.filter) ? searchParams.filter[0] : searchParams.filter;


    const {fetchRepairOrders, fetchRepairOrdersByStatus, fetchLateRepairOrders} = await import('../../utils/api');

    let repairOrders: RepairOrder[] = [];
    try {
        if (filter === 'late') {
            repairOrders = await fetchLateRepairOrders();
        } else if (statusFilter) {
            repairOrders = await fetchRepairOrdersByStatus(statusFilter);
        } else {
            repairOrders = await fetchRepairOrders();
        }
    } catch (err: any) {
        console.error('Error fetching repair orders:', err);
    }


    return (
        <div className={"container mx-auto px-4 py-10"}>
            {/* Header */}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--color-background)] leading-tight">Ordens de
                        Serviço</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)] max-w-xl">
                        Gerencie solicitações de manutenção do condomínio — crie, acompanhe prazos e atualize status.
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <Link
                            href="/repair-orders"
                            className="inline-flex items-center gap-4 p-1 px-12 py-2 rounded-full bg-[var(--color-background-card)]
                 border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-background-hover)]
                 transition-colors cursor-pointer"
                        >
                            <ClipboardList className="w-5 h-5 text-[var(--color-text-secondary)]"/>
                            <div className="text-sm text-[var(--color-text-secondary)]">Total</div>
                        </Link>

                        <Link
                            href="/repair-orders?filter=late"
                            className="inline-flex items-center gap-4 p-1 px-3 py-2 rounded-full bg-[var(--color-background-card)]
                 border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-background-hover)]
                 transition-colors cursor-pointer"
                        >
                            <Clock className="w-5 h-5 text-[var(--color-danger)]"/>
                            <div className="text-sm text-[var(--color-text-secondary)]">Atrasadas</div>
                        </Link>
                    </div>

                </div>

                <div className="flex items-center gap-4 my-1">
                    <Link
                        href="/repair-orders/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm
                         font-semibold transition-shadow bg-primary-gradient shadow-primary"
                    >
                        <Plus className="w-4 h-4"/>
                        Nova Ordem
                    </Link>


                    <div
                        className="hidden md:flex items-center bg-[var(--color-background-card)] border border-[var(--color-border)] rounded-md overflow-hidden gap-4 my-1">
                        <Link
                            href={`/repair-orders?${statusFilter ? `status=${statusFilter}&` : ''}view=table`}
                            className={`px-3 py-1 text-sm ${viewMode == 'table' ? 'bg-[var(--color-primary-light)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'}`}
                        >
                            Tabela
                        </Link>
                        <Link
                            href={`/repair-orders?${statusFilter ? `status=${statusFilter}&` : ''}view=cards`}
                            className={`px-3 py-1 text-sm ${viewMode === 'cards' ? 'bg-[var(--color-primary-light)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'}`}
                        >
                            Cards
                        </Link>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6  my-1">
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/repair-orders"
                        className={`p-1 px-3 py-1 rounded-full text-sm transition-colors 
                ${filter === 'late'
                            ? 'bg-[var(--color-background-card)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50'
                            : !statusFilter
                                ? 'bg-[var(--color-primary-light)] text-white font-medium'
                                : 'bg-[var(--color-background-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'
                        }`}
                    >
                        Todos
                    </Link>

                    {Object.values(Status).map((status) => {
                        const IconComponent = StatusIcons[status];
                        return (
                            <Link
                                key={status}
                                href={`/repair-orders?status=${status}`}
                                className={`inline-flex items-center gap-2 p-1 px-3 py-1 rounded-full text-sm transition-colors 
                        ${filter === 'late'
                                    ? 'bg-[var(--color-background-card)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50'
                                    : statusFilter === status
                                        ? 'bg-[var(--color-primary-light)] text-white font-medium'
                                        : 'bg-[var(--color-background-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'
                                }`}
                            >
                                <IconComponent className="w-4 h-4"/>
                                {translateStatus(status)}
                            </Link>
                        )
                    })}
                </div>


                {/*<div className="flex items-center gap-3 w-full md:w-auto">*/}
                {/*    <div*/}
                {/*        className="flex items-center bg-[var(--color-background-card)] border border-[var(--color-border)] rounded-md px-3 py-2 w-full md:w-[360px]">*/}
                {/*        <Search className="w-5 h-5 mr-2 text-[var(--color-text-muted)]"/>*/}
                {/*        <input*/}
                {/*            placeholder="Pesquisar por título, localização..."*/}
                {/*            className="text-sm bg-transparent outline-none w-full placeholder:text-[var(--color-text-muted)] text-[var(--color-text-muted)]"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            {/* Content */}
            {repairOrders.length === 0 ? (
                <div className="mt-6 rounded-xl p-10 flex flex-col md:flex-row items-center gap-6
                              bg-background-card border border-border">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Nenhuma ordem de serviço
                            encontrada</h2>
                        <p className="mt-2 text-[var(--color-text-secondary)] max-w-lg">
                            {statusFilter ? `Não há ordens com o status ${translateStatus(statusFilter)}.` : filter ? 'Nenhuma ordem de serviço atrasada.' : 'Ainda não há ordens cadastradas. Crie a primeira ordem para começar a gerenciar as solicitações.'}
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link
                                href="/repair-orders/new"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm
                         font-semibold transition-shadow bg-primary-gradient shadow-primary"
                            >
                                <Plus className="w-4 h-4"/>
                                Criar Ordem
                            </Link>
                        </div>
                    </div>

                    <div
                        className="w-56 h-40 rounded-lg flex-shrink-0 flex items-center justify-center bg-primary-gradient">
                        <div className="text-center">
                            <ClipboardX className="mx-auto w-12 h-12 text-[var(--color-primary)]"/>
                            <div className="text-sm text-[var(--color-text-secondary)] mt-2">Sem ordens</div>
                        </div>
                    </div>
                </div>
            ) : (
                <RepairOrdersListClient
                    initialOrders={repairOrders}
                    viewMode={viewMode === 'table' ? 'table' : 'cards'}
                />
            )}
        </div>
    )
}