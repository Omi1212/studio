import { NextResponse } from 'next/server';
import { issuersData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const issuer = issuersData.find((iss) => iss.id === params.id);
  if (issuer) {
    return NextResponse.json(issuer);
  }
  return new Response('Issuer not found', { status: 404 });
}
