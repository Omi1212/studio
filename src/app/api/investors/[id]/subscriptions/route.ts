import { NextResponse } from 'next/server';
import { subscriptionsData } from '../subscriptions/data';
import type { SubscriptionStatus } from '@/lib/types';

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
  const { tokenId, status } = await request.json() as { tokenId: string; status: SubscriptionStatus };
  if (!tokenId || !status) {
    return new Response('Invalid payload, tokenId and status are required.', { status: 400 });
  }
  
  if (!subscriptionsData[params.id]) {
    subscriptionsData[params.id] = {};
  }

  subscriptionsData[params.id][tokenId] = status;

  return NextResponse.json({ tokenId, status });
}
