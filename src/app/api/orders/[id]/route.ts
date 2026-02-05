import { NextResponse } from 'next/server';
import { ordersData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = ordersData.find((o) => o.id === params.id);
  if (order) {
    return NextResponse.json(order);
  }
  return new Response('Order not found', { status: 404 });
}
