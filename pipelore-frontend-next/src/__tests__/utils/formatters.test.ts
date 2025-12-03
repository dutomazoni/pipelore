import { describe, it, expect } from 'vitest';
import { getStatusColor, formatDate, formatDateForApi, formatDateForForm } from '@/utils/formatters';
import { Status } from '@/utils/types';

describe('getStatusColor', () => {
  it('returns correct color for OPEN status', () => {
    expect(getStatusColor(Status.OPEN)).toBe('bg-yellow-100 text-yellow-800');
  });
  
  it('returns correct color for IN_PROGRESS status', () => {
    expect(getStatusColor(Status.IN_PROGRESS)).toBe('bg-blue-100 text-blue-800');
  });
  
  it('returns correct color for COMPLETED status', () => {
    expect(getStatusColor(Status.COMPLETED)).toBe('bg-green-100 text-green-800');
  });
  
  it('returns correct color for CANCELLED status', () => {
    expect(getStatusColor(Status.CANCELLED)).toBe('bg-red-100 text-red-800');
  });
  
  it('returns default color for unknown status', () => {
    expect(getStatusColor('UNKNOWN' as Status)).toBe('bg-gray-100 text-gray-800');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    // Using a fixed date for consistent testing
    const date = '2023-01-15T00:00:00.000Z';
    
    // The actual output depends on the locale, but we can check the format
    const formattedDate = formatDate(date);
    
    // Check that it contains the year and month, but don't check the specific day
    // due to potential timezone differences
    expect(formattedDate).toContain('2023');
    expect(formattedDate).toContain('jan');
    
    // Verify it's a properly formatted date string
    expect(formattedDate).toMatch(/\d{1,2} de [a-z]{3,4}\. de \d{4}/i);
  });
});

describe('formatDateForApi', () => {
  it('returns undefined for null input', () => {
    expect(formatDateForApi(null)).toBeUndefined();
  });
  
  it('returns undefined for undefined input', () => {
    expect(formatDateForApi(undefined)).toBeUndefined();
  });
  
  it('returns ISO string for valid date input', () => {
    const result = formatDateForApi('2023-01-15');
    expect(result).toMatch(/2023-01-15T00:00:00.000Z/);
  });
});

describe('formatDateForForm', () => {
  it('returns empty string for null input', () => {
    expect(formatDateForForm(null)).toBe('');
  });
  
  it('returns empty string for undefined input', () => {
    expect(formatDateForForm(undefined)).toBe('');
  });
  
  it('returns YYYY-MM-DD format for valid date input', () => {
    const result = formatDateForForm('2023-01-15T00:00:00.000Z');
    expect(result).toBe('2023-01-15');
  });
});