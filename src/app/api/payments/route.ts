import { NextResponse } from 'next/server';
import { paymentData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(paymentData);
}
