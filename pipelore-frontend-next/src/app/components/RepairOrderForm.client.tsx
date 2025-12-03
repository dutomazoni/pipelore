'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    RepairOrder,
    Status,
    Priority,
    CreateRepairOrderInput,
    UpdateRepairOrderInput,
} from '@/utils/types';
import {formatDateForApi, formatDateForForm} from "@/utils/formatters";
import {translatePriority, translateStatus} from "@/utils/translations";

interface RepairOrderFormProps {
    initialData?: RepairOrder;
    onSubmit: (data: CreateRepairOrderInput | UpdateRepairOrderInput) => Promise<{ success: boolean; error?: string }>;
    isEditing?: boolean;
}

export default function RepairOrderForm({ initialData, onSubmit, isEditing = false }: RepairOrderFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateRepairOrderInput | UpdateRepairOrderInput>({
        title: '',
        description: '',
        location: '',
        priority: Priority.MEDIUM,
        status: Status.OPEN,
        dueDate: '',
        completedAt: '',
        ...(isEditing && initialData ? { id: initialData.id } : {}),
    });

    useEffect(() => {
        if (initialData) {
            console.log(initialData)
            setFormData({
                id: initialData.id,
                title: initialData.title,
                description: initialData.description || '',
                location: initialData.location,
                priority: initialData.priority,
                status: initialData.status,
                dueDate: formatDateForForm(initialData.dueDate),
                completedAt: formatDateForForm(initialData.completedAt),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'status') {
            setFormData((prev) => ({
                ...prev,
                status: value as Status,
            }));
        } else if (name === 'priority') {
            setFormData((prev) => ({
                ...prev,
                priority: value as Priority,
            }));
        } else if (name === 'dueDate' || name === 'completedAt') {
            setFormData((prev) => ({
                ...prev,
                [name]: value || '',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSubmit = {
                ...formData,
                dueDate: formatDateForApi(formData.dueDate),
                completedAt: formatDateForApi(formData.completedAt)
            };
            const result = await onSubmit(formDataToSubmit);

            if (result.success) {
                router.push('/repair-orders');
            } else {
                setError(result.error || 'Falha ao salvar a ordem de serviço. Por favor, tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
            console.error('Error submitting form:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBase =
        'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm text-sm placeholder:text-[var(--color-text-muted)]';
    const inputBorder = 'border-[var(--color-border)] bg-[var(--color-background-card)] text-[var(--color-text-primary)]';
    const focusRing = 'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent';

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto rounded-xl p-6 shadow-md bg-background-card border border-border"
        >
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
                {isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
            </h2>

            {error && (
                <div className="mb-4 rounded-md px-4 py-3 text-sm bg-red-50 border border-red-200 text-danger">
                    {error}
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">Informações Básicas</h3>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Título*
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={255}
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                            placeholder="Ex.: Válvula com vazamento - Torre A, Apto 101"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Localização*
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                            placeholder="Ex.: Torre A - Apto 101"
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Prioridade*
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                        >
                            {Object.values(Priority).map((priorityOption) => (
                                <option key={priorityOption} value={priorityOption}>
                                    {translatePriority(priorityOption)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Status and Dates */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">Status e Datas</h3>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Status*
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                        >
                            {Object.values(Status).map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {translateStatus(statusOption)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Data de Vencimento
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate ?? ''}
                            onChange={handleChange}
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                        />
                    </div>

                    <div>
                        <label htmlFor="completedAt" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            Data de Conclusão
                        </label>
                        <input
                            type="date"
                            id="completedAt"
                            name="completedAt"
                            value={formData.completedAt ?? ''}
                            onChange={handleChange}
                            className={`${inputBase} ${inputBorder} ${focusRing}`}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Descrição
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputBase} ${inputBorder} ${focusRing}`}
                    placeholder="Descreva o problema com detalhes..."
                />
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.push('/repair-orders')}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-border text-text-secondary bg-transparent"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white
                              bg-primary shadow-primary border-none
                              ${isSubmitting ? 'opacity-70' : ''}`}
                >
                    {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
                </button>
            </div>

        </form>
    );
}