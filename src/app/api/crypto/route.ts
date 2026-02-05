import { NextResponse } from 'next/server';
import { cryptoData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(cryptoData);
}
