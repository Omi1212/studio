import { NextResponse } from 'next/server';
import { subscriptionsData } from '../../subscriptions/data';
import type { SubscriptionStatus } from '@/lib/types';
import { z } from 'zod';

const subscriptionSchema = z.object({
  assetId: z.string(),
  status: z.enum(['none', 'pending', 'approved', 'rejected'])
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userSubscriptions = subscriptionsData[params.id] || {};
  return NextResponse.json(userSubscriptions);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { assetId, status } = subscriptionSchema.parse(body);
    
    if (!subscriptionsData[params.id]) {
      subscriptionsData[params.id] = {};
    }

    subscriptionsData[params.id][assetId] = status;

    return NextResponse.json({ assetId, status }, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
