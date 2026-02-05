import { NextResponse } from 'next/server';
import { volumeData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(volumeData);
}
