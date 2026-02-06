import { NextResponse } from 'next/server';
import { issuersData } from './data';
import type { Issuer } from '@/lib/types';

export async function GET() {
  return NextResponse.json(issuersData);
}

export async function POST(request: Request) {
  const newIssuerData = await request.json();
  const newIssuer: Issuer = {
    ...newIssuerData,
    id: `iss-${Math.random().toString(36).substring(2, 9)}`,
  };
  issuersData.unshift(newIssuer);
  return NextResponse.json(newIssuer, { status: 201 });
}
