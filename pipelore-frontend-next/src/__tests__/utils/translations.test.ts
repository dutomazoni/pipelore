import { describe, it, expect } from 'vitest';
import { translateStatus, translatePriority, StatusTranslations, PriorityTranslations } from '@/utils/translations';
import { Status, Priority } from '@/utils/types';

describe('StatusTranslations', () => {
  it('has correct translation for OPEN status', () => {
    expect(StatusTranslations[Status.OPEN]).toBe('Em Aberto');
  });

  it('has correct translation for IN_PROGRESS status', () => {
    expect(StatusTranslations[Status.IN_PROGRESS]).toBe('Em Andamento');
  });

  it('has correct translation for COMPLETED status', () => {
    expect(StatusTranslations[Status.COMPLETED]).toBe('Concluído');
  });

  it('has correct translation for CANCELLED status', () => {
    expect(StatusTranslations[Status.CANCELLED]).toBe('Cancelado');
  });
});

describe('PriorityTranslations', () => {
  it('has correct translation for LOW priority', () => {
    expect(PriorityTranslations[Priority.LOW]).toBe('Baixa');
  });

  it('has correct translation for MEDIUM priority', () => {
    expect(PriorityTranslations[Priority.MEDIUM]).toBe('Média');
  });

  it('has correct translation for HIGH priority', () => {
    expect(PriorityTranslations[Priority.HIGH]).toBe('Alta');
  });

  it('has correct translation for URGENT priority', () => {
    expect(PriorityTranslations[Priority.URGENT]).toBe('Urgente');
  });
});

describe('translateStatus', () => {
  it('returns correct translation for valid status', () => {
    expect(translateStatus(Status.OPEN)).toBe('Em Aberto');
    expect(translateStatus(Status.IN_PROGRESS)).toBe('Em Andamento');
    expect(translateStatus(Status.COMPLETED)).toBe('Concluído');
    expect(translateStatus(Status.CANCELLED)).toBe('Cancelado');
  });

  it('returns the status itself for invalid status', () => {
    const invalidStatus = 'INVALID_STATUS' as Status;
    expect(translateStatus(invalidStatus)).toBe(invalidStatus);
  });
});

describe('translatePriority', () => {
  it('returns correct translation for valid priority', () => {
    expect(translatePriority(Priority.LOW)).toBe('Baixa');
    expect(translatePriority(Priority.MEDIUM)).toBe('Média');
    expect(translatePriority(Priority.HIGH)).toBe('Alta');
    expect(translatePriority(Priority.URGENT)).toBe('Urgente');
  });

  it('returns the priority itself for invalid priority', () => {
    const invalidPriority = 'INVALID_PRIORITY' as Priority;
    expect(translatePriority(invalidPriority)).toBe(invalidPriority);
  });
});