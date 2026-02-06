import { NextResponse } from 'next/server';
import { issuersData } from './data';

export async function GET() {
  return NextResponse.json(issuersData);
}
