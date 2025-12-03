import { describe, it, expect } from '@jest/globals';
import { repairOrderSchema } from '../../src/dtos/repairOrderDTO.js';

describe('RepairOrder Schema Validation', () => {
  it('should validate a valid repair order', () => {
    const validOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'OPEN',
      description: 'Test description',
      dueDate: '2025-12-31'
    };
    
    const result = repairOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });
  
  it('should validate a repair order with minimal required fields', () => {
    const minimalOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'LOW',
      status: 'OPEN'
    };
    
    const result = repairOrderSchema.safeParse(minimalOrder);
    expect(result.success).toBe(true);
  });
  
  it('should reject when title is missing', () => {
    const invalidOrder = {
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'OPEN'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });
  
  it('should reject when location is missing', () => {
    const invalidOrder = {
      title: 'Test Order',
      priority: 'MEDIUM',
      status: 'OPEN'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('location');
    }
  });
  
  it('should reject invalid priority value', () => {
    const invalidOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'INVALID_PRIORITY',
      status: 'OPEN'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('priority');
    }
  });
  
  it('should reject invalid status value', () => {
    const invalidOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'INVALID_STATUS'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('status');
    }
  });
  
  it('should reject invalid date format for dueDate', () => {
    const invalidOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'OPEN',
      dueDate: 'not-a-date'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('dueDate');
    }
  });
  
  it('should reject invalid date format for completedAt', () => {
    const invalidOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      completedAt: 'not-a-date'
    };
    
    const result = repairOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('completedAt');
    }
  });
  
  it('should validate with valid date strings', () => {
    const validOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: '2025-12-31',
      completedAt: '2025-12-25'
    };
    
    const result = repairOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });
  
  it('should validate with ISO date strings', () => {
    const validOrder = {
      title: 'Test Order',
      location: 'Test Location',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: '2025-12-31T23:59:59.999Z',
      completedAt: '2025-12-25T12:00:00.000Z'
    };
    
    const result = repairOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });
});