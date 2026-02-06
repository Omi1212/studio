import type { Order } from '@/lib/types';

export const ordersData: Order[] = [
    {
        id: 'order-001',
        investorId: 'inv-001',
        investorName: 'Alice Johnson',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Buy',
        amount: 10000,
        price: 1.00,
        date: '2024-07-28',
        status: 'pending'
    },
    {
        id: 'order-002',
        investorId: 'inv-003',
        investorName: 'Charlie Brown',
        tokenId: 'example-2',
        tokenTicker: 'GLDT',
        type: 'Buy',
        amount: 200,
        price: 75.50,
        date: '2024-07-27',
        status: 'completed'
    },
    {
        id: 'order-003',
        investorId: 'inv-004',
        investorName: 'Diana Miller',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Sell',
        amount: 5000,
        price: 1.01,
        date: '2024-07-26',
        status: 'pending'
    },
    {
        id: 'order-004',
        investorId: 'inv-001',
        investorName: 'Alice Johnson',
        tokenId: 'example-4',
        tokenTicker: 'CRBN',
        type: 'Buy',
        amount: 1500,
        price: 12.80,
        date: '2024-07-25',
        status: 'rejected'
    },
    {
        id: 'order-005',
        investorId: 'inv-009',
        investorName: 'Ian Wright',
        tokenId: 'example-2',
        tokenTicker: 'GLDT',
        type: 'Sell',
        amount: 50,
        price: 78.00,
        date: '2024-07-24',
        status: 'completed'
    },
     {
        id: 'order-006',
        investorId: 'inv-010',
        investorName: 'Jane Smith',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Buy',
        amount: 50000,
        price: 1.00,
        date: '2024-07-29',
        status: 'pending'
    }
];
