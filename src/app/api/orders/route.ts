import { NextResponse } from 'next/server';
import { ordersData } from './data';
import type { Order } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
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
  const startIndex = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    orders: paginatedOrders,
    total,
  });
}

export async function POST(request: Request) {
  const newOrder = (await request.json()) as Omit<Order, 'id'>;
  const orderWithId: Order = {
    ...newOrder,
    id: `order-${Math.random().toString(36).substring(2, 9)}`,
  };
  ordersData.unshift(orderWithId); // Add to the beginning of the array
  return NextResponse.json(orderWithId, { status: 201 });
}
