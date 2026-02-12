import { NextResponse } from 'next/server';
import { ordersData } from '../data';
import { z } from 'zod';

const paymentDetailsSchema = z.object({
    method: z.enum(['Bank Transfer', 'Bitcoin', 'Bitcoin Spark', 'Stablecoin']),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    reference: z.string().optional(),
    cryptoAddress: z.string().optional(),
    network: z.string().optional(),
    transactionId: z.string().optional(),
    stablecoin: z.enum(['USDT', 'USDC']).optional(),
});

const patchSchema = z.object({
  status: z.enum(['pending', 'completed', 'rejected', 'waiting payment']).optional(),
  paymentDetails: paymentDetailsSchema.optional()
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
        const validatedData = patchSchema.parse(body);

        ordersData[orderIndex] = { ...ordersData[orderIndex], ...validatedData };
        return NextResponse.json(ordersData[orderIndex]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
