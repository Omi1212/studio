import { NextResponse } from 'next/server';
import { transactionData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(transactionData);
}
