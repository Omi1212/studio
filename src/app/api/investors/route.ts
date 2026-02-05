import { NextResponse } from 'next/server';
import { investorsData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(investorsData);
}
