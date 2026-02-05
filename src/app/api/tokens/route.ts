import { NextResponse } from 'next/server';
import { exampleTokens } from '@/lib/data';

export async function GET() {
  return NextResponse.json(exampleTokens);
}
