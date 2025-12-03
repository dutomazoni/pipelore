import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RepairOrderCard from '@/app/components/RepairOrderCard';
import { Status, Priority } from '@/utils/types';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('RepairOrderCard', () => {
  const mockOrders = [
    {
      id: '1',
      title: 'Fix Printer',
      description: 'Printer not working properly',
      location: 'Office 101',
      priority: Priority.HIGH,
      status: Status.OPEN,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    }
  ];
  
  const mockDelete = vi.fn(() => Promise.resolve());
  
  it('renders order details correctly', () => {
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);
    
    expect(screen.getByText('Fix Printer')).toBeInTheDocument();
    expect(screen.getByText('Office 101')).toBeInTheDocument();
    expect(screen.getByText('Printer not working properly')).toBeInTheDocument();
  });
  
  it('displays the correct status', () => {
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);
    
    expect(screen.getByText('Em Aberto')).toBeInTheDocument();
  });
  
  it('displays the correct priority', () => {
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);
    
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });
  
  it('displays formatted dates', () => {
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);

    expect(screen.getByText(/Criado em:/)).toBeInTheDocument();
    expect(screen.getByText(/Atualizado em:/)).toBeInTheDocument();
  });
  
  it('renders edit and delete buttons', () => {
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);
    
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });
  
  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<RepairOrderCard orders={mockOrders} onDelete={mockDelete} />);
    
    const deleteButton = screen.getByText('Excluir');
    await user.click(deleteButton);
    
    expect(mockDelete).toHaveBeenCalledWith('1');
  });
  
  it('renders multiple orders when provided', () => {
    const multipleOrders = [
      ...mockOrders,
      {
        id: '2',
        title: 'Replace Keyboard',
        description: 'Keyboard has missing keys',
        location: 'Office 102',
        priority: Priority.MEDIUM,
        status: Status.IN_PROGRESS,
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      }
    ];
    
    render(<RepairOrderCard orders={multipleOrders} onDelete={mockDelete} />);
    
    expect(screen.getByText('Fix Printer')).toBeInTheDocument();
    expect(screen.getByText('Replace Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Office 101')).toBeInTheDocument();
    expect(screen.getByText('Office 102')).toBeInTheDocument();
  });
  
  it('renders due date when available', () => {
    const ordersWithDueDate = [
      {
        ...mockOrders[0],
        dueDate: '2023-02-01T00:00:00.000Z',
      }
    ];
    
    render(<RepairOrderCard orders={ordersWithDueDate} onDelete={mockDelete} />);
    
    expect(screen.getByText('Data de Vencimento')).toBeInTheDocument();
  });
});