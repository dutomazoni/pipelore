import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { repairOrdersService } from '../../src/services/repairOrdersService.js';

// Create a mock Prisma client with all the required methods
const mockPrismaClient = {
  repairOrder: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

describe('repairOrdersService', () => {
  let service: ReturnType<typeof repairOrdersService>;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockPrismaClient.repairOrder.findMany.mockReset();
    mockPrismaClient.repairOrder.findUnique.mockReset();
    mockPrismaClient.repairOrder.create.mockReset();
    mockPrismaClient.repairOrder.update.mockReset();
    mockPrismaClient.repairOrder.delete.mockReset();
    
    // Create the service with our mock Prisma client
    service = repairOrdersService(mockPrismaClient);
  });
  
  describe('getAllRepairOrders', () => {
    it('should return all repair orders', async () => {
      const mockOrders = [{ id: '1', title: 'Test Order' }];
      
      // Explicitly set up the mock to return the expected value
      mockPrismaClient.repairOrder.findMany.mockResolvedValue(mockOrders);
      
      const result = await service.getAllRepairOrders();
      
      expect(result).toEqual(mockOrders);
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ where: {} });
    });
    
    it('should pass filters to repository', async () => {
      const filters = { status: 'OPEN' as any, priority: 'HIGH' as any };
      const mockOrders = [];
      
      // Explicitly set up the mock to return the expected value
      mockPrismaClient.repairOrder.findMany.mockResolvedValue(mockOrders);
      
      const result = await service.getAllRepairOrders(filters);
      
      expect(result).toEqual(mockOrders);
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({ 
        where: { 
          status: filters.status,
          priority: filters.priority
        } 
      });
    });
  });
  
  describe('getRepairOrderById', () => {
    it('should return a repair order by id', async () => {
      const mockOrder = { id: '1', title: 'Test Order' };
      mockPrismaClient.repairOrder.findUnique.mockResolvedValue(mockOrder);
      
      const result = await service.getRepairOrderById('1');
      
      expect(result).toEqual(mockOrder);
      expect(mockPrismaClient.repairOrder.findUnique).toHaveBeenCalledWith({ 
        where: { id: '1' } 
      });
    });
    
    it('should return null if order not found', async () => {
      mockPrismaClient.repairOrder.findUnique.mockResolvedValue(null);
      
      const result = await service.getRepairOrderById('999');
      
      expect(result).toBeNull();
      expect(mockPrismaClient.repairOrder.findUnique).toHaveBeenCalledWith({ 
        where: { id: '999' } 
      });
    });
  });
  
  describe('createRepairOrder', () => {
    it('should create a repair order', async () => {
      const input = {
        title: 'New Order',
        location: 'Test Location',
        priority: 'MEDIUM',
        status: 'OPEN',
        description: 'Test description',
        dueDate: '2025-12-31'
      };
      
      const expected = {
        ...input,
        id: '1',
        dueDate: new Date('2025-12-31'),
        completedAt: null
      };
      
      mockPrismaClient.repairOrder.create.mockResolvedValue(expected);
      
      const result = await service.createRepairOrder(input as any);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.create).toHaveBeenCalledWith({
        data: {
          title: input.title,
          location: input.location,
          priority: input.priority,
          status: input.status,
          description: input.description,
          dueDate: new Date(input.dueDate),
          completedAt: null
        }
      });
    });
  });
  
  describe('updateRepairOrder', () => {
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
      
      const result = await service.updateRepairOrder(id, input as any);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          title: input.title,
          status: input.status
        }
      });
    });
  });
  
  describe('deleteRepairOrder', () => {
    it('should delete a repair order', async () => {
      const id = '1';
      const expected = { id, title: 'Deleted Order' };
      
      mockPrismaClient.repairOrder.delete.mockResolvedValue(expected);
      
      const result = await service.deleteRepairOrder(id);
      
      expect(result).toEqual(expected);
      expect(mockPrismaClient.repairOrder.delete).toHaveBeenCalledWith({
        where: { id }
      });
    });
  });
  
  describe('getLateRepairOrders', () => {
    it('should return late repair orders', async () => {
      const mockOrders = [{ id: '1', title: 'Late Order' }];
      mockPrismaClient.repairOrder.findMany.mockResolvedValue(mockOrders);
      
      const result = await service.getLateRepairOrders();
      
      expect(result).toEqual(mockOrders);
      expect(mockPrismaClient.repairOrder.findMany).toHaveBeenCalledWith({
        where: {
          dueDate: { lt: expect.any(Date) },
          status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
      });
    });
  });
});