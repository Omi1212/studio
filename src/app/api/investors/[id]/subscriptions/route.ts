'use client';

import { NextResponse } from 'next/server';
import { subscriptionsData } from '../../subscriptions/data';
import type { SubscriptionStatus } from '@/lib/types';
import { z } from 'zod';

const subscriptionSchema = z.object({
  tokenId: z.string(),
  status: z.enum(['none', 'pending', 'approved'])
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
    const { tokenId, status } = subscriptionSchema.parse(body);
    
    if (!subscriptionsData[params.id]) {
      subscriptionsData[params.id] = {};
    }

    subscriptionsData[params.id][tokenId] = status;

    return NextResponse.json({ tokenId, status }, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}