import { NextResponse } from 'next/server';
import { ordersData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(ordersData);
}
