import { NextResponse } from 'next/server';
import { transfersData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(transfersData);
}
