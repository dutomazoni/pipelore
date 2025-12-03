import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { 
  fetchRepairOrders, 
  fetchRepairOrderById, 
  createRepairOrder, 
  updateRepairOrder, 
  deleteRepairOrder 
} from '@/utils/api';
import { Status, Priority } from '@/utils/types';

// Mock console.error to avoid cluttering test output
vi.spyOn(console, 'error').mockImplementation(() => {});
// Mock console.log to avoid cluttering test output
vi.spyOn(console, 'log').mockImplementation(() => {});

const API_BASE_URL = 'http://localhost:4000/api';

const mockRepairOrder = {
  id: '1',
  title: 'Fix Elevator',
  description: 'Elevator not working properly',
  location: 'Entrance Hall',
  priority: Priority.HIGH,
  status: Status.OPEN,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const mockRepairOrders = [mockRepairOrder];

// Set up MSW server
const server = setupServer(
  // GET all repair orders
  http.get(`${API_BASE_URL}/repair-orders`, () => {
    return HttpResponse.json(mockRepairOrders);
  }),
  
  // GET repair orders by status
  http.get(`${API_BASE_URL}/repair-orders`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    if (status) {
      return HttpResponse.json(mockRepairOrders.filter(order => order.status === status));
    }
    return HttpResponse.json(mockRepairOrders);
  }),
  
  // GET late repair orders
  http.get(`${API_BASE_URL}/repair-orders/late`, () => {
    return HttpResponse.json(mockRepairOrders);
  }),
  
  // GET repair order by ID
  http.get(`${API_BASE_URL}/repair-orders/:id`, ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockRepairOrder);
    }
    return new HttpResponse(
      JSON.stringify({ message: 'Repair order not found' }),
      { status: 404 }
    );
  }),
  
  // POST create repair order
  http.post(`${API_BASE_URL}/repair-orders`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...body,
      id: '2',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  }),
  
  // PUT update repair order
  http.put(`${API_BASE_URL}/repair-orders/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    if (id === '1') {
      return HttpResponse.json({
        ...mockRepairOrder,
        ...body,
        updatedAt: '2023-01-03T00:00:00.000Z',
      });
    }
    return new HttpResponse(
      JSON.stringify({ message: 'Repair order not found' }),
      { status: 404 }
    );
  }),
  
  // DELETE repair order
  http.delete(`${API_BASE_URL}/repair-orders/:id`, ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(
      JSON.stringify({ message: 'Repair order not found' }),
      { status: 404 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API functions', () => {
  describe('fetchRepairOrders', () => {
    it('returns repair orders', async () => {
      const orders = await fetchRepairOrders();
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('1');
      expect(orders[0].title).toBe('Fix Printer');
    });
    
    it('handles errors', async () => {
      server.use(
        http.get(`${API_BASE_URL}/repair-orders`, () => {
          return new HttpResponse(
            JSON.stringify({ message: 'Server error' }),
            { status: 500 }
          );
        })
      );
      
      await expect(fetchRepairOrders()).rejects.toThrow();
    });
  });
  
  describe('fetchRepairOrderById', () => {
    it('returns a specific repair order', async () => {
      const order = await fetchRepairOrderById('1');
      expect(order.id).toBe('1');
      expect(order.title).toBe('Fix Printer');
    });
    
    it('handles errors', async () => {
      await expect(fetchRepairOrderById('999')).rejects.toThrow();
    });
    
    it('throws error when id is empty', async () => {
      await expect(fetchRepairOrderById('')).rejects.toThrow('ID is required');
    });
  });
  
  describe('createRepairOrder', () => {
    it('creates a new repair order', async () => {
      const newOrder = {
        title: 'New Order',
        description: 'New order description',
        location: 'Office 102',
        priority: Priority.MEDIUM,
        status: Status.OPEN,
      };
      
      const createdOrder = await createRepairOrder(newOrder);
      expect(createdOrder.id).toBe('2');
      expect(createdOrder.title).toBe('New Order');
      expect(createdOrder.createdAt).toBeDefined();
    });
    
    it('handles errors', async () => {
      server.use(
        http.post(`${API_BASE_URL}/repair-orders`, () => {
          return new HttpResponse(
            JSON.stringify({ message: 'Invalid data' }),
            { status: 400 }
          );
        })
      );
      
      const newOrder = {
        title: 'Invalid Order',
        location: 'Office 102',
        priority: Priority.MEDIUM,
        status: Status.OPEN,
      };
      
      await expect(createRepairOrder(newOrder)).rejects.toThrow();
    });
  });
  
  describe('updateRepairOrder', () => {
    it('updates an existing repair order', async () => {
      const updateData = {
        id: '1',
        title: 'Updated Title',
        status: Status.IN_PROGRESS,
      };
      
      const updatedOrder = await updateRepairOrder(updateData);
      expect(updatedOrder.id).toBe('1');
      expect(updatedOrder.title).toBe('Updated Title');
      expect(updatedOrder.status).toBe(Status.IN_PROGRESS);
    });
    
    it('handles errors', async () => {
      const updateData = {
        id: '999',
        title: 'Updated Title',
      };
      
      await expect(updateRepairOrder(updateData)).rejects.toThrow();
    });
  });
  
  describe('deleteRepairOrder', () => {
    it('deletes an existing repair order', async () => {
      await expect(deleteRepairOrder('1')).resolves.not.toThrow();
    });
    
    it('handles errors', async () => {
      await expect(deleteRepairOrder('999')).rejects.toThrow();
    });
  });
});