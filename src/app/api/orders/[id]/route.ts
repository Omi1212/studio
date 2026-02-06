import { NextResponse } from 'next/server';
import { ordersData } from '../data';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['pending', 'completed', 'rejected', 'waiting payment']),
});

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
    try {
        const orderIndex = ordersData.findIndex((o) => o.id === params.id);
        if (orderIndex === -1) {
            return new Response('Order not found', { status: 404 });
        }
        
        const body = await request.json();
        const { status } = patchSchema.parse(body);

        ordersData[orderIndex].status = status;
        return NextResponse.json(ordersData[orderIndex]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
