import { NextResponse } from 'next/server';
import { ordersData } from './data';
import type { Order } from '@/lib/types';
import { z } from 'zod';

const orderPostSchema = z.object({
    investorId: z.string(),
    investorName: z.string(),
    tokenId: z.string(),
    tokenTicker: z.string(),
    type: z.enum(['Buy', 'Sell']),
    amount: z.number().positive(),
    price: z.number(),
    date: z.string(),
    status: z.enum(['pending', 'completed', 'rejected', 'waiting payment'])
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const status = searchParams.get('status');
  const query = searchParams.get('query');
  const tokenId = searchParams.get('tokenId');
  const investorId = searchParams.get('investorId');

  let filteredOrders = ordersData;

  if (tokenId) {
    filteredOrders = filteredOrders.filter(order => order.tokenId === tokenId);
  }

  if (investorId) {
    filteredOrders = filteredOrders.filter(order => order.investorId === investorId);
  }
  
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredOrders = filteredOrders.filter(order =>
      order.investorName.toLowerCase().includes(lowercasedQuery) ||
      order.tokenTicker.toLowerCase().includes(lowercasedQuery) ||
      order.id.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredOrders.length;
  const startIndex = (page - 1) * perPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedOrders,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrderData = orderPostSchema.parse(body);

    const orderWithId: Order = {
      ...newOrderData,
      id: `order-${Math.random().toString(36).substring(2, 9)}`,
    };
    ordersData.unshift(orderWithId); // Add to the beginning of the array
    return NextResponse.json(orderWithId, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
