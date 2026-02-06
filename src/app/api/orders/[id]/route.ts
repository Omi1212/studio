import { NextResponse } from 'next/server';
import { ordersData } from '../data';

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


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await request.json();
  const orderIndex = ordersData.findIndex((o) => o.id === params.id);

  if (orderIndex === -1) {
    return new Response('Order not found', { status: 404 });
  }

  ordersData[orderIndex].status = status;
  return NextResponse.json(ordersData[orderIndex]);
}
