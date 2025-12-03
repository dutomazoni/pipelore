import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { repairOrdersRepository } from '../../src/repositories/repairOrdersRepository.js';
import { mock } from 'jest-mock-extended';
import type { PrismaClient } from '../../src/generated/prisma/client.js';

// Mock the Prisma client
const mockPrismaClient = mock<PrismaClient>();

// Initialize the repairOrder property with mock methods
mockPrismaClient.repairOrder = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as any;

describe('repairOrdersRepository', () => {
  let repository: ReturnType<typeof repairOrdersRepository>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    repository = repairOrdersRepository(mockPrismaClient as any);
  });
  
  describe('findAll', () => {
    it('should find all repair orders without filters', async () => {
      const mockOrders = [{ id: '1', title: 'Test Order' }];
      mockPrismaClient.repairOrder.findMany.mockResolvedValue(mockOrders);
      
      const result = await repository.findAll();
      
      expect(result).toEqual(mockOrders);
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ where: {} });
    });
    
    it('should find all repair orders with status filter', async () => {
      const filters = { status: 'OPEN' as any };
      mockPrismaClient.repairOrder.findMany.mockResolvedValue([]);
      
      await repository.findAll(filters);
      
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ 
        where: { status: 'OPEN' } 
      });
    });
    
    it('should find all repair orders with priority filter', async () => {
      const filters = { priority: 'HIGH' as any };
      mockPrismaClient.repairOrder.findMany.mockResolvedValue([]);
      
      await repository.findAll(filters);
      
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ 
        where: { priority: 'HIGH' } 
      });
    });
    
    it('should find all repair orders with both filters', async () => {
      const filters = { status: 'OPEN' as any, priority: 'HIGH' as any };
      mockPrismaClient.repairOrder.findMany.mockResolvedValue([]);
      
      await repository.findAll(filters);
      
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ 
        where: { status: 'OPEN', priority: 'HIGH' } 
      });
    });
  });
  
  describe('findById', () => {
    it('should find a repair order by id', async () => {
      const mockOrder = { id: '1', title: 'Test Order' };
      mockPrismaClient.repairOrder.findUnique.mockResolvedValue(mockOrder);
      
      const result = await repository.findById('1');
      
      expect(result).toEqual(mockOrder);
      expect(mockPrismaClient.repairOrder.findUnique).toHaveBeenCalledWith({ 
        where: { id: '1' } 
      });
    });
    
    it('should return null if order not found', async () => {
      mockPrismaClient.repairOrder.findUnique.mockResolvedValue(null);
      
      const result = await repository.findById('999');
      
      expect(result).toBeNull();
      expect(mockPrismaClient.repairOrder.findUnique).toHaveBeenCalledWith({ 
        where: { id: '999' } 
      });
    });
  });
  
  describe('create', () => {
    it('should create a repair order', async () => {
      const input = {
        title: 'New Order',
        location: 'Test Location',
        priority: 'MEDIUM',
        status: 'OPEN',
        description: 'Test description',
        dueDate: new Date('2025-12-31'),
        completedAt: null
      };
      
      const expected = {
        ...input,
        id: '1'
      };
      
      mockPrismaClient.repairOrder.create.mockResolvedValue(expected);
      
      const result = await repository.create(input as any);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.create).toHaveBeenCalledWith({
        data: input
      });
    });
  });
  
  describe('update', () => {
    it('should update a repair order', async () => {
      const id = '1';
      const input = {
        title: 'Updated Order',
        status: 'IN_PROGRESS'
      };
      
      const expected = {
        id,
        title: 'Updated Order',
        status: 'IN_PROGRESS',
        location: 'Test Location',
        priority: 'MEDIUM'
      };
      
      mockPrismaClient.repairOrder.update.mockResolvedValue(expected);
      
      const result = await repository.update(id, input as any);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.update).toHaveBeenCalledWith({
        where: { id },
        data: input
      });
    });
  });
  
  describe('delete', () => {
    it('should delete a repair order', async () => {
      const id = '1';
      const expected = { id, title: 'Deleted Order' };
      
      mockPrismaClient.repairOrder.delete.mockResolvedValue(expected);
      
      const result = await repository.delete(id);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.delete).toHaveBeenCalledWith({ 
        where: { id } 
      });
    });
  });
  
  describe('findLate', () => {
    it('should find late repair orders', async () => {
      const mockOrders = [{ id: '1', title: 'Late Order' }];
      mockPrismaClient.repairOrder.findMany.mockResolvedValue(mockOrders);
      
      const result = await repository.findLate();
      
      expect(result).toEqual(mockOrders);
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({
        where: {
          dueDate: { lt: expect.any(Date) },
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      });
    });
  });
});