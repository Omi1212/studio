import { NextResponse } from 'next/server';
import { ordersData } from './data';
import type { Order } from '@/lib/types';

export async function GET() {
  return NextResponse.json(ordersData);
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
