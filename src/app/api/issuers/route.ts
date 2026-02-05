import { NextResponse } from 'next/server';
import { issuersData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(issuersData);
}
