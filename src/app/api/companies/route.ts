import { NextResponse } from 'next/server';
import { companiesData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(companiesData);
}
