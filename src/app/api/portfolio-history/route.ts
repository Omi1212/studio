import { NextResponse } from 'next/server';
import { portfolioHistoryData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(portfolioHistoryData);
}
